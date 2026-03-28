import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, Reorder } from 'framer-motion';
import { Clock, Star, Calendar } from 'lucide-react';
import { BusinessSimulation, TimelineEvent } from '../../../../types';

interface TimelineTemplateProps {
    config?: BusinessSimulation;
    onComplete: (score: number, data: any) => void;
}

const TimelineTemplate: React.FC<TimelineTemplateProps> = ({ config, onComplete }) => {
    const { t } = useTranslation();
    const timelineConfig = config?.timeline_config || { start_hour: 12, end_hour: 20, events: [] };
    const { events, start_hour, end_hour } = timelineConfig;
    const colors = config?.visual_config?.colors || { primary: '#EC4899', background: '#FFF1F2' };

    const totalHours = end_hour - start_hour;

    // State: Scheduled events on timeline
    // Simple drag from "Available" to "Timeline". 
    // Since Framer Reorder is good for lists, let's make the Timeline a list of slots?
    // Or simpler: Just a list of scheduled events in order. We calculate times based on durations.

    const [schedule, setSchedule] = useState<TimelineEvent[]>([]);

    // Helpers
    const getUsedTime = () => schedule.reduce((acc, e) => acc + e.duration, 0);
    const getTotalFun = () => schedule.reduce((acc, e) => acc + e.fun, 0);

    const handleAdd = (event: TimelineEvent) => {
        if (getUsedTime() + event.duration <= totalHours) {
            setSchedule([...schedule, { ...event, id: event.id + Math.random() }]); // Unique IDs for instances
        }
    };

    const handleRemove = (index: number) => {
        const newSched = [...schedule];
        newSched.splice(index, 1);
        setSchedule(newSched);
    };

    const handleFinish = () => {
        // Validation? Must fill at least 50%?
        onComplete(getTotalFun() * 10, { events: schedule.length });
    };

    return (
        <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: colors.background }}>
            {/* HUD */}
            <div className="p-4 bg-white/80 backdrop-blur-md shadow-sm z-20 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-xl font-black text-xl flex items-center gap-2">
                        <Star size={20} className="fill-current" /> {getTotalFun()}
                    </div>
                    <div className={`text-sm font-bold flex items-center gap-1 ${getUsedTime() > totalHours ? 'text-red-500' : 'text-gray-600'}`}>
                        <Clock size={14} /> {getUsedTime()} / {totalHours} hrs
                    </div>
                </div>
                <button
                    onClick={handleFinish}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl font-bold transition-colors"
                >
                    Start Event
                </button>
            </div>

            <div className="flex-1 flex flex-col md:flex-row gap-4 p-4 overflow-hidden">

                {/* TIMELINE VISUALIZATION */}
                <div className="flex-1 bg-white rounded-3xl shadow-sm p-6 flex flex-col">
                    <h3 className="font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Calendar size={18} /> Schedule ({start_hour}:00 - {end_hour}:00)
                    </h3>

                    <div className="flex-1 relative bg-gray-100 rounded-xl overflow-hidden flex flex-col">
                        {/* TIME MARKERS */}
                        <div className="h-8 flex border-b border-gray-200 bg-gray-50 text-xs text-gray-400 font-mono">
                            {Array.from({ length: totalHours + 1 }).map((_, i) => (
                                <div key={i} className="flex-1 border-r border-gray-200 text-center py-2">
                                    {start_hour + i}:00
                                </div>
                            ))}
                        </div>

                        {/* EVENT BLOCKS */}
                        <div className="flex-1 p-2 flex gap-1 items-start content-start flex-wrap">
                            <Reorder.Group axis="x" values={schedule} onReorder={setSchedule} className="flex gap-1 w-full h-full">
                                {schedule.map((event, index) => (
                                    <Reorder.Item
                                        key={event.id}
                                        value={event}
                                        className="h-full rounded-lg shadow-sm flex flex-col items-center justify-center text-white relative group cursor-grab active:cursor-grabbing p-1 text-center"
                                        style={{
                                            backgroundColor: event.color,
                                            width: `${(event.duration / totalHours) * 100}%`
                                        }}
                                    >
                                        <div className="text-2xl mb-1">{event.icon}</div>
                                        <div className="font-bold text-xs truncate w-full px-1">{event.name}</div>
                                        <div className="text-[10px] opacity-80">{event.duration}h</div>

                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleRemove(index); }}
                                            className="absolute top-1 right-1 bg-black/20 hover:bg-black/40 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <div className="w-2 h-0.5 bg-white"></div>
                                        </button>
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>
                        </div>
                    </div>
                </div>

                {/* AVAILABLE EVENTS */}
                <div className="w-full md:w-80 bg-white rounded-3xl shadow-sm p-6 overflow-y-auto">
                    <h3 className="font-black text-gray-400 uppercase tracking-widest mb-4">Available Events</h3>
                    <div className="grid gap-3">
                        {events.map(event => (
                            <button
                                key={event.id}
                                onClick={() => handleAdd(event)}
                                className="bg-gray-50 hover:bg-gray-100 p-4 rounded-xl flex items-center gap-4 text-left border-2 border-transparent hover:border-gray-200 transition-all select-none"
                            >
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                                    style={{ backgroundColor: event.color + '20', color: event.color }}
                                >
                                    {event.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-gray-700">{event.name}</div>
                                    <div className="text-xs text-gray-400 font-bold">{event.duration} hours</div>
                                </div>
                                <div className="flex items-center gap-1 font-bold text-yellow-500">
                                    <Star size={14} fill="currentColor" /> {event.fun}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TimelineTemplate;

