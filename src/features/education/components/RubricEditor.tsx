import React, { useState } from 'react';
import { Rubric, RubricCriteria } from '../../../types';
import { Plus, Trash2, Save } from 'lucide-react';

const RubricEditor: React.FC<{ onSave: (rubric: Rubric) => void }> = ({ onSave }) => {
    const [title, setTitle] = useState('');
    const [criteria, setCriteria] = useState<RubricCriteria[]>([]);

    const addCriteria = () => {
        const newCriteria: RubricCriteria = {
            id: crypto.randomUUID(),
            title: '',
            description: '',
            maxScore: 10
        };
        setCriteria([...criteria, newCriteria]);
    };

    const updateCriteria = (id: string, field: keyof RubricCriteria, value: any) => {
        setCriteria(criteria.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const removeCriteria = (id: string) => {
        setCriteria(criteria.filter(c => c.id !== id));
    };

    const handleSave = () => {
        if (!title.trim() || criteria.length === 0) return;
        const rubric: Rubric = {
            id: crypto.randomUUID(),
            teacherId: 'admin', // Mock
            title,
            criteria
        };
        onSave(rubric);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg space-y-6">
            <h2 className="text-2xl font-black text-gray-800 dark:text-white">Create Grading Rubric</h2>

            <div>
                <label className="block text-sm font-bold text-gray-500 uppercase mb-1">Rubric Title</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 font-bold"
                    placeholder="e.g. Shark Tank Pitch"
                />
            </div>

            <div className="space-y-4">
                {criteria.map((c, idx) => (
                    <div key={c.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 relative group">
                        <button
                            onClick={() => removeCriteria(c.id)}
                            className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={18} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <input
                                    value={c.title}
                                    onChange={(e) => updateCriteria(c.id, 'title', e.target.value)}
                                    className="w-full bg-transparent font-bold border-b border-gray-300 focus:border-kid-accent outline-none mb-2"
                                    placeholder="Criteria Name"
                                />
                                <textarea
                                    value={c.description}
                                    onChange={(e) => updateCriteria(c.id, 'description', e.target.value)}
                                    className="w-full bg-transparent text-sm resize-none"
                                    placeholder="Description of what constitutes a good score..."
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-xs font-bold uppercase text-gray-400">Max Score:</label>
                                <input
                                    type="number"
                                    value={c.maxScore}
                                    onChange={(e) => updateCriteria(c.id, 'maxScore', Number(e.target.value))}
                                    className="w-20 p-2 rounded-lg bg-white dark:bg-gray-800 border text-center font-mono font-bold"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-4">
                <button
                    onClick={addCriteria}
                    className="flex-1 py-3 border-2 border-dashed border-gray-300 rounded-xl font-bold text-gray-500 hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                    <Plus size={20} /> Add Criteria
                </button>
                <button
                    onClick={handleSave}
                    disabled={!title || criteria.length === 0}
                    className="px-8 bg-black dark:bg-white text-white dark:text-black rounded-xl font-black flex items-center gap-2 disabled:opacity-50"
                >
                    <Save size={20} /> Save Rubric
                </button>
            </div>
        </div>
    );
};

export default RubricEditor;
