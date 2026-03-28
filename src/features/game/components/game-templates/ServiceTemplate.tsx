import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, User, Check, X, Clock } from 'lucide-react';
import { BusinessSimulation, ServiceAction, ServiceCustomerType } from '../../../../types';

// DEFAULT CONFIG (Fallback)
const DEFAULT_ACTIONS: ServiceAction[] = [
    { id: 'act_1', labelKey: 'actions.generic', icon: '🔘', color: '#ccc' }
];

const DEFAULT_CUSTOMERS: ServiceCustomerType[] = [
    { id: 'cust_1', name: 'Customer', possible_requests: [['act_1']] }
];

interface ServiceTemplateProps {
    config?: BusinessSimulation;
    onComplete: (score: number, data: any) => void;
}

interface ActiveCustomer {
    id: string; // Unique instance ID
    typeId: string;
    request: string[]; // required actions
    currentProgress: string[]; // actions done so far
    timeLeft: number;
    spotIndex: number; // 0, 1, 2
}

const ServiceTemplate: React.FC<ServiceTemplateProps> = ({ config, onComplete }) => {
    const { t } = useTranslation();

    // CONFIG
    const actions = config?.service_config?.actions || DEFAULT_ACTIONS;
    const customerTypes = config?.service_config?.customer_types || DEFAULT_CUSTOMERS;
    const themeColors = config?.visual_config?.colors || {
        primary: '#3B82F6', secondary: '#1D4ED8', accent: '#60A5FA', background: '#EFF6FF'
    };

    // GAME STATE
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameTime, setGameTime] = useState(60);
    const [score, setScore] = useState(0);
    const [customers, setCustomers] = useState<ActiveCustomer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

    // LOOP
    useEffect(() => {
        if (!isPlaying) return;

        const loop = setInterval(() => {
            setGameTime(prev => {
                if (prev <= 1) {
                    endGame();
                    return 0;
                }
                return prev - 1;
            });

            // Customer Logic
            setCustomers(prev => {
                // 1. Tick down time
                const updated = prev.map(c => ({ ...c, timeLeft: c.timeLeft - 1 }));

                // 2. Remove expired
                const active = updated.filter(c => c.timeLeft > 0);

                // 3. Spawn new if spots open (Max 3)
                if (active.length < 3 && Math.random() < 0.3) {
                    // Find open spot
                    const occupiedSpots = active.map(c => c.spotIndex);
                    const openSpots = [0, 1, 2].filter(s => !occupiedSpots.includes(s));

                    if (openSpots.length > 0) {
                        const spot = openSpots[0]; // Take first available
                        const type = customerTypes[Math.floor(Math.random() * customerTypes.length)];
                        const request = type.possible_requests[Math.floor(Math.random() * type.possible_requests.length)];

                        active.push({
                            id: Math.random().toString(36).substr(2, 9),
                            typeId: type.id,
                            request,
                            currentProgress: [],
                            timeLeft: 15, // 15 seconds patience
                            spotIndex: spot
                        });
                    }
                }
                return active;
            });

        }, 1000);

        return () => clearInterval(loop);
    }, [isPlaying]);

    useEffect(() => {
        // Auto-select first customer if none selected
        if (isPlaying && !selectedCustomer && customers.length > 0) {
            setSelectedCustomer(customers[0].id);
        }
    }, [customers, selectedCustomer, isPlaying]);

    const startGame = () => {
        setIsPlaying(true);
        setGameTime(60);
        setScore(0);
        setCustomers([]);
        setSelectedCustomer(null);
    };

    const endGame = () => {
        setIsPlaying(false);
        setTimeout(() => {
            onComplete(score, { customersServed: Math.floor(score / 20) });
        }, 1000);
    };

    const handleAction = (actionId: string) => {
        if (!selectedCustomer) return;

        setCustomers(prev => prev.map(c => {
            if (c.id !== selectedCustomer) return c;

            const nextProgress = [...c.currentProgress, actionId];

            // Check if match so far
            const isMatchSoFar = nextProgress.every((a, i) => a === c.request[i]);

            if (!isMatchSoFar) {
                // Mistake! Reset progress or penalty?
                // Let's reset progress for now
                return { ...c, currentProgress: [] };
            }

            // Check completion
            if (nextProgress.length === c.request.length) {
                // Success!
                setScore(s => s + 20 + c.timeLeft); // Bonus for speed
                return { ...c, timeLeft: 0 }; // Mark for removal next tick (or handle immediately)
            }

            return { ...c, currentProgress: nextProgress };
        }).filter(c => c.timeLeft > 0)); // Filter immediately if we want instant 'poof'
    };

    const getActionIcon = (id: string) => actions.find(a => a.id === id)?.icon || '?';

    return (
        <div className="flex flex-col h-full rounded-3xl overflow-hidden border-2 select-none"
            style={{ backgroundColor: themeColors.background, borderColor: themeColors.primary }}
        >
            {/* HUD */}
            <div className="p-4 text-white flex justify-between items-center shadow-md" style={{ backgroundColor: themeColors.primary }}>
                <span className="font-bold text-2xl">${score}</span>
                <span className={`font-mono text-2xl ${gameTime < 10 ? 'animate-pulse text-red-200' : ''}`}>0:{gameTime.toString().padStart(2, '0')}</span>
            </div>

            {/* MAIN AREA */}
            <div className="flex-1 flex flex-col relative">

                {/* START OVERLAY */}
                {!isPlaying && (
                    <div className="absolute inset-0 z-20 bg-black/50 flex items-center justify-center">
                        <button onClick={startGame} className="bg-green-500 text-white px-8 py-4 rounded-2xl font-black text-2xl shadow-xl hover:scale-105 transition-transform">
                            START SHIFT
                        </button>
                    </div>
                )}

                {/* CUSTOMER QUEUE */}
                <div className="flex-1 p-4 grid grid-cols-3 gap-2 items-end pb-8">
                    {[0, 1, 2].map(spotIndex => {
                        const customer = customers.find(c => c.spotIndex === spotIndex);
                        const isSelected = selectedCustomer === customer?.id;

                        return (
                            <div
                                key={spotIndex}
                                className={`h-full relative transition-all duration-300 ${isSelected ? 'scale-105 z-10' : 'scale-100 opacity-90'}`}
                                onClick={() => customer && setSelectedCustomer(customer.id)}
                            >
                                {customer && (
                                    <motion.div
                                        initial={{ y: 50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="absolute bottom-0 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 flex flex-col items-center p-2 overflow-hidden"
                                        style={{ borderColor: isSelected ? themeColors.accent : 'transparent' }}
                                    >
                                        {/* BUBBLE REQUEST */}
                                        <div className="mb-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-2 flex gap-1 min-h-[40px] border border-gray-200">
                                            {customer.request.map((req, i) => (
                                                <div key={i} className={`w-8 h-8 flex items-center justify-center text-lg bg-white rounded shadow-sm opacity-${i < customer.currentProgress.length ? '30' : '100'}`}>
                                                    {i < customer.currentProgress.length ? <Check size={16} className="text-green-500" /> : getActionIcon(req)}
                                                </div>
                                            ))}
                                        </div>

                                        {/* AVATAR */}
                                        <div className="text-6xl mb-2">
                                            {config?.visual_config?.icon || '🙂'}
                                        </div>

                                        {/* TIMER BAR */}
                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full"
                                                style={{ backgroundColor: customer.timeLeft < 5 ? '#EF4444' : themeColors.primary }}
                                                animate={{ width: `${(customer.timeLeft / 15) * 100}%` }}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* ACTION BAR */}
                <div className="bg-white dark:bg-gray-800 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                    <div className="grid grid-cols-5 gap-2">
                        {actions.map(action => (
                            <button
                                key={action.id}
                                onClick={() => handleAction(action.id)}
                                disabled={!isPlaying || !selectedCustomer}
                                className="aspect-square rounded-xl flex flex-col items-center justify-center shadow-sm active:scale-95 transition-transform disabled:opacity-50 disabled:grayscale"
                                style={{ backgroundColor: action.color || '#eee' }}
                            >
                                <span className="text-3xl">{action.icon}</span>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ServiceTemplate;

