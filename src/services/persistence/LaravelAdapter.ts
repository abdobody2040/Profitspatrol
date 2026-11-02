import { StorageAdapter } from './StorageAdapter';
import {
    User,
    UserRole,
    Classroom,
    UniversalLessonUnit,
    BusinessSimulation,
    Book,
    CMSContent,
    Assignment,
    Submission,
    StudentGroup,
    Rubric
} from '../../types';
import { api } from '../../lib/api';
import { Logger } from '../logger';

export class LaravelAdapter implements StorageAdapter {
    public isConnected(): boolean {
        return api.isConfigured();
    }

    async initialize(): Promise<void> {
        Logger.info('LaravelAdapter Initialized');
        const token = api.getToken();
        if (token) {
            try {
                const res: any = await api.get('/auth/me');
                if (res?.user) {
                    Logger.info('Laravel Sanctum session active', { userId: res.user.id });
                }
            } catch (e) {
                Logger.warn('Laravel session expired or invalid, cleared token', { error: e });
                api.clearToken();
            }
        }
    }

    async loadAllData(): Promise<{
        users: User[];
        classrooms: Classroom[];
        lessons: UniversalLessonUnit[];
        games: BusinessSimulation[];
        library: Book[];
        cmsContent: CMSContent;
        assignments: Assignment[];
        submissions: Submission[];
        studentGroups: StudentGroup[];
        rubrics: Rubric[];
    }> {
        if (!api.getToken()) {
            return {
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
            };
        }

        try {
            const [profileRes, classroomsRes]: [any, any] = await Promise.all([
                api.get('/profile').catch(() => null),
                api.get('/classrooms').catch(() => null),
            ]);

            const users: User[] = profileRes?.profile ? [this.mapProfileToUser(profileRes.profile)] : [];
            const classrooms: Classroom[] = (classroomsRes?.classrooms ?? []).map((c: any) => this.mapRowToClassroom(c));

            return {
                users,
                classrooms,
                lessons: [],
                games: [],
                library: [],
                cmsContent: {} as CMSContent,
                assignments: [],
                submissions: [],
                studentGroups: [],
                rubrics: []
            };
        } catch (error) {
            Logger.error('LaravelAdapter: Failed to load data', error);
            return {
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
            };
        }
    }

    async saveUser(user: User): Promise<void> {
        try {
            await api.put('/profile', {
                name: user.name,
                avatar: user.avatar,
                settings: user.settings,
                hq_level: user.hqLevel,
                hq_theme: user.settings?.themeColor ?? 'blue',
                business_logo: user.businessLogo,
                equipped_items: user.equippedItems,
                placed_items: user.placedItems,
                unlocked_skills: user.unlockedSkills,
            });
        } catch (e) {
            Logger.error('LaravelAdapter: saveUser failed', e);
        }
    }

    async deleteUser(userId: string): Promise<void> {
        try {
            await api.post('/account/delete-request', { userId });
        } catch (e) {
            Logger.error('LaravelAdapter: deleteUser failed', e);
        }
    }

    async saveClassroom(classroom: Classroom): Promise<void> {
        try {
            await api.post('/classrooms', classroom);
        } catch (e) {
            Logger.error('LaravelAdapter: saveClassroom failed', e);
        }
    }

    async deleteClassroom(_classroomId: string): Promise<void> {
        // Reserved for future classroom deletion route
    }

    async saveAssignment(assignment: Assignment): Promise<void> {
        try {
            await api.post(`/classrooms/${assignment.classId}/assignments`, assignment);
        } catch (e) {
            Logger.error('LaravelAdapter: saveAssignment failed', e);
        }
    }

    async deleteAssignment(_assignmentId: string): Promise<void> {
        // Reserved
    }

    async saveSubmission(submission: Submission): Promise<void> {
        try {
            await api.post(`/assignments/${submission.assignmentId}/submit`, {
                content: submission.content,
            });
        } catch (e) {
            Logger.error('LaravelAdapter: saveSubmission failed', e);
        }
    }

    async saveGame(_game: BusinessSimulation): Promise<void> {}
    async deleteGame(_gameId: string): Promise<void> {}
    async saveLesson(_lesson: UniversalLessonUnit): Promise<void> {}
    async saveBook(_book: Book): Promise<void> {}
    async removeBook(_bookId: string): Promise<void> {}
    async saveCMSContent(_content: CMSContent): Promise<void> {}

