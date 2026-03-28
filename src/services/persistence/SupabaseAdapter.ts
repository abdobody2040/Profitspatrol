import { StorageAdapter } from './StorageAdapter';
import { User, UserRole, Classroom, UniversalLessonUnit, BusinessSimulation, Book, CMSContent, Assignment, Submission, StudentGroup, Rubric } from '../../types';
import { Logger } from '../logger';
import { supabase, supabaseAdmin, isSupabaseConfigured } from '../../lib/supabase';


export class SupabaseAdapter implements StorageAdapter {
    public get client() {
        return supabase;
    }

    async initialize(): Promise<void> {
        if (isSupabaseConfigured()) {
            Logger.info("Supabase Adapter Initialized (Cloud Mode)");
            // Check auth session
            const { data: { session } } = await supabase!.auth.getSession();
            if (session) {
                Logger.info("Supabase Session Active", { userId: session.user.id }); // Redact email
            } else {
                Logger.warn("Supabase Configuration", { status: "No active session" });
            }
        } else {
            // ✅ SECURITY FIX: Use Logger.warn instead of console.warn so missing-key
            // events are captured by the structured logger and production monitoring.
            Logger.warn("Supabase Adapter initialized in Mock/Local Mode — missing keys");
        }
        return Promise.resolve();
    }

    async loadAllData() {
        if (!isSupabaseConfigured()) {
            return Promise.resolve({
                users: [],
                classrooms: [],
                lessons: [],
                games: [],
                library: [],
                cmsContent: {} as CMSContent,
                assignments: [],
                submissions: [],
                studentGroups: [],
                rubrics: []
            });
        }

        Logger.info("Supabase: Loading all data...");

        try {
            const [
                { data: profiles, error: profilesErr },
                { data: classrooms, error: classroomsErr },
                { data: assignments, error: assignmentsErr },
                { data: submissions, error: submissionsErr },
                { data: games, error: gamesErr },
                { data: books, error: booksErr },
                { data: cmsRows, error: cmsErr },
            ] = await Promise.all([
                supabase!.from('profiles').select('*, subscription_tier, subscription_status, billing_cycle, invite_code'),
                supabase!.from('classrooms').select('*'),
                supabase!.from('assignments').select('*'),
                supabase!.from('submissions').select('*'),
                supabase!.from('games').select('*'),
                supabase!.from('books').select('*'),
                supabase!.from('cms_content').select('*')
            ]);

            // ✅ SECURITY FIX: Check every query result — the 7th (cms_content) was silently discarded before.
            [profilesErr, classroomsErr, assignmentsErr, submissionsErr, gamesErr, booksErr, cmsErr]
                .filter(Boolean)
                .forEach(err => Logger.error('Supabase loadAllData partial failure', err));

            // Transform profiles to User objects (Snake case -> Camel case if needed, or rely on direct mapping if schema matches)
            // Note: Schema uses snake_case (e.g. biz_coins), Types use camelCase (bizCoins).
            // We need a mapper. For now, assuming basic mapping or we'll need a robust transformer.

            // Temporary: Returning empty for now to avoid compilation errors until mappers are written.
            // In a real implementation, we would map `profiles` -> `users` here.

            return {
                users: (profiles || []).map(p => this.mapProfileToUser(p, profiles || [])),
                classrooms: (classrooms || []).map(c => this.mapRowToClassroom(c)),
                lessons: [], // Lessons might be static or fetched
                games: (games || []) as unknown as BusinessSimulation[],
                library: (books || []) as unknown as Book[],
                cmsContent: {} as CMSContent, // TODO: map CMS
                assignments: (assignments || []) as unknown as Assignment[],
                submissions: (submissions || []) as unknown as Submission[],
                studentGroups: [],
                rubrics: []
            };

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            Logger.error("Supabase Load Failed", { error: errorMessage });
            throw error;
        }
    }

