
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '../../../../store';
import { BusinessSimulation, VisualConfig } from '../../../../types';
import { Play, TrendingUp, ShoppingCart, CheckCircle, AlertTriangle, Zap, RotateCcw, Save, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logger } from '../../../../services/logger';
import { useTranslation } from 'react-i18next';

interface Props {
    config: BusinessSimulation;
    onExit: () => void;
}

interface GameSaveData {
    day: number;
    funds: number;
    upgrades: string[];
    sliderValues: Record<string, number>;
    timestamp: number;
}

const SimulationTemplate: React.FC<Props> = ({ config, onExit }) => {
    const { user, completeGame, getSkillModifiers } = useAppStore();
    const { t } = useTranslation();
    const gameId = config.business_id;

    const [day, setDay] = useState(1);
    const [funds, setFunds] = useState(100);
    const [phase, setPhase] = useState<'STRATEGY' | 'SIMULATION' | 'RESULT'>('STRATEGY');
    const [sliderValues, setSliderValues] = useState<Record<string, number>>({});
    const [upgrades, setUpgrades] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const [dayStats, setDayStats] = useState<any>({});
    const [eventLog, setEventLog] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ============================================================================
    // SAVE/LOAD SYSTEM
    // ============================================================================

    const getSaveKey = useCallback(() => {
        if (!user || !gameId) return null;
        return `profitspatrol_save_${user.id}_${gameId}`;
    }, [user, gameId]);

    const loadGameData = useCallback(() => {
        const saveKey = getSaveKey();
        if (!saveKey) return false;

        try {
            const savedString = localStorage.getItem(saveKey);
            if (!savedString) return false;

            const saved: GameSaveData = JSON.parse(savedString);

            // Basic validation
            if (typeof saved.day !== 'number' || typeof saved.funds !== 'number') return false;

            setDay(saved.day);
            setFunds(saved.funds);
            setUpgrades(saved.upgrades || []);

            // Restore sliders or fallback to defaults
            const initialSliders: Record<string, number> = {};
            config.variables?.player_inputs?.forEach(input => {
                const key = String(input);
                initialSliders[key] = typeof saved.sliderValues?.[key] === 'number' ? saved.sliderValues[key] : 50;
            });
            setSliderValues(initialSliders);

            return true;
        } catch (error) {
            Logger.error('SimulationTemplate: Failed to load game data from localStorage', error);
            return false;
        }
    }, [getSaveKey, config]);

    const saveGameData = useCallback(() => {
        const saveKey = getSaveKey();
        if (!saveKey) return;

        const stateToSave: GameSaveData = {
            day,
            funds,
            upgrades,
            sliderValues,
            timestamp: Date.now()
        };

        try {
            localStorage.setItem(saveKey, JSON.stringify(stateToSave));
            setIsSaving(true);
            setTimeout(() => setIsSaving(false), 1000);
        } catch (error) {
            // QuotaExceededError is the most common cause — localStorage is full
            Logger.error('SimulationTemplate: Failed to save game data', error);
        }
    }, [day, funds, upgrades, sliderValues, getSaveKey]);

    // INITIALIZE
    useEffect(() => {
        const loaded = loadGameData();
        if (!loaded) {
            // Initialize defaults if no save found
            const initial: any = {};
            config.variables?.player_inputs?.forEach(input => {
                initial[String(input)] = 50;
            });
            setSliderValues(initial);
        }
    }, [config, loadGameData]);

    // AUTO-SAVE on state change (Debounced)
    useEffect(() => {
        // Don't save initial render immediately
        if (day === 1 && funds === 100 && upgrades.length === 0) return;

        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(saveGameData, 1000);

        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, [day, funds, upgrades, sliderValues, saveGameData]);

    const handleReset = () => {
        if (!window.confirm("Restart this business? You will lose all progress.")) return;

        const saveKey = getSaveKey();
        if (saveKey) localStorage.removeItem(saveKey);

        setDay(1);
        setFunds(100);
        setUpgrades([]);
        const initial: any = {};
        config.variables?.player_inputs?.forEach(input => {
            initial[String(input)] = 50;
        });
        setSliderValues(initial);
        setPhase('STRATEGY');
    };

    const handleExit = () => {
        saveGameData(); // Force save
        // Award 20% of final funds as XP, capped reasonably
        const xpReward = Math.min(200, Math.floor(funds * 0.2));
        completeGame(funds, xpReward);
        onExit();
    };

    const startDay = () => {
        setPhase('SIMULATION');
        setProgress(0);

        const modifiers = getSkillModifiers();

        // Event Logic
        const r = Math.random();
        let eventEffect = 1.0;
        let eventName = null;
        if (r > 0.8 && config.event_triggers?.positive) {
            eventEffect = 1.5;
            eventName = config.event_triggers.positive.event_name;
        } else if (r < 0.2 && config.event_triggers?.negative) {
            eventEffect = 0.6;
            eventName = config.event_triggers.negative.event_name;
        }
        setEventLog(eventName);

        let p = 0;
        const interval = setInterval(() => {
            p += 2;
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                finishDay(eventEffect, modifiers);
            }
        }, 50);
    };

    const finishDay = (eventMult: number, mods: any) => {
        // Simplified Tycoon Logic based on config
        const values = Object.values(sliderValues) as number[];
        const avgInput = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 50;

        // Satisfaction Calculation
        // Base satisfaction 60-100 based on input quality
        const qualityFactor = avgInput / 100;
        const satisfactionBase = 60 + (qualityFactor * 40);

        // Event Modifier: Positive boosts, Negative reduces
        // If eventMult > 1 (Positive), boost satisfaction by 10%
        // If eventMult < 1 (Negative), reduce satisfaction by 10%
        const eventSatMod = eventMult > 1 ? 1.1 : (eventMult < 1 ? 0.9 : 1.0);
        const satisfaction = Math.min(100, Math.round(satisfactionBase * eventSatMod));

        // Calculate Revenue/Cost based on "Game Balance"
        const customerBase = 20 * (1 + upgrades.length * 0.2);
        const customers = Math.floor(customerBase * eventMult * (satisfaction / 100));

        // Financials
        // Price Multiplier from Skills affects Revenue per customer
        const revenue = Math.floor(customers * 5 * mods.priceMultiplier);

        // Cost Multiplier from Skills affects Expenses
        const expenses = Math.floor((customers * 2 + 10) * mods.costMultiplier);

        const profit = revenue - expenses;

        setDayStats({ revenue, expenses, profit, customers, satisfaction });
        setFunds(f => Math.max(0, f + profit)); // Prevent negative balance
        setPhase('RESULT');
    };

    const buyUpgrade = (u: any) => {
        if (funds >= u.cost && !upgrades.includes(u.id)) {
            setFunds(f => f - u.cost);
            setUpgrades([...upgrades, u.id]);
        }
    };

    const visual: VisualConfig = config.visual_config || {
        theme: 'light',
        colors: { primary: '#FFC800', secondary: '#F59E0B', accent: '#10B981', background: '#FFF' }
    };

    // Helper to safely render potential objects
    const safeRender = (content: any) => {
        if (typeof content === 'string' || typeof content === 'number') return content;
        return JSON.stringify(content);
    };

    // Safe access to upgrade tree
    const upgradeTree = Array.isArray(config.upgrade_tree) ? config.upgrade_tree : [];

    return (
        <div className="h-full flex flex-col pb-24 md:pb-0" style={{ backgroundColor: visual.colors.background }}>
            {/* HUD */}
            {/* HUD */}
            <div className="text-white p-6 flex justify-between items-center relative z-20 shadow-2xl border-b-4 border-white/10" style={{ backgroundColor: visual.colors.primary }}>
                <div className="flex items-center gap-6">
                    <motion.div
                        animate={{ y: [0, -5, 0], rotate: [0, 2, -2, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <img src="/assets/ollie_head.png" alt="Ollie" className="w-14 h-14 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
                    </motion.div>
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-black tracking-tight text-white uppercase drop-shadow-sm">{t(`games.${config.business_id}.title`, config.name)}</h2>
                        <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-2xl border border-white/10">
                            <span className="text-xs font-black text-white/70 uppercase tracking-widest">{t('sim.day')}</span>
                            <span className="text-2xl font-black text-white leading-none">{day}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 bg-white/20 px-5 py-2.5 rounded-[1.25rem] border-2 border-white/30">
                        <div className="p-1.5 bg-white/20 rounded-lg"><Zap size={16} className="text-white" /></div>
                        <span className="text-2xl font-black text-white">${funds}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <AnimatePresence>
                            {isSaving && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.5 }} 
                                    animate={{ opacity: 1, scale: 1 }} 
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest bg-white/20 px-3 py-1.5 rounded-full border border-white/10"
                                >
                                    <Save size={12} /> {t('common.saved', 'Saved')}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        <button
                            onClick={handleReset}
                            className="text-white/50 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
                            title="Reset Business"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-1 md:p-6">
                <div className="max-w-4xl mx-auto space-y-4 md:space-y-8">

                    {phase === 'STRATEGY' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8">
                            {/* INPUTS */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] shadow-xl border-4 border-gray-50 dark:border-gray-700">
                                <h3 className="font-black text-2xl mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
                                    <div className="p-2 bg-blue-100 rounded-xl"><TrendingUp className="text-blue-600" size={24} /></div>
                                    {t('sim.strategy')}
                                </h3>
                                <div className="space-y-8">
                                    {config.variables?.player_inputs?.map(input => {
                                        const inputKey = String(input);
                                        return (
                                            <div key={inputKey}>
                                                <div className="flex justify-between mb-3 font-black text-gray-800 dark:text-gray-200 text-xs uppercase tracking-[0.2em]">
                                                    {t(['sim.' + inputKey, inputKey.replace(/_/g, ' ')] as any)}
                                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">{sliderValues[inputKey] || 50}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer"
                                                    style={{ accentColor: visual.colors.primary }}
                                                    value={sliderValues[inputKey] || 50}
                                                    onChange={(e) => setSliderValues({
                                                        ...sliderValues,
                                                        [inputKey]: parseInt(e.target.value)
                                                    })}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* UPGRADES */}
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border-4 border-gray-50 dark:border-gray-700 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full opacity-30 -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform"></div>
                                <h3 className="font-black text-2xl mb-6 flex items-center gap-3 text-gray-900 dark:text-white relative z-10">
                                    <div className="p-2 bg-green-100 rounded-xl"><ShoppingCart className="text-green-600" size={24} /></div>
                                    {t('sim.shop')}
                                </h3>
                                <div className="space-y-4 relative z-10">
                                    {upgradeTree.length === 0 && <div className="text-gray-400 font-bold italic">{t('sim.no_upgrades', 'No upgrades available.')}</div>}
                                    {upgradeTree.map(u => {
                                        const isOwned = upgrades.includes(u.id);
                                        return (
                                            <button
                                                key={u.id}
                                                disabled={isOwned || funds < u.cost}
                                                onClick={() => buyUpgrade(u)}
                                                className={`w-full p-5 rounded-3xl border-4 text-start flex justify-between items-center transition-all group/item
                                                ${isOwned
                                                        ? 'bg-green-50 border-green-200 opacity-80'
                                                        : funds >= u.cost
                                                            ? 'bg-white border-gray-100 hover:border-blue-400 hover:scale-[1.02] shadow-sm hover:shadow-md'
                                                            : 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed'}
                                            `}
                                            >
                                                <div>
                                                    <div className="font-black text-lg text-gray-900 dark:text-gray-100">{t(u.nameKey!, u.name)}</div>
                                                    <div className="text-sm font-bold text-gray-500">{t(u.effectKey!, u.effect)}</div>
                                                </div>
                                                {isOwned ? (
                                                    <div className="bg-green-500 text-white p-2 rounded-full shadow-lg"><CheckCircle size={20} strokeWidth={3} /></div>
                                                ) : (
                                                    <div className={`px-4 py-2 rounded-xl font-black text-lg transition-colors ${funds >= u.cost ? 'bg-blue-100 text-blue-700 group-hover/item:bg-blue-600 group-hover/item:text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                        ${u.cost}
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {phase === 'SIMULATION' && (
                        <div className="text-center py-20 bg-white/50 dark:bg-gray-800/50 rounded-[3rem] backdrop-blur-md border-4 border-white/50 shadow-2xl">
                            <h3 className="text-2xl md:text-4xl font-black text-gray-400 animate-pulse mb-8 uppercase tracking-widest">{t('sim.simulating', 'Simulating Day...')}</h3>
                            <div className="max-w-md mx-auto w-full h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-8 border-4 border-white shadow-inner">
                                <motion.div
                                    className="h-full"
                                    style={{ width: `${progress}%`, backgroundColor: visual.colors.primary }}
                                />
                            </div>
                            {eventLog && (
                                <motion.div
                                    initial={{ scale: 0, rotate: -10 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    className="inline-flex flex-col items-center gap-2 bg-yellow-100 text-yellow-800 p-8 rounded-[2rem] border-4 border-yellow-200 shadow-xl"
                                >
                                    <div className="p-4 bg-yellow-400 rounded-2xl text-yellow-950 mb-2"><AlertTriangle size={32} /></div>
                                    <div className="text-3xl font-black uppercase tracking-tight">{t(`games.events.${eventLog}.name`, eventLog)}</div>
                                    <div className="font-bold opacity-70">{t(`games.events.${eventLog}.effect`, '')}</div>
                                </motion.div>
                            )}
                        </div>
                    )}

                    {phase === 'RESULT' && (
                        <div className="text-center py-10 bg-white dark:bg-gray-800 p-12 rounded-[3rem] shadow-2xl border-4 border-gray-50 relative overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.3em] mb-4">{t('sim.report', 'Daily Results')}</h3>
                            <div className={`text-6xl md:text-8xl font-black mb-6 tracking-tighter drop-shadow-md ${dayStats.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {dayStats.profit >= 0 ? '+' : '-'}${Math.abs(dayStats.profit)}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mt-8">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-[2rem] border-2 border-blue-100 dark:border-blue-800">
                                    <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">{t('sim.customers')}</div>
                                    <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{dayStats.customers}</div>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-[2rem] border-2 border-green-100 dark:border-green-800">
                                    <div className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">{t('sim.revenue')}</div>
                                    <div className="text-3xl font-black text-green-600 dark:text-green-400">${dayStats.revenue}</div>
                                </div>
                                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-[2rem] border-2 border-red-100 dark:border-red-800">
                                    <div className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">{t('sim.expenses')}</div>
                                    <div className="text-3xl font-black text-red-600 dark:text-red-400">${dayStats.expenses}</div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700 flex flex-col items-center">
                                <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">{t('sim.satisfaction')}</div>
                                <div className="w-full max-w-sm h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden relative border-2 border-white shadow-inner">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${dayStats.satisfaction}%` }}
                                        className="h-full bg-yellow-400"
                                    />
                                </div>
                                <div className="mt-2 font-black text-yellow-600">{dayStats.satisfaction}%</div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Footer Controls */}
            <div className="p-8 bg-white dark:bg-gray-900 border-t-4 border-gray-50 dark:border-gray-800 flex justify-between items-center relative z-10">
                <button onClick={handleExit} className="font-black text-gray-400 hover:text-red-500 transition-colors px-6 uppercase tracking-[0.2em] text-xs">
                    {t('sim.save_exit', 'Save & Exit')}
                </button>
                {phase === 'STRATEGY' && (
                    <button
                        onClick={startDay}
                        className="bg-yellow-400 text-yellow-950 px-16 py-6 rounded-[2.5rem] font-black shadow-[0_10px_0_0_rgba(202,138,4,1)] btn-juicy text-2xl flex items-center gap-4 transition-all active:translate-y-2 active:shadow-none hover:scale-105"
                    >
                        <Play fill="currentColor" size={28} /> {t('sim.start_day', 'Start Day')}
                    </button>
                )}
                {phase === 'RESULT' && (
                    <button
                        onClick={() => { setDay(d => d + 1); setPhase('STRATEGY'); }}
                        className="bg-green-500 text-white px-16 py-6 rounded-[2.5rem] font-black shadow-[0_10px_0_0_rgba(21,128,61,1)] btn-juicy text-2xl flex items-center gap-4 transition-all active:translate-y-2 active:shadow-none hover:scale-105"
                    >
                        <RotateCcw size={28} /> {t('sim.next_day', 'Next Day')}
                    </button>
                )}
            </div>
        </div>
    );
};

export default SimulationTemplate;
