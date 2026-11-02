import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../../../store';
import { BusinessSimulation, VisualConfig } from '../../../../types';
import { motion } from "framer-motion";
import { Zap, MousePointer2, LogOut, Star } from "lucide-react";
import OllieBubble from '../../../../components/OllieBubble';
import { useOllieCommentary } from '../../../../hooks/useOllieCommentary';

interface Props {
  config: BusinessSimulation;
  onExit: () => void;
}

interface FallingEntity {
  id: string;
  entityData: any;
  x: number; // 0-100%
  y: number; // 0-100%
  speed: number;
  alive: boolean;
}

interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

const GAME_DURATION = 60;
const LANES_COUNT = 4;

const ClickerTemplate: React.FC<Props> = ({ config, onExit }) => {
  const { t, i18n } = useTranslation();
  const { completeGame } = useAppStore();
  const { currentMessage, isVisible, trigger, dismiss } = useOllieCommentary();

  const clickConfig = config.clicker_config || { resource_name: 'Money', click_label: 'Click', auto_label: 'Auto' };
  const visual: VisualConfig = config.visual_config || {
    theme: 'dark',
    colors: { primary: '#3B82F6', secondary: '#1E3A8A', accent: '#10B981', background: '#0F172A' },
    icon: '👆',
  };

  const entities = Array.isArray(config.entities) ? config.entities : [];
  const goodEntities = entities.filter(e => e.type !== 'obstacle');
  const badEntities = entities.filter(e => e.type === 'obstacle');
  const hasEntityMode = entities.length > 0;

  const [score, setScore] = useState(0);
  const [clickValue, setClickValue] = useState(config.game_mechanics?.click_value || 1);
  const [autoRate, setAutoRate] = useState(config.game_mechanics?.auto_click_rate || 0);
  const [upgrades, setUpgrades] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [fallingEntities, setFallingEntities] = useState<FallingEntity[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [clickPulse, setClickPulse] = useState(false);
  const [milestone, setMilestone] = useState(0);

  const upgradeTree = Array.isArray(config.upgrade_tree) ? config.upgrade_tree : [];

  const spawnEntity = useCallback(() => {
    if (!hasEntityMode) return;
    const allEntities = [...goodEntities, ...badEntities];
    if (allEntities.length === 0) return;

    // Weight bad entities less frequently
    const isObstacle = badEntities.length > 0 && Math.random() < 0.25;
    const pool = isObstacle ? badEntities : goodEntities;
    const entity = pool[Math.floor(Math.random() * pool.length)];

    setFallingEntities(prev => {
      if (prev.filter(e => e.alive).length > 12) return prev;
      return [...prev, {
        id: `${Date.now()}_${Math.random()}`,
        entityData: entity,
        x: 5 + Math.random() * 85,
        y: -10,
        speed: 1 + Math.random() * 1.5,
        alive: true,
      }];
    });
  }, [hasEntityMode, goodEntities, badEntities]);

  const addFloatingText = (text: string, x: number, y: number, color: string) => {
    const id = Math.random().toString(36);
    setFloatingTexts(prev => [...prev, { id, text, x, y, color }]);
    setTimeout(() => setFloatingTexts(prev => prev.filter(ft => ft.id !== id)), 900);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setIsPlaying(true);
    setShowResult(false);
    setFallingEntities([]);
    setMilestone(0);
    trigger('game_start');
  };

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setShowResult(true);
    const coins = Math.floor(score / 10);
    const xp = Math.floor(score / 20);
    completeGame(coins, xp);
    if (score > 500) trigger('game_over_win');
    else trigger('game_over_lose');
  }, [score, completeGame, trigger]);

  // Countdown
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { endGame(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, endGame]);

  // Auto-clicker
  useEffect(() => {
    if (!isPlaying || autoRate <= 0) return;
    const timer = setInterval(() => {
      setScore(s => s + autoRate);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, autoRate]);

  // Spawn entities
  useEffect(() => {
    if (!isPlaying || !hasEntityMode) return;
    const spawner = setInterval(spawnEntity, 800);
    return () => clearInterval(spawner);
  }, [isPlaying, hasEntityMode, spawnEntity]);

  // Animate falling entities
  useEffect(() => {
    if (!isPlaying) return;
    const anim = setInterval(() => {
      setFallingEntities(prev => prev
        .map(e => ({ ...e, y: e.y + e.speed }))
        .filter(e => e.y < 110)
      );
    }, 50);
    return () => clearInterval(anim);
  }, [isPlaying]);

  const handleMainClick = () => {
    if (!isPlaying) return;
    setScore(s => {
      const newScore = s + clickValue;
      // Milestone events
      const milestones = [100, 500, 1000, 2000, 5000];
      const nextMilestone = milestones.find(m => m > milestone && newScore >= m);
      if (nextMilestone) {
        setMilestone(nextMilestone);
        trigger('milestone');
      }
      return newScore;
    });
    setClickPulse(true);
    setTimeout(() => setClickPulse(false), 100);
    addFloatingText(`+${clickValue}`, 50, 50, '#22C55E');
  };

  const handleEntityClick = (entity: FallingEntity, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!entity.alive) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const isObstacle = entity.entityData.type === 'obstacle';

    if (isObstacle) {
      setScore(s => Math.max(0, s + (entity.entityData.value || -10)));
      addFloatingText(`${entity.entityData.value || -10}`, entity.x, entity.y, '#EF4444');
      trigger('bad_decision');
    } else {
      const val = entity.entityData.value || clickValue * 3;
      setScore(s => s + val);
      addFloatingText(`+${val} ⭐`, entity.x, entity.y, '#F59E0B');
    }
    setFallingEntities(prev => prev.filter(en => en.id !== entity.id));
  };

  const buyUpgrade = (u: any) => {
    if (score >= u.cost && !upgrades.includes(u.id)) {
      setScore(s => s - u.cost);
      setUpgrades([...upgrades, u.id]);
      if (u.modifier_target === 'click_value') setClickValue(v => v + (u.modifier_value || 0));
      if (u.modifier_target === 'auto_click_rate') setAutoRate(v => v + (u.modifier_value || 0));
      trigger('upgrade_bought');
    }
  };

  const safeRender = (content: any) => {
    if (typeof content === 'string' || typeof content === 'number') return content;
    return JSON.stringify(content);
  };

  const getScoreRank = () => {
    if (score >= 2000) return { label: 'LEGENDARY CEO', emoji: '👑', color: '#F59E0B' };
    if (score >= 1000) return { label: 'TYCOON', emoji: '💰', color: '#8B5CF6' };
    if (score >= 500) return { label: 'FOUNDER', emoji: '🚀', color: '#3B82F6' };
    return { label: 'INTERN', emoji: '💼', color: '#6B7280' };
  };

  return (
    <div className="h-full flex flex-col pb-24 md:pb-0 text-white relative overflow-hidden" style={{ backgroundColor: visual.colors.background }}>
      {/* Background radial glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 40%, ${visual.colors.primary}, transparent 70%)` }} />

      {/* Ollie Commentary */}
      <OllieBubble message={currentMessage} isVisible={isVisible} onDismiss={dismiss} position="top-right" />

      {/* HUD */}
      <div className="flex justify-between items-center px-4 py-3 z-20 shrink-0 border-b border-white/10">
        <div className="flex flex-col">
          <motion.div key={Math.floor(score / 100)} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="text-3xl font-black tabular-nums">
            {Math.floor(score).toLocaleString()}
          </motion.div>
          <span className="text-[10px] uppercase tracking-widest opacity-50">{clickConfig.resource_name}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
            <MousePointer2 size={12} className="text-blue-400" />
            <span className="font-black text-xs">{clickValue}/click</span>
          </div>
          {autoRate > 0 && (
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
              <Zap size={12} className="text-yellow-400" />
              <span className="font-black text-xs">{autoRate}/s</span>
            </div>
          )}
        </div>

        <div className={`text-2xl font-black tabular-nums ${timeLeft < 10 ? 'text-red-400 animate-pulse' : ''}`}>
          {isPlaying ? `0:${timeLeft.toString().padStart(2, '0')}` : '1:00'}
        </div>
      </div>

      {/* Main game area */}
      <div className="flex-1 relative flex flex-col items-center justify-center z-10 px-4" onClick={hasEntityMode ? undefined : handleMainClick}>
        {/* Falling Entities (when entity mode) */}
        {hasEntityMode && isPlaying && fallingEntities.map(entity => (
          <motion.button
            key={entity.id}
            className={`absolute text-4xl md:text-5xl cursor-pointer z-20 hover:scale-125 transition-transform select-none ${entity.entityData.type === 'obstacle' ? 'drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'}`}
            style={{ left: `${entity.x}%`, top: `${entity.y}%`, transform: 'translate(-50%, -50%)' }}
            onClick={(e) => handleEntityClick(entity, e)}
            whileTap={{ scale: 0.7 }}
          >
            {entity.entityData.emoji}
          </motion.button>
        ))}

        {/* Floating score texts */}
        {floatingTexts.map(ft => (
          <motion.div
            key={ft.id}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -80, scale: 1.3 }}
            transition={{ duration: 0.9 }}
            className="absolute font-black text-xl pointer-events-none z-30"
            style={{ left: `${ft.x}%`, top: `${ft.y}%`, color: ft.color, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            {ft.text}
          </motion.div>
        ))}

        {/* Main click button (non-entity mode) */}
        {!hasEntityMode && (
          <div className="relative group">
            <motion.div
              className="absolute inset-0 rounded-full opacity-40 blur-2xl"
              style={{ backgroundColor: visual.colors.primary }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.button
              whileTap={{ scale: 0.82, rotate: 5 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleMainClick}
              disabled={!isPlaying}
              className="w-48 h-48 md:w-64 md:h-64 rounded-full flex items-center justify-center text-6xl md:text-8xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-8 border-white/20 relative z-10 disabled:opacity-50"
              style={{
                backgroundColor: visual.colors.primary,
                boxShadow: `0 15px 0 0 ${visual.colors.secondary}`,
              }}
            >
              {visual.icon || '👆'}
            </motion.button>
          </div>
        )}

        {/* Entity mode instruction */}
        {hasEntityMode && isPlaying && (
          <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">TAP the ✨ items • AVOID the ☠️ obstacles</p>
          </div>
        )}

        {/* Start / Result overlay */}
        {(!isPlaying) && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center p-4">
            {showResult ? (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gray-900 border border-white/20 rounded-3xl p-8 max-w-sm w-full text-center">
                {(() => {
                  const rank = getScoreRank();
                  return <>
                    <div className="text-6xl mb-3">{rank.emoji}</div>
                    <h2 className="text-2xl font-black mb-1" style={{ color: rank.color }}>{rank.label}</h2>
                    <div className="text-5xl font-black text-white mb-2">{Math.floor(score).toLocaleString()}</div>
                    <p className="text-gray-400 text-sm mb-6">{clickConfig.resource_name} Generated</p>
                    <div className="flex gap-3">
                      <button onClick={startGame} className="flex-1 py-3 bg-blue-500 text-white rounded-2xl font-black hover:bg-blue-600 transition-all shadow-[0_4px_0_0_rgba(29,78,216,1)]">
                        {t('games.play_again', 'العب مجدداً')}
                      </button>
                      <button onClick={onExit} className="flex-1 py-3 bg-white/10 text-white rounded-2xl font-black hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                        <LogOut size={16} /> {t('games.exit', 'خروج')}
                      </button>
                    </div>
                  </>;
                })()}
              </motion.div>
            ) : (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gray-900 border border-white/20 rounded-3xl p-8 max-w-sm w-full text-center">
                <div className="text-6xl mb-4">{visual.icon || '👆'}</div>
                <h2 className="text-2xl font-black text-white mb-2">{config.name}</h2>
                <p className="text-gray-400 text-sm mb-6">{config.description}</p>
                {hasEntityMode && (
                  <div className="bg-white/5 rounded-xl p-3 mb-4 text-sm text-gray-300">
                    <p>✅ {i18n.language.startsWith('ar') ? 'انقر على العناصر الجيدة للربح' : 'Tap good items to earn'}</p>
                    <p>❌ {i18n.language.startsWith('ar') ? 'تجنب العوائق — فهي تكلفك نقاطاً!' : 'Avoid obstacles — they cost you!'}</p>
                  </div>
                )}
                <button onClick={startGame} className="w-full py-4 font-black text-xl rounded-2xl text-white shadow-[0_6px_0_0_rgba(0,0,0,0.4)] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all" style={{ backgroundColor: visual.colors.primary }}>
                  {t('games.ui.start_shift', 'ابدأ!')}
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Upgrades Panel */}
      <div className="shrink-0 max-h-[35%] bg-black/50 backdrop-blur-xl border-t-2 border-white/10 p-4 overflow-y-auto z-20">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-black text-white/50 uppercase text-xs tracking-[0.3em]">{t('sim.shop')}</h3>
          <span className="text-[10px] font-black text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20 uppercase">
            {t('games.invest.ui.cash', 'الرصيد')}: {Math.floor(score).toLocaleString()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {upgradeTree.length === 0 && <div className="text-white/30 text-sm font-bold italic col-span-3 text-center py-4">No upgrades available yet.</div>}
          {upgradeTree.map(u => {
            const canAfford = score >= u.cost;
            const isOwned = upgrades.includes(u.id);
            return (
              <button
                key={u.id}
                disabled={!canAfford || isOwned}
                onClick={() => buyUpgrade(u)}
                className={`p-4 rounded-2xl border-2 text-start transition-all relative overflow-hidden group
                  ${isOwned ? 'bg-green-500/20 border-green-500/50' : canAfford ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-500/50 hover:scale-[1.02]' : 'bg-white/5 border-transparent opacity-40 cursor-not-allowed'}
                `}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-black text-base">{safeRender(t(u.nameKey || '', u.name))}</span>
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-black ${canAfford && !isOwned ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/30'}`}>
                    {isOwned ? '✓' : `$${u.cost}`}
                  </span>
                </div>
                <div className="text-xs font-bold text-white/50">{safeRender(t(u.effectKey || '', u.effect))}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClickerTemplate;
