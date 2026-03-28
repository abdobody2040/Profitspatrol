import React from 'react';
import { motion } from 'framer-motion';
import { THEMES } from '../data/themes';
import { useTranslation } from 'react-i18next';

interface ThemeSelectorProps {
    currentTheme: string;
    onThemeChange: (theme: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
    const { t } = useTranslation();
    const themes = [
        { id: 'girls', name: t('hq.girls'), icon: '👧', gradient: 'from-pink-400 to-purple-400' },
        { id: 'boys', name: t('hq.boys'), icon: '👦', gradient: 'from-blue-400 to-cyan-400' }
    ];

    return (
        <div className="flex gap-3 justify-center mb-6">
            {themes.map((theme) => (
                <motion.button
                    key={theme.id}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onThemeChange(theme.id)}
                    className={`relative px-6 py-3 rounded-2xl font-bold text-white shadow-xl transition-all flex items-center gap-2
                        ${currentTheme === theme.id
                            ? `bg-gradient-to-r ${theme.gradient} ring-4 ring-white`
                            : `bg-gradient-to-r ${theme.gradient} opacity-70 hover:opacity-100`
                        }`}
                >
                    <span className="text-2xl">{theme.icon}</span>
                    <span>{theme.name}</span>
                    {currentTheme === theme.id && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1"
                        >
                            ✓
                        </motion.div>
                    )}
                </motion.button>
            ))}
        </div>
    );
};

export default ThemeSelector;