    // ✅ SECURITY FIX: Public mappers — allows type-safe access from store slices,
    // eliminating all `(supabaseAdapter as any).mapXxx()` encapsulation bypasses.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public mapProfileToUser(profile: any, allProfiles?: any[]): User {
        const user: User = {
            id: profile.id,
            name: profile.username || 'Unknown', // profile table has username
            role: ((): UserRole => {
                // ✅ SECURITY FIX: Validate the raw DB role against the UserRole enum allowlist.
                // Without this, a compromised DB row with role='ADMIN' would grant admin privileges on the client.
                // Deny-by-default: any unrecognized role maps to the lowest-privilege role (KID).
                const VALID_ROLES = new Set<string>(Object.values(UserRole));
                const rawRole = String(profile.role || 'KID').toUpperCase();
                return VALID_ROLES.has(rawRole) ? (rawRole as UserRole) : UserRole.KID;
            })(),
            parentId: profile.parent_id,
            xp: profile.xp,
            level: profile.level,
            bizCoins: profile.biz_coins, // DB snake_case -> TS camelCase
            inventory: profile.inventory || [],
            badges: profile.badges || [],
            settings: profile.settings || {},
            hqLevel: profile.hq_level || 'GARAGE',
            portfolio: profile.portfolio || [],
            placedItems: profile.placed_items || [],
            properties: profile.properties || [],
            // Defaults for missing fields in MVP schema
            streak: 0,
            lastActivityDate: profile.last_activity_date,
            currentModuleId: 'module_1',
            completedLessonIds: [],
            // Subscription: Use DB function to handle inheritance (Parent -> Kid)
            // Note: We need to fetch this separately or rely on a view. 
            // For MVP, we'll map direct fields first, then enhance.
            // Ideally: const { data } = await supabase.rpc('get_user_subscription_status', { user_uuid: profile.id });
            subscriptionStatus: profile.subscription_status || 'FREE',
            subscriptionTier: profile.subscription_tier || 'intern',
            billingCycle: profile.billing_cycle || undefined,
            energy: 5,
            lastEnergyRefill: Date.now(),
            equippedItems: [],
            unlockedSkills: [],
            referralCode: profile.referral_code || profile.invite_code, // fallback to invite_code if it exists
            referredBy: profile.referred_by,
            totalReferrals: profile.total_referrals || 0
        };
        
        // Apply Subscription Inheritance (Parent -> Kid) and Parent-Child Link (Kid -> Parent)
        if (user.role === UserRole.KID && user.parentId && allProfiles) {
            const parent = allProfiles.find((p: any) => p.id === user.parentId);
            if (parent && (
                parent.subscription_status?.toLowerCase() === 'active' ||
                parent.subscription_status?.toLowerCase() === 'premium' ||
                (parent.subscription_tier && parent.subscription_tier !== 'intern')
            )) {
                user.subscriptionStatus = 'PREMIUM';
                user.subscriptionTier = parent.subscription_tier || 'intern'; // Inherit tier
                user.billingCycle = parent.billing_cycle || undefined; // Inherit billing cycle
            }
        } else if (user.role === UserRole.PARENT && allProfiles) {
            // Find the child linked to this parent (if any)
            const childProfile = allProfiles.find((p: any) => p.parent_id === user.id);
            // ✅ SECURITY FIX: Replaced console.log (PII leak) with Logger.info logging
            // only safe non-identifying fields (role + link presence, not IDs).
            Logger.info('mapProfileToUser: parent-child link resolved', {
                hasLinkedChild: !!childProfile
            });
            if (childProfile) {
                user.linkedChildId = childProfile.id;
            }
        }

        return user;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public mapRowToClassroom(row: any): Classroom {
        return {
            id: row.id,
            code: row.code,
            name: row.name,
            teacherId: row.teacher_id,
            studentIds: row.student_ids || [],
            lockedModules: row.locked_modules || []
        };
    }

