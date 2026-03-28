import React, { useState } from 'react';
import { useAppStore } from '../../../store';
import { useSocialStore } from '../../../store/socialStore';
import { UserRole } from '../../../types';
import { X, DollarSign, Briefcase, Check, Info, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

interface CreateBountyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateBountyModal: React.FC<CreateBountyModalProps> = ({ isOpen, onClose }) => {
    const { user } = useAppStore();
    const { addBounty } = useSocialStore();
    const [title, setTitle] = useState('');
    const [reward, setReward] = useState(100);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        addBounty({
            id: uuidv4(),
            creatorId: user.id,
            title,
            description: '', // MVP: No description field yet
            reward,
            status: 'OPEN',
            createdAt: new Date().toISOString()
        });

        // Reset and close
        setTitle('');
        setReward(100);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl p-6 shadow-2xl"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                        <Briefcase className="text-blue-500" /> Post New Job
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-1">Job Title</label>
                        <input
                            autoFocus
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g. Wash the Car, Clean Room..."
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 font-bold"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-1">Reward (BizCoins)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-3.5 text-gray-400" size={16} />
                            <input
                                type="number"
                                value={reward}
                                onChange={e => setReward(Number(e.target.value))}
                                className="w-full px-4 py-3 pl-9 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 font-bold"
                                min="10"
                                max="10000"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button type="submit" className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-black rounded-xl transition-transform active:scale-95 shadow-lg shadow-blue-500/30">
                            Post Job
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateBountyModal;
