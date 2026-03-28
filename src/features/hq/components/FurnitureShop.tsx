import React from 'react';
import { useAppStore } from '../../../store';
import { FURNITURE_ITEMS } from '../../hq/data/furniture';
import { Lock, ShoppingBag, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface FurnitureShopProps {
    onClose: () => void;
}

const FurnitureShop: React.FC<FurnitureShopProps> = ({ onClose }) => {
    const { user, buyFurniture } = useAppStore();
    const { t } = useTranslation();

    if (!user) return null;

    const handleBuy = (item: any) => {
        if (user.bizCoins >= item.cost) {
            buyFurniture(item);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border-4 border-gray-100 dark:border-gray-700 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                    <ShoppingBag className="text-purple-500" /> {t('hq.furniture_shop')}
                </h3>
                <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-xl font-black flex items-center gap-2">
                    <DollarSign size={16} /> {user.bizCoins.toLocaleString()}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto flex-1 p-2">
                {FURNITURE_ITEMS.map((item) => {
                    const isLocked = item.reqHqLevel && user.hqLevel !== item.reqHqLevel && user.hqLevel === 'hq_garage'; // Simple lock logic for MVP
                    // Better lock logic: Check if reqHqLevel index > current index. For now just check if req exists and isn't current.
                    // Actually, let's just say if you have the HQ or better. 
                    // Simplifying: If item needs 'hq_office' and you are 'hq_garage', locked.
                    const canAfford = user.bizCoins >= item.cost;
                    const inventoryCount = user.inventory.filter(id => id === item.id).length;

                    return (
                        <motion.div
                            key={item.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center relative
                                ${isLocked ? 'bg-gray-100 border-gray-200 opacity-60' : 'bg-white dark:bg-gray-700 border-purple-100 dark:border-purple-900 shadow-sm'}
                            `}
                        >
                            <div className="text-4xl mb-2">{item.icon}</div>
                            <div className="font-bold text-gray-800 dark:text-white text-sm mb-1">{t(`hq.furniture.${item.id}` as any)}</div>

                            {inventoryCount > 0 && (
                                <div className="absolute top-2 right-2 bg-blue-100 text-blue-600 text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">
                                    {inventoryCount}
                                </div>
                            )}

                            {isLocked ? (
                                <div className="mt-auto text-xs font-bold text-gray-400 flex items-center gap-1">
                                    <Lock size={12} /> {t('hq.locked')}
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleBuy(item)}
                                    disabled={!canAfford}
                                    className={`mt-auto w-full py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1
                                        ${canAfford ? 'bg-kid-primary text-yellow-900 hover:bg-yellow-400' : 'bg-gray-200 text-gray-400'}
                                    `}
                                >
                                    {item.cost} <span className="text-[10px]">🪙</span>
                                </button>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default FurnitureShop;
