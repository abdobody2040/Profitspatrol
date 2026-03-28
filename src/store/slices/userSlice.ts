import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { User, UserRole, Classroom, UserSettings, SubscriptionTier, BusinessLogo } from '../../types';
import { useEducationStore } from '../educationStore';
import { MOCK_USER, MOCK_PARENT, MOCK_TEACHER, MOCK_ADMIN, MOCK_CLASSROOM } from '../../data/mocks';
import { MAX_LOCAL_USERS, HASH_MOCK_123 } from '../../data/constants';
import { getToday } from '../../utils/gameUtils';
import { Logger } from '../../services/logger';
import { supabaseAdapter } from '../../services/persistence/SupabaseAdapter';
import { isSupabaseConfigured, supabaseAdmin } from '../../lib/supabase';

const DEFAULT_SETTINGS: UserSettings = {
    dailyGoalMinutes: 15,
    soundEnabled: true,
    musicEnabled: true,
    themeColor: 'green',
    themeMode: 'light'
};

export interface UserSlice {
    user: User | null;
    users: User[];
    adminViewingClassroomId: string | null;

    // --- AUTHENTICATION ---
    login: (role: UserRole) => void;
    loginWithCredentials: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    registerUser: (name: string, username: string, email: string, password: string, role: UserRole, inviteCode?: string) => Promise<string | undefined>;
    impersonateUser: (userId: string) => void;

    // --- USER SETTINGS ---
    setUser: (user: User | null) => void;
    updateUserSettings: (settings: Partial<UserSettings>) => void;
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
            user.bizCoins = 1_000_000_000;
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