    // Auth helpers
    async register(payload: any): Promise<any> {
        const res: any = await api.post('/auth/register', payload);
        if (res?.token) {
            api.setToken(res.token);
        }
        return res;
    }

    async login(payload: any): Promise<any> {
        const res: any = await api.post('/auth/login', payload);
        if (res?.token) {
            api.setToken(res.token);
        }
        return res;
    }

    async loginWithGoogle(payload: { credential: string; role?: string; invite_code?: string; age?: number }): Promise<any> {
        const res: any = await api.post('/auth/google', payload);
        if (res?.token) {
            api.setToken(res.token);
        }
        return res;
    }

    async logout(): Promise<void> {
        try {
            await api.post('/auth/logout');
        } catch (e) {
            Logger.warn('Backend logout encountered error, clearing client state', { error: e });
        } finally {
            api.clearToken();
        }
    }

    // Progression helpers
    async completeLesson(lessonId: string, xpEarned?: number, ppEarned?: number): Promise<any> {
        return api.post('/profile/lessons/complete', {
            lesson_id: lessonId,
            xp_earned: xpEarned,
            pp_tokens_earned: ppEarned,
        });
    }

    async awardTokens(amount: number, reason: string, targetUserId?: string): Promise<any> {
        return api.post('/profile/tokens/award', {
            target_user_id: targetUserId,
            amount,
            reason,
        });
    }

    async claimSpin(rewardType: string, amount: number): Promise<any> {
        return api.post('/profile/spin/claim', {
            reward_type: rewardType,
            amount,
        });
    }

    // Stocks
    async getStocks(): Promise<any> {
        return api.get('/stocks');
    }

    async getStockPortfolio(): Promise<any> {
        return api.get('/stocks/portfolio');
    }

    async buyStock(stockId: string, quantity: number): Promise<any> {
        return api.post('/stocks/buy', { stock_id: stockId, quantity });
    }

    async sellStock(stockId: string, quantity: number): Promise<any> {
        return api.post('/stocks/sell', { stock_id: stockId, quantity });
    }

    // Security & Server Time
    async getServerTime(): Promise<number> {
        const res: any = await api.get('/server-time');
        return res?.server_time ?? Date.now();
    }

    async logSecurityEvent(payload: any): Promise<any> {
        return api.post('/security/log-event', payload);
    }

    public isTableMissing(_error: any): boolean {
        return false;
    }

