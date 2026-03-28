
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '../../../store';
import { Logger } from '../../../services/logger';
import { useGameSimulation } from '../hooks/useGameSimulation';

import { useEnergy } from '../../../hooks/useEnergy';
import {
  ArrowLeft, Play, TrendingUp, AlertTriangle, Zap, ShoppingCart,
  CheckCircle, Users, BarChart3, Star, RotateCcw, Trash2, Save,
  HelpCircle, ChevronRight, Lock, BatteryWarning
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EnergyBar from './EnergyBar';
import InvestorPitchModal from './InvestorPitchModal';
import PricingTemplate from './game-templates/PricingTemplate';
import AudienceMatcher from './game-templates/AudienceMatcher';
import OperationsTemplate from './game-templates/OperationsTemplate';
import QualityControlTemplate from './game-templates/QualityControlTemplate';
import EthicalDilemmaTemplate from './game-templates/EthicalDilemmaTemplate';
import StockMarketTemplate from './game-templates/StockMarketTemplate';

interface Props {
  gameId: string;
  onExit: () => void;
}

interface DayStats {
  revenue: number;
  expenses: number;
  profit: number;
  customers: number;
  satisfaction: number;
}

interface GameSaveData {
  day: number;
  funds: number;
  upgrades: string[];
  sliderValues: Record<string, number>;
  timestamp: number;
}

const UniversalBusinessGame: React.FC<Props> = ({ gameId, onExit }) => {
  // Access store for live game data
  const { user, games, completeGame, getSkillModifiers } = useAppStore();
  const { consumeEnergy } = useEnergy(); // Hook usage

  // ---------------------------------------------------------
  // SPECIAL GAME TEMPLATES INTERCEPTION
  // ---------------------------------------------------------
  const handleTemplateComplete = (score: number, data: any) => {
    // Basic reward logic for mini-games
    const xpReward = Math.max(10, Math.floor(score / 5)); // Generous XP for mini-games
    completeGame(score, xpReward);
    onExit();
  };

  if (gameId === 'BIZ_PRICING_GAME') {
    return <PricingTemplate onComplete={handleTemplateComplete} />;
  }

  if (gameId === 'BIZ_AUDIENCE_GAME') {
    return <AudienceMatcher onComplete={handleTemplateComplete} />;
  }

  if (gameId === 'BIZ_OPERATIONS_GAME') {
    return <OperationsTemplate onComplete={handleTemplateComplete} />;
  }

  if (gameId === 'BIZ_QUALITY_GAME') {
    return <QualityControlTemplate onComplete={handleTemplateComplete} />;
  }

  if (gameId === 'BIZ_ETHICS_GAME') {
    return <EthicalDilemmaTemplate onComplete={handleTemplateComplete} />;
  }

  if (gameId === 'BIZ_INVEST_GAME') {
    return <StockMarketTemplate onComplete={handleTemplateComplete} />;
  }

  // ---------------------------------------------------------
  // GENERIC BUSINESS SIMULATION LOGIC
  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // GENERIC BUSINESS SIMULATION LOGIC
  // ---------------------------------------------------------
  const gameData = games.find(g => g.business_id === gameId);

  // Use the Simulation Hook
  const {
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
      handleStartDay,
      handleReset,
      buyUpgrade,
      quitGame
    }
  } = useGameSimulation({
    gameId,
    gameData,
    user,
    onExit,
    completeGame,
    getSkillModifiers,
    consumeEnergy
  });

  // Helper to safely render potential objects
  const safeRender = (content: any) => {
    if (typeof content === 'string' || typeof content === 'number') return content;
    return JSON.stringify(content);
  };


  // ============================================================================
  // RENDER
  // ============================================================================

  if (!gameData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400 font-bold">Game not found</p>
      </div>
    );
  }

  // Safe render for funds
  const safeFunds = typeof funds === 'number' ? funds : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] flex flex-col relative border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="bg-gray-900 dark:bg-gray-950 text-white p-4 md:p-6 flex justify-between items-center relative z-20 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onExit}
            className="hover:bg-gray-800 p-2 rounded-full transition-colors"
            aria-label="Exit game"
          >
            <ArrowLeft />
          </button>
          <div>
            <h2 className="text-lg md:text-xl font-black truncate max-w-[150px] md:max-w-none">{gameData.name}</h2>
            <div className="text-xs md:text-sm text-gray-400 font-bold uppercase tracking-wider flex items-center gap-2">
              Day {day}
              <AnimatePresence>
                {isSaving && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-green-400 text-xs flex items-center gap-1"
                  >
                    <Save size={12} /> Saved
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* ENERGY BAR Integration */}
          <EnergyBar />

          <button
            onClick={() => {
              setShowTutorial(true);
              setTutorialStep(0);
            }}
            className="bg-gray-800 hover:bg-gray-700 p-2 rounded-xl text-gray-400 hover:text-white transition-colors"
            title="How to Play"
            aria-label="Show tutorial"
          >
            <HelpCircle size={20} />
          </button>
          <div className="bg-green-600 px-3 py-1 md:px-4 md:py-2 rounded-xl font-mono font-bold text-lg md:text-xl flex items-center gap-2 shadow-inner">
            $ {safeFunds.toLocaleString()}
          </div>
          <button
            onClick={handleReset}
            className="bg-gray-800 hover:bg-red-900 p-2 rounded-xl text-gray-400 hover:text-white transition-colors"
            title="Reset Business"
            aria-label="Reset game"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Paywall Modal */}
      <InvestorPitchModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
      />

      {/* TUTORIAL OVERLAY */}
      <AnimatePresence>
        {showTutorial && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={() => setShowTutorial(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl font-bold w-8 h-8 flex items-center justify-center"
                aria-label="Close tutorial"
              >
                ×
              </button>

              <div className="mb-6 flex justify-center">
                {tutorialStep === 0 && <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full text-4xl">🚀</div>}
                {tutorialStep === 1 && <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-4xl">🎯</div>}
                {tutorialStep === 2 && <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full text-4xl">🛒</div>}
              </div>

              <div className="text-center min-h-[150px]">
                <AnimatePresence mode='wait'>
                  {tutorialStep === 0 && (
                    <motion.div
                      key="step0"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Welcome, CEO!</h3>
                      <p className="text-gray-600 dark:text-gray-300 font-medium mb-4">{gameData.description}</p>
                      <p className="text-sm text-gray-400 font-bold">
                        Your goal is to maximize profit over time.
                      </p>
                    </motion.div>
                  )}
                  {tutorialStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Daily Strategy</h3>
                      <p className="text-gray-600 dark:text-gray-300 font-medium mb-4">
                        Before each day starts, adjust your strategy sliders.
                      </p>
                      <p className="text-sm text-gray-400 font-bold">
                        Find the perfect balance to keep customers happy!
                      </p>
                    </motion.div>
                  )}
                  {tutorialStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Grow Your Biz</h3>
                      <p className="text-gray-600 dark:text-gray-300 font-medium mb-4">
                        Use your profits to buy Upgrades in the Shop.
                      </p>
                      <p className="text-sm text-gray-400 font-bold">
                        Upgrades attract more customers and increase revenue.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${i === tutorialStep ? 'bg-kid-primary' : 'bg-gray-200 dark:bg-gray-600'
                        }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => {
                    if (tutorialStep < 2) {
                      setTutorialStep(s => s + 1);
                    } else {
                      setShowTutorial(false);
                    }
                  }}
                  className="bg-kid-primary text-yellow-900 px-6 py-2 rounded-xl font-black shadow-[0_4px_0_0_rgba(202,138,4,1)] btn-juicy flex items-center gap-2 hover:bg-yellow-400 transition-colors"
                >
                  {tutorialStep === 2 ? "Let's Play!" : "Next"} <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex-1 p-4 md:p-8 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
        {phase === 'STRATEGY' && (
          <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 md:p-6 rounded-2xl border-l-8 border-blue-500 shadow-sm">
              <h3 className="text-blue-800 dark:text-blue-300 font-bold uppercase text-sm mb-2">Objective</h3>
              <p className="text-blue-900 dark:text-blue-100 font-medium text-lg">{gameData.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Inputs */}
              <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-black text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                  <TrendingUp size={20} /> Daily Strategy
                </h3>
                <div className="space-y-6">
                  {gameData.variables?.player_inputs?.map(input => (
                    <div key={String(input)}>
                      <div className="flex justify-between mb-2 font-bold text-gray-600 dark:text-gray-300 text-sm uppercase">
                        {String(input).replace(/_/g, ' ')}
                        {/* Safe render for slider value */}
                        <span>{typeof sliderValues[String(input)] === 'number' ? sliderValues[String(input)] : 50}%</span>
                      </div>
                      <input
                        type="range"
                        className="w-full h-3 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        value={typeof sliderValues[String(input)] === 'number' ? sliderValues[String(input)] : 50}
                        onChange={(e) => setSliderValues({
                          ...sliderValues,
                          [String(input)]: parseInt(e.target.value)
                        })}
                        min="0"
                        max="100"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Upgrades */}
              <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-black text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                  <ShoppingCart size={20} /> Shop
                </h3>
                <div className="space-y-4 max-h-64 md:max-h-96 overflow-y-auto">
                  {gameData.upgrade_tree.map(u => {
                    const isOwned = upgrades.includes(u.id);
                    const canAfford = safeFunds >= u.cost;
                    return (
                      <div
                        key={u.id}
                        className={`p-4 rounded-xl border-2 flex justify-between items-center transition-all ${isOwned
                          ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-100 dark:border-gray-700'
                          }`}
                      >
                        <div className="flex-1 pr-2">
                          <div className="font-bold text-gray-800 dark:text-gray-200 text-sm md:text-base">{safeRender(u.name)}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{safeRender(u.effect)}</div>
                        </div>
                        {isOwned ? (
                          <div className="text-green-600 font-bold flex items-center gap-1 text-sm">
                            <CheckCircle size={16} /> <span className="hidden sm:inline">Owned</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => buyUpgrade(u.id, u.cost)}
                            disabled={!canAfford}
                            className={`px-3 py-2 md:px-4 md:py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${canAfford
                              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                              }`}
                          >
                            ${u.cost}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              onClick={handleStartDay}
              className="w-full bg-kid-primary text-yellow-900 font-black py-4 rounded-2xl shadow-[0_4px_0_0_rgba(202,138,4,1)] btn-juicy text-xl flex items-center justify-center gap-3 hover:bg-yellow-400 transition-colors"
            >
              <Play fill="currentColor" /> Start Day {day} <span className="text-xs font-bold text-yellow-800 opacity-60">(-1 Energy)</span>
            </button>
          </div>
        )}

        {phase === 'SIMULATION' && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
            <h3 className="text-2xl font-bold text-gray-500 dark:text-gray-400 animate-pulse">Simulating Market...</h3>

            <div className="w-full max-w-md bg-gray-200 dark:bg-gray-700 h-6 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
              <motion.div
                className="h-full bg-blue-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="h-20">
              {eventLog && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-6 py-3 rounded-full font-bold border-2 border-yellow-400 dark:border-yellow-600 shadow-sm text-sm md:text-base"
                >
                  <AlertTriangle size={20} /> {eventLog}!
                </motion.div>
              )}
            </div>
          </div>
        )}

        {phase === 'RESULT' && (
          <div className="max-w-2xl mx-auto space-y-8 py-4">
            <div className="text-center">
              <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                Day {day} Report
              </div>
              <h2 className={`text-6xl font-black mb-2 ${dayStats.profit >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                {dayStats.profit >= 0 ? '+' : '-'}${Math.abs(dayStats.profit)}
              </h2>
              <p className="text-gray-500 font-bold">Net Profit</p>
              {activeModifiers && (
                <div className="flex justify-center gap-3 mt-4 flex-wrap">
                  {activeModifiers.priceMultiplier > 1 && (
                    <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Zap size={12} /> Charisma Boost
                    </span>
                  )}
                  {activeModifiers.costMultiplier < 1 && (
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Zap size={12} /> Efficiency Save
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600 dark:text-green-400 mb-2">
                  <TrendingUp size={20} />
                </div>
                <div className="text-sm text-gray-400 font-bold uppercase">Revenue</div>
                <div className="text-2xl font-black text-gray-800 dark:text-white">${dayStats.revenue}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center">
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full text-red-600 dark:text-red-400 mb-2">
                  <BarChart3 size={20} />
                </div>
                <div className="text-sm text-gray-400 font-bold uppercase">Expenses</div>
                <div className="text-2xl font-black text-gray-800 dark:text-white">${dayStats.expenses}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-blue-600 dark:text-blue-400 mb-2">
                  <Users size={20} />
                </div>
                <div className="text-sm text-gray-400 font-bold uppercase">Customers</div>
                <div className="text-2xl font-black text-gray-800 dark:text-white">{dayStats.customers}</div>
              </div>
            </div>

            {/* Customer Satisfaction */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  Customer Satisfaction
                </h3>
                <span className="font-black text-xl text-yellow-500">
                  {dayStats.satisfaction}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-4 rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full transition-all ${dayStats.satisfaction > 70
                    ? 'bg-green-500'
                    : dayStats.satisfaction > 40
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                    }`}
                  style={{ width: `${dayStats.satisfaction}%` }}
                />
              </div>
              <div className="flex justify-center gap-1 text-yellow-400">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    fill={dayStats.satisfaction >= star * 20 ? "currentColor" : "none"}
                    className={dayStats.satisfaction >= star * 20 ? "" : "text-gray-300 dark:text-gray-600"}
                  />
                ))}
              </div>
              <p className="text-center text-sm font-bold text-gray-400 mt-2">
                {dayStats.satisfaction > 80
                  ? "Customers loved it!"
                  : dayStats.satisfaction > 50
                    ? "Customers thought it was okay."
                    : "Customers were unhappy."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={quitGame}
                className="py-4 rounded-xl font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-all"
              >
                Save & Exit
              </button>
              <button
                onClick={handleStartDay}
                className="py-4 bg-kid-secondary text-white rounded-xl font-black shadow-[0_4px_0_0_rgba(21,128,61,1)] btn-juicy flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
              >
                <RotateCcw size={20} /> Next Day
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversalBusinessGame;
