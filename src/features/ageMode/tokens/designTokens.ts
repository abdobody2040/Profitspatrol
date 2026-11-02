/**
 * Profits Patrol Design Tokens
 * Duolingo-Grade Polish for Kids (Junior 6-9 & Explorer 9-12)
 */

export const DESIGN_TOKENS = {
  colors: {
    // Primary: Warm Orange (Confidence, Fun, Energy)
    primary: {
      DEFAULT: '#F97316',
      hover: '#EA580C',
      active: '#C2410C',
      light: '#FFF7ED',
      border: '#FDBA74',
      shadow: '#C2410C',
      gradient: 'from-[#FF8A00] to-[#F97316]'
    },
    // Secondary: Sky Blue (Focus, Calm, Clarity)
    secondary: {
      DEFAULT: '#0EA5E9',
      hover: '#0284C7',
      active: '#0369A1',
      light: '#F0F9FF',
      border: '#7DD3FC',
      shadow: '#0369A1',
      gradient: 'from-[#38BDF8] to-[#0EA5E9]'
    },
    // Accent: Sunny Yellow (Coins, Stars, Cheer)
    accent: {
      DEFAULT: '#FACC15',
      hover: '#EAB308',
      active: '#CA8A04',
      light: '#FEFCE8',
      border: '#FDE047',
      shadow: '#A16207',
      gradient: 'from-[#FDE047] to-[#EAB308]'
    },
    // Clean Neutrals (Soft Cream, Slate, Warm White - No harsh borders)
    neutrals: {
      canvas: '#F8FAFC',
      canvasDark: '#0B1120',
      surface: '#FFFFFF',
      surfaceDark: '#1E293B',
      surfaceWarm: '#FFFDF9',
      borderSoft: 'rgba(226, 232, 240, 0.8)',
      textPrimary: '#0F172A',
      textSecondary: '#475569',
      textMuted: '#94A3B8'
    }
  },

  radius: {
    base: '20px',
    lg: '24px',
    full: '9999px',
    token: 'rounded-[20px]'
  },

  shadows: {
    soft: '0 8px 24px -4px rgba(0, 0, 0, 0.06)',
    card: '0 10px 25px -5px rgba(249, 115, 22, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
    elevated: '0 20px 30px -10px rgba(0, 0, 0, 0.1)',
    // 3D tactile button push effect
    buttonPrimary3D: '0 6px 0 #C2410C, 0 10px 15px rgba(249, 115, 22, 0.25)',
    buttonSecondary3D: '0 6px 0 #0369A1, 0 10px 15px rgba(14, 165, 233, 0.25)',
    buttonAccent3D: '0 6px 0 #A16207, 0 10px 15px rgba(250, 204, 21, 0.3)'
  },

  typography: {
    fontFamily: "'Baloo 2', 'Nunito', 'Cairo', system-ui, sans-serif",
    junior: {
      body: 'text-[20px] leading-[28px] font-bold',
      bodyLg: 'text-[22px] leading-[30px] font-extrabold',
      heading: 'text-[28px] sm:text-[34px] leading-tight font-black tracking-tight',
      subheading: 'text-[22px] sm:text-[26px] font-extrabold',
      caption: 'text-[18px] font-bold',
      minTouchSize: 'min-h-[64px] min-w-[64px]'
    },
    explorer: {
      body: 'text-[16px] leading-[24px] font-semibold',
      bodyLg: 'text-[18px] leading-[26px] font-bold',
      heading: 'text-[24px] sm:text-[30px] leading-tight font-black tracking-tight',
      subheading: 'text-[20px] sm:text-[24px] font-extrabold',
      caption: 'text-[14px] font-medium',
      minTouchSize: 'min-h-[48px] min-w-[48px]'
    }
  },

  transitions: {
    fast: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    standard: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
} as const;

export type AgeMode = 'junior' | 'explorer';
