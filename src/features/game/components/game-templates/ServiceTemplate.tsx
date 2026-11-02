import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, Star } from "lucide-react";
import { BusinessSimulation, ServiceAction, ServiceCustomerType } from '../../../../types';
import OllieBubble from '../../../../components/OllieBubble';
import { useOllieCommentary } from '../../../../hooks/useOllieCommentary';

const DEFAULT_ACTIONS: ServiceAction[] = [
  { id: 'act_1', labelKey: 'actions.generic', icon: '🔘', color: '#ccc' },
];
const DEFAULT_CUSTOMERS: ServiceCustomerType[] = [
  { id: 'cust_1', name: 'Customer', possible_requests: [['act_1']] },
];

interface ServiceTemplateProps {
  config?: BusinessSimulation;
  onComplete: (score: number, data: any) => void;
}

interface ActiveCustomer {
  id: string;
  typeId: string;
  request: string[];
  currentProgress: string[];
  timeLeft: number;
  maxTime: number;
  spotIndex: number;
  isVIP: boolean;
  avatar: string;
  tip: number;
}

const AVATARS = ['😊', '🧑', '👩', '🧔', '👴', '👵', '🧒', '🤵', '👩‍💼', '🧑‍🎓'];
const VIP_CHANCE = 0.12;
const GAME_DURATION = 90;

