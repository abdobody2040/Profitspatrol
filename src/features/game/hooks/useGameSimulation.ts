
import { useState, useEffect, useRef, useCallback } from 'react';
import { useGamePersistence } from './useGamePersistence';
import { BusinessSimulation, User } from '../../../types';

interface DayStats {
    revenue: number;
    expenses: number;
    profit: number;
    customers: number;
    satisfaction: number;
}

interface UseGameSimulationProps {
    gameId: string;
    gameData: BusinessSimulation | undefined;
    user: User | null;
    onExit: () => void;
    completeGame: (score: number, xpReward: number) => void;
    getSkillModifiers: () => { xpMultiplier: number; costMultiplier: number; priceMultiplier: number };
    consumeEnergy: () => boolean;
}

export const useGameSimulation = ({
    gameId,
    gameData,
    user,
    onExit,
    completeGame,
    getSkillModifiers,
    consumeEnergy
}: UseGameSimulationProps) => {

    // ---------------------------------------------------------
    // PERSISTENCE
    // ---------------------------------------------------------
    const { loadGameData, saveGameData, triggerAutoSave, isSaving } = useGamePersistence({
        gameId,
        user,
        gameData
    });

    // ---------------------------------------------------------
    // STATE
    // ---------------------------------------------------------
    const [day, setDay] = useState(1);
    const [funds, setFunds] = useState(100);
    const [phase, setPhase] = useState<'STRATEGY' | 'SIMULATION' | 'RESULT'>('STRATEGY');
    const [sliderValues, setSliderValues] = useState<Record<string, number>>({});
    const [upgrades, setUpgrades] = useState<string[]>([]);

    // Animation/Transient State
    const [progress, setProgress] = useState(0);
    const [dayStats, setDayStats] = useState<DayStats>({
        revenue: 0,
        expenses: 0,
        profit: 0,
        customers: 0,
        satisfaction: 0
    });
    const [eventLog, setEventLog] = useState<string | null>(null);
    const [activeModifiers, setActiveModifiers] = useState<{
        xpMultiplier: number;
        costMultiplier: number;
        priceMultiplier: number;
    } | null>(null);

    // Tutorial State
    const [showTutorial, setShowTutorial] = useState(false);
    const [tutorialStep, setTutorialStep] = useState(0);

    // Paywall State
    const [showPaywall, setShowPaywall] = useState(false);

    // Refs
    const simulationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ---------------------------------------------------------
    // INITIALIZATION & LOADING
    // ---------------------------------------------------------
    useEffect(() => {
        if (!gameData || !user) return;

        const loaded = loadGameData();

        if (loaded) {
            setDay(loaded.day);
            setFunds(loaded.funds);
            setUpgrades(loaded.upgrades || []);
            setSliderValues(loaded.sliderValues || {});

            const mods = getSkillModifiers();
            setActiveModifiers(mods);
        } else {
            // Initialize with defaults
            const initialSliders: Record<string, number> = {};
            gameData.variables?.player_inputs?.forEach(input => {
                initialSliders[String(input)] = 50;
            });
            setSliderValues(initialSliders);
            setDay(1);
            setFunds(100);
            setUpgrades([]);

            const mods = getSkillModifiers();
            setActiveModifiers(mods);

            // Show tutorial on first load
            setShowTutorial(true);
            setTutorialStep(0);
        }
    }, [gameId, gameData, user, loadGameData, getSkillModifiers]);

    // ---------------------------------------------------------
    // AUTO-SAVE
    // ---------------------------------------------------------
    useEffect(() => {
        if (day === 1 && upgrades.length === 0 && funds === 100) {
            return; // Don't save initial state if untouched
        }

        triggerAutoSave({
            day,
            funds,
            upgrades,
            sliderValues,
            timestamp: Date.now()
        });

    }, [day, funds, upgrades, sliderValues, triggerAutoSave]);


    // ---------------------------------------------------------
    // GAME LOGIC METHODS
    // ---------------------------------------------------------
    const handleReset = useCallback(() => {
        const confirmed = window.confirm(
            "Are you sure you want to reset your business? You will lose all upgrades and money."
        );

        if (!confirmed) return;

        // Reset to defaults
        if (gameData) {
            const initialSliders: Record<string, number> = {};
            gameData.variables?.player_inputs?.forEach(input => {
                initialSliders[String(input)] = 50;
            });
            setSliderValues(initialSliders);
        }

        setDay(1);
        setFunds(100);
        setUpgrades([]);
        setPhase('STRATEGY');
        setShowTutorial(true);
        setTutorialStep(0);

        // Force save the reset state
        saveGameData({
            day: 1,
            funds: 100,
            upgrades: [],
            sliderValues: {}, // Will be re-populated on next render or we should update it now
            timestamp: Date.now()
        });

    }, [gameData, saveGameData]);

    const finishDay = useCallback((
        eventMultiplier: number,
        modifiers: { priceMultiplier: number; costMultiplier: number }
    ) => {
        // Calculate Stats
        const values = Object.values(sliderValues) as number[];
        const avgInput = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 50;
        const upgradeMultiplier = 1 + (upgrades.length * 0.5);

        // Basic Logic
        const qualityFactor = avgInput / 100;
        const satisfactionBase = 60 + (qualityFactor * 40); // 60-100 base
        const satisfaction = Math.min(100, Math.round(satisfactionBase * (eventMultiplier > 1 ? 1.1 : 1.0)));

        const baseCustomers = 20;
        const customers = Math.floor(
            baseCustomers * upgradeMultiplier * eventMultiplier * (satisfaction / 100)
        );

        // Apply Skill Modifiers
        const revenuePerCustomer = (5 + (avgInput * 0.05)) * modifiers.priceMultiplier;
        const expensePerCustomer = 2 + (avgInput * 0.04);

        const revenue = Math.floor(customers * revenuePerCustomer);
        const variableExpenses = Math.floor(customers * expensePerCustomer);
        const fixedExpenses = 10;
        const totalExpenses = Math.floor((variableExpenses + fixedExpenses) * modifiers.costMultiplier);

        const profit = revenue - totalExpenses;

        setDayStats({
            revenue,
            expenses: totalExpenses,
            profit,
            customers,
            satisfaction
        });

        setFunds(prev => Math.max(0, prev + profit)); // Prevent negative funds
        setDay(prev => prev + 1); // Advance day
        setPhase('RESULT');
    }, [sliderValues, upgrades]);

    const startSimulation = useCallback(() => {
        setPhase('SIMULATION');
        setProgress(0);
        setEventLog(null);

        // Refresh modifiers before day start
        const modifiers = getSkillModifiers();
        setActiveModifiers(modifiers);

        // Random Event
        const r = Math.random();
        let eventEffect = 1.0;
        let eventMsg: string | null = null;

        if (gameData) {
            if (r > 0.8) {
                eventMsg = gameData.event_triggers.positive.event_name;
                eventEffect = 1.5;
            } else if (r < 0.2) {
                eventMsg = gameData.event_triggers.negative.event_name;
                eventEffect = 0.5;
            }
        }

        setEventLog(eventMsg);

        // Clear any existing interval
        if (simulationIntervalRef.current) {
            clearInterval(simulationIntervalRef.current);
        }

        // Simulation Animation
        let p = 0;
        simulationIntervalRef.current = setInterval(() => {
            p += 2;
            setProgress(p);

            if (p >= 100) {
                if (simulationIntervalRef.current) {
                    clearInterval(simulationIntervalRef.current);
                    simulationIntervalRef.current = null;
                }
                finishDay(eventEffect, modifiers);
            }
        }, 50);
    }, [gameData, getSkillModifiers, finishDay]);

    const handleStartDay = useCallback(() => {
        // ENERGY CHECK
        const hasEnergy = consumeEnergy();
        if (!hasEnergy) {
            setShowPaywall(true);
            return;
        }

        startSimulation();
    }, [consumeEnergy, startSimulation]);

    const buyUpgrade = useCallback((upgradeId: string, cost: number) => {
        if (funds >= cost && !upgrades.includes(upgradeId)) {
            setFunds(f => f - cost);
            setUpgrades(prev => [...prev, upgradeId]);
        }
    }, [funds, upgrades]);

    const quitGame = useCallback(() => {
        // Save one final time before exiting
        saveGameData({
            day,
            funds,
            upgrades,
            sliderValues,
            timestamp: Date.now()
        });

        // Award XP/Coins based on performance
        const finalScore = Math.max(0, funds);
        const xpReward = Math.max(10, Math.floor(finalScore / 10));

        completeGame(finalScore, xpReward);
        onExit();
    }, [day, funds, upgrades, sliderValues, completeGame, onExit, saveGameData]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (simulationIntervalRef.current) {
                clearInterval(simulationIntervalRef.current);
            }
        };
    }, []);

    return {
        state: {
            day,
            funds,
            phase,
            sliderValues,
            upgrades,
            progress,
            dayStats,
            eventLog,
            activeModifiers,
            showTutorial,
            tutorialStep,
            showPaywall,
            isSaving
        },
        actions: {
            setSliderValues,
            setShowTutorial,
            setTutorialStep,
            setShowPaywall,
            setPhase,
            handleStartDay,
            handleReset,
            buyUpgrade,
            quitGame
        }
    };
};
