import React from 'react';
import { Building2, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const RealEstatePlaceholder = () => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center p-10 mt-10 text-center animate-in fade-in zoom-in duration-500">
            <div className="bg-yellow-100 p-8 rounded-full mb-6 relative">
                <Building2 size={80} className="text-yellow-600" />
                <div className="absolute -bottom-2 -right-2 bg-gray-900 text-white p-2 rounded-full border-4 border-white">
                    <Lock size={20} />
                </div>
            </div>

            <h1 className="text-4xl font-black text-gray-800 mb-2">{t('real_estate.title')}</h1>
            <p className="text-xl text-gray-500 font-bold max-w-md mx-auto mb-8">
                {t('real_estate.subtitle')}
            </p>

            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full border-2 border-dashed border-gray-300">
                <div className="font-black text-xs text-gray-400 uppercase tracking-widest mb-4">{t('real_estate.sneak_peek')}</div>
                <div className="space-y-4 text-left">
                    <div className="flex items-center gap-3 opacity-50">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg"></div>
                        <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                    </div>
                    <div className="flex items-center gap-3 opacity-50">
                        <div className="w-10 h-10 bg-green-100 rounded-lg"></div>
                        <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                    </div>
                </div>
                <div className="mt-6 text-center">
                    <span className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold text-sm">
                        {t('real_estate.available_v2')}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RealEstatePlaceholder;