const ServiceTemplate: React.FC<ServiceTemplateProps> = ({ config, onComplete }) => {
  const { t } = useTranslation();
  const { currentMessage, isVisible, trigger, dismiss } = useOllieCommentary();

  const actions = config?.service_config?.actions || DEFAULT_ACTIONS;
  const customerTypes = config?.service_config?.customer_types || DEFAULT_CUSTOMERS;
  const themeColors = config?.visual_config?.colors || {
    primary: '#3B82F6', secondary: '#1D4ED8', accent: '#60A5FA', background: '#EFF6FF',
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [gameTime, setGameTime] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [customers, setCustomers] = useState<ActiveCustomer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [customersServed, setCustomersServed] = useState(0);
  const [customersLost, setCustomersLost] = useState(0);
  const [vipServed, setVipServed] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedbackText, setFeedbackText] = useState<{ text: string; color: string } | null>(null);
  const [combo, setCombo] = useState(0);
  const [badReviewFlash, setBadReviewFlash] = useState<string | null>(null);
  const [goodReviewFlash, setGoodReviewFlash] = useState<string | null>(null);

  const BAD_REVIEWS = [
    "😤 'Worst service ever. 1 star!'",
    "💀 'I waited so long I aged 10 years!'",
    "🌧️ 'My patience, like my coffee, ran cold.'",
    "😡 'I'm never coming back. My dog is a better manager.'",
  ];
  const GOOD_REVIEWS = [
    "⭐⭐⭐⭐⭐ 'Absolute perfection!'",
    "🎉 'My new favourite spot!'",
    "💯 'Faster than my Wi-Fi!'",
    "🏆 'This crew is elite!'",
  ];
  const VIP_NAMES = ['Mr. Moneybags 💎', 'CEO Karen 👑', 'The Influencer 📱', 'Professor Rich 🎓'];

  const spawnCustomer = useCallback(() => {
    setCustomers(prev => {
      if (prev.length >= 3) return prev;
      const occupied = prev.map(c => c.spotIndex);
      const open = [0, 1, 2].filter(s => !occupied.includes(s));
      if (open.length === 0 || Math.random() > 0.35) return prev;

      const spot = open[0];
      const type = customerTypes[Math.floor(Math.random() * customerTypes.length)];
      const request = type.possible_requests[Math.floor(Math.random() * type.possible_requests.length)];
      const isVIP = Math.random() < VIP_CHANCE;
      const patience = isVIP ? 20 : 12 + Math.floor(Math.random() * 8);

      return [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        typeId: type.id,
        request,
        currentProgress: [],
        timeLeft: patience,
        maxTime: patience,
        spotIndex: spot,
        isVIP,
        avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
        tip: isVIP ? 30 + Math.floor(Math.random() * 50) : Math.floor(Math.random() * 10),
      }];
    });
  }, [customerTypes]);

  const showFeedback = (text: string, color: string) => {
    setFeedbackText({ text, color });
    setTimeout(() => setFeedbackText(null), 1200);
  };

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setShowResult(true);
    setTimeout(() => {
      onComplete(score, { customersServed, customersLost, vipServed });
    }, 500);
    if (customersServed > 8) trigger('game_over_win');
    else trigger('game_over_lose');
  }, [score, customersServed, customersLost, vipServed, onComplete, trigger]);

  // Main game loop
  useEffect(() => {
    if (!isPlaying) return;
    const loop = setInterval(() => {
      setGameTime(prev => {
        if (prev <= 1) { endGame(); return 0; }
        return prev - 1;
      });
      spawnCustomer();
      setCustomers(prev => {
        const updated = prev.map(c => ({ ...c, timeLeft: c.timeLeft - 1 }));
        const timedOut = updated.filter(c => c.timeLeft <= 0);
        if (timedOut.length > 0) {
          setCustomersLost(n => n + timedOut.length);
          setCombo(0);
          const review = BAD_REVIEWS[Math.floor(Math.random() * BAD_REVIEWS.length)];
          setBadReviewFlash(review);
          setTimeout(() => setBadReviewFlash(null), 2500);
          if (timedOut.some(c => c.isVIP)) trigger('bad_decision');
        }
        return updated.filter(c => c.timeLeft > 0);
      });
    }, 1000);
    return () => clearInterval(loop);
  }, [isPlaying, spawnCustomer, endGame]);

  // Auto-select
  useEffect(() => {
    if (isPlaying && !selectedCustomer && customers.length > 0) {
      setSelectedCustomer(customers[0].id);
    }
  }, [customers, selectedCustomer, isPlaying]);

  const startGame = () => {
    setIsPlaying(true);
    setGameTime(GAME_DURATION);
    setScore(0);
    setCustomers([]);
    setSelectedCustomer(null);
    setCustomersServed(0);
    setCustomersLost(0);
    setVipServed(0);
    setShowResult(false);
    setCombo(0);
    trigger('game_start');
  };

  const handleAction = (actionId: string) => {
    if (!selectedCustomer) return;
    setCustomers(prev => {
      const updated = prev.map(c => {
        if (c.id !== selectedCustomer) return c;
        const nextProgress = [...c.currentProgress, actionId];
        const isMatchSoFar = nextProgress.every((a, i) => a === c.request[i]);
        if (!isMatchSoFar) {
          showFeedback('❌ Wrong! Try again!', '#EF4444');
          return { ...c, currentProgress: [] };
        }
        if (nextProgress.length === c.request.length) {
          // Served!
          const newCombo = combo + 1;
          const speedBonus = c.timeLeft * 2;
          const vipBonus = c.isVIP ? c.tip : 0;
          const total = 20 + speedBonus + vipBonus;
          setScore(s => s + total);
          setCombo(newCombo);
          setCustomersServed(n => n + 1);
          if (c.isVIP) setVipServed(n => n + 1);

          const review = GOOD_REVIEWS[Math.floor(Math.random() * GOOD_REVIEWS.length)];
          setGoodReviewFlash(review);
          setTimeout(() => setGoodReviewFlash(null), 2000);
          showFeedback(c.isVIP ? `VIP! +${total} 💎` : `+${total}`, '#22C55E');

          if (newCombo === 3) trigger('streak_3');
          if (newCombo === 5) trigger('streak_5');
          if (newCombo >= 7) trigger('streak_7');

          return { ...c, timeLeft: 0 };
        }
        return { ...c, currentProgress: nextProgress };
      });
      return updated.filter(c => c.timeLeft > 0);
    });
  };

  const getActionIcon = (id: string) => actions.find(a => a.id === id)?.icon || '?';
  const activeCustomer = customers.find(c => c.id === selectedCustomer);

  return (
    <div className="flex flex-col h-full rounded-xl md:rounded-3xl overflow-hidden border-2 select-none relative"
      style={{ backgroundColor: themeColors.background, borderColor: themeColors.primary }}
    >
      <OllieBubble message={currentMessage} isVisible={isVisible} onDismiss={dismiss} position="top-right" />

      {/* HUD */}
      <div className="p-3 text-white flex justify-between items-center shadow-md shrink-0" style={{ backgroundColor: themeColors.primary }}>
        <div className="flex flex-col">
          <span className="text-xl font-black">${score}</span>
          {combo > 1 && (
            <motion.span key={combo} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="text-xs font-black text-yellow-300">
              🔥 x{combo} COMBO
            </motion.span>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1"><span className="text-green-300">✓</span> {customersServed}</div>
          <div className="flex items-center gap-1"><span className="text-red-300">✗</span> {customersLost}</div>
          {vipServed > 0 && <div className="flex items-center gap-1"><span>💎</span> {vipServed}</div>}
        </div>

        <span className={`font-mono text-xl font-black ${gameTime < 15 ? 'text-red-200 animate-pulse' : ''}`}>
          {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}
        </span>
      </div>

      {/* Review Flash */}
      <AnimatePresence>
        {badReviewFlash && (
          <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }}
            className="bg-red-100 text-red-700 text-xs font-bold px-3 py-2 text-center border-b border-red-200 shrink-0">
            {badReviewFlash}
          </motion.div>
        )}
        {goodReviewFlash && (
          <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }}
            className="bg-green-100 text-green-700 text-xs font-bold px-3 py-2 text-center border-b border-green-200 shrink-0">
            {goodReviewFlash}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback flash */}
      <AnimatePresence>
        {feedbackText && (
          <motion.div initial={{ opacity: 1, scale: 1 }} animate={{ opacity: 0, y: -30, scale: 1.2 }} transition={{ duration: 0.8 }}
            className="absolute top-24 left-0 right-0 flex justify-center z-30 pointer-events-none">
            <span className="font-black text-xl" style={{ color: feedbackText.color }}>{feedbackText.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* START OVERLAY */}
        {!isPlaying && !showResult && (
          <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-xs w-full text-center shadow-2xl">
              <div className="text-5xl mb-3">{config?.visual_config?.icon || '🧑‍🍳'}</div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{config?.name || 'Service Challenge'}</h2>
              <p className="text-gray-500 text-sm mb-3">Serve customers in order before their patience runs out!</p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded-xl p-3 mb-5 text-sm text-left">
                <p className="font-bold text-yellow-800 dark:text-yellow-300">💎 VIP Customers pay BIG tips!</p>
                <p className="text-yellow-700 dark:text-yellow-400 text-xs mt-1">But they have 7 extra needs. Don't let them leave!</p>
              </div>
              <button onClick={startGame} className="w-full bg-green-500 text-white py-4 rounded-2xl font-black text-lg shadow-[0_4px_0_0_rgba(21,128,61,1)] hover:bg-green-600 active:translate-y-1 active:shadow-none transition-all">
                Open for Business!
              </button>
            </motion.div>
          </div>
        )}

        {/* RESULT OVERLAY */}
        {showResult && (
          <div className="absolute inset-0 z-20 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-xs w-full text-center shadow-2xl">
              <div className="text-5xl mb-2">{score > 300 ? '🏆' : score > 150 ? '⭐' : '💪'}</div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Shift Complete!</h2>
              <div className="text-4xl font-black text-green-600 mb-3">${score}</div>
              <div className="grid grid-cols-3 gap-2 text-center mb-4 text-sm">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-2">
                  <div className="font-black text-green-600 text-lg">{customersServed}</div>
                  <div className="text-gray-500 text-xs">Served</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-2">
                  <div className="font-black text-red-600 text-lg">{customersLost}</div>
                  <div className="text-gray-500 text-xs">Lost</div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-2">
                  <div className="font-black text-yellow-600 text-lg">{vipServed}</div>
                  <div className="text-gray-500 text-xs">VIPs</div>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 mb-4 text-xs text-left">
                <p className="font-bold text-blue-700 dark:text-blue-300">💡 Business Lesson:</p>
                <p className="text-blue-600 dark:text-blue-400 mt-1">VIP customers (CLV = Customer Lifetime Value) are worth 5-25x more than average. Always prioritize retention!</p>
              </div>
              <div className="flex gap-3">
                <button onClick={startGame} className="flex-1 bg-green-500 text-white py-3 rounded-2xl font-black hover:bg-green-600 transition-all shadow-[0_4px_0_0_rgba(21,128,61,1)]">Again!</button>
                <button onClick={() => onComplete(score, {})} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-2xl font-black hover:opacity-80 transition-all">Exit</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* CUSTOMER QUEUE */}
        <div className="flex-1 p-3 grid grid-cols-3 gap-2 items-end pb-2">
          {[0, 1, 2].map(spotIndex => {
            const customer = customers.find(c => c.spotIndex === spotIndex);
            const isSelected = selectedCustomer === customer?.id;
            return (
              <div key={spotIndex} className={`h-full relative transition-all duration-200 cursor-pointer`}
                onClick={() => customer && setSelectedCustomer(customer.id)}>
                <AnimatePresence>
                  {customer && (
                    <motion.div
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 40, opacity: 0, scale: 0.8 }}
                      className="absolute bottom-0 w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 flex flex-col items-center p-2 overflow-hidden"
                      style={{ borderColor: customer.isVIP ? '#F59E0B' : isSelected ? themeColors.accent : 'transparent' }}
                    >
                      {/* VIP badge */}
                      {customer.isVIP && (
                        <div className="absolute top-1 right-1 bg-yellow-400 text-yellow-900 text-[9px] font-black px-1.5 py-0.5 rounded-full">VIP 💎</div>
                      )}

                      {/* Request bubble */}
                      <div className="mb-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1.5 flex gap-1 min-h-[36px] border border-gray-200 dark:border-gray-600 w-full justify-center">
                        {customer.request.map((req, i) => (
                          <div key={i} className={`w-7 h-7 flex items-center justify-center text-base bg-white dark:bg-gray-600 rounded shadow-sm transition-opacity ${i < customer.currentProgress.length ? 'opacity-30' : 'opacity-100'}`}>
                            {i < customer.currentProgress.length ? <Check size={14} className="text-green-500" /> : getActionIcon(req)}
                          </div>
                        ))}
                      </div>

                      {/* Avatar */}
                      <div className="text-3xl md:text-4xl mb-1">{customer.avatar}</div>

                      {/* Patience bar */}
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full transition-all"
                          style={{
                            backgroundColor: customer.timeLeft < 4 ? '#EF4444' : customer.timeLeft < 8 ? '#F59E0B' : '#22C55E',
                          }}
                          animate={{ width: `${(customer.timeLeft / customer.maxTime) * 100}%` }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* SELECTED customer detail */}
        {activeCustomer && (
          <div className="shrink-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeCustomer.avatar}</span>
              <div>
                <div className="font-black text-xs text-gray-700 dark:text-gray-300">
                  {activeCustomer.isVIP ? VIP_NAMES[Math.floor(Math.random() * VIP_NAMES.length)] : 'Customer'}
                </div>
                <div className="text-[10px] text-gray-500 flex gap-1">
                  {activeCustomer.request.map((req, i) => <span key={i}>{getActionIcon(req)}</span>)}
                </div>
              </div>
            </div>
            <div className="text-xs font-bold text-gray-500 flex items-center gap-1">
              <Clock size={12} /> {activeCustomer.timeLeft}s
            </div>
          </div>
        )}

        {/* ACTION BAR */}
        <div className="bg-white dark:bg-gray-800 p-2 md:p-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] shrink-0">
          <div className="grid grid-cols-5 gap-2">
            {actions.map(action => (
              <button
                key={action.id}
                onClick={() => handleAction(action.id)}
                disabled={!isPlaying || !selectedCustomer}
                className="aspect-square rounded-xl flex flex-col items-center justify-center shadow-sm active:scale-90 transition-transform disabled:opacity-40 disabled:grayscale border-2 border-transparent active:border-white"
                style={{ backgroundColor: action.color || '#eee' }}
              >
                <span className="text-xl md:text-2xl">{action.icon}</span>
                <span className="text-[8px] md:text-[10px] font-bold uppercase mt-0.5 opacity-80 text-white drop-shadow">{t(action.labelKey as any || action.id)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceTemplate;
