import React, { useState } from 'react';
import { useAppStore } from '../../../store';
import { LiveSession, UserRole } from '../../../types';
import { Calendar, Clock, Video, Plus, Trash2, Edit, Save, Users, Link } from 'lucide-react';
import { useEducationStore } from '../../../store/educationStore';

const AdminLiveSessionManager = () => {
    const { sessions, addSession, updateSession, deleteSession, users, user } = useAppStore();
    const classrooms = useEducationStore(state => state.classrooms);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    // SECURITY: Defense in Depth - Ensure only Teachers/Admins can see this component
    if (!user || (user.role !== UserRole.ADMIN && user.role !== UserRole.TEACHER)) {
        return null;
    }

    const emptySession: LiveSession = {
        id: '',
        title: '',
        description: '',
        meetingUrl: '',
        hostId: users.find(u => u.role === UserRole.TEACHER || u.role === UserRole.ADMIN)?.id || '',
        startTime: new Date().toISOString().slice(0, 16),
        durationMinutes: 60,
        status: 'SCHEDULED',
        targetAudience: 'ALL'
    };

    const [formData, setFormData] = useState<LiveSession>(emptySession);

    const handleEdit = (session: LiveSession) => {
        setEditingId(session.id);
        const localTime = new Date(session.startTime);
        localTime.setMinutes(localTime.getMinutes() - localTime.getTimezoneOffset());

        setFormData({
            ...session,
            startTime: localTime.toISOString().slice(0, 16)
        });
        setIsAdding(false);
    };

    const handleAdd = () => {
        setEditingId(null);
        setFormData({ ...emptySession, id: crypto.randomUUID() });
        setIsAdding(true);
    };

    const handleSave = () => {
        const submissionData = {
            ...formData,
            startTime: new Date(formData.startTime).toISOString()
        };

        if (isAdding) {
            addSession(submissionData);
        } else if (editingId) {
            updateSession(editingId, submissionData);
        }
        setEditingId(null);
        setIsAdding(false);
        setFormData(emptySession);
    };

    const handleDelete = (id: string) => {
        if (confirm('Delete this session?')) {
            deleteSession(id);
        }
    };

    const teachers = users.filter(u => u.role === UserRole.TEACHER || u.role === UserRole.ADMIN);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white">
                    <Video className="text-purple-500" /> Live Sessions
                </h2>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                >
                    <Plus size={16} /> Schedule Session
                </button>
            </div>

            {(isAdding || editingId) && (
                <div className="p-6 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 animate-fade-in">
                    <h3 className="font-bold mb-4 dark:text-white">{isAdding ? 'Schedule New Session' : 'Edit Session'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 mb-1">Title</label>
                            <input
                                className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                            <textarea
                                className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                rows={2}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Date & Time</label>
                            <input
                                type="datetime-local"
                                className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                value={formData.startTime}
                                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Duration (Minutes)</label>
                            <input
                                type="number"
                                className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                value={formData.durationMinutes}
                                onChange={e => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 mb-1">Meeting Link (Zoom/Meet)</label>
                            <div className="flex items-center gap-2">
                                <Link size={16} className="text-gray-400" />
                                <input
                                    className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    value={formData.meetingUrl}
                                    placeholder="https://..."
                                    onChange={e => setFormData({ ...formData, meetingUrl: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Host</label>
                            <select
                                className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                value={formData.hostId}
                                onChange={e => setFormData({ ...formData, hostId: e.target.value })}
                            >
                                {teachers.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Audience</label>
                            <div className="flex gap-2">
                                <select
                                    className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    value={formData.targetAudience} // @ts-ignore
                                    onChange={e => setFormData({ ...formData, targetAudience: e.target.value as any })}
                                >
                                    <option value="ALL">All Students</option>
                                    <option value="CLASS">Specific Class</option>
                                </select>
                                {formData.targetAudience === 'CLASS' && (
                                    <select
                                        className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                        value={formData.targetId || ''}
                                        onChange={e => setFormData({ ...formData, targetId: e.target.value })}
                                    >
                                        <option value="">Select Class</option>
                                        {classrooms.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => { setIsAdding(false); setEditingId(null); }}
                            className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg flex items-center gap-2"
                        >
                            <Save size={16} /> Save Session
                        </button>
                    </div>
                </div>
            )}

            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {sessions.length === 0 && (
                    <div className="p-8 text-center text-gray-400 font-bold">No sessions scheduled.</div>
                )}
                {sessions.map(session => {
                    const host = users.find(u => u.id === session.hostId);
                    const now = new Date();
                    const start = new Date(session.startTime);
                    const end = new Date(start.getTime() + session.durationMinutes * 60000);
                    const isLive = now >= start && now <= end;
                    const isPast = now > end;

                    return (
                        <div key={session.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-sm
                                    ${isLive ? 'bg-red-500 animate-pulse' : isPast ? 'bg-gray-300' : 'bg-purple-500'}`}>
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                        {session.title}
                                        {isLive && <span className="text-[10px] bg-red-100 text-red-600 px-2 rounded-full uppercase tracking-wider">LIVE</span>}
                                    </h4>
                                    <div className="flex flex-col md:flex-row gap-1 md:gap-4 text-xs text-gray-500 dark:text-gray-400 font-medium">
                                        <span className="flex items-center gap-1"><Clock size={12} /> {start.toLocaleString()} ({session.durationMinutes}m)</span>
                                        <span className="flex items-center gap-1"><Users size={12} /> Host: {host?.name || 'Unknown'}</span>
                                        <span className="flex items-center gap-1">Audience: {session.targetAudience}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(session)}
                                    className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(session.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminLiveSessionManager;
