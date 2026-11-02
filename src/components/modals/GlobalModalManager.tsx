import React, { Suspense } from 'react';
import { useAppStore } from '../../store';
import { Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '../../hooks/useIsMobile';

const DailySpinWheel = React.lazy(() => import('../../features/game/components/DailySpinWheel'));
const WeeklyCEOChallenge = React.lazy(() => import('../../features/game/components/CEOChallengeWidget'));
const BizPulseNewsFeed = React.lazy(() => import('../../features/game/components/BizPulseNewsFeed'));
const CorporationHub = React.lazy(() => import('../../features/game/components/CorporationHub'));
const StockMarket = React.lazy(() => import('../../features/game/components/StockMarket'));
const AvatarCustomizer = React.lazy(() => import('../../features/game/components/AvatarCustomizer'));
const SeasonalEvent = React.lazy(() => import('../../features/game/components/SeasonalEvent'));
const ParentReport = React.lazy(() => import('../../features/game/components/ParentReport'));
const DailyMissions = React.lazy(() => import('../../features/education/components/DailyMissions'));

const ModalWrapper = ({ children, onClose, isWide }: { children: React.ReactNode; onClose: () => void; isWide?: boolean }) => {
    const isMobile = useIsMobile();

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center" 
            onClick={onClose}
        >
            <motion.div 
                initial={isMobile ? { y: '100%' } : { scale: 0.9, opacity: 0 }}
                animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1 }}
                exit={isMobile ? { y: '100%' } : { scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className={`
                    bg-white dark:bg-gray-900 shadow-2xl overflow-hidden
                    ${isMobile 
                        ? 'w-full rounded-t-[32px] max-h-[92vh] pb-safe' 
                        : (isWide ? 'rounded-3xl max-w-4xl w-full m-4 max-h-[92vh]' : 'rounded-3xl max-w-lg w-full m-4 max-h-[90vh]')
                    }
                `} 
                onClick={e => e.stopPropagation()}
            >
                {isMobile && (
                    <div className="flex flex-col items-center pt-2">
                        <div className="bottom-sheet-handle" />
                    </div>
                )}

                <div className="relative h-full overflow-y-auto custom-scrollbar p-6">
                    {!isMobile && (
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    )}
                    
                    <Suspense fallback={
                        <div className="flex items-center justify-center p-20">
                            <Loader2 className="animate-spin text-primary-500" size={40} />
                        </div>
                    }>
                        {children}
                    </Suspense>
                </div>
            </motion.div>
        </motion.div>
    );
};

export const GlobalModalManager = () => {
    const { activeModal, closeModal } = useAppStore();

    return (
        <AnimatePresence>
            {activeModal && (
                <ModalWrapper onClose={closeModal} isWide={activeModal === 'avatar'}>
                    {activeModal === 'spin' && <DailySpinWheel onClose={closeModal} />}
                    {activeModal === 'weeklyChallenge' && <WeeklyCEOChallenge onClose={closeModal} />}
                    {activeModal === 'bizPulse' && <BizPulseNewsFeed onClose={closeModal} />}
                    {activeModal === 'corpHub' && <CorporationHub onClose={closeModal} />}
                    {activeModal === 'stockMarket' && <StockMarket onClose={closeModal} />}
                    {activeModal === 'avatar' && <AvatarCustomizer onClose={closeModal} />}
                    {activeModal === 'seasonalEvent' && <SeasonalEvent onClose={closeModal} />}
                    {activeModal === 'parentReport' && <ParentReport onClose={closeModal} />}
                    {activeModal === 'dailyMissions' && <DailyMissions />}
                </ModalWrapper>
            )}
        </AnimatePresence>
    );
};
