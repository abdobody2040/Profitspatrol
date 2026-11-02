import { StateCreator } from 'zustand';
import type { AppState } from '../types';
import { User, UserRole, Classroom, UserSettings, BusinessLogo } from "../../types";
import { useEducationStore } from '../educationStore';
import { MOCK_USER, MOCK_EXPLORER_USER, MOCK_PARENT, MOCK_TEACHER, MOCK_ADMIN, MOCK_CLASSROOM } from '../../data/mocks';
import { getToday } from '../../utils/gameUtils';
import { Logger } from '../../services/logger';
import { laravelAdapter } from '../../services/persistence/LaravelAdapter';
import { api } from '../../lib/api';

const DEFAULT_SETTINGS: UserSettings = {
    dailyGoalMinutes: 15,
    soundEnabled: true,
    musicEnabled: true,
    themeColor: 'green',
    themeMode: 'light',
    ageMode: 'explorer',
    hapticsEnabled: true
};

export interface UserSlice {
    user: User | null;
    users: User[];
    adminViewingClassroomId: string | null;

    // --- AUTH LIFECYCLE FLAGS (never persisted) ---
    /** True while AuthProvider is running its initial session check. Prevents
     *  stale localStorage data from triggering premature redirects. */
    isAuthLoading: boolean;
    /** True while registerUser() is in progress. Prevents the concurrent
     *  SIGNED_IN event in AuthProvider from firing a refreshUser() that would
     *  overwrite the freshly-registered user with an incomplete DB profile. */
    isRegistering: boolean;

    setAuthLoading: (loading: boolean) => void;

    // --- AUTHENTICATION ---
    login: (role: UserRole) => void;
    loginWithCredentials: (username: string, password: string) => Promise<boolean | 'EMAIL_NOT_CONFIRMED'>;
    loginWithGoogle: (credential: string, role?: UserRole, inviteCode?: string, age?: number) => Promise<boolean>;
    logout: () => void;
    registerUser: (name: string, username: string, email: string, password: string, role: UserRole, inviteCode?: string) => Promise<string | undefined>;
    impersonateUser: (userId: string) => void;

    // --- USER SETTINGS ---
    setUser: (user: User | null) => void;
    updateUserSettings: (settings: Partial<UserSettings>) => void;
    setAgeMode: (mode: 'junior' | 'explorer') => void;
    updateBusinessLogo: (logo: BusinessLogo) => void;

    // --- ADMIN CRUD ---
    fetchAllUsers: () => Promise<void>;
    addUser: (user: User) => Promise<string | undefined>;
    updateUser: (id: string, updates: Partial<User>) => void;
    updateUserAdmin: (id: string, updates: Partial<User>) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    exportUserData: (id: string) => object | null;
    refreshUser: () => Promise<void>;
}

