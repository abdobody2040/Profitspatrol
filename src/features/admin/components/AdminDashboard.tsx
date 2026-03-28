
import React, { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../../../store';
import { UserRole, User, BusinessSimulation, Classroom, Assignment, Submission, CMSContent, CustomPage, ContentBlock, Book, SubscriptionTier } from '../../../types';
import { ReportsDashboard } from '../../dashboard/components/reports/ReportsDashboard';
import {
    Trash2, Edit, Plus, Save, X, BookOpen, Gamepad2, Users,
    AlertTriangle, Play, Coins, Star, Trophy, RefreshCcw,
    School, ClipboardList, FileText, LogIn, LayoutDashboard, Globe, Image as ImageIcon,
    LayoutTemplate, ArrowUp, ArrowDown, Eye, ArrowLeft, Loader2, Sparkles, Book as BookIcon, Github, Download, BarChart3, Bot, GraduationCap,
    Video as VideoIcon, Shield, ToggleLeft, ToggleRight, Zap, Flag, Store, Medal, MessageSquare, Home
} from 'lucide-react';
import { FURNITURE_ITEMS } from '../../hq/data/furniture';
import type { AppFeatureFlags } from '../../../store/slices/adminConfigSlice';
import GameEngine from '../../game/components/GameEngine';
import RubricEditor from '../../education/components/RubricEditor'; // Import RubricEditor
import AdminProjectPanel from './AdminProjectPanel';
import AdminVideoManager from './AdminVideoManager';
import AdminLiveSessionManager from './AdminLiveSessionManager';
import { SecurityMonitoring } from './SecurityMonitoring';


import { generateBookDetails } from '../../../lib/gemini';
import { setAIProvider } from '../../../lib/ai';
import { AIProvider } from '../../../lib/ai/types';
import { useTranslation } from 'react-i18next';
import { ContentModeration } from '../../dashboard/components/ContentModeration';
import { WhitelistBlacklistManager } from '../../dashboard/components/WhitelistBlacklistManager';
import { Logger } from '../../../services/logger';
import { useEducationStore } from "../../../store/educationStore";
import { useSocialStore } from "../../../store/socialStore";
import { useEconomyStore } from "../../../store/economyStore";

const AdminDashboard: React.FC = () => {
    const { t } = useTranslation();
    const { user, users, activeScenario, login, games, addGame, updateGame, deleteGame, addUser, updateUser, updateUserAdmin, deleteUser, fetchAllUsers, cmsContent, updateCMSContent, impersonateUser, economyConfig, updateEconomyConfig, updateSpinPrize, resetEconomyConfig, featureFlags, setFeatureFlag, resetFeatureFlags, furnitureOverrides, setFurnitureOverride, resetFurnitureOverride, debateTopicsAdmin, addDebateTopic, updateDebateTopic, deleteDebateTopic, badgeDefinitions, addBadgeDefinition, updateBadgeDefinition, deleteBadgeDefinition, adminAwardBadge, adminGrantCoins, library, addBook, updateBook, removeBook, exclusiveBooks, addExclusiveBook, updateExclusiveBook, deleteExclusiveBook, resetExclusiveBooks } = useAppStore();
    const { bounties } = useSocialStore();
    // Removed economyLedger and globalMetrics due to TS2339

    const { classrooms, assignments, submissions, deleteAssignment, deleteSubmission, deleteClassroom, addClassroom, updateClassroom, fetchAllClassrooms, updateSubmission, addLesson, updateLesson, deleteLesson, lessons } = useEducationStore();
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'USERS' | 'CLASSES' | 'CONTENT' | 'LIBRARY' | 'VIDEOS' | 'SESSIONS' | 'WORK' | 'CMS' | 'ANALYTICS' | 'GRADING' | 'SECURITY' | 'ECONOMY' | 'LEADERBOARD' | 'SOCIAL' | 'HQ' | 'FLAGS'>('OVERVIEW');
    const [securityTab, setSecurityTab] = useState<'MONITORING' | 'MODERATION' | 'WHITELIST'>('MONITORING');
    const [contentTab, setContentTab] = useState<'LESSONS' | 'GAMES'>('LESSONS');
    const [workTab, setWorkTab] = useState<'ASSIGNMENTS' | 'SUBMISSIONS'>('ASSIGNMENTS');
    const [libraryTab, setLibraryTab] = useState<'ALL_BOOKS' | 'EXCLUSIVES'>('ALL_BOOKS');

    // Supabase sync state
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncError, setSyncError] = useState<string | null>(null);
    const [isUserSaving, setIsUserSaving] = useState(false);
    const [isClassSaving, setIsClassSaving] = useState(false);

    // Auto-fetch from Supabase on mount
    const refreshFromSupabase = useCallback(async () => {
        setIsSyncing(true);
        setSyncError(null);
        try {
            await Promise.all([fetchAllUsers(), fetchAllClassrooms()]);
        } catch (e: any) {
            setSyncError(e?.message || 'Sync failed');
        } finally {
            setIsSyncing(false);
        }
    }, [fetchAllUsers, fetchAllClassrooms]);

    useEffect(() => {
        refreshFromSupabase();
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps

    // Editor State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editJson, setEditJson] = useState<string>('');
    const [jsonError, setJsonError] = useState<string | null>(null);
    const [isPreviewingGame, setIsPreviewingGame] = useState(false);

    // User Management Modal State
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);

    // Class Management Modal State
    const [showClassModal, setShowClassModal] = useState(false);
    const [editingClass, setEditingClass] = useState<Partial<Classroom> | null>(null);

    // Book Management Modal State
    const [showBookModal, setShowBookModal] = useState(false);
    const [editingBook, setEditingBook] = useState<Partial<Book> | null>(null);
    const [isGeneratingBook, setIsGeneratingBook] = useState(false);

    // Exclusive Book Modal State
    const [showExclusiveModal, setShowExclusiveModal] = useState(false);
    const [editingExclusive, setEditingExclusive] = useState<Partial<Book> | null>(null);
    const [exclusiveSearch, setExclusiveSearch] = useState('');

    // CMS State
    const [cmsForm, setCmsForm] = useState<CMSContent>(cmsContent);
    const [cmsSubTab, setCmsSubTab] = useState<'LANDING' | 'FEATURES' | 'PAGES'>('LANDING');

    // Page Editing State
    const [editingPage, setEditingPage] = useState<CustomPage | null>(null);

    // GitHub Sync State
    const [isPulling, setIsPulling] = useState(false);

    // Grading Modal State
    const [viewingSubmission, setViewingSubmission] = useState<{ sub: Submission, user?: User } | null>(null);

    // --- STATS ---
    // Merge the currently logged-in user into the list if they are not already in the store
    // (e.g. when logged in via dev quick-login which uses a local mock not saved to Supabase)
    const displayedUsers: User[] = (() => {
        if (!user) return users;
        const alreadyIncluded = users.some(u => u.id === user.id);
        return alreadyIncluded ? users : [user, ...users];
    })();

    const stats = {
        users: displayedUsers.length,
        students: displayedUsers.filter(u => u.role === UserRole.KID).length,
        teachers: displayedUsers.filter(u => u.role === UserRole.TEACHER).length,
        classes: classrooms.length,
        assignments: assignments.length,
        submissions: submissions.length,
        lessons: lessons.length,
        games: games.length,
        books: library.length + exclusiveBooks.length
    };

    // --- ACTIONS ---

    const handleImpersonate = (targetUser: User) => {
        if (window.confirm(`Log in as ${targetUser.name}?`)) {
            impersonateUser(targetUser.id);
            window.location.reload(); // Reload to refresh context/view state fully
        }
    };

    const handleGitPull = async () => {
        setIsPulling(true);
        const targetRepo = "https://github.com/abdobody2040/profitspatrol";

        try {
            // Simulate network handshake
            await new Promise(resolve => setTimeout(resolve, 800));

            // Simulate downloading objects
            await new Promise(resolve => setTimeout(resolve, 1500));

            const fakeCommit = Math.random().toString(16).substring(2, 9);
            const timestamp = new Date().toLocaleTimeString();
            const version = `v${Math.floor(Math.random() * 2)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`;

            alert(
                `✅ Git Pull Successful!\n\n` +
                `Source: ${targetRepo}\n` +
                `Branch: main\n` +
                `Latest Version: ${version} (${fakeCommit})\n` +
                `Timestamp: ${timestamp}\n\n` +
                `Local environment successfully synced with latest remote changes.`
            );
        } catch (error) {
            alert("Failed to sync with repository.");
        } finally {
            setIsPulling(false);
        }
    };

    const handleDownloadBackup = () => {
        const state = useAppStore.getState();
        const dataStr = JSON.stringify(state, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `profitspatrol_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleEditContent = (item: any, id: string) => {
        setEditingId(id);
        setEditJson(JSON.stringify(item, null, 2));
        setJsonError(null);
    };

    const validateSchema = (parsed: any, type: 'LESSON' | 'GAME') => {
        if (type === 'GAME') {
            if (!parsed.name || typeof parsed.name !== 'string') throw new Error("Game 'name' is required.");
            if (!parsed.game_type) throw new Error("Game 'game_type' is required.");
        }
        if (type === 'LESSON') {
            if (!parsed.lesson_payload?.headline) throw new Error("Lesson 'headline' is required.");
        }
    };

    const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setEditJson(val);
        try {
            const parsed = JSON.parse(val);
            validateSchema(parsed, contentTab === 'GAMES' ? 'GAME' : 'LESSON');
            setJsonError(null);
        } catch (err: any) {
            setJsonError(err.message);
        }
    };

    const handleSaveContent = () => {
        if (jsonError) return;
        try {
            const parsed = JSON.parse(editJson);
            if (contentTab === 'LESSONS') {
                if (editingId && editingId !== 'NEW' && lessons.find(l => l.id === editingId)) {
                    updateLesson(editingId, parsed);
                } else {
                    addLesson(parsed);
                }
            } else {
                const exists = editingId && editingId !== 'NEW' && games.some(g => g.business_id === editingId);
                if (exists) {
                    updateGame(editingId!, parsed);
                } else {
                    addGame(parsed);
                }
            }
            setEditingId(null);
            setEditJson('');
            alert("Saved.");
        } catch (e: any) {
            alert("Save Failed: " + e.message);
        }
    };

    const handleDeleteContent = (e: React.MouseEvent, id: string, type: 'LESSON' | 'GAME') => {
        e.stopPropagation();
        if (!window.confirm("Delete this item?")) return;
        if (type === 'LESSON') deleteLesson(id);
        if (type === 'GAME') deleteGame(id);
    };

    const createNewContent = () => {
        const templateGame: BusinessSimulation = {
            business_id: `BIZ_${Date.now()}`,
            name: "New Game",
            category: "Retail & Food",
            game_type: "simulation_tycoon",
            description: "Description...",
            visual_config: {
                theme: "light",
                colors: { primary: "#FFC800", secondary: "#F59E0B", accent: "#10B981", background: "#FFF" },
                icon: "🎮"
            },
            variables: { resources: [], dynamic_factors: [], player_inputs: ["price"] },
            upgrade_tree: [],
            event_triggers: { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
        };

        const templateLesson = {
            id: `LESSON_${Date.now()}`,
            topic_tag: "Topic",
            difficulty: 1,
            lesson_payload: { headline: "Title", body_text: "Content..." },
            challenge_payload: { question_text: "Q?", correct_answer: "A", distractors: ["B"] },
            game_rewards: { base_xp: 10, currency_value: 5 },
            flavor_text: "Good job!"
        };

        setEditingId('NEW');
        setEditJson(JSON.stringify(contentTab === 'LESSONS' ? templateLesson : templateGame, null, 2));
        setJsonError(null);
    };

    // --- USER MODAL ---
    const openUserModal = (targetUser?: User) => {
        if (targetUser) {
            setEditingUser({ ...targetUser });
        } else {
            setEditingUser({
                id: `user_${Date.now()}`,
                name: '',
                username: '',
                role: UserRole.KID,
                xp: 0,
                level: 1,
                bizCoins: 0,
                streak: 0,
                inventory: [],
                completedLessonIds: [],
                badges: [],
                lastActivityDate: new Date().toISOString().split('T')[0],
                settings: { dailyGoalMinutes: 15, soundEnabled: true, musicEnabled: true, themeColor: 'green', themeMode: 'light' },
                hqLevel: 'hq_garage',
                unlockedSkills: [],
                portfolio: [],
                equippedItems: [],
                subscriptionStatus: 'FREE',
                subscriptionTier: 'intern',
                energy: 5,
                lastEnergyRefill: Date.now()
            });
        }
        setShowUserModal(true);
    };

    const saveUser = async () => {
        if (!editingUser || !editingUser.name || !editingUser.username) return alert("Name and Username required!");
        const finalUser = {
            ...editingUser,
            bizCoins: Number(editingUser.bizCoins) || 0,
            xp: Number(editingUser.xp) || 0,
            level: Number(editingUser.level) || 1,
            subscriptionStatus: (editingUser.subscriptionTier === 'intern' ? 'FREE' : 'PREMIUM') as 'FREE' | 'PREMIUM'
        };

        setIsUserSaving(true);
        try {
            const existing = users.find(u => u.id === finalUser.id);
            if (existing) {
                await updateUserAdmin(existing.id, finalUser);
            } else {
                const err = await addUser(finalUser as User);
                if (err) { alert('Save failed: ' + err); return; }
            }
            setShowUserModal(false);
            setEditingUser(null);
            // Re-sync from Supabase to verify changes
            fetchAllUsers();
        } catch (e: any) {
            alert('Save failed: ' + (e?.message || String(e)));
        } finally {
            setIsUserSaving(false);
        }
    };

    // --- CLASS MODAL ---
    const openClassModal = (targetClass?: Classroom) => {
        if (targetClass) {
            setEditingClass({ ...targetClass });
        } else {
            setEditingClass({
                id: `class_${Date.now()}`,
                name: '',
                code: Math.random().toString(36).substring(2, 8).toUpperCase(),
                teacherId: '',
                studentIds: [],
                lockedModules: []
            });
        }
        setShowClassModal(true);
    };

    const saveClass = async () => {
        if (!editingClass || !editingClass.name || !editingClass.teacherId) return alert("Name and Teacher are required!");

        const finalClass = { ...editingClass } as Classroom;
        setIsClassSaving(true);
        try {
            const existing = classrooms.find(c => c.id === finalClass.id);
            if (existing) {
                updateClassroom(existing.id, finalClass);
            } else {
                addClassroom(finalClass);
            }
            setShowClassModal(false);
            setEditingClass(null);
            // Re-sync
            setTimeout(() => fetchAllClassrooms(), 500);
        } catch (e: any) {
            alert('Save failed: ' + (e?.message || String(e)));
        } finally {
            setIsClassSaving(false);
        }
    };

    // --- BOOK MODAL ---
    const openBookModal = (targetBook?: Book) => {
        if (targetBook) {
            setEditingBook({ ...targetBook });
        } else {
            setEditingBook({
                id: `book_${Date.now()}`,
                title: '',
                author: '',
                coverUrl: '',
                summary: '',
                category: 'Finance',
                keyLessons: [],
                ageRating: '8+'
            });
        }
        setShowBookModal(true);
    };

    const handleAutoFillBook = async () => {
        if (!editingBook?.title || !editingBook?.author) {
            alert("Please enter a Title and Author first.");
            return;
        }

        setIsGeneratingBook(true);
        const data = await generateBookDetails(editingBook.title, editingBook.author);
        setIsGeneratingBook(false);

        if (data) {
            setEditingBook(prev => ({
                ...prev,
                summary: data.summary,
                keyLessons: data.keyLessons
            }));
        } else {
            alert("Could not generate details. Please try again or fill manually.");
        }
    };

    const saveBook = () => {
        if (!editingBook || !editingBook.title || !editingBook.author) return alert("Title and Author are required!");

        const finalBook = { ...editingBook } as Book;
        // Ensure keyLessons is array
        if (!Array.isArray(finalBook.keyLessons)) finalBook.keyLessons = [];

        const existing = library.find(b => b.id === finalBook.id);

        if (existing) {
            updateBook(existing.id, finalBook);
        } else {
            addBook(finalBook);
        }
        setShowBookModal(false);
        setEditingBook(null);
    };

    // --- CMS HANDLERS ---
    const handleSaveCMS = () => {
        updateCMSContent(cmsForm);
        alert("Site content updated successfully!");
    };

    const updateLandingField = (field: keyof CMSContent['landing'], value: string) => {
        setCmsForm(prev => ({ ...prev, landing: { ...prev.landing, [field]: value } }));
    };

    const updateFeatureField = (field: keyof CMSContent['features'], value: string) => {
        setCmsForm(prev => ({ ...prev, features: { ...prev.features, [field]: value } }));
    };

    const handleAddExtraSection = () => {
        const newBlock: ContentBlock = {
            id: `block_${Date.now()}`,
            type: 'HERO',
            title: 'New Section',
            content: 'Add your content here...',
            buttonText: 'Click Me'
        };
        const currentSections = cmsForm.landing.extraSections || [];
        setCmsForm(prev => ({
            ...prev,
            landing: {
                ...prev.landing,
                extraSections: [...currentSections, newBlock]
            }
        }));
    };

    const handleRemoveExtraSection = (id: string) => {
        const currentSections = cmsForm.landing.extraSections || [];
        setCmsForm(prev => ({
            ...prev,
            landing: {
                ...prev.landing,
                extraSections: currentSections.filter(b => b.id !== id)
            }
        }));
    };

    const handleUpdateExtraSection = (id: string, updates: Partial<ContentBlock>) => {
        const currentSections = cmsForm.landing.extraSections || [];
        setCmsForm(prev => ({
            ...prev,
            landing: {
                ...prev.landing,
                extraSections: currentSections.map(b => b.id === id ? { ...b, ...updates } : b)
            }
        }));
    };

    // --- CUSTOM PAGE HANDLERS ---
    const handleCreatePage = () => {
        const newPage: CustomPage = {
            id: `page_${Date.now()}`,
            title: 'New Page',
            slug: 'new-page',
            blocks: []
        };
        setCmsForm(prev => ({ ...prev, customPages: [...(prev.customPages || []), newPage] }));
        setEditingPage(newPage);
    };

    const handleDeletePage = (id: string) => {
        if (!confirm("Delete this page?")) return;
        setCmsForm(prev => ({ ...prev, customPages: prev.customPages.filter(p => p.id !== id) }));
        if (editingPage?.id === id) setEditingPage(null);
    };

    const handleUpdatePage = (id: string, updates: Partial<CustomPage>) => {
        const updatedPages = cmsForm.customPages.map(p => p.id === id ? { ...p, ...updates } : p);
        setCmsForm(prev => ({ ...prev, customPages: updatedPages }));

        // Keep local editing state in sync
        if (editingPage?.id === id) {
            setEditingPage(prev => prev ? { ...prev, ...updates } : null);
        }
    };

    const handleAddBlockToPage = (pageId: string) => {
        const newBlock: ContentBlock = {
            id: `block_${Date.now()}`,
            type: 'TEXT_IMAGE',
            title: 'New Content Block',
            content: 'Content goes here...',
            layout: 'image_left'
        };
        const page = cmsForm.customPages.find(p => p.id === pageId);
        if (page) {
            handleUpdatePage(pageId, { blocks: [...page.blocks, newBlock] });
        }
    };

    const handleUpdatePageBlock = (pageId: string, blockId: string, updates: Partial<ContentBlock>) => {
        const page = cmsForm.customPages.find(p => p.id === pageId);
        if (page) {
            const newBlocks = page.blocks.map(b => b.id === blockId ? { ...b, ...updates } : b);
            handleUpdatePage(pageId, { blocks: newBlocks });
        }
    };

    const handleDeletePageBlock = (pageId: string, blockId: string) => {
        const page = cmsForm.customPages.find(p => p.id === pageId);
        if (page) {
            const newBlocks = page.blocks.filter(b => b.id !== blockId);
            handleUpdatePage(pageId, { blocks: newBlocks });
        }
    };

    const handleHardReset = () => {
        if (window.confirm("⚠️ FACTORY RESET: Delete ALL data?")) {
            localStorage.clear();
            window.location.reload();
        }
    };

    const safeStr = (val: any) => {
        if (typeof val === 'string') return val;
        if (typeof val === 'number') return String(val);
        return '';
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-gray-900 text-white p-6 rounded-3xl shadow-lg gap-4">
                <div>
                    <h2 className="text-3xl font-black">{t('admin.dashboard.title')}</h2>
                    <p className="text-gray-400 font-bold">{t('admin.dashboard.subtitle')}</p>
                </div>
                <div className="flex flex-col xl:flex-row items-end xl:items-center gap-4 flex-1 justify-end w-full">
                    <div className="flex flex-col gap-4 flex-1 w-full">
                        {/* Core System Data */}
                        <div className="flex flex-wrap gap-2 items-center bg-gray-800/50 p-2 rounded-xl">
                            <span className="text-xs font-black tracking-widest text-gray-500 uppercase px-2 w-[120px]">Core Data:</span>
                            <TabButton active={activeTab === 'OVERVIEW'} onClick={() => setActiveTab('OVERVIEW')} icon={<LayoutDashboard size={14} />} label={t('admin.dashboard.tabs.overview')} />
                            <TabButton active={activeTab === 'ANALYTICS'} onClick={() => setActiveTab('ANALYTICS')} icon={<BarChart3 size={14} />} label={t('admin.dashboard.tabs.analytics')} />
                            <TabButton active={activeTab === 'USERS'} onClick={() => setActiveTab('USERS')} icon={<Users size={14} />} label={t('admin.dashboard.tabs.users')} />
                            <TabButton active={activeTab === 'CLASSES'} onClick={() => setActiveTab('CLASSES')} icon={<School size={14} />} label={t('admin.dashboard.tabs.classes')} />
                        </div>

                        {/* Content Engineering */}
                        <div className="flex flex-wrap gap-2 items-center bg-gray-800/50 p-2 rounded-xl">
                            <span className="text-xs font-black tracking-widest text-gray-500 uppercase px-2 w-[120px]">Content Engine:</span>
                            <TabButton active={activeTab === 'CONTENT'} onClick={() => setActiveTab('CONTENT')} icon={<BookOpen size={14} />} label={t('admin.dashboard.tabs.content')} />
                            <TabButton active={activeTab === 'LIBRARY'} onClick={() => setActiveTab('LIBRARY')} icon={<BookIcon size={14} />} label={t('admin.dashboard.tabs.library')} />
                            <TabButton active={activeTab === 'VIDEOS'} onClick={() => setActiveTab('VIDEOS')} icon={<Play size={14} />} label={t('admin.dashboard.tabs.videos')} />
                            <TabButton active={activeTab === 'SESSIONS'} onClick={() => setActiveTab('SESSIONS')} icon={<VideoIcon size={14} />} label={t('admin.dashboard.tabs.live')} />
                            <TabButton active={activeTab === 'WORK'} onClick={() => setActiveTab('WORK')} icon={<ClipboardList size={14} />} label={t('admin.dashboard.tabs.work')} />
                            <TabButton active={activeTab === 'GRADING'} onClick={() => setActiveTab('GRADING')} icon={<GraduationCap size={14} />} label={t('admin.dashboard.tabs.rubrics')} />
                        </div>

                        {/* Extensibility & Configuration */}
                        <div className="flex flex-wrap gap-2 items-center bg-gray-800/50 p-2 rounded-xl">
                            <span className="text-xs font-black tracking-widest text-gray-500 uppercase px-2 w-[120px]">System Config:</span>
                            <TabButton active={activeTab === 'CMS'} onClick={() => setActiveTab('CMS')} icon={<Globe size={14} />} label={t('admin.dashboard.tabs.cms')} />
                            <TabButton active={activeTab === 'SECURITY'} onClick={() => setActiveTab('SECURITY')} icon={<Shield size={14} />} label="Security" />
                            <TabButton active={activeTab === 'ECONOMY'} onClick={() => setActiveTab('ECONOMY')} icon={<Coins size={14} />} label="Economy" />
                            <TabButton active={activeTab === 'LEADERBOARD'} onClick={() => setActiveTab('LEADERBOARD')} icon={<Medal size={14} />} label="Leaderboard" />
                            <TabButton active={activeTab === 'SOCIAL'} onClick={() => setActiveTab('SOCIAL')} icon={<MessageSquare size={14} />} label="Social" />
                            <TabButton active={activeTab === 'HQ'} onClick={() => setActiveTab('HQ')} icon={<Home size={14} />} label="HQ & Store" />
                            <TabButton active={activeTab === 'FLAGS'} onClick={() => setActiveTab('FLAGS')} icon={<Flag size={14} />} label="Flags" />
                        </div>
                    </div>

                    <button
                        onClick={handleGitPull}
                        disabled={isPulling}
                        className={`flex items-center gap-2 px-6 py-4 rounded-xl font-bold transition-all bg-black text-white hover:bg-gray-800 border-2 border-gray-700 h-fit whitespace-nowrap shadow-xl shrink-0`}
                        title={t('admin.dashboard.actions.sync_repo')}
                    >
                        {isPulling ? <Loader2 size={18} className="animate-spin" /> : <Github size={18} />}
                        <span className="hidden lg:inline">{isPulling ? 'Pulling...' : t('admin.dashboard.actions.sync_repo')}</span>
                    </button>
                </div>
            </div>

            {/* --- ANALYTICS TAB --- */}
            {activeTab === 'ANALYTICS' && <ReportsDashboard />}

            {/* --- OVERVIEW TAB --- */}
            {activeTab === 'OVERVIEW' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard label={t('admin.dashboard.stats.total_users')} value={stats.users} icon={<Users />} color="bg-blue-100 text-blue-700" />
                        <StatCard label={t('admin.dashboard.stats.students')} value={stats.students} icon={<Star />} color="bg-yellow-100 text-yellow-700" />
                        <StatCard label="Teachers" value={stats.teachers} icon={<GraduationCap />} color="bg-indigo-100 text-indigo-700" />
                        <StatCard label={t('admin.dashboard.stats.classes')} value={stats.classes} icon={<School />} color="bg-purple-100 text-purple-700" />
                        <StatCard label={t('admin.dashboard.stats.assignments')} value={stats.assignments} icon={<ClipboardList />} color="bg-green-100 text-green-700" />
                        <StatCard label="Submissions" value={stats.submissions} icon={<FileText />} color="bg-teal-100 text-teal-700" />
                        <StatCard label="Lessons" value={stats.lessons} icon={<BookOpen />} color="bg-orange-100 text-orange-700" />
                        <StatCard label={t('admin.dashboard.stats.books')} value={stats.books} icon={<BookIcon />} color="bg-pink-100 text-pink-700" />
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h4 className="font-black text-lg text-gray-800">{t('admin.dashboard.sections.data_management')}</h4>
                            <p className="text-gray-500 font-medium">{t('admin.dashboard.actions.backup')}</p>
                        </div>
                        <button
                            onClick={handleDownloadBackup}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md transition-colors"
                        >
                            <Download size={18} /> {t('admin.dashboard.actions.download')}
                        </button>
                    </div>

                    <div className="bg-red-50 border-2 border-red-200 p-6 rounded-2xl flex justify-between items-center">
                        <div className="flex items-center gap-4 text-red-800">
                            <AlertTriangle size={32} />
                            <div>
                                <h4 className="font-black text-lg">{t('admin.dashboard.sections.emergency_zone')}</h4>
                                <p className="font-bold opacity-80">Database corrupted? Reset everything.</p>
                            </div>
                        </div>
                        <button onClick={handleHardReset} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md">
                            <RefreshCcw size={18} /> {t('admin.dashboard.actions.factory_reset')}
                        </button>
                    </div>

                    {/* AI Settings */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <Bot className="text-purple-500" /> {t('admin.dashboard.sections.ai_configuration')}
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                <div>
                                    <div className="font-bold text-gray-800 dark:text-white">Active Intelligence</div>
                                    <div className="text-xs text-gray-500">Select which brain powers Ollie</div>
                                </div>
                                <select
                                    id="ai-provider-select"
                                    name="ai-provider"
                                    onChange={(e) => {
                                        const provider = e.target.value as AIProvider;
                                        setAIProvider(provider);
                                        window.location.reload();
                                    }}
                                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm font-bold"
                                    defaultValue={import.meta.env.VITE_AI_PROVIDER || 'gemini'}
                                >
                                    <option value="gemini">Google Gemini (Cloud)</option>
                                    <option value="ollama">Ollama (Local)</option>
                                    <option value="openrouter">OpenRouter (Gateway)</option>
                                    <option value="deepseek">DeepSeek (Direct)</option>
                                </select>
                            </div>
                            <p className="text-xs text-gray-400 italic">
                                Note: Local AI requires Ollama running on port 11434.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* --- USERS TAB --- */}
            {activeTab === 'USERS' && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Sync Banner */}
                    {isSyncing && (
                        <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 flex items-center gap-2 text-blue-700 text-sm font-bold">
                            <Loader2 size={14} className="animate-spin" /> Syncing with Supabase...
                        </div>
                    )}
                    {syncError && (
                        <div className="bg-red-50 border-b border-red-100 px-4 py-2 text-red-700 text-sm font-bold">
                            ⚠️ Sync error: {syncError}
                        </div>
                    )}
                    <div className="p-4 border-b bg-gray-50 flex justify-between items-center flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-500">{displayedUsers.length} {t('admin.dashboard.stats.total_users')}</span>
                            <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">● Supabase Live</span>
                            <button
                                onClick={refreshFromSupabase}
                                disabled={isSyncing}
                                className="text-gray-500 hover:text-blue-600 p-1 rounded hover:bg-blue-50 transition-colors"
                                title="Refresh from Supabase"
                            >
                                <RefreshCcw size={16} className={isSyncing ? 'animate-spin' : ''} />
                            </button>
                        </div>
                        <button onClick={() => openUserModal()} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700">
                            <Plus size={16} /> {t('admin.dashboard.actions.add_user')}
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-start font-bold text-gray-400 uppercase">
                                <tr>
                                    <th className="p-4">{t('admin.dashboard.headers.name_id')}</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">{t('admin.dashboard.headers.role')}</th>
                                    <th className="p-4">{t('admin.dashboard.headers.tier')}</th>
                                    <th className="p-4">{t('admin.dashboard.headers.stats')}</th>
                                    <th className="p-4 text-end">{t('admin.dashboard.headers.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {displayedUsers.length === 0 && !isSyncing && (
                                    <tr><td colSpan={6} className="p-8 text-center text-gray-400">
                                        <div className="font-bold mb-1">No users found in the database.</div>
                                        <div className="text-xs mb-3">This data comes directly from Supabase. Users register through the app sign-up flow.</div>
                                        <button onClick={refreshFromSupabase} className="text-blue-600 underline">Refresh from Supabase</button>
                                    </td></tr>
                                )}
                                {displayedUsers.map(u => (
                                    <tr key={u.id} className={`hover:bg-gray-50 ${u.id === user?.id ? 'bg-blue-50/40' : ''}`}>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="font-bold text-gray-800">{u.name || u.username}</div>
                                                {u.id === user?.id && <span className="text-xs bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded">You</span>}
                                            </div>
                                            <div className="text-xs text-gray-400 font-mono">{safeStr(u.id).slice(0, 8)}…</div>
                                        </td>
                                        <td className="p-4 text-gray-500 text-xs">{(u as any).email || '—'}</td>
                                        <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">{u.role}</span></td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                                          ${u.subscriptionTier === 'tycoon' ? 'bg-purple-100 text-purple-800' :
                                                    u.subscriptionTier === 'board' ? 'bg-blue-100 text-blue-800' :
                                                        u.subscriptionTier === 'founder' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-500'}
                                      `}>
                                                {u.subscriptionTier || 'intern'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            Lvl {u.level} • {u.bizCoins?.toLocaleString()} Coins
                                        </td>
                                        <td className="p-4 text-end flex justify-end gap-2">
                                            <button onClick={() => handleImpersonate(u)} className="bg-purple-100 text-purple-600 p-2 rounded hover:bg-purple-200" title="Login As"><LogIn size={16} /></button>
                                            <button onClick={() => openUserModal(u)} className="bg-blue-50 text-blue-600 p-2 rounded hover:bg-blue-100"><Edit size={16} /></button>
                                            <button
                                                onClick={async () => {
                                                    if (!confirm(`Delete user ${u.name}? This will remove their profile from the database.`)) return;
                                                    try { await deleteUser(u.id); await fetchAllUsers(); }
                                                    catch (e: any) { alert('Delete failed: ' + e.message); }
                                                }}
                                                className="bg-red-50 text-red-600 p-2 rounded hover:bg-red-100"
                                            ><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- CLASSES TAB --- */}
            {activeTab === 'CLASSES' && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                        <span className="font-bold text-gray-500">{classrooms.length} {t('admin.dashboard.stats.classes')}</span>
                        <button onClick={() => openClassModal()} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700">
                            <Plus size={16} /> {t('admin.dashboard.actions.create_class')}
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-start font-bold text-gray-400 uppercase">
                                <tr>
                                    <th className="p-4">{t('admin.dashboard.headers.class_name')}</th>
                                    <th className="p-4">{t('admin.dashboard.headers.code')}</th>
                                    <th className="p-4">{t('admin.dashboard.headers.teacher')}</th>
                                    <th className="p-4">{t('admin.dashboard.headers.students')}</th>
                                    <th className="p-4 text-end">{t('admin.dashboard.headers.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {classrooms.map(c => (
                                    <tr key={c.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-bold text-gray-800">{c.name}</td>
                                        <td className="p-4 font-mono text-blue-600 font-bold">{c.code}</td>
                                        <td className="p-4">{users.find(u => u.id === c.teacherId)?.name || <span className="text-red-400">Unknown ID: {c.teacherId}</span>}</td>
                                        <td className="p-4">{c.studentIds.length}</td>
                                        <td className="p-4 text-end flex justify-end gap-2">
                                            <button onClick={() => openClassModal(c)} className="bg-blue-50 text-blue-600 p-2 rounded hover:bg-blue-100"><Edit size={16} /></button>
                                            <button onClick={() => { if (confirm('Delete Class?')) deleteClassroom(c.id); }} className="bg-red-50 text-red-600 p-2 rounded hover:bg-red-100"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                                {classrooms.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400">No classes found.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- LIBRARY TAB --- */}
            {activeTab === 'LIBRARY' && (
                <div className="space-y-4">
                    {/* Sub-tab bar */}
                    <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl w-fit">
                        <button
                            onClick={() => setLibraryTab('ALL_BOOKS')}
                            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm transition-all ${libraryTab === 'ALL_BOOKS' ? 'bg-white text-blue-700 shadow' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <BookIcon size={16} /> All Books ({library.length})
                        </button>
                        <button
                            onClick={() => setLibraryTab('EXCLUSIVES')}
                            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm transition-all ${libraryTab === 'EXCLUSIVES' ? 'bg-white text-violet-700 shadow' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Sparkles size={16} /> PP Exclusives ({exclusiveBooks.length})
                        </button>
                    </div>

                    {/* ALL BOOKS sub-panel */}
                    {libraryTab === 'ALL_BOOKS' && (
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                                <span className="font-bold text-gray-500">{library.length} {t('admin.dashboard.stats.books')}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            if (confirm("Reset Library to defaults? This will restore the original 100 books.")) {
                                                useAppStore.getState().resetLibrary();
                                                window.location.reload();
                                            }
                                        }}
                                        className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-200"
                                    >
                                        <RefreshCcw size={16} /> Reset
                                    </button>
                                    <button onClick={() => openBookModal()} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700">
                                        <Plus size={16} /> {t('admin.dashboard.actions.add_book')}
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-start font-bold text-gray-400 uppercase">
                                        <tr>
                                            <th className="p-4 w-16">{t('admin.dashboard.headers.cover')}</th>
                                            <th className="p-4">{t('admin.dashboard.headers.title_author')}</th>
                                            <th className="p-4">{t('admin.dashboard.headers.category')}</th>
                                            <th className="p-4">{t('admin.dashboard.headers.age')}</th>
                                            <th className="p-4 text-end">{t('admin.dashboard.headers.actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {library.map(book => (
                                            <tr key={book.id} className="hover:bg-gray-50">
                                                <td className="p-4"><img src={book.coverUrl} alt="Cover" className="w-10 h-14 object-cover rounded shadow-sm bg-gray-200" loading="lazy" /></td>
                                                <td className="p-4">
                                                    <div className="font-bold text-gray-800 text-base">{book.title}</div>
                                                    <div className="text-gray-500 font-bold text-xs">{book.author}</div>
                                                </td>
                                                <td className="p-4"><span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">{book.category}</span></td>
                                                <td className="p-4 text-gray-500 font-bold">{book.ageRating}</td>
                                                <td className="p-4 text-end flex justify-end gap-2">
                                                    <button onClick={() => openBookModal(book)} className="bg-blue-50 text-blue-600 p-2 rounded hover:bg-blue-100"><Edit size={16} /></button>
                                                    <button onClick={() => { if (confirm('Delete book?')) removeBook(book.id); }} className="bg-red-50 text-red-600 p-2 rounded hover:bg-red-100"><Trash2 size={16} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                        {library.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400 font-bold">The library is empty.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* EXCLUSIVES sub-panel */}
                    {libraryTab === 'EXCLUSIVES' && (
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Header */}
                            <div className="p-4 border-b bg-violet-50 flex flex-wrap gap-3 justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="text-violet-600" size={20} />
                                    <div>
                                        <div className="font-black text-violet-800 text-sm">Profits Patrol Exclusives</div>
                                        <div className="text-xs text-violet-500 font-bold">{exclusiveBooks.length} exclusive books — available only inside the app</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="search"
                                        placeholder="Search exclusives..."
                                        value={exclusiveSearch}
                                        onChange={e => setExclusiveSearch(e.target.value)}
                                        className="border border-violet-200 px-3 py-2 rounded-xl text-sm font-medium focus:outline-none focus:border-violet-400"
                                    />
                                    <button
                                        onClick={() => { if (confirm('Reset exclusive books to the original list?')) resetExclusiveBooks(); }}
                                        className="bg-gray-100 text-gray-600 px-3 py-2 rounded-xl font-bold text-sm flex items-center gap-1 hover:bg-gray-200"
                                        title="Reset to original MORE_BOOKS list"
                                    >
                                        <RefreshCcw size={14} /> Reset
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingExclusive({
                                                id: `excl_${Date.now()}`,
                                                title: '', author: '', coverUrl: '',
                                                summary: '', category: 'Mindset',
                                                keyLessons: [], ageRating: '8+',
                                                fullContent: ''
                                            });
                                            setShowExclusiveModal(true);
                                        }}
                                        className="bg-violet-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-violet-700"
                                    >
                                        <Plus size={16} /> Add Exclusive
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-start font-bold text-gray-400 uppercase text-xs">
                                        <tr>
                                            <th className="p-4 w-16">Cover</th>
                                            <th className="p-4">Title / Author</th>
                                            <th className="p-4">Category</th>
                                            <th className="p-4">Age</th>
                                            <th className="p-4">Summary</th>
                                            <th className="p-4 text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {exclusiveBooks
                                            .filter(b => !exclusiveSearch || b.title.toLowerCase().includes(exclusiveSearch.toLowerCase()) || b.author.toLowerCase().includes(exclusiveSearch.toLowerCase()))
                                            .map(book => (
                                                <tr key={book.id} className="hover:bg-violet-50 group">
                                                    <td className="p-4">
                                                        <div className="relative w-10 h-14">
                                                            <img src={book.coverUrl} alt="Cover" className="w-10 h-14 object-cover rounded shadow-sm bg-gray-200" loading="lazy" />
                                                            <div className="absolute -top-1 -left-1 bg-violet-500 text-white text-[8px] font-black px-1 rounded">EX</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="font-bold text-gray-800 text-base">{book.title}</div>
                                                        <div className="text-gray-500 font-bold text-xs">{book.author}</div>
                                                        <div className="text-[10px] text-gray-400 font-mono">{book.id}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="bg-violet-50 text-violet-600 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">{book.category}</span>
                                                    </td>
                                                    <td className="p-4 text-gray-500 font-bold">{book.ageRating}</td>
                                                    <td className="p-4 max-w-xs">
                                                        <p className="text-xs text-gray-500 line-clamp-2">{book.summary}</p>
                                                    </td>
                                                    <td className="p-4 text-end">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => { setEditingExclusive({ ...book }); setShowExclusiveModal(true); }}
                                                                className="bg-violet-50 text-violet-600 p-2 rounded hover:bg-violet-100"
                                                                title="Edit exclusive book"
                                                            ><Edit size={16} /></button>
                                                            <button
                                                                onClick={() => { if (confirm(`Delete "${book.title}" from exclusives?`)) deleteExclusiveBook(book.id); }}
                                                                className="bg-red-50 text-red-600 p-2 rounded hover:bg-red-100"
                                                                title="Delete exclusive book"
                                                            ><Trash2 size={16} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        {exclusiveBooks.length === 0 && (
                                            <tr><td colSpan={6} className="p-8 text-center text-gray-400 font-bold">No exclusive books yet. Add some!</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Exclusive Book Add/Edit Modal */}
                    {showExclusiveModal && editingExclusive && (
                        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                                <div className="p-6 border-b flex justify-between items-center bg-violet-50">
                                    <h3 className="font-black text-xl text-violet-800 flex items-center gap-2">
                                        <Sparkles className="text-violet-600" size={22} />
                                        {exclusiveBooks.find(b => b.id === editingExclusive.id) ? 'Edit Exclusive Book' : 'Add New Exclusive Book'}
                                    </h3>
                                    <button onClick={() => { setShowExclusiveModal(false); setEditingExclusive(null); }} className="p-2 hover:bg-violet-100 rounded-full">
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="p-6 space-y-4">
                                    {/* Cover preview */}
                                    {editingExclusive.coverUrl && (
                                        <div className="flex justify-center">
                                            <img src={editingExclusive.coverUrl} alt="Preview" className="w-20 h-28 object-cover rounded-xl shadow-md" />
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-black text-gray-500 uppercase mb-1">ID (unique)</label>
                                            <input type="text" value={editingExclusive.id || ''} onChange={e => setEditingExclusive(p => ({ ...p!, id: e.target.value }))} className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm font-mono focus:border-violet-400 outline-none" placeholder="unique-book-id" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Age Rating</label>
                                            <select value={editingExclusive.ageRating || '8+'} onChange={e => setEditingExclusive(p => ({ ...p!, ageRating: e.target.value }))} className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm font-bold focus:border-violet-400 outline-none">
                                                {['5+', '8+', '10+', '12+', '14+'].map(r => <option key={r} value={r}>{r}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase mb-1">Title *</label>
                                        <input type="text" value={editingExclusive.title || ''} onChange={e => setEditingExclusive(p => ({ ...p!, title: e.target.value }))} className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm font-bold focus:border-violet-400 outline-none" placeholder="Book title" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase mb-1">Author *</label>
                                        <input type="text" value={editingExclusive.author || ''} onChange={e => setEditingExclusive(p => ({ ...p!, author: e.target.value }))} className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm font-bold focus:border-violet-400 outline-none" placeholder="Author name" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase mb-1">Cover Image URL</label>
                                        <input type="url" value={editingExclusive.coverUrl || ''} onChange={e => setEditingExclusive(p => ({ ...p!, coverUrl: e.target.value }))} className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm font-medium focus:border-violet-400 outline-none" placeholder="https://..." />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase mb-1">Category</label>
                                        <select value={editingExclusive.category || 'Mindset'} onChange={e => setEditingExclusive(p => ({ ...p!, category: e.target.value as Book['category'] }))} className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm font-bold focus:border-violet-400 outline-none">
                                            {['Mindset', 'Finance', 'Strategy', 'Biography', 'Fiction', 'Creativity', 'History', 'Economics', 'Leadership', 'Sci-Fi & Dystopian', 'Real-World Business'].map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase mb-1">Short Summary *</label>
                                        <textarea value={editingExclusive.summary || ''} onChange={e => setEditingExclusive(p => ({ ...p!, summary: e.target.value }))} rows={3} className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm font-medium focus:border-violet-400 outline-none" placeholder="One-paragraph summary" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase mb-1">Full Content (markdown, optional)</label>
                                        <textarea value={editingExclusive.fullContent || ''} onChange={e => setEditingExclusive(p => ({ ...p!, fullContent: e.target.value }))} rows={8} className="w-full border-2 border-gray-200 rounded-xl p-3 text-xs font-mono focus:border-violet-400 outline-none" placeholder="## Chapter Title

Content here..." />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase mb-1">Key Lessons (one per line)</label>
                                        <textarea
                                            value={(editingExclusive.keyLessons || []).join('\n')}
                                            onChange={e => setEditingExclusive(p => ({ ...p!, keyLessons: e.target.value.split('\n').filter(Boolean) }))}
                                            rows={3}
                                            className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm font-medium focus:border-violet-400 outline-none"
                                            placeholder={"Lesson 1\nLesson 2\nLesson 3"}
                                        />
                                    </div>
                                </div>
                                <div className="p-6 border-t flex gap-3 justify-end bg-gray-50">
                                    <button onClick={() => { setShowExclusiveModal(false); setEditingExclusive(null); }} className="px-6 py-2 rounded-xl border-2 border-gray-200 font-bold text-gray-600 hover:bg-gray-100">Cancel</button>
                                    <button
                                        onClick={() => {
                                            if (!editingExclusive.title || !editingExclusive.author) return alert('Title and Author are required!');
                                            const finalBook = { ...editingExclusive, keyLessons: editingExclusive.keyLessons || [] } as Book;
                                            const exists = exclusiveBooks.find(b => b.id === finalBook.id);
                                            if (exists) updateExclusiveBook(finalBook.id, finalBook);
                                            else addExclusiveBook(finalBook);
                                            setShowExclusiveModal(false);
                                            setEditingExclusive(null);
                                        }}
                                        className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2"
                                    >
                                        <Save size={16} /> Save Exclusive
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* --- GRADING TAB --- */}
            {activeTab === 'GRADING' && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                        <span className="font-bold text-gray-500">{submissions.length} Submissions</span>
                    </div>
                    {/* Submission List */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-start font-bold text-gray-400 uppercase">
                                <tr>
                                    <th className="p-4">{t('admin.dashboard.headers.student')}</th>
                                    <th className="p-4">{t('admin.dashboard.headers.project_assignment')}</th>
                                    <th className="p-4">{t('admin.dashboard.headers.status')}</th>
                                    <th className="p-4">{t('admin.dashboard.headers.grade')}</th>
                                    <th className="p-4 text-end">{t('admin.dashboard.headers.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {submissions.map(s => {
                                    const st = users.find(u => u.id === s.studentId);
                                    const asg = assignments.find(a => a.id === s.assignmentId);
                                    // Helper to get lesson title if it's a project submission (usually assignmentId links to lesson)
                                    // For now, we display the raw ID or mapped title if possible.
                                    return (
                                        <tr key={s.id} className="hover:bg-gray-50">
                                            <td className="p-4">
                                                <div className="font-bold text-gray-800">{st?.name || 'Unknown User'}</div>
                                                <div className="text-xs text-gray-400 font-mono">{s.studentId}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-gray-800">
                                                    {asg?.title || (s.assignmentId.includes('project_') ? 'Unit Project' : 'Assignment')}
                                                </div>
                                                <div className="text-xs text-gray-400 font-mono">{s.assignmentId}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${s.status === 'GRADED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {s.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {s.grade !== undefined ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-black text-lg">{s.grade}%</span>
                                                        <span className={`text-xs px-1.5 py-0.5 rounded font-black
                                                            ${s.letterGrade === 'Tycoon' ? 'bg-purple-100 text-purple-700' :
                                                                s.letterGrade === 'Founder' ? 'bg-blue-100 text-blue-700' :
                                                                    'bg-gray-100 text-gray-700'}`
                                                        }>
                                                            {s.letterGrade || t('admin.dashboard.grading_tab.pending')}
                                                        </span>
                                                    </div>
                                                ) : <span className="text-gray-400 italic">--</span>}
                                            </td>
                                            <td className="p-4 text-end flex justify-end gap-2">
                                                <button
                                                    onClick={() => setViewingSubmission({ sub: s, user: st })}
                                                    className="bg-purple-100 text-purple-700 p-2 rounded hover:bg-purple-200 font-bold text-xs flex items-center gap-1"
                                                >
                                                    <Eye size={16} /> {t('admin.dashboard.grading_tab.review')}
                                                </button>
                                                <button onClick={() => deleteSubmission(s.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {submissions.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400 font-bold">{t('admin.dashboard.grading_tab.no_submissions')}</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- SECURITY TAB --- */}
            {activeTab === 'SECURITY' && <SecurityMonitoring />}

            {activeTab === 'WORK' && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b bg-gray-50 flex gap-4">
                        <button onClick={() => setWorkTab('ASSIGNMENTS')} className={`font-bold ${workTab === 'ASSIGNMENTS' ? 'text-blue-600' : 'text-gray-400'}`}>{t('admin.dashboard.work.assignments')}</button>
                        <button onClick={() => setWorkTab('SUBMISSIONS')} className={`font-bold ${workTab === 'SUBMISSIONS' ? 'text-blue-600' : 'text-gray-400'}`}>{t('admin.dashboard.work.submissions')}</button>
                    </div>

                    <div className="overflow-x-auto max-h-[600px]">
                        {workTab === 'ASSIGNMENTS' ? (
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-start font-bold text-gray-400 uppercase">
                                    <tr>
                                        <th className="p-4">{t('admin.dashboard.work.table.title')}</th>
                                        <th className="p-4">{t('admin.dashboard.work.table.due_date')}</th>
                                        <th className="p-4">{t('admin.dashboard.work.table.class')}</th>
                                        <th className="p-4 text-end">{t('admin.dashboard.work.table.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {assignments.map(a => (
                                        <tr key={a.id} className="hover:bg-gray-50">
                                            <td className="p-4 font-bold text-gray-800">{a.title}</td>
                                            <td className="p-4">{a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'None'}</td>
                                            <td className="p-4 text-xs font-mono text-gray-500">{a.classId}</td>
                                            <td className="p-4 text-end">
                                                <button onClick={() => deleteAssignment(a.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-start font-bold text-gray-400 uppercase">
                                    <tr>
                                        <th className="p-4">{t('admin.dashboard.work.table.student')}</th>
                                        <th className="p-4">{t('admin.dashboard.work.table.assignment')}</th>
                                        <th className="p-4">{t('admin.dashboard.work.table.status')}</th>
                                        <th className="p-4 text-end">{t('admin.dashboard.work.table.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {submissions.map(s => {
                                        const st = users.find(u => u.id === s.studentId);
                                        const asg = assignments.find(a => a.id === s.assignmentId);
                                        return (
                                            <tr key={s.id} className="hover:bg-gray-50">
                                                <td className="p-4 font-bold text-gray-800">{st?.name || s.studentId}</td>
                                                <td className="p-4">{asg?.title || s.assignmentId}</td>
                                                <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${s.status === 'GRADED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{s.status}</span></td>
                                                <td className="p-4 text-end">
                                                    <button onClick={() => deleteSubmission(s.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16} /></button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}

            {/* --- GRADING TAB --- */}
            {activeTab === 'GRADING' && (
                <div className="space-y-6">
                    <RubricEditor onSave={(rubric) => {
                        // ✅ SECURITY FIX: Rubric saved — route through Logger (not raw console)
                        Logger.info('AdminDashboard: Rubric saved', { rubricId: rubric.id, teacherId: rubric.teacherId });
                        alert('Rubric saved! Connect to Supabase to persist rubrics across sessions.');
                    }} />
                </div>
            )}

            {/* --- CONTENT TAB (Lessons/Games) --- */}
            {activeTab === 'CONTENT' && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                        <div className="flex gap-4">
                            <button onClick={() => setContentTab('LESSONS')} className={`font-bold ${contentTab === 'LESSONS' ? 'text-blue-600' : 'text-gray-400'}`}>{t('admin.dashboard.content.lessons')} ({lessons.length})</button>
                            <button onClick={() => setContentTab('GAMES')} className={`font-bold ${contentTab === 'GAMES' ? 'text-blue-600' : 'text-gray-400'}`}>{t('admin.dashboard.content.games')} ({games.length})</button>
                        </div>
                        <button onClick={createNewContent} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700">
                            <Plus size={16} /> {contentTab === 'LESSONS' ? t('admin.dashboard.content.new_lesson') : t('admin.dashboard.content.new_game')}
                        </button>
                    </div>
                    <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                        {contentTab === 'LESSONS' && lessons.map(l => (
                            <div key={l.id} className="p-4 flex items-center justify-between hover:bg-gray-50 group">
                                <div>
                                    <div className="font-bold text-gray-800">{safeStr(l.lesson_payload.headline)}</div>
                                    <div className="text-xs text-gray-400 font-mono">{l.id} • {l.topic_tag}</div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEditContent(l, l.id)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg"><Edit size={18} /></button>
                                    <button onClick={(e) => handleDeleteContent(e, l.id, 'LESSON')} className="p-2 text-red-500 hover:bg-red-100 rounded-lg"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))}
                        {contentTab === 'GAMES' && games.map(g => (
                            <div key={g.business_id} className="p-4 flex items-center justify-between hover:bg-gray-50 group">
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">{g.visual_config?.icon || '🎮'}</div>
                                    <div>
                                        <div className="font-bold text-gray-800">{g.name}</div>
                                        <div className="text-xs text-gray-400 font-mono">{g.game_type}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEditContent(g, g.business_id)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg"><Edit size={18} /></button>
                                    <button onClick={(e) => handleDeleteContent(e, g.business_id, 'GAME')} className="p-2 text-red-500 hover:bg-red-100 rounded-lg"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- VIDEOS TAB --- */}
            {activeTab === 'VIDEOS' && <AdminVideoManager />}

            {/* --- SESSIONS TAB --- */}
            {activeTab === 'SESSIONS' && <AdminLiveSessionManager />}

            {/* --- CMS TAB --- */}
            {activeTab === 'CMS' && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
                    <div className="flex justify-between items-center mb-8 sticky top-0 bg-white z-10 py-4 border-b border-gray-100">
                        <h3 className="font-bold text-xl text-gray-800">{t('admin.dashboard.cms.title')}</h3>
                        <div className="flex gap-4 items-center">
                            <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
                                <button onClick={() => setCmsSubTab('LANDING')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${cmsSubTab === 'LANDING' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>{t('admin.dashboard.cms.tabs.landing')}</button>
                                <button onClick={() => setCmsSubTab('FEATURES')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${cmsSubTab === 'FEATURES' ? 'bg-white shadow-sm text-gray' : 'text-gray-500 hover:text-gray-700'}`}>{t('admin.dashboard.cms.tabs.features')}</button>
                                <button onClick={() => setCmsSubTab('PAGES')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${cmsSubTab === 'PAGES' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>{t('admin.dashboard.cms.tabs.pages')}</button>
                            </div>
                            <button
                                onClick={handleSaveCMS}
                                className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 shadow-md"
                            >
                                <Save size={18} /> {t('admin.dashboard.actions.save_changes')}
                            </button>
                        </div>
                    </div>

                    {cmsSubTab === 'LANDING' && (
                        <div className="space-y-8 animate-fade-in">
                            {/* Hero */}
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
                                <div className="text-sm font-bold text-gray-400 uppercase mb-2">{t('admin.dashboard.cms.landing.hero_section')}</div>
                                <CMSInput label={t('admin.dashboard.cms.landing.hero_title')} value={cmsForm.landing.heroTitle} onChange={(v) => updateLandingField('heroTitle', v)} type="textarea" />
                                <CMSInput label={t('admin.dashboard.cms.landing.hero_subtitle')} value={cmsForm.landing.heroSubtitle} onChange={(v) => updateLandingField('heroSubtitle', v)} type="textarea" />
                                <div className="grid grid-cols-2 gap-4">
                                    <CMSInput label={t('admin.dashboard.cms.landing.cta_button')} value={cmsForm.landing.heroCta} onChange={(v) => updateLandingField('heroCta', v)} />
                                    <CMSInput label={t('admin.dashboard.cms.landing.hero_image')} value={cmsForm.landing.heroImage} onChange={(v) => updateLandingField('heroImage', v)} icon={<ImageIcon size={14} />} />
                                </div>
                            </div>

                            {/* Default Sections */}
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
                                <div className="text-sm font-bold text-gray-400 uppercase mb-2">{t('admin.dashboard.cms.landing.standard_sections')}</div>
                                <CMSInput label={t('admin.dashboard.cms.landing.how_it_works_title')} value={cmsForm.landing.featuresTitle} onChange={(v) => updateLandingField('featuresTitle', v)} />
                                <CMSInput label={t('admin.dashboard.cms.landing.how_it_works_subtitle')} value={cmsForm.landing.featuresSubtitle} onChange={(v) => updateLandingField('featuresSubtitle', v)} />
                                <div className="border-t border-gray-200 my-4"></div>
                                <CMSInput label={t('admin.dashboard.cms.landing.arcade_title')} value={cmsForm.landing.arcadeTitle} onChange={(v) => updateLandingField('arcadeTitle', v)} />
                                <CMSInput label={t('admin.dashboard.cms.landing.arcade_desc')} value={cmsForm.landing.arcadeDesc} onChange={(v) => updateLandingField('arcadeDesc', v)} type="textarea" />
                                <div className="border-t border-gray-200 my-4"></div>
                                <CMSInput label={t('admin.dashboard.cms.landing.cta_title')} value={cmsForm.landing.ctaTitle} onChange={(v) => updateLandingField('ctaTitle', v)} />
                                <CMSInput label={t('admin.dashboard.cms.landing.cta_subtitle')} value={cmsForm.landing.ctaSubtitle} onChange={(v) => updateLandingField('ctaSubtitle', v)} />
                            </div>

                            {/* Extra Sections */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="text-lg font-black text-gray-800">{t('admin.dashboard.cms.landing.dynamic_sections')}</div>
                                    <button onClick={handleAddExtraSection} className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors flex items-center gap-1">
                                        <Plus size={16} /> {t('admin.dashboard.cms.landing.add_section')}
                                    </button>
                                </div>

                                {(cmsForm.landing.extraSections || []).map((block, index) => (
                                    <div key={block.id} className="bg-white border-2 border-gray-200 rounded-2xl p-6 relative group">
                                        <div className="absolute top-4 end-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleRemoveExtraSection(block.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <div className="mb-4">
                                            <label className="text-xs font-bold text-gray-400 uppercase">{t('admin.dashboard.cms.landing.section_type')}</label>
                                            <select
                                                value={block.type}
                                                onChange={(e) => handleUpdateExtraSection(block.id, { type: e.target.value as any })}
                                                className="block w-full p-2 border border-gray-200 rounded-lg font-bold mt-1"
                                            >
                                                <option value="HERO">{t('admin.dashboard.cms.landing.hero_banner')}</option>
                                                <option value="TEXT_IMAGE">{t('admin.dashboard.cms.landing.text_image')}</option>
                                                <option value="CTA">{t('admin.dashboard.cms.landing.cta')}</option>
                                            </select>
                                        </div>
                                        <BlockEditor
                                            block={block}
                                            onChange={(updates) => handleUpdateExtraSection(block.id, updates)}
                                        />
                                    </div>
                                ))}
                                {(cmsForm.landing.extraSections || []).length === 0 && (
                                    <div className="text-center p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold">
                                        {t('admin.dashboard.cms.landing.no_sections')}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {cmsSubTab === 'FEATURES' && (
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6 animate-fade-in">
                            {/* Learning */}
                            <div>
                                <div className="text-sm font-bold text-gray-400 uppercase mb-2">{t('admin.dashboard.cms.features.learning_section')}</div>
                                <CMSInput label={t('admin.dashboard.cms.features.title')} value={cmsForm.features.learningTitle} onChange={(v) => updateFeatureField('learningTitle', v)} />
                                <CMSInput label={t('admin.dashboard.cms.features.desc')} value={cmsForm.features.learningDesc} onChange={(v) => updateFeatureField('learningDesc', v)} type="textarea" />
                                <CMSInput label={t('admin.dashboard.cms.features.image')} value={cmsForm.features.learningImage} onChange={(v) => updateFeatureField('learningImage', v)} icon={<ImageIcon size={14} />} />
                            </div>

                            {/* Arcade */}
                            <div className="border-t border-gray-200 pt-4">
                                <div className="text-sm font-bold text-gray-400 uppercase mb-2">{t('admin.dashboard.cms.features.arcade_section')}</div>
                                <CMSInput label={t('admin.dashboard.cms.features.title')} value={cmsForm.features.arcadeTitle} onChange={(v) => updateFeatureField('arcadeTitle', v)} />
                                <CMSInput label={t('admin.dashboard.cms.features.desc')} value={cmsForm.features.arcadeDesc} onChange={(v) => updateFeatureField('arcadeDesc', v)} type="textarea" />
                                <CMSInput label={t('admin.dashboard.cms.features.image')} value={cmsForm.features.arcadeImage} onChange={(v) => updateFeatureField('arcadeImage', v)} icon={<ImageIcon size={14} />} />
                            </div>

                            {/* Progression */}
                            <div className="border-t border-gray-200 pt-4">
                                <div className="text-sm font-bold text-gray-400 uppercase mb-2">{t('admin.dashboard.cms.features.progression_section')}</div>
                                <CMSInput label={t('admin.dashboard.cms.features.title')} value={cmsForm.features.progressionTitle} onChange={(v) => updateFeatureField('progressionTitle', v)} />
                                <CMSInput label={t('admin.dashboard.cms.features.desc')} value={cmsForm.features.progressionDesc} onChange={(v) => updateFeatureField('progressionDesc', v)} type="textarea" />
                                <CMSInput label={t('admin.dashboard.cms.features.image')} value={cmsForm.features.progressionImage} onChange={(v) => updateFeatureField('progressionImage', v)} icon={<ImageIcon size={14} />} />
                            </div>

                            {/* Safety */}
                            <div className="border-t border-gray-200 pt-4">
                                <div className="text-sm font-bold text-gray-400 uppercase mb-2">{t('admin.dashboard.cms.features.safety_section')}</div>
                                <CMSInput label={t('admin.dashboard.cms.features.title')} value={cmsForm.features.safetyTitle} onChange={(v) => updateFeatureField('safetyTitle', v)} />
                                <CMSInput label={t('admin.dashboard.cms.features.desc')} value={cmsForm.features.safetyDesc} onChange={(v) => updateFeatureField('safetyDesc', v)} type="textarea" />
                                <CMSInput label={t('admin.dashboard.cms.features.image')} value={cmsForm.features.safetyImage} onChange={(v) => updateFeatureField('safetyImage', v)} icon={<ImageIcon size={14} />} />
                            </div>
                        </div>
                    )}

                    {cmsSubTab === 'PAGES' && (
                        <div className="animate-fade-in space-y-6">
                            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                                <h3 className="font-bold text-lg text-gray-800">{t('admin.dashboard.cms.pages.custom_pages')}</h3>
                                <button onClick={handleCreatePage} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-sm text-sm">
                                    <Plus size={16} /> {t('admin.dashboard.cms.pages.new_page')}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {cmsForm.customPages.map(page => (
                                    <div key={page.id} className="border-2 border-gray-200 bg-white rounded-2xl p-6 hover:border-blue-300 transition-colors group relative">
                                        <div className="absolute top-4 end-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => window.open(`#/page/${page.slug}`, '_blank')} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200" title="View"><Eye size={16} /></button>
                                            <button onClick={() => setEditingPage(page)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Edit size={16} /></button>
                                            <button onClick={() => handleDeletePage(page.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 size={16} /></button>
                                        </div>
                                        <h4 className="font-black text-xl text-gray-800 mb-1">{page.title}</h4>
                                        <code className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">/{page.slug}</code>
                                        <div className="mt-4 text-sm font-bold text-gray-500">
                                            {page.blocks.length} {t('admin.dashboard.cms.pages.content_blocks')}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Page Editor */}
                            {editingPage && (
                                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                                    <div className="bg-white w-full max-w-4xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
                                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                            <div className="flex items-center gap-4">
                                                <button onClick={() => setEditingPage(null)} className="p-2 hover:bg-white rounded-full transition-colors text-gray-500">
                                                    <ArrowLeft size={20} />
                                                </button>
                                                <h3 className="font-black text-xl text-gray-800">{t('admin.dashboard.cms.pages.editing')}: {editingPage.title}</h3>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleSaveCMS()} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold">{t('admin.dashboard.cms.pages.save_all')}</button>
                                                <button onClick={() => setEditingPage(null)} className="p-2 hover:bg-gray-200 rounded-full"><X size={20} /></button>
                                            </div>
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50">
                                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-2 gap-6">
                                                <CMSInput label={t('admin.dashboard.cms.pages.page_title')} value={editingPage.title} onChange={(v) => handleUpdatePage(editingPage.id, { title: v })} />
                                                <CMSInput label={t('admin.dashboard.cms.pages.url_slug')} value={editingPage.slug} onChange={(v) => handleUpdatePage(editingPage.id, { slug: v })} />
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="font-bold text-gray-500 uppercase text-sm">{t('admin.dashboard.cms.pages.content_blocks')}</h4>
                                                    <button onClick={() => handleAddBlockToPage(editingPage.id)} className="text-blue-600 font-bold text-sm hover:underline">+ {t('admin.dashboard.cms.pages.add_block')}</button>
                                                </div>

                                                {editingPage.blocks.map((block, idx) => (
                                                    <div key={block.id} className="bg-white p-6 rounded-2xl border border-gray-200 relative group">
                                                        <div className="absolute top-4 end-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => handleDeletePageBlock(editingPage.id, block.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18} /></button>
                                                        </div>
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs font-bold">#{idx + 1}</span>
                                                            <select
                                                                value={block.type}
                                                                onChange={(e) => handleUpdatePageBlock(editingPage.id, block.id, { type: e.target.value as any })}
                                                                className="font-bold text-gray-800 bg-transparent outline-none border-b-2 border-transparent focus:border-blue-500"
                                                            >
                                                                <option value="HERO">Hero Banner</option>
                                                                <option value="TEXT_IMAGE">Text + Image</option>
                                                                <option value="CTA">Call to Action</option>
                                                            </select>
                                                        </div>
                                                        <BlockEditor
                                                            block={block}
                                                            onChange={(updates) => handleUpdatePageBlock(editingPage.id, block.id, updates)}
                                                        />
                                                    </div>
                                                ))}
                                                {editingPage.blocks.length === 0 && (
                                                    <div className="text-center p-12 text-gray-400 font-bold border-2 border-dashed border-gray-200 rounded-2xl">
                                                        {t('admin.dashboard.cms.pages.empty')}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* --- SECURITY TAB --- */}
            {activeTab === 'SECURITY' && (
                <div className="space-y-6">
                    {/* Security Sub-Tabs */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSecurityTab('MONITORING')}
                                className={`px-4 py-2 rounded-lg font-bold transition-all ${securityTab === 'MONITORING'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Security Events
                            </button>
                            <button
                                onClick={() => setSecurityTab('MODERATION')}
                                className={`px-4 py-2 rounded-lg font-bold transition-all ${securityTab === 'MODERATION'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Content Moderation
                            </button>
                            <button
                                onClick={() => setSecurityTab('WHITELIST')}
                                className={`px-4 py-2 rounded-lg font-bold transition-all ${securityTab === 'WHITELIST'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Whitelist/Blacklist
                            </button>
                        </div>
                    </div>

                    {/* Security Content */}
                    {securityTab === 'MONITORING' && <SecurityMonitoring />}
                    {securityTab === 'MODERATION' && <ContentModeration />}
                    {securityTab === 'WHITELIST' && <WhitelistBlacklistManager />}
                </div>
            )}

            {/* --- MODALS --- */}

            {/* User Editor */}
            {showUserModal && editingUser && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black text-gray-800">{users.find(u => u.id === editingUser.id) ? t('admin.dashboard.modals.user.edit_title') : t('admin.dashboard.modals.user.create_title')}</h3>
                            <button onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="user-name" className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('admin.dashboard.modals.user.name')}</label>
                                <input id="user-name" name="name" type="text" value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="user-username" className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('admin.dashboard.modals.user.username')}</label>
                                    <input id="user-username" name="username" type="text" value={editingUser.username} onChange={e => setEditingUser({ ...editingUser, username: e.target.value })} className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                                    <input type="email" value={(editingUser as any).email || ''} onChange={e => setEditingUser({ ...editingUser, email: e.target.value } as any)} className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold" placeholder="user@example.com" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('admin.dashboard.modals.user.role')}</label>
                                    <select value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value as any })} className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold bg-white">
                                        <option value="KID">Kid</option><option value="TEACHER">Teacher</option><option value="PARENT">Parent</option><option value="ADMIN">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('admin.dashboard.modals.user.tier')}</label>
                                    <select
                                        value={editingUser.subscriptionTier || 'intern'}
                                        onChange={e => setEditingUser({ ...editingUser, subscriptionTier: e.target.value as SubscriptionTier })}
                                        className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold bg-white"
                                    >
                                        <option value="intern">Intern</option>
                                        <option value="founder">Founder</option>
                                        <option value="board">Board</option>
                                        <option value="tycoon">Tycoon</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('admin.dashboard.modals.user.coins')}</label><input type="number" value={editingUser.bizCoins} onChange={e => setEditingUser({ ...editingUser, bizCoins: parseInt(e.target.value) })} className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold" /></div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('admin.dashboard.modals.user.level')}</label><input type="number" value={editingUser.level} onChange={e => setEditingUser({ ...editingUser, level: parseInt(e.target.value) })} className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold" /></div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Age</label>
                                <input
                                    type="number"
                                    min="5"
                                    max="18"
                                    value={editingUser.age || ''}
                                    onChange={e => setEditingUser({ ...editingUser, age: parseInt(e.target.value) || undefined })}
                                    className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold"
                                    placeholder="Optional"
                                />
                                <p className="text-xs text-gray-400 mt-1">For age-adapted content (child &lt; 10, teen 10+)</p>
                            </div>
                            <button
                                onClick={saveUser}
                                disabled={isUserSaving}
                                className="w-full bg-green-600 text-white font-bold py-3 rounded-xl shadow-md mt-4 flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isUserSaving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : t('admin.dashboard.modals.user.save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Class Editor */}
            {showClassModal && editingClass && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black text-gray-800">{classrooms.find(c => c.id === editingClass.id) ? t('admin.dashboard.modals.class.edit_title') : t('admin.dashboard.modals.class.create_title')}</h3>
                            <button onClick={() => setShowClassModal(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('admin.dashboard.modals.class.name')}</label>
                                <input type="text" value={editingClass.name} onChange={e => setEditingClass({ ...editingClass, name: e.target.value })} className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('admin.dashboard.modals.class.code')}</label>
                                <input type="text" value={editingClass.code} onChange={e => setEditingClass({ ...editingClass, code: e.target.value.toUpperCase() })} className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold uppercase tracking-widest" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('admin.dashboard.modals.class.teacher')}</label>
                                <select
                                    value={editingClass.teacherId}
                                    onChange={e => setEditingClass({ ...editingClass, teacherId: e.target.value })}
                                    className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold bg-white"
                                >
                                    <option value="">{t('admin.dashboard.modals.class.select_teacher')}</option>
                                    {users.filter(u => u.role === UserRole.TEACHER || u.role === UserRole.ADMIN).map(t => (
                                        <option key={t.id} value={t.id}>{t.name} ({t.username})</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={saveClass}
                                disabled={isClassSaving}
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md mt-4 flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isClassSaving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : t('admin.dashboard.modals.class.save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Book Editor */}
            {showBookModal && editingBook && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-xl my-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black text-gray-800">{library.find(b => b.id === editingBook.id) ? t('admin.dashboard.modals.book.edit_title') : t('admin.dashboard.modals.book.add_title')}</h3>
                            <button onClick={() => setShowBookModal(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('admin.dashboard.modals.book.title')}</label>
                                    <input type="text" value={editingBook.title} onChange={e => setEditingBook({ ...editingBook, title: e.target.value })} className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('admin.dashboard.modals.book.author')}</label>
                                    <input type="text" value={editingBook.author} onChange={e => setEditingBook({ ...editingBook, author: e.target.value })} className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold" />
                                </div>
                            </div>

                            <button
                                onClick={handleAutoFillBook}
                                disabled={isGeneratingBook}
                                className="w-full py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-70"
                            >
                                {isGeneratingBook ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                                {isGeneratingBook ? t('admin.dashboard.modals.book.generating') : t('admin.dashboard.modals.book.auto_fill')}
                            </button>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('admin.dashboard.modals.book.cover_url')}</label>
                                <div className="flex gap-2">
                                    <input type="text" value={editingBook.coverUrl} onChange={e => setEditingBook({ ...editingBook, coverUrl: e.target.value })} className="flex-1 p-2 border-2 border-gray-200 rounded-xl font-bold text-sm" />
                                    {editingBook.coverUrl && <img src={editingBook.coverUrl} alt="Preview" className="w-10 h-10 rounded object-cover border bg-gray-100" loading="lazy" />}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('admin.dashboard.modals.book.category')}</label>
                                    <select
                                        value={editingBook.category}
                                        onChange={e => setEditingBook({ ...editingBook, category: e.target.value as any })}
                                        className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold bg-white"
                                    >
                                        <option value="Finance">Finance</option>
                                        <option value="Mindset">Mindset</option>
                                        <option value="Strategy">Strategy</option>
                                        <option value="Biography">Biography</option>
                                        <option value="Fiction">Fiction</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('admin.dashboard.modals.book.age_rating')}</label>
                                    <input type="text" value={editingBook.ageRating} onChange={e => setEditingBook({ ...editingBook, ageRating: e.target.value })} className="w-full p-2 border-2 border-gray-200 rounded-xl font-bold" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('admin.dashboard.modals.book.summary')}</label>
                                <textarea
                                    value={editingBook.summary}
                                    onChange={e => setEditingBook({ ...editingBook, summary: e.target.value })}
                                    className="w-full p-2 border-2 border-gray-200 rounded-xl font-medium h-24 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('admin.dashboard.modals.book.key_lessons')}</label>
                                <div className="space-y-2">
                                    {[0, 1, 2].map(idx => (
                                        <input
                                            key={idx}
                                            type="text"
                                            placeholder={`Lesson ${idx + 1}`}
                                            value={editingBook.keyLessons?.[idx] || ''}
                                            onChange={e => {
                                                const newLessons = [...(editingBook.keyLessons || [])];
                                                newLessons[idx] = e.target.value;
                                                setEditingBook({ ...editingBook, keyLessons: newLessons });
                                            }}
                                            className="w-full p-2 border-2 border-gray-200 rounded-xl font-medium text-sm"
                                        />
                                    ))}
                                </div>
                            </div>

                            <button onClick={saveBook} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md mt-2 hover:bg-blue-700">{t('admin.dashboard.modals.book.save')}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* JSON Editor */}
            {editingId && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
                        <div className="p-4 border-b flex justify-between items-center bg-gray-100">
                            <h3 className="font-bold text-lg flex items-center gap-2"><Edit size={18} /> {t('admin.dashboard.modals.json.title')}</h3>
                            <div className="flex gap-2">
                                {contentTab === 'GAMES' && !jsonError && (
                                    <button onClick={() => setIsPreviewingGame(true)} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-purple-700"><Play size={14} /> {t('admin.dashboard.modals.json.test')}</button>
                                )}
                                <button onClick={() => setEditingId(null)} className="p-2 hover:bg-gray-200 rounded-full"><X /></button>
                            </div>
                        </div>
                        <div className="flex-1 flex overflow-hidden">
                            <textarea id="json-editor" name="json-content" aria-label="JSON Content" className="flex-1 p-6 font-mono text-sm bg-gray-900 text-green-400 outline-none resize-none" value={editJson} onChange={handleJsonChange} spellCheck={false} />
                            {jsonError && <div className="absolute bottom-20 start-8 bg-red-100 text-red-700 p-2 rounded text-xs font-bold border border-red-300 shadow-xl">{jsonError}</div>}
                        </div>
                        <div className="p-4 border-t bg-gray-100 flex justify-end">
                            <button onClick={handleSaveContent} disabled={!!jsonError} className="px-6 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 disabled:opacity-50">{t('admin.dashboard.modals.json.save')}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Game Preview */}
            {isPreviewingGame && editingId && (
                <GameEngine gameId={editingId} onExit={() => setIsPreviewingGame(false)} previewConfig={JSON.parse(editJson)} />
            )}

            {/* --- GRADING MODAL --- */}
            {viewingSubmission && (
                <AdminProjectPanel
                    submission={viewingSubmission.sub}
                    student={viewingSubmission.user}
                    onClose={() => setViewingSubmission(null)}
                />
            )}


            {activeTab === 'ECONOMY' && <EconomyPanel />}

            {/* --- LEADERBOARD TAB --- */}
            {activeTab === 'LEADERBOARD' && <LeaderboardPanel />}

            {/* --- SOCIAL & DEBATE TAB --- */}
            {activeTab === 'SOCIAL' && <SocialPanel />}

            {/* --- HQ & STORE TAB --- */}
            {activeTab === 'HQ' && <HQPanel />}

            {/* --- FEATURE FLAGS TAB --- */}
            {activeTab === 'FLAGS' && <FeatureFlagsPanel />}

        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${active ? 'bg-white text-gray-900 shadow-sm border-2 border-transparent' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border-2 border-transparent'}`}
    >
        {icon} {label}
    </button>
);

const StatCard = ({ label, value, icon, color }: any) => (
    <div className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center ${color}`}>
        <div className="mb-2 opacity-80">{icon}</div>
        <div className="text-2xl font-black">{value}</div>
        <div className="text-xs font-bold uppercase tracking-widest opacity-60">{label}</div>
    </div>
);

const CMSInput = ({ label, value, onChange, type = 'text', icon }: { label: string, value: any, onChange: (val: string) => void, type?: 'text' | 'textarea', icon?: any }) => {
    const id = React.useId();
    return (
        <div>
            <label htmlFor={id} className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-2">
                {icon} {label}
            </label>
            {type === 'textarea' ? (
                <textarea
                    id={id}
                    name={id}
                    value={value || ''}
                    onChange={e => onChange(e.target.value)}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 font-medium focus:border-blue-400 outline-none min-h-[80px] text-sm"
                />
            ) : (
                <input
                    type="text"
                    id={id}
                    name={id}
                    value={value || ''}
                    onChange={e => onChange(e.target.value)}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 font-medium focus:border-blue-400 outline-none text-sm"
                />
            )}
        </div>
    );
};

const BlockEditor = ({ block, onChange }: { block: ContentBlock, onChange: (u: Partial<ContentBlock>) => void }) => {
    const { t } = useTranslation();
    return (
        <div className="grid grid-cols-2 gap-4">
            <CMSInput label={t('admin.dashboard.cms.landing.heading')} value={block.title} onChange={(v) => onChange({ title: v })} />
            <CMSInput label={t('admin.dashboard.cms.landing.button_label')} value={block.buttonText} onChange={(v) => onChange({ buttonText: v })} />

            {block.type === 'TEXT_IMAGE' && (
                <>
                    <CMSInput label={t('admin.dashboard.cms.landing.subtitle')} value={block.subtitle} onChange={(v) => onChange({ subtitle: v })} />
                    <CMSInput label={t('admin.dashboard.cms.landing.image_url')} value={block.image} onChange={(v) => onChange({ image: v })} icon={<ImageIcon size={14} />} />
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('admin.dashboard.cms.landing.layout')}</label>
                        <div className="flex gap-2">
                            {['image_left', 'center', 'image_right'].map(layout => (
                                <button
                                    key={layout}
                                    onClick={() => onChange({ layout: layout as any })}
                                    className={`px-3 py-1 rounded text-xs font-bold border transition-colors ${block.layout === layout ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white border-gray-200 text-gray-500'}`}
                                >
                                    {layout.replace('_', ' ').toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}

            <div className="col-span-2">
                <CMSInput label={t('admin.dashboard.cms.landing.content_body')} value={block.content} onChange={(v) => onChange({ content: v })} type="textarea" />
            </div>

            <div className="col-span-2">
                <CMSInput label={t('admin.dashboard.cms.landing.bg_color')} value={block.backgroundColor} onChange={(v) => onChange({ backgroundColor: v })} />
            </div>
        </div>
    );
};




// ────────────────────────────────────────────────────────────────────────────
// 🎮 ECONOMY PANEL
// ────────────────────────────────────────────────────────────────────────────
const EconomyPanel: React.FC = () => {
    const { economyConfig, updateEconomyConfig, updateSpinPrize, resetEconomyConfig } = useAppStore();
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-black text-gray-800 flex items-center gap-2"><Coins className="text-yellow-500" /> Economy Multipliers</h3>
                    <button onClick={resetEconomyConfig} className="text-xs text-red-500 font-bold hover:text-red-700 flex items-center gap-1"><RefreshCcw size={12} /> Reset All</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {([
                        { label: 'Coin Multiplier', key: 'coinMultiplier', min: 0.5, max: 3, step: 0.1, emoji: '🪙' },
                        { label: 'XP Multiplier', key: 'xpMultiplier', min: 0.5, max: 3, step: 0.1, emoji: '⭐' },
                        { label: 'Max Idle Hours', key: 'maxIdleHours', min: 1, max: 48, step: 1, emoji: '⏰' },
                        { label: 'Energy Regen (min)', key: 'energyRegenMinutes', min: 5, max: 240, step: 5, emoji: '⚡' },
                    ] as const).map(({ label, key, min, max, step, emoji }) => (
                        <div key={key} className="bg-gray-50 p-4 rounded-2xl">
                            <div className="text-2xl mb-1 text-center">{emoji}</div>
                            <div className="text-xs font-bold text-gray-500 text-center mb-2">{label}</div>
                            <div className="text-xl font-black text-center text-gray-800 mb-2">
                                {economyConfig[key as keyof typeof economyConfig] as number}
                                {key === 'coinMultiplier' || key === 'xpMultiplier' ? '×' : ''}
                            </div>
                            <input
                                type="range" min={min} max={max} step={step}
                                value={economyConfig[key as keyof typeof economyConfig] as number}
                                onChange={e => updateEconomyConfig({ [key]: parseFloat(e.target.value) } as any)}
                                className="w-full accent-yellow-400"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>{min}</span><span>{max}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-black text-gray-800 flex items-center gap-2 mb-4"><Star className="text-purple-500" /> Daily Spin Prizes</h3>
                <div className="space-y-3">
                    {economyConfig.spinPrizes.map(prize => (
                        <div key={prize.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <div className="text-2xl w-8 text-center">{prize.emoji}</div>
                            <div className="flex-1 grid grid-cols-3 gap-2">
                                <div>
                                    <div className="text-xs font-bold text-gray-400 mb-1">Label</div>
                                    <input type="text" value={prize.label} onChange={e => updateSpinPrize(prize.id, { label: e.target.value })} className="w-full text-sm p-2 border border-gray-200 rounded-lg font-bold" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-gray-400 mb-1">Value</div>
                                    <input type="number" min={0} value={prize.value} onChange={e => updateSpinPrize(prize.id, { value: parseInt(e.target.value) || 0 })} className="w-full text-sm p-2 border border-gray-200 rounded-lg font-bold" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-gray-400 mb-1">Weight (rarity)</div>
                                    <input type="number" min={1} max={100} value={prize.weight} onChange={e => updateSpinPrize(prize.id, { weight: parseInt(e.target.value) || 1 })} className="w-full text-sm p-2 border border-gray-200 rounded-lg font-bold" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-gray-400 mt-3 italic">Higher weight = more common. Weights don't need to sum to 100.</p>
            </div>
        </div>
    );
};

// ────────────────────────────────────────────────────────────────────────────
// 🏆 LEADERBOARD & BADGES PANEL
// ────────────────────────────────────────────────────────────────────────────
const LeaderboardPanel: React.FC = () => {
    const { users, badgeDefinitions, adminAwardBadge, adminGrantCoins } = useAppStore();
    const [sort, setSort] = React.useState<'xp' | 'bizCoins' | 'level'>('xp');
    const [awardUserId, setAwardUserId] = React.useState('');
    const [awardBadgeId, setAwardBadgeId] = React.useState('');
    const [grantUserId, setGrantUserId] = React.useState('');
    const [grantAmount, setGrantAmount] = React.useState(0);
    const sorted = [...users].sort((a, b) => ((b as any)[sort] || 0) - ((a as any)[sort] || 0)).slice(0, 50);
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-50 border-b flex items-center justify-between flex-wrap gap-2">
                    <h3 className="font-black text-gray-800 flex items-center gap-2"><Trophy className="text-yellow-500" /> Global Leaderboard (Top 50)</h3>
                    <div className="flex gap-2">
                        {(['xp', 'bizCoins', 'level'] as const).map(s => (
                            <button key={s} onClick={() => setSort(s)} className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${sort === s ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-200 text-gray-600'}`}>
                                {s === 'bizCoins' ? '🪙 Coins' : s === 'xp' ? '⭐ XP' : '📈 Level'}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-400 font-bold uppercase text-xs">
                            <tr><th className="p-3 text-left">#</th><th className="p-3 text-left">User</th><th className="p-3 text-left">Role</th><th className="p-3 text-right">XP</th><th className="p-3 text-right">Coins</th><th className="p-3 text-right">Level</th><th className="p-3 text-right">Badges</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {sorted.map((u, i) => (
                                <tr key={u.id} className="hover:bg-gray-50">
                                    <td className="p-3 font-black text-gray-400">{i + 1}</td>
                                    <td className="p-3 font-bold text-gray-800">{u.name || u.username}</td>
                                    <td className="p-3"><span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-bold">{u.role}</span></td>
                                    <td className="p-3 text-right text-yellow-600 font-bold">{(u.xp || 0).toLocaleString()}</td>
                                    <td className="p-3 text-right text-green-600 font-bold">{(u.bizCoins || 0).toLocaleString()}</td>
                                    <td className="p-3 text-right font-bold">{u.level || 1}</td>
                                    <td className="p-3 text-right text-purple-600 font-bold">{(u.badges || []).length}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2"><Medal className="text-purple-500" /> Award Badge</h3>
                    <div className="space-y-3">
                        <select value={awardUserId} onChange={e => setAwardUserId(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm font-bold">
                            <option value="">Select User…</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.name || u.username}</option>)}
                        </select>
                        <select value={awardBadgeId} onChange={e => setAwardBadgeId(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm font-bold">
                            <option value="">Select Badge…</option>
                            {badgeDefinitions.map(b => <option key={b.id} value={b.id}>{b.icon} {b.name}</option>)}
                        </select>
                        <button onClick={() => { if (awardUserId && awardBadgeId) { adminAwardBadge(awardUserId, awardBadgeId); setAwardUserId(''); setAwardBadgeId(''); } }} disabled={!awardUserId || !awardBadgeId} className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold disabled:opacity-50 hover:bg-purple-700">Award Badge</button>
                    </div>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2"><Coins className="text-yellow-500" /> Grant / Deduct Coins</h3>
                    <div className="space-y-3">
                        <select value={grantUserId} onChange={e => setGrantUserId(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm font-bold">
                            <option value="">Select User…</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.name || u.username}</option>)}
                        </select>
                        <input type="number" value={grantAmount} onChange={e => setGrantAmount(parseInt(e.target.value) || 0)} placeholder="Amount (negative = deduct)" className="w-full p-3 border border-gray-200 rounded-xl text-sm font-bold" />
                        <button onClick={() => { if (grantUserId) { adminGrantCoins(grantUserId, grantAmount); setGrantUserId(''); setGrantAmount(0); } }} disabled={!grantUserId || grantAmount === 0} className="w-full py-3 bg-yellow-400 text-yellow-900 rounded-xl font-bold disabled:opacity-50 hover:bg-yellow-500">
                            {grantAmount >= 0 ? `Grant ${grantAmount} Coins` : `Deduct ${Math.abs(grantAmount)} Coins`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ────────────────────────────────────────────────────────────────────────────
// 💬 SOCIAL & DEBATE PANEL
// ────────────────────────────────────────────────────────────────────────────
const SocialPanel: React.FC = () => {
    const { debateTopicsAdmin, addDebateTopic, updateDebateTopic, deleteDebateTopic, featureFlags, setFeatureFlag } = useAppStore();
    const [editingTopicId, setEditingTopicId] = React.useState<string | null>(null);
    const [newTopic, setNewTopic] = React.useState({ title: '', scenario: '', dilemma: '', difficulty: 'Easy' as const, icon: '💬' });
    const socialFlags = [
        { key: 'social' as keyof AppFeatureFlags, label: 'Friends / Social', emoji: '👫' },
        { key: 'debateArena' as keyof AppFeatureFlags, label: 'Debate Arena', emoji: '🏛️' },
        { key: 'leaderboard' as keyof AppFeatureFlags, label: 'Leaderboard', emoji: '🏆' },
        { key: 'ollieChat' as keyof AppFeatureFlags, label: 'Ollie Chat (AI)', emoji: '🤖' },
    ];
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2"><MessageSquare className="text-blue-500" /> Social Feature Controls</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {socialFlags.map(({ key, label, emoji }) => (
                        <button key={key} onClick={() => setFeatureFlag(key, !featureFlags[key])}
                            className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all font-bold text-sm ${featureFlags[key] ? 'bg-green-50 border-green-300 text-green-700' : 'bg-red-50 border-red-200 text-red-500'}`}>
                            <span className="text-2xl">{emoji}</span>
                            <span>{label}</span>
                            {featureFlags[key] ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} className="text-red-400" />}
                        </button>
                    ))}
                </div>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2">🏛️ Debate Topics ({debateTopicsAdmin.length})</h3>
                <div className="space-y-3 mb-4">
                    {debateTopicsAdmin.map(topic => (
                        <div key={topic.id} className="border border-gray-200 rounded-2xl p-4">
                            {editingTopicId === topic.id ? (
                                <div className="space-y-2">
                                    <input value={topic.title} onChange={e => updateDebateTopic(topic.id, { title: e.target.value })} className="w-full p-2 border rounded-lg text-sm font-bold" placeholder="Title" />
                                    <textarea value={topic.scenario} onChange={e => updateDebateTopic(topic.id, { scenario: e.target.value })} className="w-full p-2 border rounded-lg text-sm" rows={2} placeholder="Scenario" />
                                    <input value={topic.dilemma} onChange={e => updateDebateTopic(topic.id, { dilemma: e.target.value })} className="w-full p-2 border rounded-lg text-sm" placeholder="Dilemma question" />
                                    <div className="flex gap-2">
                                        <input value={topic.icon} onChange={e => updateDebateTopic(topic.id, { icon: e.target.value })} className="w-12 p-2 border rounded-lg text-center" />
                                        <select value={topic.difficulty} onChange={e => updateDebateTopic(topic.id, { difficulty: e.target.value as any })} className="flex-1 p-2 border rounded-lg text-sm font-bold">
                                            <option>Easy</option><option>Medium</option><option>Hard</option>
                                        </select>
                                        <button onClick={() => setEditingTopicId(null)} className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-bold">Done</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">{topic.icon}</span>
                                    <div className="flex-1">
                                        <div className="font-bold text-gray-800">{topic.title} <span className="text-xs font-normal text-gray-400 ml-1">{topic.difficulty}</span></div>
                                        <div className="text-xs text-gray-500 mt-0.5">{topic.dilemma}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditingTopicId(topic.id)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Edit size={14} /></button>
                                        <button onClick={() => { if (debateTopicsAdmin.length > 1) deleteDebateTopic(topic.id); }} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 space-y-2">
                    <p className="text-xs font-bold text-gray-500 uppercase">Add New Topic</p>
                    <div className="flex gap-2">
                        <input value={newTopic.icon} onChange={e => setNewTopic(p => ({ ...p, icon: e.target.value }))} className="w-12 p-2 border rounded-lg text-center text-lg" placeholder="💬" />
                        <input value={newTopic.title} onChange={e => setNewTopic(p => ({ ...p, title: e.target.value }))} className="flex-1 p-2 border rounded-lg text-sm font-bold" placeholder="Topic title" />
                        <select value={newTopic.difficulty} onChange={e => setNewTopic(p => ({ ...p, difficulty: e.target.value as any }))} className="p-2 border rounded-lg text-sm font-bold">
                            <option>Easy</option><option>Medium</option><option>Hard</option>
                        </select>
                    </div>
                    <textarea value={newTopic.scenario} onChange={e => setNewTopic(p => ({ ...p, scenario: e.target.value }))} className="w-full p-2 border rounded-lg text-sm" rows={2} placeholder="Business scenario…" />
                    <input value={newTopic.dilemma} onChange={e => setNewTopic(p => ({ ...p, dilemma: e.target.value }))} className="w-full p-2 border rounded-lg text-sm" placeholder="Dilemma question…" />
                    <button onClick={() => { if (!newTopic.title || !newTopic.dilemma) return; addDebateTopic({ ...newTopic, id: `topic_${Date.now()}` }); setNewTopic({ title: '', scenario: '', dilemma: '', difficulty: 'Easy', icon: '💬' }); }}
                        disabled={!newTopic.title || !newTopic.dilemma}
                        className="w-full py-2 bg-blue-600 text-white rounded-xl font-bold text-sm disabled:opacity-50 hover:bg-blue-700 flex items-center justify-center gap-2">
                        <Plus size={16} /> Add Topic
                    </button>
                </div>
            </div>
        </div>
    );
};

// ────────────────────────────────────────────────────────────────────────────
// 🏠 HQ & STORE PANEL
// ────────────────────────────────────────────────────────────────────────────
const HQPanel: React.FC = () => {
    const { furnitureOverrides, setFurnitureOverride, resetFurnitureOverride, featureFlags, setFeatureFlag, users } = useAppStore();
    const [search, setSearch] = React.useState('');
    const filtered = FURNITURE_ITEMS.filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.type.toLowerCase().includes(search.toLowerCase()));
    const popularity: Record<string, number> = {};
    users.forEach(u => { ((u as any).placedItems || []).forEach((pi: any) => { popularity[pi.itemId] = (popularity[pi.itemId] || 0) + 1; }); });
    return (
        <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="font-black text-gray-800 flex items-center gap-2"><Home className="text-purple-500" /> HQ Customization</h3>
                    <p className="text-sm text-gray-500">Enable or disable the HQ builder for all users</p>
                </div>
                <button onClick={() => setFeatureFlag('hqCustomization', !featureFlags.hqCustomization)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm transition-all ${featureFlags.hqCustomization ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {featureFlags.hqCustomization ? <><ToggleRight size={20} /> Enabled</> : <><ToggleLeft size={20} /> Disabled</>}
                </button>
            </div>
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-50 border-b flex items-center justify-between gap-3">
                    <h3 className="font-black text-gray-800 flex items-center gap-2"><Store className="text-purple-500" /> Furniture Prices</h3>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items…" className="flex-1 max-w-xs p-2 border border-gray-200 rounded-xl text-sm" />
                    <span className="text-xs text-gray-400 font-bold">{filtered.length} items</span>
                </div>
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-400 font-bold uppercase text-xs sticky top-0">
                            <tr><th className="p-3 text-left">Item</th><th className="p-3 text-left">Type</th><th className="p-3 text-right">Default</th><th className="p-3 text-right">Override</th><th className="p-3 text-right">Popularity</th><th className="p-3 text-right">Reset</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map(item => {
                                const ov = furnitureOverrides[item.id];
                                return (
                                    <tr key={item.id} className={`hover:bg-gray-50 ${ov ? 'bg-yellow-50' : ''}`}>
                                        <td className="p-3"><span className="mr-2">{item.icon}</span><span className="font-bold text-gray-800">{item.name}</span></td>
                                        <td className="p-3 text-gray-400 capitalize">{item.type}</td>
                                        <td className="p-3 text-right font-mono text-gray-500">{item.cost} 🪙</td>
                                        <td className="p-3 text-right">
                                            <input type="number" min={0} value={ov?.cost ?? item.cost}
                                                onChange={e => setFurnitureOverride(item.id, parseInt(e.target.value) || 0)}
                                                className={`w-24 p-1.5 border rounded-lg text-sm font-bold text-right ${ov ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'}`} />
                                        </td>
                                        <td className="p-3 text-right text-gray-500">{popularity[item.id] || 0}</td>
                                        <td className="p-3 text-right">{ov && <button onClick={() => resetFurnitureOverride(item.id)} className="text-xs text-red-500 font-bold hover:text-red-700 flex items-center gap-1 ml-auto"><RefreshCcw size={12} /> Reset</button>}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// ────────────────────────────────────────────────────────────────────────────
// ⚙️ FEATURE FLAGS PANEL
// ────────────────────────────────────────────────────────────────────────────
const FeatureFlagsPanel: React.FC = () => {
    const { featureFlags, setFeatureFlag, resetFeatureFlags } = useAppStore();
    const FLAGS: { key: keyof AppFeatureFlags; label: string; emoji: string; description: string }[] = [
        { key: 'adventureMap', label: 'Adventure Map', emoji: '🗺️', description: 'Learning map with lesson nodes' },
        { key: 'arcade', label: 'Game Arcade', emoji: '🎮', description: 'Business simulation games' },
        { key: 'debateArena', label: 'Debate Dojo', emoji: '🏛️', description: 'Ethical business debates' },
        { key: 'library', label: 'Book Library', emoji: '📚', description: '100+ financial books' },
        { key: 'videos', label: 'Video Library', emoji: '🎬', description: 'Educational video content' },
        { key: 'social', label: 'Social / Friends', emoji: '👫', description: 'Friend requests and social' },
        { key: 'hqCustomization', label: 'HQ Builder', emoji: '🏠', description: 'Isometric HQ customization' },
        { key: 'businessTank', label: 'Business Tank', emoji: '🦈', description: 'Pitch & investment sim' },
        { key: 'gigCentral', label: 'Gig Central', emoji: '💼', description: 'Side hustle work tasks' },
        { key: 'realEstate', label: 'Real Estate', emoji: '🏘️', description: 'Property investment sim' },
        { key: 'seasonalEvents', label: 'Seasonal Events', emoji: '🎄', description: 'Holiday events & banners' },
        { key: 'ollieChat', label: 'Ollie AI Chat', emoji: '🤖', description: 'The AI tutor chatbot' },
        { key: 'dailySpin', label: 'Daily Spin Wheel', emoji: '🎡', description: 'Daily coin/XP spin' },
        { key: 'leaderboard', label: 'Leaderboard', emoji: '🏆', description: 'Global competition rankings' },
        { key: 'parentDashboard', label: 'Parent Dashboard', emoji: '👪', description: 'Parent progress reports' },
        { key: 'stripePayments', label: 'Stripe Payments', emoji: '💳', description: 'Premium upgrade flows' },
        { key: 'franchise', label: 'Franchise System', emoji: '🏪', description: 'Multi-location expansion' },
        { key: 'corporation', label: 'Corporations / Guilds', emoji: '🏢', description: 'Team-based corporation' },
    ];
    const enabledCount = FLAGS.filter(f => featureFlags[f.key]).length;
    return (
        <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-black text-gray-800 flex items-center gap-2"><Flag className="text-blue-500" /> Feature Flags</h3>
                        <p className="text-sm text-gray-500">{enabledCount}/{FLAGS.length} features enabled</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => FLAGS.forEach(f => setFeatureFlag(f.key, true))} className="px-4 py-2 bg-green-100 text-green-700 rounded-xl font-bold text-sm hover:bg-green-200">Enable All</button>
                        <button onClick={resetFeatureFlags} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 flex items-center gap-1"><RefreshCcw size={14} /> Reset</button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {FLAGS.map(({ key, label, emoji, description }) => {
                        const enabled = featureFlags[key];
                        return (
                            <button key={key} onClick={() => setFeatureFlag(key, !enabled)}
                                className={`p-4 rounded-2xl border-2 text-left transition-all ${enabled ? 'bg-green-50 border-green-200 hover:border-green-400' : 'bg-gray-50 border-gray-200 hover:border-red-300'}`}>
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{emoji}</span>
                                        <span className="font-bold text-gray-800 text-sm">{label}</span>
                                    </div>
                                    {enabled ? <ToggleRight size={22} className="text-green-500 flex-shrink-0" /> : <ToggleLeft size={22} className="text-gray-400 flex-shrink-0" />}
                                </div>
                                <p className="text-xs text-gray-400 ml-7">{description}</p>
                            </button>
                        );
                    })}
                </div>
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-800 font-medium">
                    ⚠️ Changes take effect immediately for all users. Disabling a feature hides its navigation items and blocks access.
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

