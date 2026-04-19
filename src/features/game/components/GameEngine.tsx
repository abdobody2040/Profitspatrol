import React, { useState, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../../store';
import { BusinessSimulation } from '../../../types';
import { motion } from 'framer-motion';
import { ArrowLeft, X, Loader2 } from 'lucide-react';
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

interface GameEngineProps {
    gameId: string;
    onExit: () => void;
    previewConfig?: BusinessSimulation; // For Admin Testing
}

const GameEngine: React.FC<GameEngineProps> = ({ gameId, onExit, previewConfig }) => {
    const { games, completeGame } = useAppStore();
    const { t } = useTranslation();
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
            case 'production_conveyor': return <QualityControlTemplate key={gameKey} {...props} />;
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

    return (
        <div className="fixed inset-0 bg-gray-900 z-[100] flex flex-col">
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
            <div className="bg-gray-800 p-4 flex items-center justify-between shadow-md z-10 shrink-0">
                <div className="flex items-center gap-4 text-white">
                    <button
                        onClick={onExit}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-sm shrink-0"
                    >
                        <X size={20} />
                    </button>
                    <div>
                        <h1 className="font-black text-lg">{gameConfig.name}</h1>
                        <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">{gameConfig.category}</div>
                    </div>
                </div>
                <button onClick={() => setShowTutorial(true)} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs font-bold text-gray-300">
                    ? Help
                </button>
            </div>

            <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900 relative">
                <Suspense fallback={
                    <div className="flex flex-col items-center justify-center h-full text-white">
                        <Loader2 className="animate-spin mb-2" size={48} />
                        <p className="font-bold">Loading Game Engine...</p>
                    </div>
                }>
                    {renderGameContent()}
                </Suspense>
            </div>
        </div>
    );
};

export default GameEngine;
