import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Heart, Users, DollarSign, MessageSquare, AlertCircle } from 'lucide-react';
import { BusinessSimulation, StreamerAction } from '../../../../types';
import OllieBubble from '../../../../components/OllieBubble';
import { useOllieCommentary } from '../../../../hooks/useOllieCommentary';

interface StreamerTemplateProps {
    config?: BusinessSimulation;
    onComplete: (score: number, data: any) => void;
}

interface ChatMessage {
    id: number;
    user: string;
    text: string;
    color: string;
    isDonation?: boolean;
    amount?: number;
}

interface SponsorOffer {
    id: string;
    brand: string;
    offerAmount: number;
    description: string;
    reputationCost: number;
    isShady: boolean;
}

const CHAT_USERS = ['PogChamp99', 'NinjaFan', 'xXx_Sniper_xXx', 'BusinessBro', 'Mom', 'KittenLover', 'TrollMaster', 'SpeedRunner'];
const CHAT_COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
const GENERIC_MESSAGES = ['LMAO', 'POGGERS', 'W', 'L', 'F in the chat', 'Play a different game', 'Hi stream!', 'Can you say my name?', 'Skill issue', 'Based'];

const SPONSOR_POOL: SponsorOffer[] = [
    { id: '1', brand: 'ShadyCoin Crypto', offerAmount: 500, description: 'Promote our new unregistered crypto token!', reputationCost: 30, isShady: true },
    { id: '2', brand: 'HealthySnacks', offerAmount: 150, description: 'Eat our protein bar on stream.', reputationCost: 0, isShady: false },
    { id: '3', brand: 'LootBox Casino', offerAmount: 800, description: 'Stream yourself gambling on our site.', reputationCost: 50, isShady: true },
    { id: '4', brand: 'Indie Game Dev', offerAmount: 100, description: 'Play my new indie game for 10 minutes.', reputationCost: -10, isShady: false }, // Gains reputation
];

const DEFAULT_ACTIONS: StreamerAction[] = [
    { id: 'play', name: 'Focus on Game', energy_cost: 10, mood_effect: -5, view_effect: 20, icon: '🎮', color: '#3b82f6' },
    { id: 'chat', name: 'Read Chat', energy_cost: 5, mood_effect: 10, view_effect: -10, icon: '💬', color: '#10b981' },
    { id: 'hype', name: 'Hype Up!', energy_cost: 25, mood_effect: -10, view_effect: 50, icon: '🔥', color: '#ef4444' },
    { id: 'drink', name: 'Drink Water', energy_cost: -15, mood_effect: 5, view_effect: -5, icon: '💧', color: '#0ea5e9' },
];

