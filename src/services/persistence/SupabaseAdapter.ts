import { StorageAdapter } from './StorageAdapter';
import { User, UserRole, Classroom, UniversalLessonUnit, BusinessSimulation, Book, CMSContent, Assignment, Submission, StudentGroup, Rubric } from '../../types';
import { Logger } from '../logger';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';


export class SupabaseAdapter implements StorageAdapter {
    public get client() {
        return supabase;
    }

    public isTableMissing(error: any): boolean {
        if (!error) return false;
        const code = String(error.code || '');
        const message = String(error.message || '').toLowerCase();
        return code === '42P01' || message.includes('relation') && message.includes('does not exist');
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
                { data: stockPortfolios, error: stockPortfoliosErr },
                { data: corpMembers, error: corpMembersErr },
            ] = await Promise.all([
                supabase!.from('profiles').select('*, subscription_tier, subscription_status, billing_cycle, invite_code'),
                supabase!.from('classrooms').select('*'),
                supabase!.from('assignments').select('*'),
                supabase!.from('submissions').select('*'),
                supabase!.from('games').select('*'),
                supabase!.from('books').select('*'),
                supabase!.from('cms_content').select('*'),
                supabase!.from('stock_portfolio').select('*'),
                supabase!.from('corporation_members').select('*')
            ]);

            // ✅ SECURITY FIX: Check every query result — the 7th (cms_content) was silently discarded before.
            const errors = [profilesErr, classroomsErr, assignmentsErr, submissionsErr, gamesErr, booksErr, cmsErr].filter(Boolean);
            
            if (errors.length > 0) {
                errors.forEach(err => Logger.error('Supabase loadAllData partial failure', err));
                
                // If the profiles table is missing, the whole app is likely uninitialized
                if (profilesErr && this.isTableMissing(profilesErr)) {
                    throw new Error("DATABASE_NOT_INITIALIZED: profiles table missing");
                }
            }

            if (stockPortfoliosErr) {
                Logger.error("Supabase: failed to load stock_portfolio", stockPortfoliosErr);
            }
            if (corpMembersErr) {
                Logger.error("Supabase: failed to load corporation_members", corpMembersErr);
            }

            // Transform profiles to User objects (Snake case -> Camel case if needed, or rely on direct mapping if schema matches)
            // Note: Schema uses snake_case (e.g. pp_tokens), Types use camelCase (ppTokens).
            // We need a mapper. For now, assuming basic mapping or we'll need a robust transformer.

            // Temporary: Returning empty for now to avoid compilation errors until mappers are written.
            // In a real implementation, we would map `profiles` -> `users` here.

