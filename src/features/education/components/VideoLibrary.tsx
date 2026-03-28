import React, { useState } from 'react';
import { Play, Clock, Tag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useEducationStore } from "../../../store/educationStore";

const VideoLibrary = () => {
    const { t } = useTranslation();
    const { videos } = useEducationStore();
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [activeVideo, setActiveVideo] = useState<string | null>(null);

    const categories = ['All', 'Finance', 'Mindset', 'Strategy', 'Tutorial'];

    const filteredVideos = selectedCategory === 'All'
        ? videos
        : videos.filter(v => v.category === selectedCategory);

    const currentVideo = videos.find(v => v.id === activeVideo);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 dark:text-white flex items-center gap-3">
                        <Play className="fill-red-500 text-red-500" size={32} />
                        {t('videos.title')}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{t('videos.subtitle')}</p>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors
                                ${selectedCategory === cat
                                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                                    : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            {t(`videos.categories.${cat}`, cat)}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map(video => (
                    <motion.div
                        key={video.id}
                        layoutId={video.id}
                        onClick={() => setActiveVideo(video.id)}
                        whileHover={{ y: -5 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group border border-gray-100 dark:border-gray-700"
                    >
                        <div className="aspect-video bg-gray-900 relative">
                            <img
                                src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                                alt={video.title}
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <Play className="fill-white text-white ml-1" size={20} />
                                </div>
                            </div>
                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">
                                {video.duration}
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-500`}>
                                    {video.category}
                                </span>
                            </div>
                            <h3 className="font-bold text-gray-800 dark:text-white text-lg leading-tight mb-2 line-clamp-2">
                                {t(`videos.items.${video.id}.title`, video.title)}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                                {t(`videos.items.${video.id}.desc`, video.description)}
                            </p>

                            {video.tags && (
                                <div className="flex flex-wrap gap-2">
                                    {video.tags.map(tag => (
                                        <span key={tag} className="flex items-center gap-1 text-xs text-blue-500 font-medium bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
                                            <Tag size={10} /> {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {activeVideo && currentVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setActiveVideo(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-black rounded-3xl overflow-hidden w-full max-w-4xl shadow-2xl relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="absolute top-4 right-4 z-10">
                                <button
                                    onClick={() => setActiveVideo(null)}
                                    className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="aspect-video w-full">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${currentVideo.youtubeId}?autoplay=1`}
                                    title={currentVideo.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>

                            <div className="p-6 bg-white dark:bg-gray-800">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{t(`videos.items.${currentVideo.id}.title`, currentVideo.title)}</h2>
                                <p className="text-gray-600 dark:text-gray-300">{t(`videos.items.${currentVideo.id}.desc`, currentVideo.description)}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VideoLibrary;
