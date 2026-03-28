import React from 'react';
import { useAppStore } from '../../../store';
import { Video, Clock, ExternalLink, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LiveNowWidget = () => {
    const { sessions, user } = useAppStore();

    if (!user || user.role !== 'KID') return null;

    const now = new Date();
    const isTycoon = user.subscriptionTier === 'tycoon';

    // Find active or upcoming sessions for this user
    const relevantSessions = sessions.filter(s => {
        if (s.targetAudience === 'CLASS' && s.targetId && user.classId !== s.targetId) return false;
        const start = new Date(s.startTime);
        const end = new Date(start.getTime() + s.durationMinutes * 60000);
        const isUpcoming = start > now && (start.getTime() - now.getTime()) < 24 * 60 * 60 * 1000;
        const isLive = now >= start && now <= end;
        return isLive || isUpcoming;
    }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    if (relevantSessions.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
            <AnimatePresence>
                {relevantSessions.map(session => {
                    const start = new Date(session.startTime);
                    const end = new Date(start.getTime() + session.durationMinutes * 60000);
                    const isLive = now >= start && now <= end;
                    const isMentorshipSession = session.isMentorship;
                    const canJoin = !isMentorshipSession || isTycoon;

                    // Color scheme: mentorship = gold, live = red, upcoming = purple
                    const cardColor = isMentorshipSession
                        ? 'bg-gradient-to-br from-amber-600 to-yellow-500'
                        : isLive ? 'bg-red-600' : 'bg-purple-600';

                    return (
                        <motion.div
                            key={session.id}
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 100, opacity: 0 }}
                            className={`${cardColor} text-white p-4 rounded-2xl shadow-xl border-2 border-white/20`}
                        >
                            {/* Header row */}
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className={`p-2 rounded-full ${isLive ? 'bg-white/20 animate-pulse' : 'bg-white/10'}`}>
                                        {isMentorshipSession ? (
                                            <span className="text-lg">{session.speakerEmoji ?? '🎤'}</span>
                                        ) : (
                                            <Video size={20} />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-sm uppercase tracking-wide">
                                            {isMentorshipSession
                                                ? (isLive ? '🔴 LIVE MENTORSHIP' : '📅 MENTORSHIP SESSION')
                                                : (isLive ? '🔴 LIVE NOW' : 'UPCOMING CLASS')}
                                        </h4>
                                        <p className="text-xs font-bold opacity-80">
                                            {isLive ? 'Session is happening now!' : start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>

                                {/* Join button (Tycoon-gated for mentorship) */}
                                {isLive && (
                                    canJoin ? (
                                        <a
                                            href={session.meetingUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-white text-red-600 px-3 py-1.5 rounded-lg text-xs font-black hover:scale-105 transition-transform flex items-center gap-1 whitespace-nowrap"
                                        >
                                            JOIN <ExternalLink size={12} />
                                        </a>
                                    ) : (
                                        <div className="bg-white/20 border border-white/30 px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1 whitespace-nowrap opacity-70">
                                            <Lock size={12} /> Tycoon Only
                                        </div>
                                    )
                                )}
                            </div>

                            {/* Session title */}
                            <h3 className="font-bold text-lg mb-1">{session.title}</h3>

                            {/* Speaker profile card (only for mentorship sessions) */}
                            {isMentorshipSession && session.speakerName && (
                                <div className="mt-2 pt-2 border-t border-white/20 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl flex-shrink-0">
                                        {session.speakerEmoji ?? '🎤'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-black text-sm">{session.speakerName}</div>
                                        {session.speakerRole && (
                                            <div className="text-xs opacity-75 font-semibold">{session.speakerRole}</div>
                                        )}
                                        {session.speakerBio && (
                                            <div className="text-xs opacity-70 mt-1 line-clamp-2 leading-tight">{session.speakerBio}</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Description (non-mentorship) */}
                            {!isMentorshipSession && (
                                <p className="text-xs opacity-90 line-clamp-2">{session.description}</p>
                            )}

                            {/* Tycoon upgrade prompt */}
                            {isMentorshipSession && !isTycoon && (
                                <div className="mt-2 text-xs bg-black/20 rounded-lg px-3 py-2 font-semibold text-center">
                                    🌟 Upgrade to <strong>Tycoon</strong> to join live mentorship sessions
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default LiveNowWidget;
