import React, { useState, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store';
import { BusinessSimulation } from '../../../types';
import { motion } from 'framer-motion';
import { X, Loader2 } from "lucide-react";
import GameTutorialModal from './common/GameTutorialModal';
import GameResultModal from './common/GameResultModal';

// Import Templates
// Lazy Load Templates
const SimulationTemplate = React.lazy(() => import('./game-templates/SimulationTemplate'));
const ClickerTemplate = React.lazy(() => import('./game-templates/ClickerTemplate'));
const SortingTemplate = React.lazy(() => import('./game-templates/SortingTemplate'));
const DrivingTemplate = React.lazy(() => import('./game-templates/DrivingTemplate'));
const MatchingTemplate = React.lazy(() => import('./game-templates/MatchingTemplate'));
const NegotiationBattle = React.lazy(() => import('../../tank/components/NegotiationBattle'));
const PricingTemplate = React.lazy(() => import('./game-templates/PricingTemplate'));
const AudienceMatcher = React.lazy(() => import('./game-templates/AudienceMatcher'));
const QualityControlTemplate = React.lazy(() => import('./game-templates/QualityControlTemplate'));
const EthicalDilemmaTemplate = React.lazy(() => import('./game-templates/EthicalDilemmaTemplate'));
const StockMarketTemplate = React.lazy(() => import('./game-templates/StockMarketTemplate'));
const OperationsTemplate = React.lazy(() => import('./game-templates/OperationsTemplate'));
const ServiceTemplate = React.lazy(() => import('./game-templates/ServiceTemplate'));
const RhythmTemplate = React.lazy(() => import('./game-templates/RhythmTemplate'));
const GridTemplate = React.lazy(() => import('./game-templates/GridTemplate'));
const RepairTemplate = React.lazy(() => import('./game-templates/RepairTemplate'));
const PhysicsTemplate = React.lazy(() => import('./game-templates/PhysicsTemplate'));
const OfficeTemplate = React.lazy(() => import('./game-templates/OfficeTemplate'));
const TimelineTemplate = React.lazy(() => import('./game-templates/TimelineTemplate'));
const TradingTemplate = React.lazy(() => import('./game-templates/TradingTemplate'));
const DefenseTemplate = React.lazy(() => import('./game-templates/DefenseTemplate'));
const StreamerTemplate = React.lazy(() => import('./game-templates/StreamerTemplate'));
const ConveyorTemplate = React.lazy(() => import('./game-templates/ConveyorTemplate'));

interface GameEngineProps {
    gameId: string;
    onExit: () => void;
    previewConfig?: BusinessSimulation; // For Admin Testing
}

const GameEngine: React.FC<GameEngineProps> = ({ gameId, onExit, previewConfig }) => {
    const { games, completeGame } = useAppStore();
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language.startsWith('ar');
    const navigate = useNavigate();
    const [showTutorial, setShowTutorial] = useState(true);

    // Result Modal State
    const [resultOpen, setResultOpen] = useState(false);
    const [lastScore, setLastScore] = useState(0);
    const [lastStars, setLastStars] = useState(0);

    // Use preview config if provided (Admin Mode), otherwise find in store
    const gameConfig = previewConfig || games.find(g => g.business_id === gameId);

    // Force re-render key for replay
    const [gameKey, setGameKey] = useState(0);

    if (!gameConfig) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 relative z-[100]">
                <h2 className="text-2xl font-bold mb-4">Game Not Found</h2>
                <button onClick={onExit} className="bg-gray-800 dark:bg-gray-700 text-white px-6 py-2 rounded-xl font-bold">Exit</button>
            </div>
        );
    }

    const handleGameComplete = (score: number) => {
        // Calculate stars based on score (simplified logic, can be customized per game)
        // Typically base_points * multiplier. Assuming score > 100 is 3 stars for generic games.
        // Or we can pass stars from the game template if they calculate it.
        // For now, let's estimate: 
        const estimatedStars = score > 1000 ? 3 : score > 500 ? 2 : 1;

        setLastScore(score);
        setLastStars(estimatedStars);

        // Save to store
        completeGame(score, Math.floor(score / 10)); // XP = score / 10

        // Show Modal
        setResultOpen(true);
    };

    const handleReplay = () => {
        setResultOpen(false);
        setGameKey(prev => prev + 1); // Remount game
        setShowTutorial(true); // Optionally show tutorial again? Maybe not. Let's keep it false if they want fast replay.
        // Actually, let's keep tutorial OFF for replay for speed
    };

    const getInstructions = (type: string) => {
        // @ts-ignore
        const instructions = t(`instructions.${type}`, { returnObjects: true });
        if (Array.isArray(instructions)) return instructions;

        switch (type) {
            case 'simulation_tycoon':
            case 'office_tower':
            case 'mars_colony':
                return ["Set your strategy sliders before the day starts.", "Buy upgrades to attract more customers.", "Watch out for random daily events!"];

            case 'clicker_idle':
            case 'streamer_sim':
                return ["Tap the screen to earn points/actions.", "Buy upgrades to automate your income.", "Unlock new tiers to scale up!"];

            case 'driving_game':
                return ["Use Arrow Keys (or buttons) to steer.", "Reach the destination before time runs out.", "Avoid traffic and obstacles!"];

            case 'matching_game':
            case 'matching_pattern':
            case 'crafting_game':
                return ["Observe the required pattern or order.", "Select items in the correct sequence.", "Be accurate to earn bonus combos!"];

            case 'rhythm_game':
            case 'action_rhythm':
                return ["Watch for the falling notes/icons.", "Tap exactly when they align with the target.", "Keep the beat to maintain your multiplier!"];

            case 'sorting_game':
            case 'recycle_game':
                return ["Sort items into the correct bins.", "Pay attention to the item types.", "Don't let the conveyor belt overflow!"];

            case 'negotiation_game':
            case 'trading_auction':
            case 'trading_sim':
                return ["Buy low and sell high!", "Negotiate deals to get the best price.", "Don't run out of patience or money!"];

            case 'pricing_game':
                return ["Adjust prices to find the 'Goldilocks' zone.", "Too high = no sales. Too low = no profit.", "Maximize your total revenue!"];

            case 'audience_game':
                return ["Analyze the product features.", "Drag it to the customer persona that fits best.", "Speed and accuracy are key!"];

            case 'quality_control':
            case 'production_conveyor':
                return ["Inspect items on the assembly line.", "Tap defective items to reject them.", "Let perfect items pass through!"];

            case 'narrative_choice':
            case 'ethical_dilemma':
                return ["Read the scenario carefully.", "Make choices that balance Profit vs Reputation.", "Your decisions shape the story!"];

            case 'stock_sim':
                return ["Analyze the market trends.", "Buy shares when they're cheap.", "Sell them when the price peaks!"];

            case 'service_queue':
            case 'cooking_game':
            case 'coffee_game':
                return ["Take customer orders.", "Prepare the item exactly as requested.", "Serve quickly to get a big tip!"];

            case 'puzzle_repair':
            case 'physics_balance':
            case 'battery_game':
                return ["Drag and drop parts to fix the item.", "Match shapes and connectors.", "Ensure everything is secure/balanced!"];

            case 'grid_territory':
                return ["Navigate the grid to cover territory.", "Avoid obstacles and walls.", "Complete the objective before time runs out!"];

            case 'defense_game':
                return ["Defend your base from incoming threats.", "Tap/Click enemies to neutralize them.", "Don't let your health drop to zero!"];

            default: return ["Play and have fun!", "Follow on-screen prompts.", "Score as many points as possible!"];
        }
    };

    // Common Layout Wrapper
    const renderGameContent = () => {
        const props = {
            config: gameConfig,
            onExit: onExit, // Some might use this for explicit abort
            onComplete: (score: number, data?: any) => handleGameComplete(score)
        };

        switch (gameConfig.game_type) {
            case 'simulation_tycoon': return <SimulationTemplate key={gameKey} {...props} />;
            case 'clicker_idle': return <ClickerTemplate key={gameKey} {...props} />;
            case 'sorting_game': return <SortingTemplate key={gameKey} {...props} />;
            case 'driving_game': return <DrivingTemplate key={gameKey} {...props} />;
            case 'matching_game': return <MatchingTemplate key={gameKey} {...props} />;
            case 'rhythm_game': return <RhythmTemplate key={gameKey} {...props} />;
            case 'negotiation_game': return <NegotiationBattle key={gameKey} onExit={onExit} />; // custom prop sig?
            case 'pricing_game': return <PricingTemplate key={gameKey} {...props} />;
            case 'audience_game': return <AudienceMatcher key={gameKey} {...props} />;
            case 'quality_control': return <QualityControlTemplate key={gameKey} {...props} />;
            case 'narrative_choice': return <EthicalDilemmaTemplate key={gameKey} {...props} />;
            case 'stock_sim': return <StockMarketTemplate key={gameKey} {...props} />;
            case 'cooking_game': return <OperationsTemplate key={gameKey} {...props} />;
            case 'service_queue': return <ServiceTemplate key={gameKey} {...props} />;
            case 'action_rhythm': return <RhythmTemplate key={gameKey} {...props} />;
            case 'grid_territory': return <GridTemplate key={gameKey} {...props} />;
            case 'puzzle_repair': return <RepairTemplate key={gameKey} {...props} />;
            case 'production_conveyor': return <ConveyorTemplate key={gameKey} {...props} />;
            case 'recycle_game': return <ConveyorTemplate key={gameKey} {...props} />;
            case 'matching_pattern': return <MatchingTemplate key={gameKey} {...props} />;
            case 'physics_balance': return <PhysicsTemplate key={gameKey} {...props} />;
            case 'office_tower': return <OfficeTemplate key={gameKey} {...props} />;
            case 'timeline_planner': return <TimelineTemplate key={gameKey} {...props} />;
            case 'trading_auction': return <TradingTemplate key={gameKey} {...props} />;
            case 'defense_game': return <DefenseTemplate key={gameKey} {...props} />;
            case 'streamer_sim': return <StreamerTemplate key={gameKey} {...props} />;

            // ... Mapping fallback for legacy types to SimulationTemplate ...
            default:
                return <SimulationTemplate key={gameKey} {...props} />;
        }
    };

    // Helper to get translated texts
    // @ts-ignore
    const gameTitle = (gameConfig.nameKey ? t(gameConfig.nameKey) : gameConfig.name) as string;
    // @ts-ignore
    const gameDesc = (gameConfig.descriptionKey ? t(gameConfig.descriptionKey) : gameConfig.description) as string;

    const getCategoryLabel = (cat: string) => {
        if (cat === 'Retail & Food') return t('arcade.cat_retail');
        if (cat === 'Services & E-Commerce') return t('arcade.cat_service');
        if (cat === 'Production & Manufacturing') return t('arcade.cat_production');
        if (cat === 'Creative & Events') return t('arcade.cat_creative');
        if (cat === 'Digital & Tech') return t('arcade.cat_tech');
        if (cat === 'Social Impact') return t('arcade.cat_social');
        if (cat === 'Tycoon Exclusive') return t('arcade.cat_tycoon');
        if (cat === 'Marketing') return t('arcade.cat_marketing' as any);
        return cat;
    };

    return (
        <div 
            dir={isRTL ? "rtl" : "ltr"}
            className="fixed inset-0 bg-[#FAF8F5] dark:bg-[#070b16] text-slate-800 dark:text-slate-100 z-[100] flex flex-col transition-colors duration-200"
        >
            {/* Tutorial Overlay */}
            {showTutorial && (
                <GameTutorialModal
                    onStart={() => setShowTutorial(false)}
                    title={gameTitle}
                    description={gameDesc}
                    icon={gameConfig.visual_config?.icon}
                    color={gameConfig.visual_config?.colors.primary}
                    instructions={getInstructions(gameConfig.game_type)}
                />
            )}

            {/* Result Modal */}
            <GameResultModal
                isOpen={resultOpen}
                score={lastScore}
                stars={lastStars}
                title={gameTitle}
                onReplay={handleReplay}
                onExit={onExit}
            />

            {/* Global Game Header */}
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b-2 border-amber-200/80 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-sm z-10 shrink-0">
                <div className="flex items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/dashboard')}
                        className="relative group shrink-0 w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-300 dark:border-amber-700 flex items-center justify-center shadow-sm"
                        title={t('nav.overview', 'Dashboard')}
                    >
                        <img 
                            src="/assets/ollie_head.png" 
                            alt="Ollie" 
                            className="w-7 h-7 object-contain drop-shadow-sm" 
                        />
                    </motion.button>
                    <button
                        onClick={onExit}
                        className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border-2 border-red-200 dark:border-red-900/50 text-red-500 dark:text-red-400 shadow-[0_3px_0_#fca5a5] dark:shadow-[0_3px_0_#7f1d1d] hover:bg-red-50 dark:hover:bg-red-950/30 active:translate-y-1 active:shadow-none flex items-center justify-center transition-all cursor-pointer shrink-0"
                        title={t('games.exit', 'Exit')}
                    >
                        <X size={18} />
                    </button>
                    <div>
                        <h1 className="font-black text-base sm:text-lg text-slate-900 dark:text-white leading-tight">{gameTitle}</h1>
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-300/60 dark:border-amber-800/60 inline-block mt-0.5">
                            {getCategoryLabel(gameConfig.category)}
                        </span>
                    </div>
                </div>
                <button 
                    onClick={() => setShowTutorial(true)} 
                    className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-slate-800 border-2 border-amber-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 text-xs font-black text-amber-900 dark:text-amber-200 shadow-[0_2px_0_#fde68a] dark:shadow-[0_2px_0_#1e293b] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
                >
                    <span className="text-amber-600 font-black">?</span>
                    <span>{t('nav.help', isRTL ? 'مساعدة' : 'Help')}</span>
                </button>
            </div>

            <div className="flex-1 overflow-auto bg-[#FAF8F5] dark:bg-[#070b16] p-2 sm:p-4 flex flex-col items-center justify-center relative">
                <Suspense fallback={
                    <div className="flex flex-col items-center justify-center h-full text-amber-600 dark:text-amber-400">
                        <Loader2 className="animate-spin mb-2" size={48} />
                        <p className="font-bold">{t('common.loading', 'Loading...')}</p>
                    </div>
                }>
                    {renderGameContent()}
                </Suspense>
            </div>
        </div>
    );
};

export default GameEngine;