const StreamerTemplate: React.FC<StreamerTemplateProps> = ({ config, onComplete }) => {
    const { t } = useTranslation();
    const { currentMessage, isVisible, trigger, dismiss } = useOllieCommentary();
    const actions = config?.streamer_config?.actions || DEFAULT_ACTIONS;
    const colors = config?.visual_config?.colors || { primary: '#8b5cf6', background: '#0f172a' };

    const [energy, setEnergy] = useState(100);
    const [reputation, setReputation] = useState(100);
    const [views, setViews] = useState(100);
    const [money, setMoney] = useState(0);

    const [timeLeft, setTimeLeft] = useState(90); // 1.5 mins
    const [isPlaying, setIsPlaying] = useState(false);
    const [showResult, setShowResult] = useState(false);
    
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [activeSponsor, setActiveSponsor] = useState<SponsorOffer | null>(null);

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const messageIdCounter = useRef(0);
    const timerRef = useRef<NodeJS.Timeout>();
    const loopRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        return () => stopGameLoop();
    }, []);

    const stopGameLoop = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (loopRef.current) clearInterval(loopRef.current);
    };

    const startGame = () => {
        setIsPlaying(true);
        setEnergy(100);
        setReputation(100);
        setViews(100);
        setMoney(0);
        setTimeLeft(90);
        setShowResult(false);
        setChatMessages([]);
        setActiveSponsor(null);
        trigger('game_start');

        timerRef.current = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    endGame(true);
                    return 0;
                }
                return t - 1;
            });

            // Passive Decay
            setEnergy(e => Math.max(0, e - 1));
            
            // View trend based on reputation
            setViews(v => {
                let trend = -2; // Base decay
                if (reputation > 80) trend += 5;
                if (reputation < 30) trend -= 10;
                return Math.max(0, v + trend);
            });

        }, 1000);

        loopRef.current = setInterval(gameLoop, 2000);
    };

    const gameLoop = () => {
        // 1. Generate Chat
        const isDonation = Math.random() < 0.1;
        const msg: ChatMessage = {
            id: messageIdCounter.current++,
            user: CHAT_USERS[Math.floor(Math.random() * CHAT_USERS.length)],
            text: GENERIC_MESSAGES[Math.floor(Math.random() * GENERIC_MESSAGES.length)],
            color: CHAT_COLORS[Math.floor(Math.random() * CHAT_COLORS.length)],
            isDonation,
            amount: isDonation ? Math.floor(Math.random() * 20) + 1 : undefined
        };

        if (isDonation) {
            setMoney(m => m + msg.amount!);
            msg.text = `Donated $${msg.amount}! Keep it up!`;
        }

        setChatMessages(prev => {
            const newChat = [...prev, msg];
            if (newChat.length > 20) newChat.shift();
            return newChat;
        });

        // Auto-scroll chat
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }

        // 2. Random Sponsor
        setViews(v => {
            // Only trigger sponsors if views > 200 and no active sponsor
            if (v > 200 && Math.random() < 0.05) {
                setActiveSponsor(prev => prev || SPONSOR_POOL[Math.floor(Math.random() * SPONSOR_POOL.length)]);
            }
            return v;
        });
    };

    useEffect(() => {
        if (isPlaying && (energy <= 0 || reputation <= 0 || views <= 0)) {
            endGame(false);
            if (energy <= 0) trigger('bad_decision'); // Burnout
            else trigger('going_broke'); // Cancelled or dead stream
        }
    }, [energy, reputation, views, isPlaying, trigger]);

    const handleAction = (action: StreamerAction) => {
        if (!isPlaying || activeSponsor) return; // Block actions while sponsor popup is open

        // Check if enough energy (unless it's an energy-gaining action)
        if (action.energy_cost > 0 && energy < action.energy_cost) {
            addSystemMessage("Not enough energy!");
            return;
        }

        setEnergy(e => Math.min(100, Math.max(0, e - action.energy_cost)));
        setReputation(r => Math.min(100, Math.max(0, r + action.mood_effect)));
        setViews(v => Math.max(0, v + action.view_effect));

        addSystemMessage(`Action: ${action.name}`);
    };

    const handleSponsor = (accept: boolean) => {
        if (!activeSponsor) return;

        if (accept) {
            setMoney(m => m + activeSponsor.offerAmount);
            setReputation(r => Math.max(0, r - activeSponsor.reputationCost));
            addSystemMessage(`Accepted sponsor: ${activeSponsor.brand}`);
            
            if (activeSponsor.isShady) {
                trigger('bad_decision');
                // Chat backlash
                const backlashMsg: ChatMessage = { id: messageIdCounter.current++, user: 'Mod', text: 'Chat did not like that sponsor...', color: '#ef4444' };
                setChatMessages(prev => [...prev, backlashMsg]);
                setViews(v => Math.max(0, v - 50));
            } else {
                trigger('good_decision');
            }
        } else {
            addSystemMessage(`Declined sponsor: ${activeSponsor.brand}`);
            if (activeSponsor.isShady) {
                setReputation(r => Math.min(100, r + 10)); // Bonus for rejecting shady stuff
                trigger('good_decision');
            }
        }
        setActiveSponsor(null);
    };

    const addSystemMessage = (text: string) => {
        setChatMessages(prev => [...prev, { id: messageIdCounter.current++, user: 'SYSTEM', text, color: '#94a3b8' }]);
    };

    const endGame = (survived: boolean) => {
        stopGameLoop();
        setIsPlaying(false);
        setShowResult(true);

        const baseScore = Math.floor(views / 10) + money;
        const finalScore = survived ? baseScore : Math.floor(baseScore / 2);

        if (survived) trigger('game_over_win');

        setTimeout(() => {
            onComplete(finalScore, { views, money, reputation, survived });
        }, 3000);
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 overflow-hidden relative font-sans text-white">
            <OllieBubble message={currentMessage} isVisible={isVisible} onDismiss={dismiss} position="top-right" />

            {/* HEADER */}
            <div className="p-3 bg-slate-800 shadow-sm z-20 flex justify-between items-center shrink-0 border-b border-slate-700">
                <div className="flex items-center gap-2">
                    <div className="bg-red-600 text-white px-3 py-1 rounded-lg font-black text-xs uppercase flex items-center gap-2 animate-pulse">
                        <span className="w-2 h-2 bg-white rounded-full"></span> LIVE
                    </div>
                    <div className="font-mono font-bold text-slate-400 text-sm">
                        0:{timeLeft.toString().padStart(2, '0')}
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                        <div className="text-[9px] font-bold text-slate-400 uppercase">Views</div>
                        <div className="text-lg font-black flex items-center gap-1 text-blue-400">
                            <Users size={16} /> {views.toLocaleString()}
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-[9px] font-bold text-slate-400 uppercase">Revenue</div>
                        <div className="text-lg font-black flex items-center gap-1 text-green-400">
                            <DollarSign size={16} /> {money}
                        </div>
                    </div>
                </div>
            </div>

            {/* METERS */}
            <div className="px-4 py-2 bg-slate-800 grid grid-cols-2 gap-4 shrink-0 border-b border-slate-700">
                <div>
                    <div className="flex justify-between mb-1 text-[10px] font-bold text-yellow-500 uppercase">
                        <span className="flex items-center gap-1"><Zap size={10} /> Energy</span>
                        <span>{energy}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-yellow-400" animate={{ width: `${energy}%` }} />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between mb-1 text-[10px] font-bold text-pink-500 uppercase">
                        <span className="flex items-center gap-1"><Heart size={10} /> Reputation</span>
                        <span>{reputation}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-pink-500" animate={{ width: `${reputation}%` }} />
                    </div>
                </div>
            </div>

            {/* MAIN AREA */}
            <div className="flex-1 flex overflow-hidden relative">
                
                {/* VIDEO FEED */}
                <div className="flex-1 bg-black m-2 md:m-4 rounded-xl border border-slate-700 relative overflow-hidden flex flex-col items-center justify-center">
                    
                    {/* Fake Stream Content */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
                        <div className="w-48 h-48 border-4 border-slate-500 rounded-lg animate-spin-slow"></div>
                        <div className="absolute w-24 h-24 bg-slate-600 rounded-full animate-bounce"></div>
                    </div>
                    
                    <span className="relative z-10 text-slate-700 font-black text-4xl md:text-6xl tracking-widest opacity-50 uppercase rotate-12">
                        Gameplay
                    </span>

                    {/* Sponsor Popup */}
                    <AnimatePresence>
                        {activeSponsor && (
                            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                                className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                                <div className="bg-slate-800 border-2 border-indigo-500 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
                                    <div className="bg-indigo-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-400">
                                        <MessageSquare size={32} />
                                    </div>
                                    <h3 className="text-xl font-black mb-1 text-white">Sponsorship Offer!</h3>
                                    <p className="text-indigo-400 font-bold mb-4">{activeSponsor.brand}</p>
                                    
                                    <div className="bg-slate-900 rounded-xl p-4 mb-6 text-left">
                                        <p className="text-sm text-slate-300 mb-4">"{activeSponsor.description}"</p>
                                        <div className="flex justify-between items-center text-sm font-bold border-t border-slate-700 pt-2">
                                            <span className="text-slate-400">Offer:</span>
                                            <span className="text-green-400">+${activeSponsor.offerAmount}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button onClick={() => handleSponsor(true)} className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-black">Accept</button>
                                        <button onClick={() => handleSponsor(false)} className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-black">Decline</button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* CHAT BOX */}
                <div className="w-1/3 max-w-[250px] bg-slate-800 border-l border-slate-700 flex flex-col">
                    <div className="p-2 border-b border-slate-700 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
                        Live Chat
                    </div>
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-2 space-y-2 text-sm">
                        {chatMessages.map(msg => (
                            <div key={msg.id} className={`leading-tight ${msg.isDonation ? 'bg-green-900/30 border border-green-500/30 p-2 rounded-lg' : ''}`}>
                                <span className="font-bold mr-2" style={{ color: msg.color }}>{msg.user}:</span>
                                <span className={msg.isDonation ? 'text-green-300 font-bold' : 'text-slate-300'}>{msg.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ACTION CONTROLS */}
            <div className="p-3 bg-slate-800 border-t border-slate-700 shrink-0">
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {actions.map(action => (
                        <button key={action.id} onClick={() => handleAction(action)} disabled={!isPlaying || activeSponsor !== null || energy < action.energy_cost && action.energy_cost > 0}
                            className="min-w-[100px] flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl p-2 flex flex-col items-center justify-center transition-colors border border-slate-600 hover:border-slate-500">
                            <span className="text-2xl mb-1">{action.icon}</span>
                            <span className="text-[10px] font-bold uppercase text-white mb-1">{action.name}</span>
                            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${action.energy_cost > 0 ? 'bg-slate-900 text-yellow-500' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                {action.energy_cost > 0 ? `-${action.energy_cost}⚡` : `+${Math.abs(action.energy_cost)}⚡`}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* OVERLAYS */}
            {!isPlaying && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    {showResult ? (
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-slate-800 border-2 border-slate-700 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl">
                            <div className="text-5xl mb-3">{views > 0 && energy > 0 && reputation > 0 ? '🏆' : '💀'}</div>
                            <h2 className="text-2xl font-black text-white mb-1">
                                {views > 0 && energy > 0 && reputation > 0 ? 'Stream Ended' : 'Stream Crashed'}
                            </h2>
                            
                            <div className="grid grid-cols-2 gap-4 my-6">
                                <div className="bg-slate-900 rounded-xl p-3">
                                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Peak Views</div>
                                    <div className="text-xl font-black text-blue-400">{views.toLocaleString()}</div>
                                </div>
                                <div className="bg-slate-900 rounded-xl p-3">
                                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Revenue</div>
                                    <div className="text-xl font-black text-green-400">${money}</div>
                                </div>
                            </div>

                            <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-xl p-4 mb-6 text-left">
                                <p className="font-bold text-indigo-400 mb-1 text-sm flex items-center gap-2"><AlertCircle size={14}/> Creator Economy Lesson</p>
                                <p className="text-xs text-indigo-200">
                                    Content creators run a business. They balance Audience Growth (Views), Revenue (Sponsors/Donations), and Brand Image (Reputation). Selling out for quick cash can destroy long-term trust!
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={startGame} className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-black">Go Live Again</button>
                                <button onClick={() => onComplete(0, {})} className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-black">Exit</button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="bg-slate-800 border-2 border-slate-700 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl">
                            <div className="text-6xl mb-4 text-indigo-500 mx-auto">🔴</div>
                            <h2 className="text-3xl font-black text-white mb-2">{config?.name || 'Creator Sim'}</h2>
                            <p className="text-slate-400 mb-6 text-sm">{config?.description || 'Balance your energy, views, and reputation.'}</p>
                            
                            <div className="bg-slate-900 rounded-xl p-4 mb-6 text-xs text-left text-slate-300 space-y-2">
                                <p>⚡ <strong>Manage Energy:</strong> If it hits 0, you burn out.</p>
                                <p>💬 <strong>Read Chat:</strong> Boosts reputation but costs views.</p>
                                <p>🤝 <strong>Sponsors:</strong> Some pay well but ruin your reputation.</p>
                            </div>

                            <button onClick={startGame} className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-black text-xl shadow-[0_4px_0_0_rgba(67,56,202,1)] active:translate-y-1 active:shadow-none transition-all">
                                Go Live
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StreamerTemplate;
