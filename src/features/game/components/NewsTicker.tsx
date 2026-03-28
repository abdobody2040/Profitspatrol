import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Sun, Globe, Newspaper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocialStore } from "../../../store/socialStore";

const NewsTicker = () => {
    const { news, addNewsEvent } = useSocialStore();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Simulation of event generation (mock)
    useEffect(() => {
        const timer = setInterval(() => {
            if (Math.random() > 0.7) return; // Only distinct events

            const events = [
                { headline: "Heatwave incoming! Lemonade demand skyrockets!", type: 'WEATHER', effect: { target: 'LEMONADE', multiplier: 1.5, durationMinutes: 10 } },
                { headline: "Market Crash! Stocks tumble temporarily.", type: 'MARKET', effect: { target: 'STOCK', multiplier: 0.8, durationMinutes: 5 } },
                { headline: "Local festival in town! More customers expected.", type: 'LOCAL', effect: { target: 'ALL', multiplier: 1.2, durationMinutes: 15 } },
                { headline: "Tech sector boom! Coding stocks up.", type: 'GLOBAL', effect: { target: 'STOCK', multiplier: 1.3, durationMinutes: 10 } }
            ];

            const randomEvent = events[Math.floor(Math.random() * events.length)];

            // Avoid duplicates of the same latest headline
            if (news[0]?.headline !== randomEvent.headline) {
                addNewsEvent({
                    id: crypto.randomUUID(),
                    headline: randomEvent.headline,
                    type: randomEvent.type as any,
                    effect: randomEvent.effect as any,
                    createdAt: new Date().toISOString()
                });
            }
        }, 30000); // Check every 30 seconds

        return () => clearInterval(timer);
    }, [news, addNewsEvent]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % news.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [news.length]);

    if (!news.length) return null;

    const currentNews = news[currentIndex] || news[0];

    return (
        <div className="bg-gray-900 text-white overflow-hidden py-2 border-t border-gray-700 bg-opacity-90 backdrop-blur-sm z-40 fixed bottom-0 w-full md:relative md:bottom-auto">
            <div className="flex items-center gap-4 px-4 max-w-4xl mx-auto">
                <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-yellow-400 shrink-0">
                    <Newspaper size={14} /> Breaking News
                </div>
                <div className="h-6 w-px bg-gray-700 shrink-0"></div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentNews.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="flex items-center gap-2 text-sm font-bold truncate flex-1"
                    >
                        {currentNews.type === 'MARKET' && <TrendingDown size={16} className="text-red-400" />}
                        {currentNews.type === 'WEATHER' && <Sun size={16} className="text-orange-400" />}
                        {currentNews.type === 'GLOBAL' && <Globe size={16} className="text-blue-400" />}
                        {currentNews.type === 'LOCAL' && <TrendingUp size={16} className="text-green-400" />}

                        <span>{currentNews.headline}</span>
                        <span className="text-xs opacity-50 font-mono ml-auto hidden sm:block">
                            {new Date(currentNews.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default NewsTicker;