    public mapProfileToUser(
        profile: any,
        allProfiles?: any[],
        stockPortfolios?: any[],
        corporationId?: string
    ): User {
        const VALID_ROLES = new Set<string>(Object.values(UserRole));
        const rawRole = String(profile.role || 'KID').toUpperCase();
        const role = VALID_ROLES.has(rawRole) ? (rawRole as UserRole) : UserRole.KID;

        const user: User = {
            id: profile.id,
            name: profile.name || profile.username || 'User',
            username: profile.username || profile.email?.split('@')[0] || 'user',
            email: profile.email || undefined,
            avatar: profile.avatar || undefined,
            role,
            parentId: profile.parent_id || undefined,
            xp: Number(profile.xp) || 0,
            seasonXp: Number(profile.season_xp) || 0,
            level: Number(profile.level) || 1,
            ppTokens: Number(profile.pp_tokens) || 0,
            streak: Number(profile.streak) || 1,
            lastActivityDate: profile.last_activity_date || new Date().toISOString().split('T')[0],
            currentModuleId: profile.current_module_id || 'mod_1',
            completedLessonIds: Array.isArray(profile.completed_lesson_ids) ? profile.completed_lesson_ids : [],
            badges: Array.isArray(profile.badges) ? profile.badges : ['Newbie'],
            inventory: Array.isArray(profile.inventory) ? profile.inventory : [],
            equippedItems: Array.isArray(profile.equipped_items) ? profile.equipped_items : [],
            placedItems: Array.isArray(profile.placed_items) ? profile.placed_items : [],
            businessLogo: profile.business_logo || undefined,
            unlockedSkills: Array.isArray(profile.unlocked_skills) ? profile.unlocked_skills : [],
            portfolio: Array.isArray(profile.portfolio) ? profile.portfolio : [],
            properties: Array.isArray(profile.properties) ? profile.properties : [],
            settings: profile.settings || {
                dailyGoalMinutes: 15,
                soundEnabled: true,
                musicEnabled: true,
                themeColor: role === UserRole.ADMIN ? 'purple' : role === UserRole.TEACHER ? 'blue' : role === UserRole.PARENT ? 'orange' : 'green',
                themeMode: 'light',
                ageMode: role === UserRole.KID ? 'junior' : 'explorer',
                hapticsEnabled: true,
            },
            hqLevel: profile.hq_level || 'GARAGE',
            subscriptionStatus: (profile.subscription_status?.toUpperCase() === 'PREMIUM' ? 'PREMIUM' : 'FREE'),
            subscriptionTier: profile.subscription_tier || 'intern',
            billingCycle: profile.billing_cycle || undefined,
            energy: profile.energy !== undefined && profile.energy !== null ? Number(profile.energy) : 5,
            lastEnergyRefill: profile.last_energy_refill ? Number(profile.last_energy_refill) : Date.now(),
            referralCode: profile.invite_code || undefined,
            referredBy: profile.referred_by || undefined,
            totalReferrals: Number(profile.total_referrals) || 0,
            lastSpinDate: profile.last_spin_date || undefined,
            totalSpins: Number(profile.total_spins) || 0,
            stockPortfolio: stockPortfolios
                ? stockPortfolios.map((sp: any) => ({
                    stockId: sp.stock_id,
                    shares: sp.quantity,
                    avgBuyPrice: sp.avg_buy_price
                }))
                : (Array.isArray(profile.stock_portfolio) ? profile.stock_portfolio : []),
            corporationId: corporationId || profile.corporation_id || undefined,
        };

        // Apply Subscription Inheritance (Parent -> Kid) and Parent-Child Link
        if (user.role === UserRole.KID && user.parentId && allProfiles) {
            const parent = allProfiles.find((p: any) => p.id === user.parentId);
            if (parent && (
                parent.subscription_status?.toLowerCase() === 'active' ||
                parent.subscription_status?.toLowerCase() === 'premium' ||
                (parent.subscription_tier && parent.subscription_tier !== 'intern')
            )) {
                user.subscriptionStatus = 'PREMIUM';
                user.subscriptionTier = parent.subscription_tier || 'intern';
                user.billingCycle = parent.billing_cycle || undefined;
            }
        } else if (user.role === UserRole.PARENT && allProfiles) {
            const childProfile = allProfiles.find((p: any) => p.parent_id === user.id);
            if (childProfile) {
                user.linkedChildId = childProfile.id;
            }
        }

        return user;
    }

    public mapRowToClassroom(row: any): Classroom {
        return {
            id: row.id,
            code: row.code,
            name: row.name,
            teacherId: row.teacher_id,
            studentIds: row.members ? row.members.map((m: any) => m.user_id) : (row.student_ids || []),
            lockedModules: row.locked_modules || []
        };
    }

    public mapRowToAssignment(row: any): Assignment {
        return {
            id: row.id,
            classId: row.classroom_id,
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

    public mapRowToSubmission(row: any): Submission {
        return {
            id: row.id,
            assignmentId: row.assignment_id,
            studentId: row.student_id,
            submittedAt: row.submitted_at,
            status: row.status,
            content: row.content,
            grade: row.grade,
            feedback: row.feedback,
            gradedAt: row.graded_at,
            rubricScores: row.rubric_scores,
            plagiarismScore: row.plagiarism_score,
            originalityScore: row.originality_score
        };
    }

    async fetchAllUsers(): Promise<User[]> {
        try {
            const res: any = await api.get('/admin/users');
            const profiles = res?.users ?? [];
            if (profiles.length > 0) {
                return profiles.map((p: any) => this.mapProfileToUser(p, profiles));
            }
        } catch (err) {
            Logger.warn('[LaravelAdapter] /admin/users fetch failed, trying leaderboard fallback', { error: String(err) });
        }

        try {
            const res: any = await api.get('/leaderboard');
            const profiles = res?.leaderboard ?? [];
            return profiles.map((p: any) => this.mapProfileToUser(p, profiles));
        } catch {
            return [];
        }
    }

    async fetchAllClassrooms(): Promise<Classroom[]> {
        try {
            const res: any = await api.get('/classrooms/public').catch(() => api.get('/classrooms'));
            const rows = res?.classrooms ?? [];
            return rows.map((r: any) => this.mapRowToClassroom(r));
        } catch (err) {
            Logger.warn('[LaravelAdapter] fetchAllClassrooms failed (likely unauthenticated in dev)', { error: String(err) });
            return [];
        }
    }
}

export const laravelAdapter = new LaravelAdapter();
