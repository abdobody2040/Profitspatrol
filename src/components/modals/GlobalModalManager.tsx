import React, { Suspense } from 'react';
import { useAppStore } from '../../store';
import { Loader2 } from 'lucide-react';

const DailySpinWheel = React.lazy(() => import('../../features/game/components/DailySpinWheel'));
const WeeklyCEOChallenge = React.lazy(() => import('../../features/game/components/CEOChallengeWidget'));
const BizPulseNewsFeed = React.lazy(() => import('../../features/game/components/BizPulseNewsFeed'));
const CorporationHub = React.lazy(() => import('../../features/game/components/CorporationHub'));
const StockMarket = React.lazy(() => import('../../features/game/components/StockMarket'));
const AvatarCustomizer = React.lazy(() => import('../../features/game/components/AvatarCustomizer'));
const SeasonalEvent = React.lazy(() => import('../../features/game/components/SeasonalEvent'));
const ParentReport = React.lazy(() => import('../../features/game/components/ParentReport'));

const ModalWrapper = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
    <div 
        className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" 
        onClick={onClose}
    >
        <div 
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 max-w-sm w-full mx-auto max-h-[90vh] overflow-y-auto" 
            onClick={e => e.stopPropagation()}
        >
            <Suspense fallback={<div className="flex items-center justify-center p-10"><Loader2 className="animate-spin" size={32} /></div>}>
                {children}
            </Suspense>
        </div>
    </div>
);

export const GlobalModalManager = () => {
    const { activeModal, closeModal } = useAppStore();

    if (!activeModal) return null;

    return (
        <ModalWrapper onClose={closeModal}>
            {activeModal === 'spin' && <DailySpinWheel onClose={closeModal} />}
            {activeModal === 'weeklyChallenge' && <WeeklyCEOChallenge onClose={closeModal} />}
            {activeModal === 'bizPulse' && <BizPulseNewsFeed onClose={closeModal} />}
            {activeModal === 'corpHub' && <CorporationHub onClose={closeModal} />}
            {activeModal === 'stockMarket' && <StockMarket onClose={closeModal} />}
            {activeModal === 'avatar' && <AvatarCustomizer onClose={closeModal} />}
            {activeModal === 'seasonalEvent' && <SeasonalEvent onClose={closeModal} />}
            {activeModal === 'parentReport' && <ParentReport onClose={closeModal} />}
        </ModalWrapper>
    );
};
