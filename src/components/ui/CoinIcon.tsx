import React from 'react';

interface CoinIconProps {
  className?: string;
  size?: number;
}

export const CoinIcon: React.FC<CoinIconProps> = ({ className = '', size = 16 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block align-middle select-none ${className}`}
    >
      <circle cx="12" cy="12" r="10" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="7" fill="#f59e0b" />
      <text
        x="12"
        y="16"
        fill="#78350f"
        fontSize="12"
        fontWeight="black"
        textAnchor="middle"
        style={{ fontFamily: 'Cairo, sans-serif' }}
      >
        P
      </text>
    </svg>
  );
};

export default CoinIcon;
