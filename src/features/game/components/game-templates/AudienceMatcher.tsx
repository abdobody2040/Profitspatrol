import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShoppingBag, Check, X, Timer } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSound } from '../../../../contexts/SoundContext';

interface AudienceMatcherProps {
    onComplete: (score: number, data: any) => void;
    config?: any;
}

interface Persona {
    id: string;
    name: string;
    icon: string;
    description: string;
    accepts: string[]; // List of product IDs they want
}

interface Product {
    id: string;
    name: string;
    icon: string;
}

const PERSONAS: Persona[] = [
    { id: 'p_teen', name: 'Skater Sam', icon: '🛹', description: 'Loves extreme sports and loud music.', accepts: ['prod_board', 'prod_headphones', 'prod_sneakers'] },
    { id: 'p_mom', name: 'Busy Mom', icon: '👩‍👧‍👦', description: 'Values time-saving and healthy snacks.', accepts: ['prod_blender', 'prod_yoga', 'prod_planner'] },
    { id: 'p_grandma', name: 'Grandma Betty', icon: '👵', description: 'Loves gardening and baking cookies.', accepts: ['prod_wool', 'prod_plants', 'prod_tea'] },
    { id: 'p_tech', name: 'Techie Tom', icon: '👨‍💻', description: 'Always wants the newest gadgets.', accepts: ['prod_drone', 'prod_vr', 'prod_laptop'] },
];

const PRODUCTS: Product[] = [
    { id: 'prod_board', name: 'Pro Skateboard', icon: '🛹' },
    { id: 'prod_tea', name: 'Herbal Tea Set', icon: '🫖' },
    { id: 'prod_drone', name: '4K Drone', icon: '🚁' },
    { id: 'prod_yoga', name: 'Yoga Mat', icon: '🧘' },
    { id: 'prod_headphones', name: 'Bass Headphones', icon: '🎧' },
    { id: 'prod_wool', name: 'Knitting Wool', icon: '🧶' },
    { id: 'prod_vr', name: 'VR Headset', icon: '👓' },
    { id: 'prod_planner', name: 'Family Planner', icon: '📅' },
];

const AudienceMatcher: React.FC<AudienceMatcherProps> = ({ onComplete }) => {
    const { t } = useTranslation();
    const { playSuccess, playError } = useAppSound();

    // Game State
    const [queue, setQueue] = useState<Product[]>(() => [...PRODUCTS].sort(() => 0.5 - Math.random()));
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const [score, setScore] = useState(0);
    const [matches, setMatches] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isGameOver, setIsGameOver] = useState(false);

    // Pick first product on mount or queue change
    useEffect(() => {
        if (!currentProduct && queue.length > 0) {
            setCurrentProduct(queue[0]);
            setQueue(prev => prev.slice(1));
        } else if (!currentProduct && queue.length === 0 && !isGameOver) {
            finishGame();
        }
    }, [queue, currentProduct, isGameOver]);

    // Timer
    useEffect(() => {
        if (isGameOver) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    finishGame();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isGameOver]);

    const finishGame = () => {
        setIsGameOver(true);
        // Calculate final score: Base (Matches * 100) - (Mistakes * 50) + TimeBonus
        const finalScore = Math.max(0, (matches * 100) - (mistakes * 50) + (timeLeft * 2));
        setTimeout(() => {
            onComplete(finalScore, { matches, mistakes });
        }, 2000);
    };

    const handleMatch = (personaId: string) => {
        if (!currentProduct) return;

        const persona = PERSONAS.find(p => p.id === personaId);
        if (persona && persona.accepts.includes(currentProduct.id)) {
            // Correct!
            playSuccess();
            setScore(prev => prev + 100);
            setMatches(prev => prev + 1);
            setCurrentProduct(null); // Triggers next item
        } else {
            // Wrong!
            playError();
            setMistakes(prev => prev + 1);
            setScore(prev => Math.max(0, prev - 50));
            // Shake effect or visual indication could go here
        }
    };

    const checkDrop = (point: { x: number; y: number }) => {
        const elements = document.elementsFromPoint(point.x, point.y);
        const dropTarget = elements.find(el => el.getAttribute('data-persona-id'));

        if (dropTarget) {
            const personaId = dropTarget.getAttribute('data-persona-id');
            if (personaId) handleMatch(personaId);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl max-w-5xl mx-auto border-4 border-purple-500 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                        <ShoppingBag className="text-purple-500" size={32} />
                        Target Audience
                    </h2>
                    <p className="text-gray-500 font-bold">Match the product to the right customer!</p>
                </div>
                <div className="flex gap-4">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xl border-2 ${timeLeft < 10 ? 'bg-red-100 text-red-600 border-red-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        <Timer size={24} /> {timeLeft}s
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-xl font-black text-xl border-2 border-green-200">
                        {score} pts
                    </div>
                </div>
            </div>

            {/* Game Area */}
            <div className="flex-1 flex flex-col items-center justify-between relative">

                {/* Personas (Targets) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                    {PERSONAS.map(persona => (
                        <button
                            key={persona.id}
                            data-persona-id={persona.id}
                            onClick={() => handleMatch(persona.id)}
                            className="bg-gray-50 dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/30 border-2 border-dashed border-gray-300 hover:border-purple-400 rounded-2xl p-4 flex flex-col items-center text-center transition-all group active:scale-95"
                        >
                            <div className="text-5xl mb-2 group-hover:scale-110 transition-transform pointer-events-none">{persona.icon}</div>
                            <h3 className="font-black text-gray-700 dark:text-white pointer-events-none">{persona.name}</h3>
                            <p className="text-xs font-bold text-gray-400 leading-tight mt-1 pointer-events-none">{persona.description}</p>
                        </button>
                    ))}
                </div>

                {/* Current Product (Draggable) */}
                <div className="flex-1 flex items-center justify-center py-8 w-full">
                    <AnimatePresence mode="wait">
                        {currentProduct ? (
                            <motion.div
                                key={currentProduct.id}
                                initial={{ scale: 0, rotate: -10 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, opacity: 0, y: 50 }}
                                className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border-4 border-purple-500 flex flex-col items-center w-64 aspect-square justify-center text-center cursor-grab active:cursor-grabbing z-10 touch-none"
                                drag
                                dragSnapToOrigin
                                dragElastic={0.1}
                                onDragEnd={(_, info) => checkDrop(info.point)}
                                whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
                            >
                                <div className="text-8xl mb-4 drop-shadow-md pointer-events-none">{currentProduct.icon}</div>
                                <h2 className="text-2xl font-black text-gray-800 dark:text-white pointer-events-none">{currentProduct.name}</h2>
                                <p className="text-purple-500 font-bold mt-2 animate-pulse pointer-events-none">Who buys this?</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center"
                            >
                                <h2 className="text-4xl font-black text-purple-500">All Done!</h2>
                                <p className="text-gray-500 font-bold text-xl mt-2">Calculating score...</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Queue Preview */}
                <div className="h-16 w-full bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden flex items-center px-4 gap-2 opacity-50">
                    <span className="text-xs font-bold text-gray-400 uppercase mr-2">Next:</span>
                    {queue.slice(0, 5).map((p, i) => (
                        <div key={i} className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm text-xl border border-gray-200">
                            {p.icon}
                        </div>
                    ))}
                    {queue.length > 5 && <div className="text-xs font-bold text-gray-400">+{queue.length - 5}</div>}
                </div>

            </div>
        </div>
    );
};

export default AudienceMatcher;
