import React from 'react';

export interface TRexIconProps {
  className?: string;
  size?: number;
}

export const TRexIcon: React.FC<TRexIconProps> = ({ className = 'w-6 h-6', size }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
    >
      {/* T-Rex silhouette: jaws, eye, crest, teeth */}
      <path d="M4 14.5c0-.83.67-1.5 1.5-1.5h1.75V11H6c-.55 0-1-.45-1-1s.45-1 1-1h1.5V7.5c0-.83.67-1.5 1.5-1.5h5c1.66 0 3 1.34 3 3v.5h2c.83 0 1.5.67 1.5 1.5v1c0 .83-.67 1.5-1.5 1.5h-1v1.5c0 .83-.67 1.5-1.5 1.5h-3v1h2.5c.55 0 1 .45 1 1s-.45 1-1 1H11v1h2.5c.55 0 1 .45 1 1s-.45 1-1 1h-6c-1.93 0-3.5-1.57-3.5-3.5v-2zm8-6c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
    </svg>
  );
};

export default TRexIcon;
