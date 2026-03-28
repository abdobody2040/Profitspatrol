import React, { useState } from 'react';
import { useAppStore } from '../../../store';
import { Video } from '../../../types';
import { Plus, Trash2, Edit, Save, X, Video as VideoIcon } from 'lucide-react';
import { useEducationStore } from "../../../store/educationStore";

const AdminVideoManager = () => {
    const { addVideo, updateVideo, deleteVideo } = useEducationStore();
    const { videos } = useEducationStore();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const emptyVideo: Video = {
        id: '',
        title: '',
        description: '',
        youtubeId: '',
        category: 'Finance',
        duration: '',
        tags: []
    };

    const [formData, setFormData] = useState<Video>(emptyVideo);

    const handleEdit = (video: Video) => {
        setEditingId(video.id);
        setFormData(video);
        setIsAdding(false);
    };

    const handleAdd = () => {
        setEditingId(null);
        setFormData({ ...emptyVideo, id: crypto.randomUUID() });
        setIsAdding(true);
    };

    const handleSave = () => {
        if (isAdding) {
            addVideo(formData);
        } else if (editingId) {
            updateVideo(editingId, formData);
        }
        setEditingId(null);
        setIsAdding(false);
        setFormData(emptyVideo);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this video?')) {
            deleteVideo(id);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white">
                    <VideoIcon className="text-red-500" /> Video Library Manager
                </h2>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                >
                    <Plus size={16} /> Add Video
                </button>
            </div>

            {(isAdding || editingId) && (
                <div className="p-6 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold mb-4 dark:text-white">{isAdding ? 'New Video' : 'Edit Video'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Title</label>
                            <input
                                className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">YouTube ID</label>
                            <input
                                className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                value={formData.youtubeId}
                                placeholder="e.g. dQw4w9WgXcQ"
                                onChange={e => setFormData({ ...formData, youtubeId: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                            <input
                                className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Duration</label>
                            <input
                                className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                value={formData.duration}
                                placeholder="e.g. 5:30"
                                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Category</label>
                            <select
                                className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                value={formData.category} // @ts-ignore
                                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                            >
                                <option value="Finance">Finance</option>
                                <option value="Mindset">Mindset</option>
                                <option value="Strategy">Strategy</option>
                                <option value="CaseStudy">CaseStudy</option>
                                <option value="Tutorial">Tutorial</option>
                            </select>
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
                            <Save size={16} /> Save Video
                        </button>
                    </div>
                </div>
            )}

            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {videos.map(video => (
                    <div key={video.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <img
                            src={`https://img.youtube.com/vi/${video.youtubeId}/default.jpg`}
                            alt="thumb"
                            className="w-24 h-16 object-cover rounded-lg bg-gray-200"
                            loading="lazy"
                        />
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-800 dark:text-white">{video.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{video.category} • {video.duration}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(video)}
                                className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(video.id)}
                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminVideoManager;
