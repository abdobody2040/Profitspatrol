import React from 'react';
import { useAppStore } from '../../../store';
import { UserRole, Bounty } from '../../../types';
import { Trash2, DollarSign, User as UserIcon, Camera, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useSocialStore } from "../../../store/socialStore";
import { useTranslation } from 'react-i18next';

interface BountyListProps {
    role: UserRole;
    onEdit?: (bounty: Bounty) => void;
}

const BountyList: React.FC<BountyListProps> = ({ role, onEdit }) => {
    const { user } = useAppStore();
    const { bounties, deleteBounty, approveBounty, updateBounty, submitBountyForApproval } = useSocialStore();
    const { t } = useTranslation();

    // Filter logic could be expanded (e.g., only show relevant family members)
    // For now, show all.
    const relevantBounties = bounties.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const handleClaim = (id: string) => {
        if (!user) return;
        updateBounty(id, { assigneeId: user.id, status: 'IN_PROGRESS' });
    };

    const handleMarkDone = (bounty: Bounty) => {
        if (bounty.requiresPhoto) {
            // Trigger hidden input
            const input = document.getElementById(`photo-upload-${bounty.id}`) as HTMLInputElement;
            if (input) input.click();
        } else {
            submitBountyForApproval(bounty.id);
        }
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, bountyId: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            submitBountyForApproval(bountyId, base64String);
        };
        reader.readAsDataURL(file);
    };

    const handleApprove = (id: string) => {
        approveBounty(id);
    };

    const handleDelete = (id: string) => {
        if (window.confirm(t('social.bounties.delete_confirm', { defaultValue: 'Are you sure you want to delete this bounty?' }))) {
            deleteBounty(id);
        }
    };

    if (relevantBounties.length === 0) {
        return (
            <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 font-bold">{t('social.bounties.no_bounties', { defaultValue: 'No jobs posted yet!' })}</p>
                {role === UserRole.PARENT && <p className="text-sm text-gray-400 mt-1">{t('social.bounties.create_hint', { defaultValue: 'Click the + button to create one.' })}</p>}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <AnimatePresence>
                {relevantBounties.map((bounty) => (
                    <motion.div
                        key={bounty.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-4 transition-all
              ${bounty.status === 'COMPLETED' ? 'bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700 opacity-60' :
                                bounty.status === 'PENDING_APPROVAL' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' :
                                    'bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700 shadow-sm hover:shadow-md'}
            `}
                    >
                        <div className="flex items-center gap-4 flex-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                 ${bounty.status === 'COMPLETED' ? 'bg-gray-200 text-gray-500' :
                                    bounty.status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-600' :
                                        'bg-green-100 text-green-600'}
              `}>
                                <DollarSign size={20} />
                            </div>

                            <div>
                                <h4 className={`font-bold text-gray-800 dark:text-gray-100 ${bounty.status === 'COMPLETED' ? 'line-through' : ''}`}>
                                    {bounty.title}
                                </h4>
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                    <span className="text-green-500">{bounty.reward} {t('social.bounties.tokens', { defaultValue: 'ppTokens' })}</span>
                                    <span>•</span>
                                    <span>{bounty.status.replace('_', ' ')}</span>
                                    {bounty.assigneeId && (
                                        <span className="flex items-center gap-1 ms-1 bg-blue-50 dark:bg-blue-900/30 text-blue-500 px-1.5 py-0.5 rounded">
                                            <UserIcon size={10} /> {t('social.bounties.assigned', { defaultValue: 'Assigned' })}
                                        </span>
                                    )}
                                    {bounty.frequency && bounty.frequency !== 'ONCE' && (
                                        <span className="flex items-center gap-1 bg-purple-50 dark:bg-purple-900/30 text-purple-500 px-1.5 py-0.5 rounded">
                                            <RefreshCw size={10} /> {bounty.frequency}
                                        </span>
                                    )}
                                    {bounty.requiresPhoto && (
                                        <span className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 text-amber-500 px-1.5 py-0.5 rounded">
                                            <Camera size={10} /> {t('social.bounties.photo_req', { defaultValue: 'Photo Req.' })}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Photo Preview for Parent or Kid (after upload) */}
                        {bounty.photoUrl && (
                            <div className="relative group">
                                <img 
                                    src={bounty.photoUrl} 
                                    alt="Verification" 
                                    className="w-12 h-12 rounded-lg object-cover border-2 border-white dark:border-gray-700 shadow-sm transition-transform group-hover:scale-[3]"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg pointer-events-none" />
                            </div>
                        )}

                        <div className="flex gap-2">
                            {/* KID ACTIONS */}
                            {role === UserRole.KID && bounty.status === 'OPEN' && (
                                <button onClick={() => handleClaim(bounty.id)} className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-colors">
                                    {t('social.bounties.claim', { defaultValue: 'Claim' })}
                                </button>
                            )}
                             {role === UserRole.KID && bounty.status === 'IN_PROGRESS' && (
                                <>
                                    <input
                                        type="file"
                                        id={`photo-upload-${bounty.id}`}
                                        className="hidden"
                                        accept="image/*"
                                        capture="environment"
                                        onChange={(e) => handlePhotoUpload(e, bounty.id)}
                                    />
                                    <button onClick={() => handleMarkDone(bounty)} className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1">
                                        {bounty.requiresPhoto && <Camera size={12} />}
                                        {t('social.bounties.done', { defaultValue: 'Done?' })}
                                    </button>
                                </>
                            )}

                            {/* PARENT ACTIONS */}
                            {role === UserRole.PARENT && (
                                <>
                                    {bounty.status === 'PENDING_APPROVAL' && (
                                        <button onClick={() => handleApprove(bounty.id)} className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold transition-colors">
                                            {t('social.bounties.approve', { defaultValue: 'Approve' })}
                                        </button>
                                    )}
                                    <button onClick={() => handleDelete(bounty.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default BountyList;
