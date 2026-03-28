import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X, Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
    value: string;
    onChange: (value: string) => void;
    showStrength?: boolean;
    placeholder?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
    value,
    onChange,
    showStrength = false,
    placeholder
}) => {
    const { t } = useTranslation();
    const [focused, setFocused] = useState(false);
    const [visible, setVisible] = useState(false);

    const isStrongPassword = (pwd: string) => {
        const hasLength = pwd.length >= 8;
        const hasNumber = /\d/.test(pwd);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
        return {
            hasLength,
            hasNumber,
            hasSpecial,
            isValid: hasLength && (hasNumber || hasSpecial)
        };
    };

    const strength = isStrongPassword(value);

    return (
        <div>
            <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">
                {t('auth.password')}
            </label>
            <div className="relative">
                <input
                    type={visible ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className={`w-full p-3 pr-10 rounded-xl border-2 ${showStrength && value && strength.isValid
                            ? 'border-green-500'
                            : 'border-gray-200 dark:border-gray-600'
                        } dark:bg-gray-700 dark:text-white font-bold focus:border-kid-accent outline-none transition-colors`}
                    placeholder={placeholder || t('auth.enter_password')}
                />
                <button
                    type="button"
                    onClick={() => setVisible(!visible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    {visible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            {/* Strength Indicator */}
            {showStrength && (focused || value.length > 0) && !strength.isValid && (
                <div className="mt-2 text-xs space-y-1 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-fade-in">
                    <div className={`flex items-center gap-1 ${strength.hasLength ? 'text-green-600' : 'text-gray-400'}`}>
                        {strength.hasLength ? <Check size={12} /> : <X size={12} />} 8+ Characters
                    </div>
                    <div className={`flex items-center gap-1 ${strength.hasNumber || strength.hasSpecial ? 'text-green-600' : 'text-gray-400'}`}>
                        {(strength.hasNumber || strength.hasSpecial) ? <Check size={12} /> : <X size={12} />} Number or Symbol
                    </div>
                </div>
            )}
        </div>
    );
};
