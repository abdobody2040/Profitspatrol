import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Star, Zap, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { Book } from '../../../types';
import SmartImage from '../../../components/ui/SmartImage';

// A gradient per category for the hero strip
const CATEGORY_GRADIENTS: Record<string, string> = {
    Mindset: 'from-purple-500 to-indigo-600',
    Finance: 'from-emerald-500 to-teal-600',
    Strategy: 'from-blue-500 to-cyan-600',
    Biography: 'from-amber-500 to-orange-600',
    Fiction: 'from-pink-500 to-rose-600',
    Creativity: 'from-yellow-400 to-orange-500',
    History: 'from-red-500 to-rose-700',
    Economics: 'from-green-500 to-lime-600',
    Leadership: 'from-violet-500 to-purple-700',
};

const CATEGORY_EMOJIS: Record<string, string> = {
    Mindset: '🧠',
    Finance: '💰',
    Strategy: '🚀',
    Biography: '📖',
    Fiction: '🍫',
    Creativity: '💡',
    History: '🏛️',
    Economics: '📊',
    Leadership: '👑',
};

interface ExclusiveBookCardProps {
    book: Book;
    index: number;
    isRead?: boolean;
    onRead: (book: Book) => void;
}

const ExclusiveBookCard: React.FC<ExclusiveBookCardProps> = ({ book, index, isRead, onRead }) => {
    const gradient = CATEGORY_GRADIENTS[book.category] ?? 'from-violet-500 to-indigo-600';
    const emoji = CATEGORY_EMOJIS[book.category] ?? '📚';
    const taskCount = book.tasks?.length ?? 0;
    const totalXp = book.tasks?.reduce((s, t) => s + (t.rewards?.xp ?? 0), 0) ?? 0;
    const totalCoins = book.tasks?.reduce((s, t) => s + (t.rewards?.coins ?? 0), 0) ?? 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.09, type: 'spring', stiffness: 280, damping: 22 }}
            className="group relative bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-violet-100 dark:border-violet-900 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
        >
            {/* ── Hero Strip ───────────────────────────────────── */}
            <div className={`relative bg-gradient-to-br ${gradient} p-5 flex gap-4 items-start`}>
                {/* Sparkle badge */}
                <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles size={8} /> EXCLUSIVE
                </div>

                {/* Book Cover */}
                <div className="w-24 h-36 shrink-0 rounded-xl shadow-2xl overflow-hidden border-4 border-white/30 transform -rotate-2 group-hover:rotate-0 transition-transform duration-300 bg-white/20">
                    <SmartImage
                        src={book.coverUrl}
                        alt={book.title}
                        type="book"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Title area */}
                <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-lg">{emoji}</span>
                        <span className="text-white/80 text-[10px] font-black uppercase tracking-widest">
                            {book.category}
                        </span>
                    </div>
                    <h3 className="text-white font-black text-lg leading-tight mb-1 drop-shadow">
                        {book.title}
                    </h3>
                    <p className="text-white/70 text-xs font-semibold">{book.author}</p>

                    {/* Age & read tags */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="inline-flex items-center gap-1 bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                            <Star size={9} fill="currentColor" /> {book.ageRating}
                        </span>
                        {isRead && (
                            <span className="inline-flex items-center gap-1 bg-green-400/80 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                                <CheckCircle2 size={9} /> Read
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Body ─────────────────────────────────────────── */}
            <div className="p-5">
                {/* Summary */}
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium leading-relaxed mb-4 line-clamp-3">
                    {book.summary}
                </p>

                {/* Key Lessons as chips */}
                {book.keyLessons && book.keyLessons.length > 0 && (
                    <div className="mb-4">
                        <p className="text-[10px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-2">
                            ✨ Key Lessons
                        </p>
                        <div className="flex flex-col gap-1.5">
                            {book.keyLessons.slice(0, 3).map((lesson, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-2 bg-violet-50 dark:bg-violet-950/40 rounded-xl px-3 py-1.5"
                                >
                                    <span className="text-violet-500 dark:text-violet-400 mt-0.5 shrink-0">
                                        <CheckCircle2 size={13} />
                                    </span>
                                    <span className="text-violet-800 dark:text-violet-200 text-[11px] font-semibold leading-snug">
                                        {lesson}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Stats row */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {taskCount > 0 && (
                        <div className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full px-2.5 py-1 text-[10px] font-black">
                            <Clock size={10} /> {taskCount} Challenges
                        </div>
                    )}
                    {totalXp > 0 && (
                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full px-2.5 py-1 text-[10px] font-black">
                            ⚡ {totalXp} XP
                        </div>
                    )}
                    {totalCoins > 0 && (
                        <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full px-2.5 py-1 text-[10px] font-black">
                            🪙 {totalCoins} Coins
                        </div>
                    )}
                </div>

                {/* CTA */}
                <button
                    onClick={() => onRead(book)}
                    className={`w-full py-3 rounded-2xl font-black text-sm text-white bg-gradient-to-r ${gradient} shadow-lg hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2`}
                >
                    <BookOpen size={16} />
                    {isRead ? 'Read Again' : 'Open Book'}
                    <Zap size={14} className="opacity-80" />
                </button>
            </div>
        </motion.div>
    );
};

export default ExclusiveBookCard;