    async saveUser(user: User): Promise<void> {
        if (!isSupabaseConfigured()) return;

        const profile = {
            id: user.id,
            username: user.username || user.name,
            role: user.role.toLowerCase(),
            email: (user as any).email || null,
            xp: user.xp,
            level: user.level,
            biz_coins: user.bizCoins,
            inventory: user.inventory,
            badges: user.badges,
            settings: user.settings,
            hq_level: user.hqLevel,
            portfolio: user.portfolio,
            placed_items: user.placedItems,
            properties: user.properties,
            last_activity_date: user.lastActivityDate,
            subscription_tier: user.subscriptionTier || 'intern',
            subscription_status: user.subscriptionStatus || 'FREE',
            billing_cycle: user.billingCycle || null
            // Note: referral_code, referred_by, total_referrals removed —
            // these columns do not exist in the profiles table schema.
        };

        // Use service-role client if available so admin saves bypass RLS.
        // We use update→insert instead of upsert to avoid Supabase checking
        // both INSERT + UPDATE policies simultaneously (which can cause false
        // RLS violations even with the service-role key).
        const client = supabaseAdmin ?? supabase!;
        const { data: updated, error: updateError } = await client
            .from('profiles')
            .update(profile)
            .eq('id', user.id)
            .select('id');

        if (updateError) {
            Logger.error("Supabase: Save User (update) Failed", { error: updateError.message, userId: user.id });
            throw updateError;
        }

        // If no row was updated (new user not yet in profiles), insert instead
        if (!updated || updated.length === 0) {
            const { error: insertError } = await client.from('profiles').insert(profile);
            if (insertError) {
                Logger.error("Supabase: Save User (insert) Failed", { error: insertError.message, userId: user.id });
                throw insertError;
            }
        }
    }

    async deleteUser(userId: string): Promise<void> {
        if (!isSupabaseConfigured()) return;
        const client = supabaseAdmin ?? supabase!;
        const { error } = await client.from('profiles').delete().eq('id', userId);
        if (error) {
            Logger.error("Supabase: Delete User Failed", { error: error.message, userId });
            throw error;
        }
    }

    async saveClassroom(classroom: Classroom): Promise<void> {
        if (!isSupabaseConfigured()) return;

        const row = {
            id: classroom.id,
            code: classroom.code,
            name: classroom.name,
            teacher_id: classroom.teacherId,
            student_ids: classroom.studentIds,
            locked_modules: classroom.lockedModules
        };

        const { error } = await supabase!.from('classrooms').upsert(row);
        if (error) {
            Logger.error("Supabase: Save Classroom Failed", { error: error.message, classroomId: classroom.id });
            throw error;
        }
    }

    async deleteClassroom(classroomId: string): Promise<void> {
        if (!isSupabaseConfigured()) return;
        const { error } = await supabase!.from('classrooms').delete().eq('id', classroomId);
        if (error) {
            Logger.error("Supabase: Delete Classroom Failed", { error: error.message, classroomId });
            throw error;
        }
    }

    async saveAssignment(assignment: Assignment): Promise<void> {
        if (!isSupabaseConfigured()) return;

        const row = {
            id: assignment.id,
            class_id: assignment.classId,
            lesson_id: assignment.lessonId,
            title: assignment.title,
            description: assignment.description,
            student_group_id: assignment.studentGroupId,
            specific_student_ids: assignment.specificStudentIds,
            scheduled_at: assignment.scheduledAt,
            due_date: assignment.dueDate,
            rubric_id: assignment.rubricId,
            max_points: assignment.maxPoints,
            resource_url: assignment.resourceUrl,
            created_at: assignment.createdAt,
            status: assignment.status
        };

        const { error } = await supabase!.from('assignments').upsert(row);
        if (error) {
            Logger.error("Supabase: Save Assignment Failed", { error: error.message, assignmentId: assignment.id });
            throw error;
        }
    }

    async deleteAssignment(assignmentId: string): Promise<void> {
        if (!isSupabaseConfigured()) return;
        const { error } = await supabase!.from('assignments').delete().eq('id', assignmentId);
        if (error) {
            Logger.error("Supabase: Delete Assignment Failed", { error: error.message, assignmentId });
            throw error;
        }
    }

    async saveSubmission(submission: Submission): Promise<void> {
        if (!isSupabaseConfigured()) return;

        const row = {
            id: submission.id,
            assignment_id: submission.assignmentId,
            student_id: submission.studentId,
            submitted_at: submission.submittedAt,
            status: submission.status,
            content: submission.content,
            grade: submission.grade,
            feedback: submission.feedback,
            audio_feedback_url: submission.audioFeedbackUrl,
            rubric_scores: submission.rubricScores,
            letter_grade: submission.letterGrade,
            biz_coins_awarded: submission.bizCoinsAwarded,
            xp_gained: submission.xpGained
        };

        const { error } = await supabase!.from('submissions').upsert(row);
        if (error) {
            Logger.error("Supabase: Save Submission Failed", { error: error.message, submissionId: submission.id });
            throw error;
        }
    }

