
import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { CMSContent } from '../../types';

const DEFAULT_CMS_CONTENT: CMSContent = {
    landing: {
        heroTitle: "Don't just play games.\nBuild an Empire.",
        heroSubtitle: "Profits Patrol turns screen time into real-world business skills. Learn finance, leadership, and marketing through addictive mini-games.",
        heroCta: "Play Now - It's Free!",
        heroImage: "/images/hero/hero.jpg",
        featuresTitle: "How KidCap Works",
        featuresSubtitle: "We use a simple loop to make learning sticky and addictive.",
        arcadeTitle: "Real Business Simulations",
        arcadeDesc: "Kids don't just read about business; they run them. Our simulation engine adapts to their skill level, teaching supply & demand, profit margins, and customer service in real-time.",
        ctaTitle: "Ready to launch your startup?",
        ctaSubtitle: "Join for free today. No credit card required.",
        extraSections: []
    },
    features: {
        learningTitle: "Interactive Learning Engine",
        learningDesc: "Start with our Core Lessons as an Intern (Free), or unlock the full advanced curriculum including AI & Blockchain as a Founder.",
        learningImage: "/images/features/learning.jpg",
        arcadeTitle: "Business Arcade",
        arcadeDesc: "Launch your first business for free. Upgrade to Founder to run 3 simultaneous startups with Unlimited Energy and no ads.",
        arcadeImage: "/images/features/arcade.jpg",
        progressionTitle: "RPG Progression",
        progressionDesc: "Level up from a Garage Intern to a Global Tycoon. Subscribers get exclusive Custom HQs, rare skins, and faster leveling.",
        progressionImage: "/images/features/progression.jpg",
        safetyTitle: "Safe & Secure",
        safetyDesc: "The 'Board Member' family plan gives parents a dedicate dashboard to manage up to 5 child accounts with full oversight.",
        safetyImage: "/images/features/safety.jpg"
    },
    customPages: []
};

export type GlobalModalType = 'spin' | 'weeklyChallenge' | 'bizPulse' | 'corpHub' | 'stockMarket' | 'avatar' | 'seasonalEvent' | 'parentReport' | null;

export interface UiSlice {
    cmsContent: CMSContent;
    isAdminMode: boolean;
    showLevelUpModal: boolean;
    levelUpData: { level: number, xp: number } | null;
    showCertificateId: string | null;
    activeModal: GlobalModalType;

    updateCMSContent: (updates: Partial<CMSContent>) => void;
    toggleAdminMode: () => void;
    closeLevelUpModal: () => void;
    setShowCertificateId: (id: string | null) => void;
    openModal: (modal: GlobalModalType) => void;
    closeModal: () => void;
}

export const createUiSlice: StateCreator<AppState, [], [], UiSlice> = (set, get) => ({
    cmsContent: DEFAULT_CMS_CONTENT,
    isAdminMode: false,
    showLevelUpModal: false,
    levelUpData: null,
    showCertificateId: null,
    activeModal: null,

    updateCMSContent: (updates) => set((state) => {
        // ✅ SECURITY FIX: Only ADMIN can edit CMS content.
        // Without this guard, any user can overwrite landing page hero text
        // visible to all users (stored in Zustand/localStorage).
        if (state.user?.role !== 'ADMIN') return {};
        return { cmsContent: { ...state.cmsContent, ...updates } };
    }),

    toggleAdminMode: () => set((state) => ({ isAdminMode: !state.isAdminMode })),

    closeLevelUpModal: () => set({ showLevelUpModal: false, levelUpData: null }),

    setShowCertificateId: (id) => set({ showCertificateId: id }),
    
    openModal: (modal) => set({ activeModal: modal }),
    closeModal: () => set({ activeModal: null })
});
