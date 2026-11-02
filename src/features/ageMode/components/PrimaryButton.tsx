import React from 'react';
import { motion } from 'framer-motion';
import { useAgeMode } from '../hooks/useAgeMode';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'normal' | 'large';
  pulse?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size,
  pulse = false,
  disabled = false,
  className = '',
  icon
}) => {
  const { isJunior, playTap } = useAgeMode();

  const isLarge = size === 'large' || (size === undefined && isJunior);

  const handleClick = () => {
    if (disabled) return;
    playTap();
    onClick?.();
  };

  // 3D tactile button styles with bottom border depth
  const variantStyles = {
    primary: {
      bg: 'bg-gradient-to-b from-[#FF8A00] to-[#F97316]',
      shadow: 'shadow-[0_6px_0_#C2410C,0_12px_20px_rgba(249,115,22,0.3)]',
      activeShadow: 'active:shadow-[0_2px_0_#C2410C,0_4px_8px_rgba(249,115,22,0.2)]',
      text: 'text-white'
    },
    secondary: {
      bg: 'bg-gradient-to-b from-[#38BDF8] to-[#0EA5E9]',
      shadow: 'shadow-[0_6px_0_#0369A1,0_12px_20px_rgba(14,165,233,0.3)]',
      activeShadow: 'active:shadow-[0_2px_0_#0369A1,0_4px_8px_rgba(14,165,233,0.2)]',
      text: 'text-white'
    },
    accent: {
      bg: 'bg-gradient-to-b from-[#FDE047] to-[#EAB308]',
      shadow: 'shadow-[0_6px_0_#A16207,0_12px_20px_rgba(234,179,8,0.35)]',
      activeShadow: 'active:shadow-[0_2px_0_#A16207,0_4px_8px_rgba(234,179,8,0.25)]',
      text: 'text-amber-950'
    }
  }[variant];

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { y: 4, scale: 0.98 }}
      animate={
        pulse && !disabled
          ? {
              scale: [1, 1.03, 1],
              transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' }
            }
          : {}
      }
      onClick={handleClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-2.5 rounded-[20px] font-black tracking-wide select-none transition-all active:translate-y-1 ${
        isLarge
          ? 'h-16 px-8 text-[20px] sm:text-[22px] min-w-[200px]'
          : 'h-12 px-6 text-[16px] sm:text-[17px] min-w-[150px]'
      } ${variantStyles.bg} ${variantStyles.shadow} ${variantStyles.activeShadow} ${variantStyles.text} ${
        disabled
          ? 'opacity-50 cursor-not-allowed shadow-none active:translate-y-0'
          : 'cursor-pointer'
      } ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
};
