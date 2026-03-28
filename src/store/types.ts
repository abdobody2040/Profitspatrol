import {
    User, UserRole, BusinessSimulation, LemonadeState, Classroom, StudentGroup, Rubric, Assignment, Submission, Book, CMSContent,
    ShopItem, LeaderboardEntry, UserSettings, BusinessLogo, SubscriptionTier, UniversalLessonUnit, HQLevel, PortfolioItem, Skill, Bounty, Video, LiveSession, NewsEvent, SideHustle, TurnaroundScenario, Property, FurnitureItem, PlacedItem,
    DailyMissionsState, DailyMission
} from '../types';
import { DailyMissionsSlice } from './slices/dailyMissionSlice';
import { WeeklyChallengeSlice } from './slices/weeklyChallengeSlice';
import { SeasonalEventSlice } from './slices/seasonalEventSlice';
import { FranchiseSlice } from './slices/franchiseSlice';
import { TournamentSlice } from './slices/tournamentSlice';
import { AdminConfigSlice } from './slices/adminConfigSlice';
import { UiSlice } from './slices/uiSlice';
import { UserSlice } from './slices/userSlice';
import { GameSlice } from './slices/gameSlice';
import { LibrarySlice } from './slices/librarySlice';
import { SessionSlice } from './slices/sessionSlice';
import { ScenarioSlice } from './slices/scenarioSlice';
import { CorporationSlice } from './slices/corporationSlice';

export interface AppState extends UserSlice, GameSlice, UiSlice, LibrarySlice, SessionSlice, ScenarioSlice, DailyMissionsSlice, WeeklyChallengeSlice, SeasonalEventSlice, FranchiseSlice, TournamentSlice, CorporationSlice, AdminConfigSlice {
    user: User | null;
    showLevelUpModal: boolean;
    showGraduationModal?: boolean;
    levelUpData: { level: number, xp: number } | null;

    // New State for Admin
    adminViewingClassroomId: string | null;
    showCertificateId: string | null; // For Module Recap Modal

    // Actions
    login: (role: UserRole) => void;
    loginWithCredentials: (username: string, password: string) => Promise<boolean>;
    impersonateUser: (userId: string) => void;
    registerUser: (name: string, username: string, email: string, password: string, role: UserRole, inviteCode?: string) => Promise<string | undefined>;
    logout: () => void;
    setUser: (user: User | null) => void;
    refreshUser: () => Promise<void>;
    setShowCertificateId: (id: string | null) => void;
    checkStreak: () => void;
    readBook: (bookId: string) => void;
    buyItem: (item: ShopItem) => void;
    toggleEquipItem: (itemId: string) => void;
    closeLevelUpModal: () => void;
    closeGraduationModal: () => void;

    // SaaS / Admin Actions
    updateUserSettings: (settings: Partial<UserSettings>) => void;
    updateBusinessLogo: (logo: BusinessLogo) => void;
    completeGame: (score: number, xpReward: number) => void;
    upgradeHQ: (hqId: string) => void;
    unlockSkill: (skillId: string) => void;
    hireManager: (businessId: string) => void;
    collectIdleIncome: (businessId: string) => number;
    collectAllIdleIncome: () => void;
    getSkillModifiers: () => { xpMultiplier: number, costMultiplier: number, priceMultiplier: number };
    upgradeSubscription: (tier: SubscriptionTier) => void;
    hasUnlimitedEnergy: () => boolean;
    hasAiAccess: () => boolean;
    consumeEnergy: () => boolean;
    completeDebate: (score: number) => void;

    // HQ Builder
    buyFurniture: (item: FurnitureItem) => void;
    placeFurniture: (item: FurnitureItem, x: number, y: number, roomType?: string) => void;
    moveFurniture: (id: string, x: number, y: number) => void;
    rotateFurniture: (id: string) => void;
    sellFurniture: (instanceId: string, cost: number) => void;
    removeFurnitureFromRoom: (instanceId: string) => void;
    moveFurnitureToRoom: (instanceId: string, newRoomType: string) => void;


    addGame: (game: BusinessSimulation) => void;
    updateGame: (id: string, updates: Partial<BusinessSimulation>) => void;
    deleteGame: (id: string) => void;
    syncGames: () => void;

    // Library CRUD
    addBook: (book: Book) => void;
    updateBook: (id: string, updates: Partial<Book>) => void;
    removeBook: (id: string) => void;
    resetLibrary: () => void;
    syncLibrary: () => void;
    toggleAdminMode: () => void;

    // Book Tasks
    completeBookTask: (taskId: string, bookId: string, data?: {
        score?: number;
        response?: string;
        checkpointProgress?: Record<string, boolean>;
    }) => void;
    getBookTaskProgress: (bookId: string) => {
        completed: number;
        total: number;
        percentage: number;
    };


    // User Actions
    fetchAllUsers: () => Promise<void>;
    addUser: (user: User) => Promise<string | undefined>;
    updateUser: (id: string, updates: Partial<User>) => void;
    updateUserAdmin: (id: string, updates: Partial<User>) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    exportUserData: (id: string) => object | null;


    updateCMSContent: (updates: Partial<CMSContent>) => void;

    // Session Actions
    addSession: (session: LiveSession) => void;
    updateSession: (id: string, updates: Partial<LiveSession>) => void;
    deleteSession: (id: string) => void;

    // Scenario Actions
    startScenario: (scenario: TurnaroundScenario) => void;
    updateScenarioState: (updates: Partial<TurnaroundScenario>) => void;
    endScenario: (success: boolean) => void;

    }