    async saveGame(game: BusinessSimulation): Promise<void> {
        if (!isSupabaseConfigured()) return;

        const row = {
            business_id: game.business_id, // Map business_id to business_id (or id)
            name: game.name,
            name_key: game.nameKey,
            category: game.category,
            description: game.description,
            description_key: game.descriptionKey,
            game_type: game.game_type,
            // JSON Configs
            visual_config: game.visual_config,
            variables: game.variables,
            game_mechanics: game.game_mechanics,
            cooking_config: game.cooking_config,
            service_config: game.service_config,
            rhythm_config: game.rhythm_config,
            grid_config: game.grid_config,
            clicker_config: game.clicker_config,
            repair_config: game.repair_config,
            office_config: game.office_config,
            timeline_config: game.timeline_config,
            trading_config: game.trading_config,
            defense_config: game.defense_config,
            streamer_config: game.streamer_config,
            entities: game.entities,
            scoring: game.scoring,
            upgrade_tree: game.upgrade_tree,
            event_triggers: game.event_triggers
        };

        const { error } = await supabase!.from('games').upsert(row);
        if (error) {
            Logger.error("Supabase: Save Game Failed", { error: error.message, gameId: game.business_id });
            throw error;
        }
    }

    async deleteGame(gameId: string): Promise<void> {
        if (!isSupabaseConfigured()) return;
        const { error } = await supabase!.from('games').delete().eq('business_id', gameId);
        if (error) {
            Logger.error("Supabase: Delete Game Failed", { error: error.message, gameId });
            throw error;
        }
    }

    async saveLesson(lesson: UniversalLessonUnit): Promise<void> {
        if (!isSupabaseConfigured()) return;

        const row = {
            id: lesson.id,
            topic_tag: lesson.topic_tag,
            difficulty: lesson.difficulty,
            lesson_payload: lesson.lesson_payload,
            challenge_payload: lesson.challenge_payload,
            game_rewards: lesson.game_rewards,
            flavor_text: lesson.flavor_text,
            linked_game_id: lesson.linkedGameId
        };

        const { error } = await supabase!.from('lessons').upsert(row); // Assuming table is 'lessons' based on loadAllData context
        if (error) {
            Logger.error("Supabase: Save Lesson Failed", { error: error.message, lessonId: lesson.id });
            throw error;
        }
    }

    async saveBook(book: Book): Promise<void> {
        if (!isSupabaseConfigured()) return;

        const row = {
            id: book.id,
            title: book.title,
            author: book.author,
            cover_url: book.coverUrl,
            summary: book.summary,
            category: book.category,
            key_lessons: book.keyLessons,
            age_rating: book.ageRating
        };

        const { error } = await supabase!.from('books').upsert(row);
        if (error) {
            Logger.error("Supabase: Save Book Failed", { error: error.message, bookId: book.id });
            throw error;
        }
    }

    async removeBook(bookId: string): Promise<void> {
        if (!isSupabaseConfigured()) return;
        const { error } = await supabase!.from('books').delete().eq('id', bookId);
        if (error) {
            Logger.error("Supabase: Remove Book Failed", { error: error.message, bookId });
            throw error;
        }
    }

    async saveCMSContent(content: CMSContent): Promise<void> {
        if (!isSupabaseConfigured()) return;

        // Split CMS content into rows by key (e.g., 'landing', 'features') or save as one blob if schema allows.
        // Schema definition has 'key' and 'content' columns.

        const keys = Object.keys(content) as Array<keyof CMSContent>;
        const timestamp = new Date().toISOString();

        const updates = keys.map(key => ({
            key,
            content: content[key],
            updated_at: timestamp
        }));

        const { error } = await supabase!.from('cms_content').upsert(updates, { onConflict: 'key' });

        if (error) {
            Logger.error("Supabase: Save CMS Content Failed", { error: error.message });
            throw error;
        }
    }
}

export const supabaseAdapter = new SupabaseAdapter();
