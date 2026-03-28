import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import { Building2, Users, Trophy, Plus, LogIn, Crown, Star, Zap, Coins, X, CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../../store';
import type { Corporation } from '../../../types';

// ─── Corp colour palette ──────────────────────────────────────────────────────
const CORP_COLORS = [
    { from: '#6366F1', to: '#8B5CF6', bg: '#EDE9FE', label: 'Violet' },
    { from: '#EF4444', to: '#F97316', bg: '#FEF2F2', label: 'Fire' },
    { from: '#10B981', to: '#059669', bg: '#D1FAE5', label: 'Emerald' },
    { from: '#F59E0B', to: '#EAB308', bg: '#FEF9C3', label: 'Gold' },
    { from: '#3B82F6', to: '#0EA5E9', bg: '#DBEAFE', label: 'Sky' },
    { from: '#EC4899', to: '#F43F5E', bg: '#FCE7F3', label: 'Pink' },
];

const CORP_EMOJIS = ['🏢', '🚀', '⚡', '🦁', '🌍', '💎', '🔥', '🎯', '🛡️', '🌈'];

// ─── Weekly Corp Missions ─────────────────────────────────────────────────────
const CORP_MISSIONS = [
    { id: 'cm1', desc: 'Every member completes 1 lesson this week', reward: 200 },
    { id: 'cm2', desc: 'Corp earns 1,000 combined BizCoins this week', reward: 300 },
    { id: 'cm3', desc: 'All members use the Daily Spin Wheel', reward: 150 },
    { id: 'cm4', desc: '3 members reach a new level this week', reward: 350 },
    { id: 'cm5', desc: 'Corp completes 5 Gig Central jobs combined', reward: 250 },
];

function getWeeklyMission() {
    const d = new Date();
    const week = Math.floor(d.getTime() / (7 * 24 * 3600000));
    return CORP_MISSIONS[week % CORP_MISSIONS.length];
}

// ─── Create Corp Form ─────────────────────────────────────────────────────────
const CreateCorpForm: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { t } = useTranslation();
    const { createCorporation } = useAppStore();
    const [name, setName] = useState('');
    const [motto, setMotto] = useState('');
    const [emoji, setEmoji] = useState(CORP_EMOJIS[0]);
    const [colorIdx, setColorIdx] = useState(0);
    const [creating, setCreating] = useState(false);

    const handleCreate = async () => {
        if (!name.trim() || creating) return;
        setCreating(true);
        await createCorporation({ name: name.trim(), motto: motto.trim(), emoji, color: CORP_COLORS[colorIdx].from });
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        onBack();
    };

    const color = CORP_COLORS[colorIdx];

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
                    ←
                </button>
                <h3 className="font-black text-gray-800 dark:text-white text-lg">{t('corp.create_title')}</h3>
            </div>

            {/* Preview badge */}
            <div className="flex items-center justify-center">
                <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-lg" style={{ background: `linear-gradient(135deg, ${color.from}, ${color.to})` }}>
                    {emoji}
                </div>
            </div>

            {/* Emoji picker */}
            <div className="flex gap-2 flex-wrap justify-center">
                {CORP_EMOJIS.map(e => (
                    <button key={e} onClick={() => setEmoji(e)} className={`text-2xl p-2 rounded-xl transition-all ${emoji === e ? 'bg-indigo-100 dark:bg-indigo-900 ring-2 ring-indigo-500 scale-110' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>{e}</button>
                ))}
            </div>

            {/* Color picker */}
            <div className="flex gap-2 justify-center">
                {CORP_COLORS.map((c, i) => (
                    <button key={i} onClick={() => setColorIdx(i)}
                        className={`w-8 h-8 rounded-full transition-all ${colorIdx === i ? 'ring-4 ring-offset-2 ring-gray-400 scale-125' : ''}`}
                        style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }} />
                ))}
            </div>

            {/* Name */}
            <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('corp.name_label')}</label>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    maxLength={24}
                    placeholder={t('corp.name_placeholder')}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 font-semibold text-gray-800 dark:text-white focus:border-indigo-500 outline-none transition-colors"
                />
            </div>

            {/* Motto */}
            <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('corp.motto_label')}</label>
                <input
                    value={motto}
                    onChange={e => setMotto(e.target.value)}
                    maxLength={48}
                    placeholder={t('corp.motto_placeholder')}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 focus:border-indigo-500 outline-none transition-colors"
                />
            </div>

            <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleCreate}
                disabled={!name.trim() || creating}
                className="w-full py-4 rounded-2xl font-black text-white text-lg shadow-lg disabled:opacity-50 transition-all"
                style={{ background: `linear-gradient(135deg, ${color.from}, ${color.to})` }}
            >
                {creating ? '⏳ Creating...' : `🏢 ${t('corp.create_btn')}`}
            </motion.button>
        </div>
    );
};

// ─── Corp Detail View ─────────────────────────────────────────────────────────
const CorpDetailView: React.FC<{ corp: Corporation; userId: string; onBack: () => void }> = ({ corp, userId, onBack }) => {
    const { t } = useTranslation();
    const { joinCorporation, leaveCorporation } = useAppStore();
    const isOwner = corp.ownerId === userId;
    const isMember = corp.memberIds.includes(userId);
    const mission = getWeeklyMission();

    const handleJoin = () => { joinCorporation(corp.id); confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } }); };
    const handleLeave = () => { if (confirm('Leave this corporation?')) leaveCorporation(corp.id); onBack(); };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">←</button>
                <h3 className="font-black text-gray-800 dark:text-white text-lg truncate">{corp.name}</h3>
            </div>

            {/* Corp Badge */}
            <div className="flex flex-col items-center gap-2 py-4">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-5xl shadow-xl" style={{ background: `linear-gradient(135deg, ${corp.color}, ${corp.color}99)` }}>
                    {corp.emoji}
                </div>
                <p className="font-black text-xl text-gray-800 dark:text-white">{corp.name}</p>
                {corp.motto && <p className="text-sm text-gray-500 italic">"{corp.motto}"</p>}
                <div className="flex gap-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1"><Users size={14} /> {corp.memberIds.length} members</span>
                    <span className="flex items-center gap-1"><Coins size={14} /> {corp.totalXP.toLocaleString()} XP</span>
                </div>
            </div>

            {/* Weekly Corp Mission */}
            <div className="rounded-2xl p-4 bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-700">
                <div className="flex items-center gap-2 font-bold text-indigo-700 dark:text-indigo-300 text-sm mb-2">
                    <Star size={14} /> {t('corp.weekly_mission')}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{mission.desc}</p>
                <div className="flex items-center gap-1 mt-2 text-xs font-bold text-yellow-600">
                    <Coins size={12} /> Reward: +{mission.reward} BizCoins per member
                </div>
            </div>

            {/* Members */}
            <div>
                <h4 className="font-bold text-gray-700 dark:text-gray-300 text-sm mb-2 flex items-center gap-1"><Users size={14} /> Members</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                    {corp.members?.map(m => (
                        <div key={m.id} className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 dark:bg-gray-800">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-sm font-bold text-indigo-600">
                                {m.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-gray-800 dark:text-white truncate">{m.name}</p>
                                <p className="text-xs text-gray-400">Lv.{m.level} · {m.xp.toLocaleString()} XP</p>
                            </div>
                            {m.id === corp.ownerId && <Crown size={14} className="text-yellow-500 shrink-0" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            {!isMember && (
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={handleJoin}
                    className="w-full py-3 rounded-2xl font-black text-white"
                    style={{ background: `linear-gradient(135deg, ${corp.color}, ${corp.color}99)` }}
                >
                    <LogIn size={16} className="inline mr-2" />{t('corp.join_btn')}
                </motion.button>
            )}
            {isMember && !isOwner && (
                <button onClick={handleLeave} className="w-full py-3 rounded-2xl font-bold text-red-500 border-2 border-red-200 hover:bg-red-50 transition-colors">
                    {t('corp.leave_btn')}
                </button>
            )}
        </div>
    );
};

// ─── Main CorporationHub ──────────────────────────────────────────────────────
interface CorporationHubProps { onClose?: () => void; }

export const CorporationHub: React.FC<CorporationHubProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const { user, corporations } = useAppStore();
    const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
    const [selectedCorpId, setSelectedCorpId] = useState<string | null>(null);
    const [searchText, setSearchText] = useState('');

    const userCorpId = user?.corporationId ?? null;
    const userCorp = corporations.find(c => c.id === userCorpId) ?? null;

    const filteredCorps = useMemo(() =>
        corporations.filter(c => c.name.toLowerCase().includes(searchText.toLowerCase())),
        [corporations, searchText]
    );

    const selectedCorp = corporations.find(c => c.id === selectedCorpId) ?? null;

    if (view === 'create') return <CreateCorpForm onBack={() => setView('list')} />;
    if (view === 'detail' && selectedCorp) return (
        <CorpDetailView corp={selectedCorp} userId={user?.id ?? ''} onBack={() => setView('list')} />
    );

    return (
        <div className="flex flex-col gap-4 max-w-sm w-full mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-indigo-500" />
                        {t('corp.title')}
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">{t('corp.subtitle')}</p>
                </div>
                {onClose && <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"><X size={18} /></button>}
            </div>

            {/* Your Corp Banner */}
            {userCorp ? (
                <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl p-4 text-white cursor-pointer"
                    style={{ background: `linear-gradient(135deg, ${userCorp.color}, ${userCorp.color}99)` }}
                    onClick={() => { setSelectedCorpId(userCorp.id); setView('detail'); }}
                >
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">{userCorp.emoji}</span>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 text-xs font-semibold opacity-80 mb-0.5">
                                <Crown size={10} /> {t('corp.your_corp')}
                            </div>
                            <p className="font-black text-lg truncate">{userCorp.name}</p>
                            <div className="flex gap-3 text-xs opacity-90 mt-0.5">
                                <span><Users size={10} className="inline" /> {userCorp.memberIds.length}</span>
                                <span><Zap size={10} className="inline" /> {userCorp.totalXP.toLocaleString()} XP</span>
                            </div>
                        </div>
                        <ChevronRight size={18} className="opacity-70 shrink-0" />
                    </div>
                </motion.div>
            ) : (
                <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setView('create')}
                    className="flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                >
                    <Plus size={22} />
                    <div className="text-left">
                        <p className="font-bold">{t('corp.create_cta')}</p>
                        <p className="text-xs opacity-70">{t('corp.create_cta_sub')}</p>
                    </div>
                </motion.button>
            )}

            {/* Search */}
            <input
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                placeholder={t('corp.search_placeholder')}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-white text-sm focus:border-indigo-500 outline-none transition-colors"
            />

            {/* Corp List */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredCorps.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">{t('corp.no_corps')}</div>
                ) : (
                    filteredCorps.map((corp, idx) => (
                        <motion.div
                            key={corp.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.04 }}
                            onClick={() => { setSelectedCorpId(corp.id); setView('detail'); }}
                            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                        >
                            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ background: `linear-gradient(135deg, ${corp.color}, ${corp.color}99)` }}>
                                {corp.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <p className="font-bold text-sm text-gray-800 dark:text-white truncate">{corp.name}</p>
                                    {corp.id === userCorpId && <Crown size={11} className="text-yellow-500 shrink-0" />}
                                </div>
                                <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-400">
                                    <span><Users size={10} className="inline" /> {corp.memberIds.length}</span>
                                    <span><Zap size={10} className="inline" /> {corp.totalXP.toLocaleString()} XP</span>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-gray-400 shrink-0" />
                        </motion.div>
                    ))
                )}
            </div>

            {/* Top Corps Leaderboard */}
            {corporations.length > 0 && (
                <div className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 p-4">
                    <h4 className="font-black text-white flex items-center gap-1 text-sm mb-2"><Trophy size={14} /> Top Corps</h4>
                    {[...corporations].sort((a, b) => b.totalXP - a.totalXP).slice(0, 3).map((c, i) => (
                        <div key={c.id} className="flex items-center gap-2 text-white text-xs py-1">
                            <span className="font-black">{['🥇', '🥈', '🥉'][i]}</span>
                            <span className="flex-1 font-semibold truncate">{c.emoji} {c.name}</span>
                            <span className="font-bold">{c.totalXP.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CorporationHub;
