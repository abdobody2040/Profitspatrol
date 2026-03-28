import React, { useState } from 'react';
import { useAppStore } from '../../../store';
import { useEducationStore } from '../../../store/educationStore';
import { useGameStore } from '../../../store/gameStore';
import { SHOP_ITEMS } from '../../../store'; // Or wherever constants are
import { UserRole } from '../../../types';
import { Check, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BountyList from './BountyList';
import JoinClassModal from '../../education/components/JoinClassModal';
import { Rocket, Smile, Star, Pizza, Lightbulb, Coffee, Music, Camera, Globe, Anchor, Cpu, Car, Zap, Trophy, TrendingUp, Clock, Target, Award, Edit2, Shield } from 'lucide-react';
import { FamilyManager } from '../../family/components/FamilyManager';
import YearEndReport from '../../profile/components/YearEndReport';

const ICON_MAP: Record<string, any> = {
    rocket: Rocket,
    pizza: Pizza,
    star: Star,
    smile: Smile,
    bulb: Lightbulb,
    coffee: Coffee,
    music: Music,
    camera: Camera,
    globe: Globe,
    anchor: Anchor,
    cpu: Cpu,
    car: Car,
    zap: Zap
};

const UserProfile: React.FC = () => {
    const { user, toggleEquipItem } = useAppStore();
    const classrooms = useEducationStore(state => state.classrooms);
    const { setActiveGameId } = useGameStore();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [showJoinClass, setShowJoinClass] = useState(false);

    if (!user) return null;

    const LogoIcon = user.businessLogo ? ICON_MAP[user.businessLogo.icon] || Rocket : Rocket;

    return (
        <div className="text-center py-10 space-y-8">
            <div>
                <div className="relative w-40 h-40 mx-auto mb-6">
                    {user?.businessLogo ? (
                        <div
                            className={`w-full h-full flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-700 overflow-hidden relative z-0
                                ${user.businessLogo.shape === 'circle' ? 'rounded-full' : user.businessLogo.shape === 'rounded' ? 'rounded-3xl' : 'rounded-none'}
                            `}
                            style={{ backgroundColor: user.businessLogo.backgroundColor }}
                        >
                            <LogoIcon
                                size={80}
                                color={user.businessLogo.iconColor || '#FFF'}
                                strokeWidth={2.5}
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-6xl shadow-lg border-4 border-white dark:border-gray-600">
                            🏆
                        </div>
                    )}
                    {user?.equippedItems.map(itemId => {
                        const item = SHOP_ITEMS.find(i => i.id === itemId);
                        if (!item) return null;
                        // REFACTOR: Centralized positioning logic to prevent 'Frankenstein' spaghetti
                        const getItemStyle = (id: string) => {
                            if (['hat', 'crown', 'helmet', 'cap', 'beret', 'tiara'].some(k => id.includes(k))) {
                                return { pos: "-top-10 left-1/2 -translate-x-1/2 z-20", scale: "scale-150" };
                            }
                            if (['sunglasses', 'monocle', 'glasses'].some(k => id.includes(k))) {
                                return { pos: "top-10 left-1/2 -translate-x-1/2 z-20", scale: "scale-125" };
                            }
                            if (['suit', 'cape', 'gear', 'tux'].some(k => id.includes(k))) {
                                return { pos: "bottom-0 right-0 z-20", scale: "scale-75 origin-bottom-right" };
                            }
                            return { pos: "top-0 left-0", scale: "scale-100" };
                        };

                        const { pos: positionClass, scale: scaleClass } = getItemStyle(item.id);
                        return (
                            <div key={itemId} className={`absolute ${positionClass} ${scaleClass} text-5xl drop-shadow-md`}>
                                {item.icon}
                            </div>
                        );
                    })}
                </div>

                <h2 className="text-2xl font-black text-gray-800 dark:text-white">{t('profile.title')}</h2>
                {user?.businessLogo && (
                    <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300 mt-2">{user.businessLogo.companyName}</h3>
                )}

                <button onClick={() => { setActiveGameId('brand'); navigate('/games'); }} className="mt-4 text-sm font-bold text-blue-500 hover:underline">{t('profile.edit_logo')}</button>
            </div>

            {!user?.classId && user.role === UserRole.KID && (
                <button onClick={() => setShowJoinClass(true)} className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-6 py-3 rounded-xl font-bold hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">{t('profile.join_class')}</button>
            )}

            {user?.classId && (
                <div className="inline-block bg-blue-50 dark:bg-blue-900/30 px-6 py-2 rounded-xl text-blue-600 dark:text-blue-300 font-bold border border-blue-100 dark:border-blue-800">
                    {t('profile.student_of', { class: classrooms.find(c => c.id === user.classId)?.name || 'Unknown Class' })}
                </div>
            )}

            {/* FAMILY BOUNTIES (New) */}
            {user.role === UserRole.KID && (
                <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-3xl border-2 border-gray-100 dark:border-gray-700 shadow-sm text-left">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Briefcase className="text-green-500" /> My Jobs (Bounties)
                    </h3>
                    <BountyList role={user.role} />
                </div>
            )}

            {/* YEAR-END REPORT CARD */}
            {user.role === UserRole.KID && (
                <div className="max-w-2xl mx-auto">
                    <YearEndReport />
                </div>
            )}

            {/* Family Management (Moved out of Wardrobe) */}
            <div className="max-w-2xl mx-auto mb-8">
                <FamilyManager />
            </div>

            <div className="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-800 p-6 rounded-3xl border-2 border-gray-100 dark:border-gray-700">
                <h3 className="text-gray-500 dark:text-gray-400 font-bold mb-4 uppercase text-sm tracking-widest">{t('profile.wardrobe')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {user?.inventory.filter(itemId => !itemId.startsWith('cons_')).map(itemId => {
                        const item = SHOP_ITEMS.find(i => i.id === itemId);
                        if (!item) return null;
                        const isEquipped = user.equippedItems.includes(itemId);
                        return (
                            <button
                                key={itemId}
                                onClick={() => toggleEquipItem(itemId)}
                                className={`p-4 rounded-xl shadow-sm border-2 transition-all relative flex flex-col items-center gap-2 
                                    ${isEquipped
                                        ? 'bg-green-50 dark:bg-green-900/30 border-green-400 dark:border-green-600 ring-2 ring-green-200 dark:ring-green-900'
                                        : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'}
                                `}
                            >
                                <div className="text-4xl">{item.icon}</div>
                                <div className="text-xs font-bold text-gray-600 dark:text-gray-300 leading-tight">{t(`shop_items.${item.id}` as any)}</div>
                                {isEquipped && <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-0.5"><Check size={12} strokeWidth={4} /></div>}
                            </button>
                        );
                    })}
                </div>
            </div>

            {showJoinClass && <JoinClassModal onClose={() => setShowJoinClass(false)} />}
        </div>
    );
};

export default UserProfile;