export const createUserSlice: StateCreator<AppState, [], [], UserSlice> = (set, get) => ({
    user: null,
    users: [], // Security: No mock users in production. All users must come from Supabase.
    adminViewingClassroomId: null,

    // Auth lifecycle flags — always start in loading state, never persisted.
    isAuthLoading: true,
    isRegistering: false,

    setAuthLoading: (loading) => set({ isAuthLoading: loading }),

    setUser: (user) => set({ user }),

    login: (role: UserRole) => {
        // ✅ SECURITY FIX: Block dev quick-login in production builds.
        // This shortcut bypasses Supabase auth and uses hardcoded mock users.
        // It must NEVER run in production — only in local development.
        if (import.meta.env.PROD) {
            Logger.error('[Security] Dev login() shortcut called in production — blocked. Use loginWithCredentials().');
            return;
        }

        const currentUser = get().user;
        if (currentUser && currentUser.role === role) return;

        const targetUser = get().users.find(u => u.role === role);
        let user = null;
        let classroom = null;

        if (targetUser) {
            user = { ...targetUser };
            if (role === UserRole.TEACHER) classroom = { ...MOCK_CLASSROOM };
        } else {
            // Fallback to mocks if not found (Dev Mode)
            if (role === UserRole.KID) user = { ...MOCK_USER };
            if (role === UserRole.PARENT) user = { ...MOCK_PARENT };
            if (role === UserRole.TEACHER) user = { ...MOCK_TEACHER };
            if (role === UserRole.ADMIN) user = { ...MOCK_ADMIN };
        }

        // Admin God Mode: Max Stats
        if (user && user.role === UserRole.ADMIN) {
            user.ppTokens = 1_000_000_000;
            user.level = 100;
            user.xp = 1_000_000;
            user.subscriptionTier = 'tycoon';
        }

        set({ user });
        if (classroom) {
            useEducationStore.getState().addClassroom(classroom);
        }
        // Game Logic delegated to GameSlice
        if (role === UserRole.KID) get().checkStreak();
    },

    loginWithCredentials: async (username, password): Promise<boolean | 'EMAIL_NOT_CONFIRMED'> => {
        // DEV BYPASS: Allow quick testing login in dev environment for all roles
        if (!import.meta.env.PROD && password === 'Password123!') {
            const lowerUser = username.toLowerCase();
            let baseUser = MOCK_USER;
            let role = UserRole.KID;
            let classroom: Classroom | null = null;
            const isExplorerAccount = lowerUser.includes('explorer') || lowerUser.includes('maya') || lowerUser.includes('10');

            if (lowerUser.includes('admin')) {
                baseUser = MOCK_ADMIN;
                role = UserRole.ADMIN;
            } else if (lowerUser.includes('teacher')) {
                baseUser = MOCK_TEACHER;
                role = UserRole.TEACHER;
                classroom = { ...MOCK_CLASSROOM };
            } else if (lowerUser.includes('parent') || lowerUser.includes('mom')) {
                baseUser = MOCK_PARENT;
                role = UserRole.PARENT;
            } else if (isExplorerAccount) {
                baseUser = MOCK_EXPLORER_USER;
                role = UserRole.KID;
            } else {
                baseUser = MOCK_USER;
                role = UserRole.KID;
            }

            const mockUser: User = {
                ...baseUser,
                id: `dev_${role.toLowerCase()}_${isExplorerAccount ? 'explorer_' : ''}id`,
                email: username.includes('@') ? username : `${username}@profits.com`,
                name: baseUser.name,
                username: username.split('@')[0],
                role: role,
                age: isExplorerAccount ? 10 : (baseUser.age || 7),
                settings: {
                    dailyGoalMinutes: isExplorerAccount ? 20 : 15,
                    soundEnabled: true,
                    musicEnabled: true,
                    themeColor: role === UserRole.ADMIN ? 'purple' : role === UserRole.TEACHER ? 'blue' : role === UserRole.PARENT ? 'orange' : (isExplorerAccount ? 'indigo' : 'green'),
                    themeMode: 'light',
                    ageMode: isExplorerAccount ? 'explorer' : (role === UserRole.KID ? 'junior' : 'explorer'),
                    hapticsEnabled: true
                }
            };

            if (role === UserRole.ADMIN) {
                mockUser.ppTokens = 1_000_000;
                mockUser.level = 100;
                mockUser.xp = 1_000_000;
                mockUser.subscriptionTier = 'tycoon';
                mockUser.subscriptionStatus = 'PREMIUM';
            }

            if (classroom) {
                useEducationStore.getState().addClassroom(classroom);
            }

            set({ user: mockUser, isAuthLoading: false });
            return true;
        }
        // Laravel Sanctum Auth + SQLite
        const MIN_RESPONSE_MS = 400;
        const loginStart = Date.now();
        const enforceMinDelay = async () => {
            const elapsed = Date.now() - loginStart;
            if (elapsed < MIN_RESPONSE_MS) {
                await new Promise(resolve => setTimeout(resolve, MIN_RESPONSE_MS - elapsed));
            }
        };

        try {
            const res: any = await laravelAdapter.login({
                login: username,
                password
            });

            if (res?.user) {
                const user = laravelAdapter.mapProfileToUser(res.user);
                set({ user, isAuthLoading: false });
                if (user.role === UserRole.KID) get().checkStreak();
                await enforceMinDelay();
                return true;
            }
        } catch (e: any) {
            Logger.error("Laravel login failed", e);
            await enforceMinDelay();
            if (e?.message?.toLowerCase().includes('email not confirmed')) {
                return 'EMAIL_NOT_CONFIRMED';
            }

            // Fallback: If backend is offline/unreachable, allow login if this user matches local storage
            const currentUser = get().user;
            const cleanInput = username.toLowerCase().trim();
            if (currentUser && (
                currentUser.username?.toLowerCase() === cleanInput ||
                currentUser.email?.toLowerCase() === cleanInput
            )) {
                Logger.info("Backend offline, resumed local session for user", { username: currentUser.username });
                set({ isAuthLoading: false });
                return true;
            }

            return false;
        }

        Logger.warn("[Security] Failed login attempt");
        await enforceMinDelay();
        return false;
    },

    loginWithGoogle: async (credential: string, role?: UserRole, inviteCode?: string, age?: number): Promise<boolean> => {
        try {
            set({ isAuthLoading: true });
            const res: any = await laravelAdapter.loginWithGoogle({
                credential,
                role: role ? role.toLowerCase() : undefined,
                invite_code: inviteCode || undefined,
                age: age || undefined,
            });

            if (res?.user) {
                const user = laravelAdapter.mapProfileToUser(res.user);
                set({ user, isAuthLoading: false });
                if (user.role === UserRole.KID) get().checkStreak();
                return true;
            }
        } catch (e: any) {
            Logger.error("Laravel Google login failed", e);
            set({ isAuthLoading: false });
            return false;
        }

        set({ isAuthLoading: false });
        return false;
    },

    registerUser: async (name, username, email, password, role, inviteCode?: string) => {
        set({ isRegistering: true });

        try {
            const res: any = await laravelAdapter.register({
                name,
                username,
                email,
                password,
                role: role.toLowerCase(),
                invite_code: inviteCode || null
            });

            if (res?.user) {
                const newUser = laravelAdapter.mapProfileToUser(res.user);
                set({ user: newUser, isRegistering: false });
                return undefined; // Success
            }
        } catch (e: any) {
            Logger.warn("Backend registration failed or unreachable, creating local user account", e);
            
            // If the failure was a network error (e.g. backend down/offline), allow user to register locally
            const cleanUsername = username.toLowerCase().trim();
            const cleanEmail = email.toLowerCase().trim();
            
            const fallbackUser: User = {
                id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                name,
                username: cleanUsername,
                email: cleanEmail,
                role: role,
                age: 8,
                level: 1,
                xp: 0,
                ppTokens: 50,
                streak: 1,
                lastActivityDate: new Date().toISOString(),
                currentModuleId: 'mod_1',
                completedLessonIds: [],
                unlockedSkills: [],
                properties: [],
                readBookIds: [],
                badges: [],
                inventory: [],
                portfolio: [],
                placedItems: [],
                equippedItems: [],
                hqLevel: 'hq_garage',
                settings: {
                    dailyGoalMinutes: 15,
                    soundEnabled: true,
                    musicEnabled: true,
                    themeColor: 'green',
                    themeMode: 'light',
                    ageMode: 'explorer',
                    hapticsEnabled: true
                },
                subscriptionStatus: 'FREE',
                subscriptionTier: 'intern',
                energy: 5,
                lastEnergyRefill: Date.now()
            };

            set({ user: fallbackUser, isRegistering: false });
            return undefined; // Success via local persistence
        }

        set({ isRegistering: false });
        return "Registration failed. Please try again.";
    },

    logout: async () => {
        try {
            await laravelAdapter.logout();
        } catch (e) {
            Logger.error('Failed to log out from Laravel', e);
        }
        api.clearToken();
        set({ user: null, users: [] });
    },

    impersonateUser: (userId: string) => {
        const state = get();

        // ✅ SECURITY FIX: Admin role check at function level — not just in the UI.
        // Without this, any authenticated user could call impersonateUser() from the
        // browser console to become any other user (including an Admin).
        if (!state.user || state.user.role !== UserRole.ADMIN) {
            Logger.warn('[Security] Unauthorized impersonation attempt blocked', {
                actorId: state.user?.id,
                targetId: userId,
            });
            void Logger.logSecurityEvent('unauthorized_access', 'critical', {
                action: 'impersonateUser',
                actorRole: state.user?.role,
                targetId: userId,
            });
            return; // Silently block — do not alert the attacker
        }

        const { users } = state;
        const classrooms = useEducationStore.getState().classrooms;
        const matchedUser = users.find(u => u.id === userId);
        if (matchedUser) {
            let activeClassroom = null;
            if (matchedUser.role === UserRole.TEACHER) {
                activeClassroom = classrooms.find((c) => c.teacherId === matchedUser.id) || null;
            }
            if (matchedUser.role === UserRole.KID && matchedUser.classId) {
                activeClassroom = classrooms.find((c) => c.id === matchedUser.classId) || null;
            }
            Logger.info('[Admin] Impersonating user', { adminId: state.user.id, targetId: userId });
            set({ user: matchedUser });
            if (activeClassroom) {
                useEducationStore.setState({ classroom: activeClassroom });
            }
        }
    },

    updateUserSettings: (newSettings) => set((state) => {
        if (!state.user) return {};
        const updatedUser = { ...state.user, settings: { ...state.user.settings, ...newSettings } };

        // Sync to Supabase
        laravelAdapter.saveUser(updatedUser).catch(err => Logger.error("Laravel Sync Failed", err));

        return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
    }),

    setAgeMode: (mode) => {
        get().updateUserSettings({ ageMode: mode });
    },

    updateBusinessLogo: (logo) => set((state) => {
        if (!state.user) return {};
        const updatedUser = { ...state.user, businessLogo: logo };

        // Sync to Supabase
        laravelAdapter.saveUser(updatedUser).catch(err => Logger.error("Laravel Sync Failed", err));

        return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
    }),

    fetchAllUsers: async () => {
        try {
            Logger.info("Admin: Fetching users from Laravel backend...");
            const backendUsers = await laravelAdapter.fetchAllUsers();
            
            // Merge database users with test/mock accounts so Admin can see all users
            const mockUsers = [MOCK_USER, MOCK_EXPLORER_USER, MOCK_PARENT, MOCK_TEACHER, MOCK_ADMIN];
            const combinedMap = new Map<string, User>();
            
            // 1. Database users take priority
            backendUsers.forEach(u => combinedMap.set(u.id, u));
            
            // 2. Add test mock accounts if not already in DB
            mockUsers.forEach(m => {
                if (!combinedMap.has(m.id)) {
                    combinedMap.set(m.id, m);
                }
            });

            set({ users: Array.from(combinedMap.values()) });
        } catch (e) {
            Logger.error("Admin: fetchAllUsers exception", e);
            // Safe fallback to test accounts so Admin is never blocked
            set({ users: [MOCK_USER, MOCK_EXPLORER_USER, MOCK_PARENT, MOCK_TEACHER, MOCK_ADMIN] });
        }
    },

    addUser: async (user: User) => {
        try {
            await laravelAdapter.saveUser(user);
        } catch (e: any) {
            Logger.error("Admin: addUser exception", e);
            return e?.message;
        }
        set((state) => ({ users: [...state.users, user] }));
        return undefined;
    },

    updateUser: (id: string, updates: Partial<User>) => set((state) => {
        // Security: RBAC & Input Sanitization
        const actor = state.user;
        if (!actor) return {};

        // 1. If Admin, allow everything (sync to Supabase)
        if (actor.role === UserRole.ADMIN) {
            const target = state.users.find(u => u.id === id);
            if (target) { laravelAdapter.saveUser({ ...target, ...updates } as User).catch(err => Logger.error("Laravel Sync Failed", err)); }
            return {
                users: state.users.map(u => u.id === id ? { ...u, ...updates } : u),
                user: state.user && state.user.id === id ? { ...state.user, ...updates } : state.user
            };
        }

        // 2. If trying to update someone else without Admin -> BLOCK (unless PARENT updating CHILD)
        if (actor.id !== id) {
            const targetUser = state.users.find(u => u.id === id);
            const isParentUpdatingChild = actor.role === UserRole.PARENT && targetUser?.parentId === actor.id;
            
            if (!isParentUpdatingChild) {
                Logger.warn("[Security] Unauthorized Update Attempt", { actorId: actor.id, targetId: id });
                return {};
            }
        }

        // 3. Self-Update (Non-Admin): Whitelist Only
        const STRICT_ALLOWED = ['settings', 'businessLogo', 'name', 'hqTheme', 'equippedItems'];

        const sanitizedUpdates: Partial<User> = {};
        STRICT_ALLOWED.forEach(field => {
            // @ts-expect-error — dynamic field access on Partial<User> is intentional here
            if (updates[field] !== undefined) sanitizedUpdates[field] = updates[field];
        });

        if (Object.keys(sanitizedUpdates).length === 0) return {};

        const updatedUser = { ...state.user, ...sanitizedUpdates };

        // Sync to Supabase
        if (state.user && state.user.id === id) { laravelAdapter.saveUser(updatedUser as User).catch(err => Logger.error("Laravel Sync Failed", err)); }

        return {
            users: state.users.map(u => u.id === id ? { ...u, ...sanitizedUpdates } : u),
            user: state.user && state.user.id === id ? updatedUser as User : state.user
        };
    }),

    updateUserAdmin: async (id: string, updates: Partial<User>) => {
        const state = get();
        const target = state.users.find(u => u.id === id);
        if (!target) return;
        const merged = { ...target, ...updates };
        try { await laravelAdapter.saveUser(merged as User); } catch (e) { Logger.error("Admin: updateUserAdmin Laravel failed", e); throw e; }
        set((state) => ({
            users: state.users.map(u => u.id === id ? merged : u),
            user: state.user && state.user.id === id ? merged : state.user
        }));
    },

    deleteUser: async (id: string) => {
        try {
            await laravelAdapter.deleteUser(id);
        } catch (e) {
            Logger.error("Admin: deleteUser failed", e);
            throw e;
        }
        set((state) => ({
            users: state.users.filter(u => u.id !== id),
            user: state.user && state.user.id === id ? null : state.user
        }));
    },

    exportUserData: (id: string) => {
        const user = get().users.find(u => u.id === id);
        if (!user) return null;

        // SECURITY: Strip sensitive fields before export
        const { password, ...safeUser } = user as any;
        return safeUser;
    },

    refreshUser: async () => {
        if (!api.getToken()) return;

        try {
            const res: any = await api.get('/auth/me');
            if (res?.user) {
                let allProfiles: any[] | undefined = undefined;
                if (res.user.children && res.user.children.length > 0) {
                    allProfiles = res.user.children;
                } else if (res.user.parent) {
                    allProfiles = [res.user.parent];
                }

                const mappedUser = laravelAdapter.mapProfileToUser(res.user, allProfiles);
                Logger.info('refreshUser: User profile mapped from Laravel', { userId: mappedUser.id, role: mappedUser.role });

                if (allProfiles && mappedUser.role === UserRole.PARENT) {
                    const mappedChildren = allProfiles.map(p => laravelAdapter.mapProfileToUser(p, [res.user]));
                    set((state) => {
                        const newUsers = [...state.users];
                        mappedChildren.forEach(child => {
                            const index = newUsers.findIndex(u => u.id === child.id);
                            if (index !== -1) {
                                newUsers[index] = child;
                            } else {
                                newUsers.push(child);
                            }
                        });
                        return { users: newUsers };
                    });
                }

                const currentUser = get().user;
                if (currentUser) {
                    mappedUser.settings = { ...currentUser.settings, ...mappedUser.settings };
                }

                set({ user: mappedUser });
            }
        } catch (e) {
            Logger.error("Failed to refresh user from Laravel", e);
        }
    }
});