            return {
                users: (profiles || []).map(p => {
                    const myCorp = (corpMembers || []).find((cm: any) => cm.user_id === p.id);
                    return this.mapProfileToUser(p, profiles || [], stockPortfolios || [], myCorp?.corporation_id);
                }),
                classrooms: (classrooms || []).map(c => this.mapRowToClassroom(c)),
                lessons: [], // Lessons might be static or fetched
                games: (games || []) as unknown as BusinessSimulation[],
                library: (books || []) as unknown as Book[],
                cmsContent: {} as CMSContent, // Default empty CMS store snapshot
                assignments: (assignments || []).map(a => this.mapRowToAssignment(a)),
                submissions: (submissions || []).map(s => this.mapRowToSubmission(s)),
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
    public mapProfileToUser(
        profile: any,
        allProfiles?: any[],
        stockPortfolios?: any[],
        corporationId?: string
    ): User {
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
            seasonXp: profile.season_xp || 0,
            level: profile.level,
            ppTokens: profile.pp_tokens, // DB snake_case -> TS camelCase
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
            totalReferrals: profile.total_referrals || 0,
            // Year 2 Hydrations
            lastSpinDate: profile.settings?.lastSpinDate || undefined,
            totalSpins: profile.settings?.totalSpins || 0,
            stockPortfolio: stockPortfolios
                ? stockPortfolios
                    .filter((sp: any) => sp.user_id === profile.id)
                    .map((sp: any) => ({
                        stockId: sp.stock_id,
                        shares: sp.quantity,
                        avgBuyPrice: sp.avg_buy_price
                    }))
                : [],
            corporationId: corporationId || undefined
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public mapRowToAssignment(row: any): Assignment {
        return {
            id: row.id,
            classId: row.classroom_id, // DB classroom_id -> TS classId
            lessonId: row.lesson_id,
            title: row.title,
            description: row.description,
            studentGroupId: row.student_group_id,
            specificStudentIds: row.specific_student_ids || [],
            scheduledAt: row.scheduled_at,
            dueDate: row.due_date,
            rubricId: row.rubric_id,
            maxPoints: row.max_points,
            resourceUrl: row.resource_url,
            createdAt: row.created_at,
            status: row.status
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public mapRowToSubmission(row: any): Submission {
        return {
            id: row.id,
            assignmentId: row.assignment_id,
            studentId: row.student_id,
            submittedAt: row.submitted_at,
            status: row.status,
            content: row.content,
            grade: row.grade ? Number(row.grade) : undefined,
            feedback: row.feedback,
            // Fields that might be missing in DB but in TS type
            audioFeedbackUrl: row.audio_feedback_url,
            rubricScores: row.rubric_scores,
            letterGrade: row.letter_grade,
            ppTokensAwarded: row.pp_tokens_awarded,
            xpGained: row.xp_gained
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
            season_xp: user.seasonXp,
            level: user.level,
            pp_tokens: user.ppTokens,
            inventory: user.inventory,
            badges: user.badges,
            settings: {
                ...user.settings,
                lastSpinDate: user.lastSpinDate,
                totalSpins: user.totalSpins
            },
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

        // ✅ SECURITY: Use the anon client — RLS policy ensures users can only write their own row.
        // The service_role key is NOT available on the client (see lib/supabase.ts).
        const { data: updated, error: updateError } = await supabase!
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
            const { error: insertError } = await supabase!.from('profiles').insert(profile);
            if (insertError) {
                Logger.error("Supabase: Save User (insert) Failed", { error: insertError.message, userId: user.id });
                throw insertError;
            }
        }

        // Sync stock portfolio
        if (user.stockPortfolio) {
            try {
                await this.saveStockPortfolio(user.id, user.stockPortfolio);
            } catch (err) {
                Logger.error("Supabase: Save Stock Portfolio inside saveUser failed", err);
            }
        }
    }

    async deleteUser(userId: string): Promise<void> {
        if (!isSupabaseConfigured()) return;
        // ✅ SECURITY: Anon client with RLS. Only admin-role users should call this.
        const { error } = await supabase!.from('profiles').delete().eq('id', userId);
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
            classroom_id: assignment.classId, // FIX: class_id -> classroom_id
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
            feedback: submission.feedback
            // Omitted fields not present in current DB schema (MASTER_SCHEMA.sql):
            // audio_feedback_url, rubric_scores, letter_grade, pp_tokens_awarded, xp_gained
        };

        const { error } = await supabase!.from('submissions').upsert(row);
        if (error) {
            Logger.error("Supabase: Save Submission Failed", { error: error.message, submissionId: submission.id });
            throw error;
        }
    }

    async deleteSubmission(submissionId: string): Promise<void> {
        if (!isSupabaseConfigured()) return;
        const { error } = await supabase!.from('submissions').delete().eq('id', submissionId);
        if (error) {
            Logger.error("Supabase: Delete Submission Failed", { error: error.message, submissionId });
            throw error;
        }
    }

    async saveStudentGroup(group: StudentGroup): Promise<void> {
        if (!isSupabaseConfigured()) return;
        const row = {
            id: group.id,
            classroom_id: group.classId,
            name: group.name,
            student_ids: group.studentIds,
            color: group.color
        };
        const { error } = await supabase!.from('student_groups').upsert(row);
        if (error) {
            Logger.error("Supabase: Save Student Group Failed", { error: error.message, groupId: group.id });
            throw error;
        }
    }

    async saveRubric(rubric: Rubric): Promise<void> {
        if (!isSupabaseConfigured()) return;
        const row = {
            id: rubric.id,
            teacher_id: rubric.teacherId,
            title: rubric.title,
            criteria: rubric.criteria
        };
        const { error } = await supabase!.from('rubrics').upsert(row);
        if (error) {
            Logger.error("Supabase: Save Rubric Failed", { error: error.message, rubricId: rubric.id });
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

    async saveStockPortfolio(userId: string, holdings: any[]): Promise<void> {
        if (!isSupabaseConfigured()) return;
        
        try {
            // Delete all existing holdings for the user
            const { error: deleteError } = await supabase!
                .from('stock_portfolio')
                .delete()
                .eq('user_id', userId);
                
            if (deleteError) throw deleteError;

            if (holdings.length === 0) return;

            const updates = holdings.map(h => ({
                user_id: userId,
                stock_id: h.stockId,
                quantity: h.shares,
                avg_buy_price: Math.round(h.avgBuyPrice),
                last_updated: new Date().toISOString()
            }));

            const { error: upsertError } = await supabase!
                .from('stock_portfolio')
                .upsert(updates);

            if (upsertError) throw upsertError;
        } catch (err) {
            Logger.error("Supabase: saveStockPortfolio failed", err);
            throw err;
        }
    }

    async createCorporation(userId: string, corp: { name: string; motto?: string; emoji: string; color: string }): Promise<string> {
        if (!isSupabaseConfigured()) {
            return `corp_${Date.now()}`;
        }
        
        try {
            const { data: newCorpData, error: corpError } = await supabase!
                .from('corporations')
                .insert({
                    name: corp.name,
                    motto: corp.motto || 'Building the future together',
                    logo_emoji: corp.emoji,
                    logo_color: corp.color,
                    founder_id: userId,
                    logo_icon: 'building'
                })
                .select('id')
                .single();

            if (corpError) throw corpError;

            const corpId = newCorpData.id;

            const { error: memberError } = await supabase!
                .from('corporation_members')
                .insert({
                    corporation_id: corpId,
                    user_id: userId,
                    role: 'CEO'
                });

            if (memberError) {
                await supabase!.from('corporations').delete().eq('id', corpId);
                throw memberError;
            }

            return corpId;
        } catch (err) {
            Logger.error("Supabase: createCorporation failed", err);
            throw err;
        }
    }

    async joinCorporation(userId: string, corporationId: string, role: string = 'Member'): Promise<void> {
        if (!isSupabaseConfigured()) return;

        try {
            const { error } = await supabase!
                .from('corporation_members')
                .insert({
                    corporation_id: corporationId,
                    user_id: userId,
                    role: role
                });

            if (error) throw error;
        } catch (err) {
            Logger.error("Supabase: joinCorporation failed", err);
            throw err;
        }
    }

    async leaveCorporation(userId: string, corporationId: string): Promise<void> {
        if (!isSupabaseConfigured()) return;

        try {
            const { error } = await supabase!
                .from('corporation_members')
                .delete()
                .eq('user_id', userId)
                .eq('corporation_id', corporationId);

            if (error) throw error;

            const { data: members, error: countError } = await supabase!
                .from('corporation_members')
                .select('id')
                .eq('corporation_id', corporationId);

            if (!countError && (!members || members.length === 0)) {
                await supabase!
                    .from('corporations')
                    .delete()
                    .eq('id', corporationId);
            }
        } catch (err) {
            Logger.error("Supabase: leaveCorporation failed", err);
            throw err;
        }
    }
}

export const supabaseAdapter = new SupabaseAdapter();