    loginWithCredentials: async (username, password) => {
        // SECURITY: Require Supabase Auth - no local fallback
        if (!isSupabaseConfigured()) {
            Logger.error("Supabase not configured");
            return false;
        }

        // ✅ SECURITY FIX: Enforce a minimum response time to neutralise username-enumeration
        // timing attacks. Without this, a non-existent username returns in ~10ms (fast DB miss)
        // while a wrong password returns in ~300ms (Supabase bcrypt verify). This difference
        // allows an attacker to enumerate registered usernames by measuring response time.
        const MIN_RESPONSE_MS = 400;
        const loginStart = Date.now();
        const enforceMinDelay = async () => {
            const elapsed = Date.now() - loginStart;
            if (elapsed < MIN_RESPONSE_MS) {
                await new Promise(resolve => setTimeout(resolve, MIN_RESPONSE_MS - elapsed));
            }
        };

        try {
            // Determine if username is email or username
            const isEmail = username.includes('@');
            
            if (isEmail) {
                // Direct email login
                const { data, error } = await supabaseAdapter.client!.auth.signInWithPassword({
                    email: username,
                    password: password // Plain password for Supabase
                });

                if (error) {
                    Logger.error("Supabase login failed", error);
                    await enforceMinDelay();
                    return false;
                }

                if (data.user) {
                    // Fetch profile from database
                    const { data: profile } = await supabaseAdapter.client!
                        .from('profiles')
                        .select('*, subscription_tier, subscription_status, billing_cycle, invite_code')
                        .eq('id', data.user.id)
                        .single();

                    if (profile) {
                        let allProfiles: any[] | undefined = undefined;

                        if (profile.role?.toUpperCase() === 'KID' && profile.parent_id) {
                            // KID: must wait for parent_id to be known — unavoidable sequential step
                            const { data: parentProfile } = await supabaseAdapter.client!
                                .from('profiles')
                                .select('*, subscription_tier, subscription_status, billing_cycle, invite_code')
                                .eq('id', profile.parent_id)
                                .single();
                            if (parentProfile) allProfiles = [parentProfile];

                        } else if (profile.role?.toUpperCase() === 'PARENT' || profile.role?.toUpperCase() === 'ADMIN') {
                            // ✅ N+1 FIX: Fire children + (if teacher) classroom requests in parallel
                            const [{ data: childProfiles }] = await Promise.all([
                                supabaseAdapter.client!
                                    .from('profiles')
                                    .select('*, subscription_tier, subscription_status, billing_cycle, invite_code')
                                    .eq('parent_id', profile.id),
                            ]);
                            if (childProfiles && childProfiles.length > 0) allProfiles = childProfiles;
                        }

                        const user = supabaseAdapter.mapProfileToUser(profile, allProfiles);
                        
                        // Add or update children in the store's users list so the dashboard can find them
                        if (allProfiles && profile.role?.toUpperCase() === 'PARENT') {
                            const mappedChildren = allProfiles.map(p => supabaseAdapter.mapProfileToUser(p, [profile]));
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
                        
                        let activeClassroom = null;
                        if (user.role === UserRole.TEACHER) {
                            Logger.info("Fetching classroom for teacher: " + user.id);
                            const { data: cls, error: clsError } = await supabaseAdapter.client!
                                .from('classrooms')
                                .select('*')
                                .eq('teacher_id', user.id);
                                
                            if (clsError) {
                                Logger.error("Error fetching classroom during login", clsError);
                            } else if (cls && cls.length > 0) {
                                Logger.info("Classroom successfully fetched", { classId: cls[0].id });
                                activeClassroom = supabaseAdapter.mapRowToClassroom(cls[0]);
                            } else {
                                Logger.warn("Teacher logged in but has no classroom linked in DB!");
                            }
                        }

                        set({ user });
                        if (activeClassroom) {
                            useEducationStore.getState().addClassroom(activeClassroom);
                        }
                        if (user.role === UserRole.KID) get().checkStreak();
                        await enforceMinDelay();
                        return true;
                    }
                }
            } else {
                // Username login - look up email first
                const { data: profile } = await supabaseAdapter.client!
                    .from('profiles')
                    .select('email')
                    .eq('username', username)
                    .single();

                if (profile?.email) {
                    // Recursively call with email (min delay enforced at the top level too)
                    return get().loginWithCredentials(profile.email, password);
                } else {
                    Logger.warn("Username not found");
                    await enforceMinDelay(); // ✅ Prevents username enumeration timing attack
                    return false;
                }
            }
        } catch (e) {
            Logger.error("Login exception", e);
        }

        Logger.warn("[Security] Failed login attempt");
        await enforceMinDelay();
        return false;
    },

    registerUser: async (name, username, email, password, role, inviteCode?: string) => {
        // SECURITY: Require Supabase for all registrations
        if (!isSupabaseConfigured()) {
            return "Database not configured. Please contact support.";
        }

        try {
            // Check for existing username/email in database first
            const { data: existingByUsername } = await supabaseAdapter.client!
                .from('profiles')
                .select('id')
                .eq('username', username)
                .single();

            if (existingByUsername) {
                return "Username already taken. Please choose another.";
            }

            const { data: existingByEmail } = await supabaseAdapter.client!
                .from('profiles')
                .select('id')
                .eq('email', email)
                .single();

            if (existingByEmail) {
                return "Email already registered. Please use a different email.";
            }

            // Create Supabase Auth user
            const { data, error } = await supabaseAdapter.client!.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username,
                        full_name: name,
                        role,
                        invite_code: inviteCode || null
                    }
                }
            });

            if (error) {
                Logger.error("Supabase Auth Failed", error);
                return error.message;
            }

            if (data.user) {
                const newUserId = data.user.id;
                Logger.info("Supabase User Created", { id: newUserId });

                // Create full user profile
                const newUser: User = {
                    id: newUserId,
                    name,
                    username,
                    email,
                    role,
                    xp: 0,
                    level: 1,
                    streak: 1,
                    lastActivityDate: getToday(),
                    bizCoins: 100,
                    currentModuleId: 'mod_1',
                    completedLessonIds: [],
                    readBookIds: [],
                    badges: ['Newbie'],
                    inventory: [],
                    settings: DEFAULT_SETTINGS,
                    hqLevel: 'hq_garage',
                    unlockedSkills: [],
                    portfolio: [],
                    equippedItems: [],
                    placedItems: [],
                    subscriptionStatus: 'FREE',
                    subscriptionTier: 'intern',
                    energy: 5,
                    lastEnergyRefill: Date.now(),
                    properties: []
                };

                // Add role-specific data
                if (role === UserRole.KID) {
                    newUser.businessLogo = {
                        companyName: `${name}'s Biz`,
                        backgroundColor: '#3B82F6',
                        icon: 'rocket',
                        iconColor: '#FFFFFF',
                        shape: 'circle'
                    };
                }

                let newClassroom: Classroom | null = null;
                if (role === UserRole.TEACHER) {
                    newClassroom = {
                        id: self.crypto.randomUUID(),
                        name: `${name}'s Class`,
                        // ✅ SECURITY FIX (HIGH-02): Use crypto.getRandomValues() instead of Math.random().
                        // Math.random() is not cryptographically secure and its output can be predicted.
                        // Unambiguous charset removes 0/O and 1/I/L to prevent classroom code misreads.
                        code: (() => {
                            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
                            const arr = new Uint8Array(6);
                            self.crypto.getRandomValues(arr);
                            return Array.from(arr).map(b => chars[b % chars.length]).join('');
                        })(),
                        teacherId: newUser.id,
                        studentIds: [],
                        lockedModules: []
                    };
                }

                // Save to Supabase
                // Note: If email confirmation is enabled, this might fail with RLS error (no session).
                // In that case, we rely on the DB Trigger 'on_auth_user_created' to create the profile.
                try {
                    await supabaseAdapter.saveUser(newUser);
                    if (newClassroom) {
                        await supabaseAdapter.saveClassroom(newClassroom);
                    }
                } catch (saveError: any) {
                    // Ignore RLS policy violation and database errors as Trigger handles profile creation
                    const errorCode = String(saveError?.code || '');
                    const errorMessage = String(saveError?.message || '').toLowerCase();
                    
                    // Check for various error patterns that indicate RLS/permission issues
                    const isRLSError = errorCode === '42501' || 
                                      errorCode === 'PGRST301' ||
                                      errorMessage.includes('row-level security') || 
                                      errorMessage.includes('policy') ||
                                      errorMessage.includes('permission') ||
                                      errorMessage.includes('new row violates') ||
                                      errorMessage.includes('not authorized');
                    
                    if (isRLSError) {
                        Logger.warn("Profile save via client failed (expected). Relying on Trigger to create profile.", { errorCode, errorMessage });
                        // Continue - the trigger will create the profile
                    } else {
                        // Only throw if it's a real error, not RLS
                        Logger.error("Unexpected error saving user profile", saveError);
                        throw saveError;
                    }
                }

                set({ user: newUser });
                if (newClassroom) {
                    useEducationStore.getState().addClassroom(newClassroom);
                }
                return undefined; // Success
            }
        } catch (e: unknown) {
            Logger.error("Registration Exception", e);
            return "Registration failed. Please try again.";
        }

        return "Registration failed.";
    },

    logout: async () => {
        // ✅ SECURITY FIX: Invalidate the Supabase JWT server-side.
        // Previously, logout() only cleared local Zustand state — the Supabase auth
        // session (stored in localStorage) remained valid, allowing subsequent
        // requests to still be authenticated.
        if (isSupabaseConfigured()) {
            try {
                await supabaseAdapter.client!.auth.signOut();
            } catch (e) {
                Logger.error('Failed to sign out from Supabase', e);
            }
        }
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
        if (isSupabaseConfigured()) {
            supabaseAdapter.saveUser(updatedUser).catch(err => Logger.error("Supabase Sync Failed", err));
        }

        return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
    }),

    updateBusinessLogo: (logo) => set((state) => {
        if (!state.user) return {};
        const updatedUser = { ...state.user, businessLogo: logo };

        // Sync to Supabase
        if (isSupabaseConfigured()) {
            supabaseAdapter.saveUser(updatedUser).catch(err => Logger.error("Supabase Sync Failed", err));
        }

        return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
    }),

    fetchAllUsers: async () => {
        if (!isSupabaseConfigured()) return;
        try {
            Logger.info("Admin: Fetching all users from Supabase...");

            // Use service role client if available — it bypasses RLS so the admin
            // can read ALL profiles, not just their own.
            // Falls back to anon client (only sees rows permitted by RLS).
            const client = supabaseAdmin ?? supabaseAdapter.client!;

            const { data: profiles, error } = await client
                .from('profiles')
                .select('*, subscription_tier, subscription_status, billing_cycle, invite_code');

            if (error) {
                Logger.error("Admin: fetchAllUsers failed", error);
                return;
            }

            const users = (profiles || []).map((p: any) =>
                supabaseAdapter.mapProfileToUser(p, profiles || [])
            );
            Logger.info(`Admin: Loaded ${users.length} users from Supabase (${supabaseAdmin ? 'service role' : 'anon key'})`);
            set({ users });
        } catch (e) {
            Logger.error("Admin: fetchAllUsers exception", e);
        }
    },

    addUser: async (user: User) => {
        // For admin-created users: insert profile row directly.
        // The user won't have an auth account until they sign up/reset password.
        if (isSupabaseConfigured()) {
            try {
                // Try upsert the profile so it's visible in the admin console immediately.
                const profile = {
                    id: user.id,
                    username: user.username || user.name,
                    role: user.role,
                    email: user.email || null,
                    xp: user.xp || 0,
                    level: user.level || 1,
                    biz_coins: user.bizCoins || 0,
                    inventory: user.inventory || [],
                    badges: user.badges || [],
                    settings: user.settings || {},
                    hq_level: user.hqLevel || 'hq_garage',
                    portfolio: user.portfolio || [],
                    placed_items: user.placedItems || [],
                    properties: user.properties || [],
                    subscription_tier: user.subscriptionTier || 'intern',
                    subscription_status: user.subscriptionStatus || 'FREE',
                    last_activity_date: user.lastActivityDate
                };
                const { error } = await supabaseAdapter.client!.from('profiles').upsert(profile);
                if (error) {
                    Logger.error("Admin: addUser to Supabase failed", error);
                    return error.message;
                }
            } catch (e: any) {
                Logger.error("Admin: addUser exception", e);
                return e.message;
            }
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
            if (target && isSupabaseConfigured()) {
                supabaseAdapter.saveUser({ ...target, ...updates } as User).catch(err => Logger.error("Supabase Sync Failed", err));
            }
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
            // @ts-ignore
            if (updates[field] !== undefined) sanitizedUpdates[field] = updates[field];
        });

        if (Object.keys(sanitizedUpdates).length === 0) return {};

        const updatedUser = { ...state.user, ...sanitizedUpdates };

        // Sync to Supabase
        if (isSupabaseConfigured() && state.user && state.user.id === id) {
            supabaseAdapter.saveUser(updatedUser as User).catch(err => Logger.error("Supabase Sync Failed", err));
        }

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
        if (isSupabaseConfigured()) {
            try {
                await supabaseAdapter.saveUser(merged as User);
            } catch (e) {
                Logger.error("Admin: updateUserAdmin Supabase failed", e);
                throw e;
            }
        }
        set((state) => ({
            users: state.users.map(u => u.id === id ? merged : u),
            user: state.user && state.user.id === id ? merged : state.user
        }));
    },

    deleteUser: async (id: string) => {
        if (isSupabaseConfigured()) {
            try {
                await supabaseAdapter.deleteUser(id);
            } catch (e) {
                Logger.error("Admin: deleteUser Supabase failed", e);
                throw e;
            }
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
        if (!isSupabaseConfigured()) return;
        
        try {
            const { data: { user } } = await supabaseAdapter.client!.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabaseAdapter.client!
                .from('profiles')
                .select('*, subscription_tier, subscription_status, billing_cycle, invite_code')
                .eq('id', user.id)
                .single();

            if (profile) {
                let allProfiles: any[] | undefined = undefined;
                if (profile.role?.toUpperCase() === 'KID' && profile.parent_id) {
                    const { data: parentProfile } = await supabaseAdapter.client!
                        .from('profiles')
                        .select('*, subscription_tier, subscription_status, billing_cycle, invite_code')
                        .eq('id', profile.parent_id)
                        .single();
                    if (parentProfile) {
                        allProfiles = [parentProfile];
                    }
                } else if (profile.role?.toUpperCase() === 'PARENT' || profile.role?.toUpperCase() === 'ADMIN') {
                     const { data: childProfiles } = await supabaseAdapter.client!
                        .from('profiles')
                        .select('*, subscription_tier, subscription_status, billing_cycle, invite_code')
                        .eq('parent_id', profile.id);
                    if (childProfiles && childProfiles.length > 0) {
                        allProfiles = childProfiles;
                    }
                }

                const mappedUser = supabaseAdapter.mapProfileToUser(profile, allProfiles);
                // ✅ SECURITY FIX: Logger.info only — never log user objects with PII
                Logger.info('refreshUser: User profile mapped successfully', { userId: mappedUser.id, role: mappedUser.role });
                
                // Add or update children in the store's users list so the dashboard can find them
                if (allProfiles && profile.role?.toUpperCase() === 'PARENT') {
                    const mappedChildren = allProfiles.map(p => supabaseAdapter.mapProfileToUser(p, [profile]));
                    Logger.info('refreshUser: Children mapped for parent', { count: mappedChildren.length });
                    set((state) => {
                        const newUsers = [...state.users];
                        mappedChildren.forEach(child => {
                            const index = newUsers.findIndex(u => u.id === child.id);
                            if (index !== -1) {
                                newUsers[index] = child; // Update existing
                            } else {
                                newUsers.push(child); // Add new
                            }
                        });
                        // ✅ Users array updated
                        return { users: newUsers };
                    });
                }
                
                // Keep existing local settings if not in profile (optional, but good for UX)
                const currentUser = get().user;
                if (currentUser) {
                    mappedUser.settings = { ...currentUser.settings, ...mappedUser.settings };
                }

                // Check for linked classroom
                let activeClassroom = null;
                if (mappedUser.role === UserRole.TEACHER) {
                    Logger.info("refreshUser: Fetching classroom for teacher -> " + mappedUser.id);
                    // Avoid .single() to prevent PGRST116
                    const { data: cls, error: clsError } = await supabaseAdapter.client!
                        .from('classrooms')
                        .select('*')
                        .eq('teacher_id', mappedUser.id);
                        
                    if (clsError) {
                        Logger.error("refreshUser: Error fetching classroom", clsError);
                    } else if (cls && cls.length > 0) {
                        Logger.info("refreshUser: Classroom successfully fetched", { classId: cls[0].id });
                        activeClassroom = supabaseAdapter.mapRowToClassroom(cls[0]);
                    } else {
                        Logger.warn("refreshUser: Teacher has no classroom linked in DB!");
                    }
                }

                set({ user: mappedUser });
                if (activeClassroom) {
                    useEducationStore.getState().addClassroom(activeClassroom);
                }
            }
        } catch (e) {
            Logger.error("Failed to refresh user", e);
        }
    }
});
