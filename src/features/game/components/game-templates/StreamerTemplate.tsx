import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Youtube, Zap, MessageCircle, Heart, Users, Star } from 'lucide-react';
import { BusinessSimulation, StreamerConfig, StreamerAction } from '../../../../types';

interface StreamerTemplateProps {
    config?: BusinessSimulation;
    onComplete: (score: number, data: any) => void;
}

const StreamerTemplate: React.FC<StreamerTemplateProps> = ({ config, onComplete }) => {
    const { t } = useTranslation();
    const streamerConfig = config?.streamer_config || { actions: [] };
    const { actions } = streamerConfig;
    const colors = config?.visual_config?.colors || { primary: '#A78BFA', background: '#F5F3FF' };

    const [energy, setEnergy] = useState(100);
    const [mood, setMood] = useState(50);
    const [views, setViews] = useState(100);

    // Time & Events
    const [timeLeft, setTimeLeft] = useState(60);
    const [gameOver, setGameOver] = useState(false);
    const [lastEvent, setLastEvent] = useState<string | null>(null);

    useEffect(() => {
        if (gameOver) return;
        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    handleFinish(true);
                    return 0;
                }
                return t - 1;
            });

            // Passive Decay
            setEnergy(e => Math.max(0, e - 1));
            setMood(m => Math.max(0, m - 1));

            // View Drop if mood/energy low
            setViews(v => {
                let trend = 0;
                if (mood > 70) trend += 5;
                if (mood < 30) trend -= 5;
                if (energy < 20) trend -= 10;
                return Math.max(0, v + trend);
            });

        }, 1000);
        return () => clearInterval(timer);
    }, [gameOver, mood, energy]);

    useEffect(() => {
        if (energy <= 0 || mood <= 0 || views <= 0) {
            handleFinish(false);
        }
    }, [energy, mood, views]);

    const handleAction = (action: StreamerAction) => {
        if (gameOver) return;
        if (energy < action.energy_cost) return;

        setEnergy(e => Math.min(100, Math.max(0, e - action.energy_cost)));
        setMood(m => Math.min(100, Math.max(0, m + action.mood_effect)));
        setViews(v => Math.max(0, v + action.view_effect));
    };

    const handleFinish = (win: boolean) => {
        setGameOver(true);
        setTimeout(() => {
            onComplete(views, { maxViews: views, finalMood: mood });
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: colors.background }}>
            {/* HEADER */}
            <div className="p-4 bg-white/80 backdrop-blur-md shadow-sm z-20 flex justify-between items-center">
                <div className="bg-red-600 text-white px-4 py-2 rounded-xl font-black text-xl flex items-center gap-2 animate-pulse">
                    <span className="w-3 h-3 bg-white rounded-full"></span> LIVE
                </div>
                <div className="text-xl font-black text-gray-700 flex items-center gap-2">
                    <Users size={24} className="text-gray-400" /> {views.toLocaleString()}
                </div>
                <div className="font-mono font-bold text-gray-400">
                    0:{timeLeft.toString().padStart(2, '0')}
                </div>
            </div>

            {/* METERS */}
            <div className="p-4 grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-xl shadow-sm">
                    <div className="flex justify-between mb-1 text-xs font-bold text-yellow-600">
                        <span className="flex items-center gap-1"><Zap size={12} /> ENERGY</span>
                        <span>{energy}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-yellow-400"
                            animate={{ width: `${energy}%` }}
                        />
                    </div>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-sm">
                    <div className="flex justify-between mb-1 text-xs font-bold text-purple-600">
                        <span className="flex items-center gap-1"><Heart size={12} /> MOOD</span>
                        <span>{mood}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-purple-500"
                            animate={{ width: `${mood}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* STREAM PREVIEW (Main Area) */}
            <div className="flex-1 m-4 bg-gray-900 rounded-2xl relative overflow-hidden flex items-center justify-center text-white/50 font-black text-4xl shadow-inner">
                STREAM FEED
                {gameOver && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white z-30">
                        <div className="text-6xl mb-4">{timeLeft > 0 && energy > 0 ? '🏆' : '💀'}</div>
                        <h2 className="text-4xl font-black mb-2">{timeLeft > 0 && energy > 0 ? 'STREAM ENDED' : 'OFFLINE'}</h2>
                        <p className="font-mono">Peak Views: {views}</p>
                    </div>
                )}
                {/* Chat Overlay */}
                <div className="absolute bottom-4 left-4 w-48 h-32 bg-black/50 rounded-lg p-2 text-xs text-white/80 overflow-hidden flex flex-col justify-end gap-1">
                    <div className="text-blue-300 font-bold">Mod: Don't forget to hydrate!</div>
                    <div><span className="text-green-300">Fan1:</span> Wow!</div>
                    <div><span className="text-pink-300">Fan2:</span> POGGERS</div>
                </div>
            </div>

            {/* CONTROLS */}
            <div className="p-4 grid grid-cols-3 gap-3 bg-white border-t border-gray-100">
                {actions.map(action => (
                    <button
                        key={action.id}
                        onClick={() => handleAction(action)}
                        disabled={gameOver || energy < action.energy_cost}
                        className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95
                            ${energy >= action.energy_cost ? 'bg-gray-50 hover:bg-gray-100 shadow-sm border border-gray-200' : 'opacity-50 cursor-not-allowed bg-gray-100'}
                        `}
                    >
                        <div className="text-2xl">{action.icon}</div>
                        <div className="font-bold text-xs text-center leading-tight">{action.name}</div>
                        <div className="text-[10px] font-mono text-gray-400 mt-1">-{action.energy_cost}⚡</div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StreamerTemplate;

