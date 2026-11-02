import React from 'react';
import { motion } from 'framer-motion';

const OllieBase: React.FC<{ children: React.ReactNode; floating?: boolean }> = ({ children, floating = true }) => {
    return (
        <motion.div
            className="w-24 h-24 flex items-center justify-center relative"
            animate={floating ? { y: [0, -8, 0] } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
            <img 
                src="/assets/ollie_wave.png" 
                alt="Ollie" 
                className="w-[85%] h-[85%] object-contain select-none pointer-events-none drop-shadow-xl" 
            />
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full select-none pointer-events-none z-10">
                {children}
            </svg>
        </motion.div>
    );
};

export const OllieIdle: React.FC = () => (
    <OllieBase>
        {/* Bowtie */}
        <path d="M45,52 L55,58 L45,58 L55,52 Z" fill="#ef4444" />
        <circle cx="50" cy="55" r="3" fill="#fca5a5" />
    </OllieBase>
);

export const OllieHappy: React.FC = () => (
    <OllieBase>
        {/* Rosy cheeks */}
        <circle cx="27" cy="48" r="4.5" fill="#fda4af" opacity="0.6" />
        <circle cx="73" cy="48" r="4.5" fill="#fda4af" opacity="0.6" />
        {/* Big smile below beak */}
        <path d="M 46,51 Q 50,56 54,51" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </OllieBase>
);

export const OllieThinking: React.FC = () => (
    <OllieBase>
        {/* Glowing bulb above head */}
        <g transform="translate(50, -5) scale(0.8)">
            <motion.circle
                cx="0" cy="0" r="10" fill="#f59e0b"
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            />
            <path d="M-5,5 L5,5 L3,10 L-3,10 Z" fill="#94a3b8" />
            <path d="M-3,10 L3,10 L1,12 L-1,12 Z" fill="#64748b" />
            <line x1="0" y1="-12" x2="0" y2="-17" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
            <line x1="-12" y1="-5" x2="-17" y2="-7" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="-5" x2="17" y2="-7" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
        </g>
    </OllieBase>
);

export const OllieSuccess: React.FC = () => (
    <OllieBase>
        {/* Golden Trophy cup in front */}
        <g transform="translate(50, 56) scale(0.35)">
            <rect x="-10" y="25" width="20" height="8" fill="#d97706" rx="2" />
            <rect x="-4" y="15" width="8" height="12" fill="#fbbf24" />
            <polygon points="-25,-10 25,-10 18,18 -18,18" fill="#f59e0b" />
            <circle cx="0" cy="0" r="15" fill="#fbbf24" />
            {/* Handles */}
            <path d="M-22,-5 C-32,-5 -28,12 -18,12" stroke="#d97706" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M22,-5 C32,-5 28,12 18,12" stroke="#d97706" strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* Sparkle */}
            <polygon points="0,-18 3,-12 9,-12 5,-8 7,-2 0,-5 -7,-2 -5,-8 -9,-12 -3,-12" fill="#ffffff" />
        </g>
    </OllieBase>
);

export const OllieWarning: React.FC = () => (
    <OllieBase>
        {/* Yellow Hard Hat at top of owl head */}
        <path d="M 32,27 C 32,15 68,15 68,27 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
        <ellipse cx="50" cy="27" rx="21" ry="3" fill="#d97706" />
        {/* Helmet stripe */}
        <rect x="47" y="16" width="6" height="11" fill="#f59e0b" />
        
        {/* Triangle Warning sign */}
        <g transform="translate(72, 68) scale(0.25)">
            <polygon points="0,-30 30,22 -30,22" fill="#ef4444" stroke="#b91c1c" strokeWidth="4" />
            <polygon points="0,-22 22,17 -22,17" fill="#ffffff" />
            <rect x="-3.5" y="-5" width="7" height="12" fill="#ef4444" rx="1" />
            <circle cx="0" cy="11" r="4.5" fill="#ef4444" />
        </g>
    </OllieBase>
);

export const OllieTeacher: React.FC = () => (
    <OllieBase>
        {/* Reading glasses */}
        <circle cx="37" cy="38" r="9" stroke="#ef4444" strokeWidth="2.5" fill="none" />
        <circle cx="63" cy="38" r="9" stroke="#ef4444" strokeWidth="2.5" fill="none" />
        <line x1="46" y1="38" x2="54" y2="38" stroke="#ef4444" strokeWidth="2.5" />
        
        {/* Pointer Stick */}
        <motion.line
            x1="22" y1="52" x2="-2" y2="35"
            stroke="#b45309" strokeWidth="3.5" strokeLinecap="round"
            animate={{ rotate: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
        />
    </OllieBase>
);

export const OllieCelebration: React.FC = () => (
    <OllieBase>
        {/* Party Hat */}
        <polygon points="40,24 60,24 50,2" fill="#3b82f6" />
        <polygon points="43,24 57,24 50,7" fill="#f43f5e" />
        <circle cx="50" cy="1" r="3.5" fill="#fbbf24" />
    </OllieBase>
);

export const CozyGarage: React.FC = () => (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
        {/* Base block (isometric garage foundation) */}
        <polygon points="60,95 105,72 60,50 15,72" fill="#94a3b8" />
        <polygon points="15,72 60,95 60,115 15,92" fill="#64748b" />
        <polygon points="60,95 105,72 105,92 60,115" fill="#475569" />
        {/* Brick Garage structure */}
        <polygon points="60,82 100,62 60,42 20,62" fill="#fca5a5" />
        <polygon points="20,62 60,82 60,105 20,85" fill="#f87171" />
        <polygon points="60,82 100,62 100,85 60,105" fill="#dc2626" />
        {/* Roof wedge */}
        <polygon points="60,25 106,47 60,70 14,47" fill="#ef4444" />
        <polygon points="14,47 60,70 60,75 14,52" fill="#b91c1c" />
        {/* Garage Door (dark open roll-up) */}
        <polygon points="28,75 52,87 52,98 28,86" fill="#1e293b" />
        <polygon points="30,77 50,87 50,88 30,78" fill="#fbcfe8" stroke="#ec4899" strokeWidth="1" />
        {/* Glowing light bulb inside */}
        <circle cx="40" cy="85" r="4.5" fill="#fbbf24" className="animate-pulse" />
    </svg>
);

export const MoneyAcademy: React.FC = () => (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
        {/* Steps foundation */}
        <polygon points="60,98 110,73 60,48 10,73" fill="#cbd5e1" />
        <polygon points="10,73 60,98 60,104 10,79" fill="#94a3b8" />
        <polygon points="60,98 110,73 110,79 60,104" fill="#64748b" />
        {/* Middle step */}
        <polygon points="60,92 104,70 60,48 16,70" fill="#e2e8f0" />
        <polygon points="16,70 60,92 60,96 16,74" fill="#cbd5e1" />
        {/* Greek Pillars (Marble) */}
        <g stroke="#64748b" strokeWidth="1.5">
            {/* Left */}
            <rect x="28" y="52" width="6" height="24" fill="#f8fafc" />
            {/* Middle */}
            <rect x="57" y="52" width="6" height="24" fill="#f8fafc" />
            {/* Right */}
            <rect x="86" y="52" width="6" height="24" fill="#f8fafc" />
        </g>
        {/* Triangular Pediment (Academy Top Roof) */}
        <polygon points="60,28 108,52 12,52" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
        {/* Coin emblem inside pediment */}
        <circle cx="60" cy="44" r="5" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
    </svg>
);

export const LemonadeStand: React.FC = () => (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
        {/* Wood counter base */}
        <polygon points="60,95 102,74 60,53 18,74" fill="#d97706" />
        <polygon points="18,74 60,95 60,110 18,89" fill="#b45309" />
        <polygon points="60,95 102,74 102,89 60,110" fill="#78350f" />
        {/* Lemon jar on counter */}
        <rect x="42" y="44" width="12" height="16" rx="2" fill="#e0f2fe" opacity="0.8" stroke="#38bdf8" />
        <circle cx="48" cy="52" r="3.5" fill="#fbbf24" />
        {/* Striped Canopy roof */}
        <polygon points="60,22 105,45 60,68 15,45" fill="#fbbf24" />
        {/* Canopy posts */}
        <line x1="20" y1="46" x2="20" y2="78" stroke="#92400e" strokeWidth="3" />
        <line x1="100" y1="46" x2="100" y2="78" stroke="#92400e" strokeWidth="3" />
        {/* Yellow striped markings */}
        <polygon points="60,22 82,33 45,52 23,41" fill="#ffffff" opacity="0.3" />
    </svg>
);

export const JuicyCart: React.FC = () => (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
        {/* Cart body */}
        <polygon points="60,90 95,72 60,55 25,72" fill="#38bdf8" />
        <polygon points="25,72 60,90 60,105 25,87" fill="#0284c7" />
        <polygon points="60,90 95,72 95,87 60,105" fill="#0369a1" />
        {/* Blender cup */}
        <polygon points="50,42 70,42 66,58 54,58" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
        {/* Green straw */}
        <line x1="60" y1="34" x2="65" y2="46" stroke="#22c55e" strokeWidth="2.5" />
        {/* Wheels */}
        <circle cx="36" cy="98" r="10" fill="#1e293b" stroke="#475569" strokeWidth="2" />
        <circle cx="84" cy="98" r="10" fill="#1e293b" stroke="#475569" strokeWidth="2" />
    </svg>
);

export const BurgerTruck: React.FC = () => (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
        {/* Truck block body */}
        <polygon points="60,90 108,66 60,42 12,66" fill="#f1f5f9" />
        <polygon points="12,66 60,90 60,108 12,84" fill="#cbd5e1" />
        <polygon points="60,90 108,66 108,84 60,108" fill="#94a3b8" />
        {/* Giant Hamburger on roof */}
        <g transform="translate(60,35) scale(0.8)">
            {/* Bun bottom */}
            <ellipse cx="0" cy="10" rx="22" ry="5" fill="#d97706" />
            {/* Burger patty */}
            <ellipse cx="0" cy="5" rx="23" ry="5" fill="#78350f" />
            {/* Lettuce */}
            <path d="M-24,2 Q-12,5 0,2 Q12,5 24,2" stroke="#22c55e" strokeWidth="3" fill="none" />
            {/* Bun top */}
            <path d="M-22,-2 C-22,-15 22,-15 22,-2 Z" fill="#d97706" />
            {/* Sesame seeds */}
            <circle cx="-6" cy="-8" r="1" fill="#fef08a" />
            <circle cx="6" cy="-6" r="1" fill="#fef08a" />
            <circle cx="0" cy="-10" r="1" fill="#fef08a" />
        </g>
        {/* Wheels */}
        <circle cx="32" cy="102" r="9" fill="#1e293b" />
        <circle cx="88" cy="102" r="9" fill="#1e293b" />
    </svg>
);

export const FriesStand: React.FC = () => (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
        {/* Red cup */}
        <polygon points="42,95 78,95 86,52 34,52" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
        {/* Fries popping out */}
        <g stroke="#fbbf24" strokeWidth="5" strokeLinecap="round">
            <line x1="42" y1="52" x2="38" y2="28" />
            <line x1="50" y1="52" x2="48" y2="22" />
            <line x1="58" y1="52" x2="60" y2="20" />
            <line x1="68" y1="52" x2="72" y2="24" />
            <line x1="76" y1="52" x2="80" y2="30" />
        </g>
        {/* Smile face on cup */}
        <path d="M 54,72 Q 60,78 66,72" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
);

export const MiniMart: React.FC = () => (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
        {/* Shop structure */}
        <polygon points="60,95 106,72 60,50 14,72" fill="#e2e8f0" />
        <polygon points="14,72 60,95 60,112 14,89" fill="#94a3b8" />
        <polygon points="60,95 106,72 106,92 60,112" fill="#64748b" />
        {/* Green canopy roof */}
        <polygon points="60,32 110,57 60,82 10,57" fill="#16a34a" />
        <polygon points="10,57 60,82 60,86 10,61" fill="#14532d" />
        {/* Glass door print */}
        <polygon points="35,78 52,86 52,98 35,90" fill="#e0f2fe" stroke="#38bdf8" />
    </svg>
);

export const ToyBoutique: React.FC = () => (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
        {/* Boutique structure */}
        <polygon points="60,95 106,72 60,50 14,72" fill="#fdf2f8" />
        <polygon points="14,72 60,95 60,112 14,89" fill="#fbcfe8" />
        <polygon points="60,95 106,72 106,92 60,112" fill="#f472b6" />
        {/* Pink Teddy ears emblem on top */}
        <circle cx="36" cy="40" r="14" fill="#ec4899" />
        <circle cx="84" cy="40" r="14" fill="#ec4899" />
        <polygon points="60,35 96,55 60,75 24,55" fill="#f43f5e" />
    </svg>
);

export const TechIncubator: React.FC = () => (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
        {/* Silver Dome */}
        <polygon points="60,95 106,72 60,50 14,72" fill="#cbd5e1" />
        <polygon points="14,72 60,95 60,112 14,89" fill="#94a3b8" />
        <polygon points="60,95 106,72 106,92 60,112" fill="#64748b" />
        
        {/* Glowing cyber sphere */}
        <motion.ellipse
            cx="60" cy="62" rx="32" ry="22" fill="url(#cyanGlow)"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
        />
        
        <defs>
            <radialGradient id="cyanGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
            </radialGradient>
        </defs>
    </svg>
);

export const LaunchPad: React.FC = () => (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
        {/* Launch pad base */}
        <polygon points="60,98 106,75 60,52 14,75" fill="#334155" />
        {/* Gantry crane frame (red truss lattice) */}
        <line x1="28" y1="75" x2="28" y2="35" stroke="#ef4444" strokeWidth="4" />
        <line x1="28" y1="55" x2="42" y2="55" stroke="#ef4444" strokeWidth="2.5" />
        {/* Rocket */}
        <motion.g
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
        >
            <rect x="52" y="38" width="16" height="38" fill="#f8fafc" rx="4" stroke="#475569" strokeWidth="1" />
            <polygon points="60,16 52,38 68,38" fill="#ef4444" />
            {/* Boosters */}
            <polygon points="52,65 46,76 52,76" fill="#ef4444" />
            <polygon points="68,65 74,76 68,76" fill="#ef4444" />
            {/* Fire glow */}
            <circle cx="60" cy="80" r="4" fill="#f97316" />
        </motion.g>
    </svg>
);

export const SkyscraperTower: React.FC = () => (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
        {/* Giant corporate highrise */}
        <polygon points="60,95 95,78 60,60 25,78" fill="#e0f2fe" />
        <polygon points="25,78 60,95 60,115 25,98" fill="#38bdf8" />
        <polygon points="60,95 95,78 95,98 60,115" fill="#0284c7" />
        
        {/* Tall extension */}
        <polygon points="60,60 95,43 60,25 25,43" fill="#e0f2fe" />
        <polygon points="25,43 60,60 60,78 25,60" fill="#0284c7" />
        <polygon points="60,60 95,43 95,60 60,78" fill="#0369a1" />
        
        {/* Window dots */}
        <circle cx="40" cy="50" r="1.5" fill="#ffffff" />
        <circle cx="48" cy="54" r="1.5" fill="#ffffff" />
        <circle cx="72" cy="50" r="1.5" fill="#ffffff" />
        <circle cx="80" cy="54" r="1.5" fill="#ffffff" />
    </svg>
);

export const BoardroomHub: React.FC = () => (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
        {/* Glass boardroom pavilion */}
        <polygon points="60,95 106,72 60,50 14,72" fill="#e0f2fe" opacity="0.6" stroke="#38bdf8" />
        <polygon points="14,72 60,95 60,110 14,87" fill="#0284c7" />
        <polygon points="60,95 106,72 106,87 60,110" fill="#0369a1" />
        
        {/* Conference table inside */}
        <ellipse cx="60" cy="72" rx="18" ry="8" fill="#92400e" />
    </svg>
);

export const BankVault: React.FC = () => (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
        {/* Outer reinforced frame */}
        <polygon points="60,95 106,72 60,50 14,72" fill="#cbd5e1" />
        <polygon points="14,72 60,95 60,112 14,89" fill="#94a3b8" />
        <polygon points="60,95 106,72 106,92 60,112" fill="#64748b" />
        
        {/* Round golden vault door */}
        <circle cx="60" cy="74" r="24" fill="#fbbf24" stroke="#d97706" strokeWidth="3" />
        {/* Turn wheel */}
        <motion.circle
            cx="60" cy="74" r="8" fill="#94a3b8" stroke="#475569" strokeWidth="2.5"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        />
        <line x1="60" y1="62" x2="60" y2="86" stroke="#475569" strokeWidth="2.5" />
        <line x1="48" y1="74" x2="72" y2="74" stroke="#475569" strokeWidth="2.5" />
    </svg>
);

export const CargoShip: React.FC = () => (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
        {/* Red hull */}
        <path d="M 16,78 L 104,78 L 88,96 L 32,96 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
        {/* Ship bridge cabin */}
        <rect x="74" y="52" width="14" height="26" fill="#f8fafc" stroke="#475569" />
        {/* Stacked Cargo containers */}
        <rect x="26" y="62" width="14" height="16" fill="#3b82f6" rx="1" />
        <rect x="42" y="62" width="14" height="16" fill="#10b981" rx="1" />
        <rect x="58" y="62" width="14" height="16" fill="#fbbf24" rx="1" />
    </svg>
);

export const StockExchange: React.FC = () => (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
        {/* Greek temple facade */}
        <polygon points="60,95 106,72 60,50 14,72" fill="#f1f5f9" />
        <polygon points="14,72 60,95 60,112 14,89" fill="#cbd5e1" />
        <polygon points="60,95 106,72 106,92 60,112" fill="#94a3b8" />
        {/* Green rising trendline in front */}
        <motion.path
            d="M 20,85 L 50,68 L 74,75 L 100,50"
            fill="none" stroke="#22c55e" strokeWidth="4.5" strokeLinecap="round"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
        />
        <circle cx="100" cy="50" r="3.5" fill="#22c55e" />
    </svg>
);

export const ChargingBull: React.FC = () => (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
        {/* Golden Bull statue figure */}
        <g fill="#fbbf24" stroke="#d97706" strokeWidth="2">
            {/* Body */}
            <ellipse cx="60" cy="72" rx="26" ry="16" />
            {/* Head */}
            <circle cx="36" cy="62" r="11" />
            {/* Horns */}
            <path d="M28,52 C24,42 36,48 36,52" fill="none" strokeWidth="4" />
            <path d="M38,52 C36,40 48,46 42,52" fill="none" strokeWidth="4" />
            {/* Legs */}
            <rect x="42" y="84" width="7" height="15" rx="1" />
            <rect x="72" y="84" width="7" height="15" rx="1" />
        </g>
    </svg>
);

export const GlobalHQ: React.FC = () => (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
        {/* Huge circular tech dome */}
        <circle cx="60" cy="72" r="38" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2.5" />
        
        {/* Floating holographic globe banner */}
        <g transform="translate(60, 52) scale(0.6)">
            <motion.circle
                cx="0" cy="0" r="26" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="6 8"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            />
            <ellipse cx="0" cy="0" rx="26" ry="8" fill="none" stroke="#06b6d4" strokeWidth="1.5" />
            <ellipse cx="0" cy="0" rx="8" ry="26" fill="none" stroke="#06b6d4" strokeWidth="1.5" />
        </g>
    </svg>
);

export const CryptoServer: React.FC = () => (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
        {/* Server tower stack */}
        <polygon points="60,95 98,76 60,58 22,76" fill="#334155" />
        <polygon points="22,76 60,95 60,112 22,93" fill="#1e293b" />
        <polygon points="60,95 98,76 98,93 60,112" fill="#0f172a" />
        {/* LED Nodes flashing */}
        <motion.circle
            cx="40" cy="86" r="2" fill="#22c55e"
            animate={{ opacity: [0.1, 1, 0.1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
        />
        <motion.circle
            cx="50" cy="91" r="2" fill="#3b82f6"
            animate={{ opacity: [1, 0.1, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
        />
        <motion.circle
            cx="72" cy="86" r="2" fill="#ef4444"
            animate={{ opacity: [0.1, 1, 0.1] }}
            transition={{ duration: 0.7, repeat: Infinity }}
        />
    </svg>
);

export const PineTree: React.FC = () => (
    <svg viewBox="0 0 60 80" className="w-full h-full drop-shadow-md select-none">
        <rect x="27" y="58" width="6" height="15" fill="#78350f" />
        <polygon points="30,12 48,42 12,42" fill="#15803d" />
        <polygon points="30,26 44,52 16,52" fill="#166534" />
        <polygon points="30,38 42,60 18,60" fill="#14532d" />
    </svg>
);

export const OakTree: React.FC = () => (
    <svg viewBox="0 0 60 80" className="w-full h-full drop-shadow-md select-none">
        <rect x="27" y="52" width="6" height="20" fill="#78350f" />
        <circle cx="30" cy="36" r="22" fill="#166534" />
        <circle cx="20" cy="30" r="16" fill="#15803d" />
        <circle cx="40" cy="32" r="15" fill="#14532d" />
    </svg>
);

export const Bush: React.FC = () => (
    <svg viewBox="0 0 60 40" className="w-full h-full drop-shadow-sm select-none">
        <ellipse cx="30" cy="24" rx="20" ry="12" fill="#166534" />
        <ellipse cx="20" cy="18" rx="14" ry="10" fill="#15803d" />
        <ellipse cx="40" cy="20" rx="12" ry="8" fill="#22c55e" />
    </svg>
);

export const Flower: React.FC = () => (
    <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-xs select-none">
        <line x1="20" y1="20" x2="20" y2="38" stroke="#15803d" strokeWidth="3" />
        {/* Petals */}
        <circle cx="20" cy="14" r="6" fill="#f43f5e" />
        <circle cx="14" cy="20" r="6" fill="#f43f5e" />
        <circle cx="26" cy="20" r="6" fill="#f43f5e" />
        <circle cx="20" cy="26" r="6" fill="#f43f5e" />
        {/* Core */}
        <circle cx="20" cy="20" r="5" fill="#f59e0b" />
    </svg>
);

export const LampPost: React.FC = () => (
    <svg viewBox="0 0 40 80" className="w-full h-full select-none">
        <line x1="20" y1="78" x2="20" y2="28" stroke="#475569" strokeWidth="3" />
        <path d="M 14,28 L 26,28 L 20,18 Z" fill="#334155" />
        {/* Glowing bulb */}
        <circle cx="20" cy="32" r="4.5" fill="#fef08a" className="animate-pulse" />
        
        {/* Soft isometric light cone overlay */}
        <polygon points="20,32 5,78 35,78" fill="#fef08a" opacity="0.12" />
    </svg>
);

export const BusinessFountain: React.FC = () => (
    <svg viewBox="0 0 80 60" className="w-full h-full drop-shadow-md select-none">
        {/* Pool base */}
        <ellipse cx="40" cy="48" rx="32" ry="10" fill="#64748b" stroke="#475569" strokeWidth="2" />
        <ellipse cx="40" cy="46" rx="28" ry="8" fill="#38bdf8" />
        {/* Water spout */}
        <motion.path
            d="M 40,46 Q 30,12 40,8 Q 50,12 40,46"
            fill="none" stroke="#e0f2fe" strokeWidth="4" strokeLinecap="round"
            animate={{ scaleY: [0.9, 1.1, 0.9] }}
            transition={{ duration: 1.2, repeat: Infinity }}
        />
        <circle cx="40" cy="7" r="3.5" fill="#ffffff" />
    </svg>
);

export const StreetSign: React.FC = () => (
    <svg viewBox="0 0 60 80" className="w-full h-full drop-shadow-sm select-none">
        <rect x="28" y="44" width="4" height="32" fill="#78350f" />
        {/* Sign boards */}
        <polygon points="12,14 48,14 54,23 48,32 12,32" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
        <text x="28" y="25" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">TYCOON</text>
    </svg>
);

export const DistrictGate: React.FC = () => (
    <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-lg select-none">
        {/* Stone pillars */}
        <rect x="15" y="20" width="12" height="55" fill="#94a3b8" rx="2" stroke="#64748b" strokeWidth="2" />
        <rect x="73" y="20" width="12" height="55" fill="#94a3b8" rx="2" stroke="#64748b" strokeWidth="2" />
        {/* Pillar caps */}
        <rect x="12" y="14" width="18" height="6" fill="#64748b" rx="1" />
        <rect x="70" y="14" width="18" height="6" fill="#64748b" rx="1" />
        {/* Golden Arch */}
        <path d="M 21,20 C 21,-5 79,-5 79,20" fill="none" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />
        <path d="M 21,20 C 21,-5 79,-5 79,20" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
        {/* Sign in the center of the arch */}
        <g transform="translate(50, 10)">
            <rect x="-20" y="-8" width="40" height="16" fill="#7f1d1d" rx="4" stroke="#fca5a5" strokeWidth="1.5" />
            <text x="0" y="3" fill="#ffffff" fontSize="6" fontWeight="black" textAnchor="middle" letterSpacing="0.5px">WELCOME</text>
        </g>
    </svg>
);

export const DistrictBridge: React.FC = () => (
    <svg viewBox="0 0 140 60" className="w-full h-full drop-shadow-md select-none">
        {/* Under-bridge water shadow */}
        <ellipse cx="70" cy="48" rx="55" ry="10" fill="#0369a1" opacity="0.4" />
        {/* Stone Arch Base */}
        <path d="M 15,48 L 125,48 Q 70,20 15,48" fill="#475569" stroke="#1e293b" strokeWidth="2" />
        {/* Bridge deck */}
        <path d="M 10,36 L 130,36 L 130,42 L 10,42 Z" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5" />
        {/* Handrails */}
        <g stroke="#b45309" strokeWidth="2.5" strokeLinecap="round">
            <line x1="15" y1="36" x2="15" y2="22" />
            <line x1="38" y1="36" x2="38" y2="22" />
            <line x1="61" y1="36" x2="61" y2="22" />
            <line x1="84" y1="36" x2="84" y2="22" />
            <line x1="107" y1="36" x2="107" y2="22" />
            <line x1="125" y1="36" x2="125" y2="22" />
            {/* Top rail curve */}
            <path d="M 15,22 Q 70,14 125,22" fill="none" stroke="#d97706" strokeWidth="3" />
        </g>
    </svg>
);

export const SkySun: React.FC = () => (
    <svg viewBox="0 0 80 80" className="w-full h-full select-none">
        <motion.g
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        >
            {/* Sun Rays */}
            <g stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" opacity="0.6">
                <line x1="40" y1="10" x2="40" y2="70" />
                <line x1="10" y1="40" x2="70" y2="40" />
                <line x1="19" y1="19" x2="61" y2="61" />
                <line x1="19" y1="61" x2="61" y2="19" />
            </g>
        </motion.g>
        {/* Inner Sun Disk */}
        <circle cx="40" cy="40" r="18" fill="#fbbf24" stroke="#d97706" strokeWidth="3.5" />
        <circle cx="40" cy="40" r="14" fill="#fef08a" />
    </svg>
);

export const SkyMoon: React.FC = () => (
    <svg viewBox="0 0 80 80" className="w-full h-full select-none">
        {/* Twinkling stars in background */}
        <g fill="#ffffff">
            <motion.circle cx="15" cy="20" r="1.5" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5 }} />
            <motion.circle cx="65" cy="25" r="2" animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
            <motion.circle cx="25" cy="55" r="1" animate={{ opacity: [0.1, 0.9, 0.1] }} transition={{ repeat: Infinity, duration: 1.2 }} />
        </g>
        {/* Crescent Moon */}
        <path 
            d="M 45,15 A 25,25 0 1,0 45,65 A 27,27 0 0,1 45,15 Z" 
            fill="#fef08a" 
            stroke="#fbbf24" 
            strokeWidth="1.5" 
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_8px_rgba(253,224,71,0.5)]"
        />
    </svg>
);

export const FoundersNotebook: React.FC = () => (
    <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-md">
        <rect x="14" y="8" width="32" height="44" rx="3" fill="#1e3a8a" stroke="#1e293b" strokeWidth="2.5" />
        {/* Spiral coils */}
        <line x1="10" y1="14" x2="16" y2="14" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="22" x2="16" y2="22" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="30" x2="16" y2="30" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="38" x2="16" y2="38" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="46" x2="16" y2="46" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        {/* Golden emblem badge */}
        <polygon points="30,22 34,28 40,28 35,32 37,38 30,34 23,38 25,32 20,28 26,28" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
    </svg>
);

export const GoldenLemon: React.FC = () => (
    <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-md">
        {/* Lemon contour */}
        <ellipse cx="30" cy="30" rx="18" ry="14" fill="#fbbf24" stroke="#d97706" strokeWidth="3" />
        <circle cx="13" cy="30" r="3" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
        <circle cx="47" cy="30" r="3" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
        {/* Mini Golden crown */}
        <polygon points="22,18 24,8 30,14 36,8 38,18" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
    </svg>
);

export const FoodTruckKey: React.FC = () => (
    <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-md">
        <circle cx="22" cy="22" r="11" fill="#f59e0b" stroke="#b45309" strokeWidth="3" />
        <circle cx="22" cy="22" r="5" fill="#fef08a" />
        {/* Shaft */}
        <rect x="32" y="19" width="18" height="6" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
        {/* Teeth */}
        <rect x="42" y="24" width="4" height="6" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
        <rect x="47" y="24" width="4" height="6" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
    </svg>
);

export const MerchantBadge: React.FC = () => (
    <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-md">
        <polygon points="30,6 50,18 50,42 30,54 10,42 10,18" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="3" />
        <polygon points="30,12 44,22 44,38 30,48 16,38 16,22" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
        <text x="30" y="33" fill="#78350f" fontSize="9" fontWeight="black" textAnchor="middle">M</text>
    </svg>
);

export const RocketCore: React.FC = () => (
    <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-md">
        <circle cx="30" cy="30" r="22" fill="#1e293b" stroke="#475569" strokeWidth="3" />
        {/* Energy cell cylinder */}
        <rect x="22" y="16" width="16" height="28" rx="2" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
        {/* Glowing pulsing glow */}
        <motion.circle
            cx="30" cy="30" r="10" fill="#10b981" opacity="0.8"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
        />
    </svg>
);

export const ExecutiveSeal: React.FC = () => (
    <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-md">
        {/* Red wax stamp circle */}
        <circle cx="30" cy="30" r="23" fill="#dc2626" stroke="#991b1b" strokeWidth="3" />
        <circle cx="30" cy="30" r="19" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" strokeDasharray="3 3" />
        {/* Monogram stamp pattern */}
        <path d="M 22,22 L 38,22 L 30,32 L 38,42 L 22,42" fill="none" stroke="#fef08a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// We need a tiny fix for the above: </g> instead of </g> is okay, but wait, the syntax has <path ... /> and then </g> but no starting <g>. Let's make sure it closes with </svg>! Ah, yes, it should close with </svg>. Let's write the rest of the collectibles.
// Wait! Let's correct that path tag closure. In the file content, line 583 starts with `</g>`. Let's change it to `</svg>`.
// Yes! Let's write the code accurately:

export const GoldenVaultKey: React.FC = () => (
    <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-md">
        <circle cx="20" cy="30" r="12" fill="none" stroke="#fbbf24" strokeWidth="4" />
        <rect x="30" y="27" width="22" height="6" fill="#fbbf24" rx="1" />
        <rect x="42" y="33" width="5" height="8" fill="#fbbf24" />
        <rect x="49" y="33" width="5" height="8" fill="#fbbf24" />
    </svg>
);

export const GoldenBull: React.FC = () => (
    <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-md">
        <circle cx="30" cy="30" r="26" fill="#78350f" opacity="0.1" />
        <g fill="#fbbf24" stroke="#d97706" strokeWidth="1.5">
            <ellipse cx="30" cy="32" rx="14" ry="10" />
            <circle cx="16" cy="26" r="6" />
            <path d="M 12,20 Q 8,14 16,18 Z" />
            <path d="M 18,20 Q 22,14 16,18 Z" />
        </g>
    </svg>
);

export const WorldFounderTrophy: React.FC = () => (
    <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-md">
        {/* Base */}
        <rect x="18" y="44" width="24" height="8" fill="#475569" rx="1" />
        <rect x="26" y="32" width="8" height="12" fill="#fbbf24" />
        {/* Bowl */}
        <polygon points="12,12 48,12 40,32 20,32" fill="#fbbf24" stroke="#d97706" strokeWidth="2.5" />
        {/* Globe inside */}
        <circle cx="30" cy="18" r="8" fill="#38bdf8" />
        <path d="M22,18 A8,8 0 0,0 38,18" fill="none" stroke="#22c55e" strokeWidth="1.5" />
    </svg>
);

export const PPTokenIcon: React.FC<{ size?: number; animated?: boolean }> = ({ size = 20, animated = true }) => {
    return (
        <motion.div
            style={{ width: size, height: size }}
            animate={animated ? { rotateY: 360 } : {}}
            transition={animated ? { repeat: Infinity, duration: 2.2, ease: "linear" } : {}}
            className="flex items-center justify-center select-none"
        >
            <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-sm">
                <circle cx="20" cy="20" r="18" fill="#fbbf24" stroke="#d97706" strokeWidth="2.5" />
                <circle cx="20" cy="20" r="13" fill="#f59e0b" />
                {/* Center dollar/P symbol */}
                <text x="20" y="26" fill="#78350f" fontSize="18" fontWeight="black" textAnchor="middle">P</text>
            </svg>
        </motion.div>
    );
};

export const XPStarIcon: React.FC<{ size?: number; animated?: boolean }> = ({ size = 20, animated = true }) => {
    return (
        <motion.div
            style={{ width: size, height: size }}
            animate={animated ? { scale: [1, 1.2, 1] } : {}}
            transition={animated ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" } : {}}
            className="flex items-center justify-center select-none"
        >
            <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-sm">
                <polygon points="20,2 25,14 38,14 28,24 32,37 20,29 8,37 12,24 2,14 15,14" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2.5" />
                <polygon points="20,7 23,16 33,16 25,23 28,33 20,27 12,33 15,23 7,16 17,16" fill="#60a5fa" />
            </svg>
        </motion.div>
    );
};

export const SkillCardIcon: React.FC<{ size?: number }> = ({ size = 20 }) => {
    return (
        <div style={{ width: size, height: size * 1.35 }} className="relative flex items-center justify-center select-none">
            <svg viewBox="0 0 40 55" className="w-full h-full drop-shadow-md">
                <rect x="2" y="2" width="36" height="51" rx="4" fill="#8b5cf6" stroke="#6d28d9" strokeWidth="2.5" />
                <rect x="6" y="6" width="28" height="43" rx="2" fill="#a78bfa" />
                <circle cx="20" cy="22" r="8" fill="#f59e0b" />
                <polygon points="20,16 22,21 27,21 23,24 25,29 20,26 15,29 17,24 13,21 18,21" fill="#ffffff" />
            </svg>
        </div>
    );
};

export const AssetRegistry = {
    get(key: string): React.ComponentType<any> {
        const registry: Record<string, React.ComponentType<any>> = {
            // Ollie Mascot
            ollie_idle: OllieIdle,
            ollie_happy: OllieHappy,
            ollie_thinking: OllieThinking,
            ollie_success: OllieSuccess,
            ollie_warning: OllieWarning,
            ollie_teacher: OllieTeacher,
            ollie_celebration: OllieCelebration,

            // District Landmarks
            building_cozy_garage: CozyGarage,
            building_money_academy: MoneyAcademy,
            building_lemonade_stand: LemonadeStand,
            building_juicy_cart: JuicyCart,
            building_burger_truck: BurgerTruck,
            building_fries_stand: FriesStand,
            building_mini_mart: MiniMart,
            building_toy_boutique: ToyBoutique,
            building_tech_incubator: TechIncubator,
            building_launch_pad: LaunchPad,
            building_skyscraper_tower: SkyscraperTower,
            building_boardroom_hub: BoardroomHub,
            building_bank_vault: BankVault,
            building_cargo_ship: CargoShip,
            building_stock_exchange: StockExchange,
            building_charging_bull: ChargingBull,
            building_global_hq: GlobalHQ,
            building_crypto_server: CryptoServer,

            // Collectibles
            col_founders_notebook: FoundersNotebook,
            col_golden_lemon: GoldenLemon,
            col_golden_food_truck_key: FoodTruckKey,
            col_merchant_badge: MerchantBadge,
            col_rocket_core: RocketCore,
            col_executive_seal: ExecutiveSeal,
            col_golden_vault_key: GoldenVaultKey,
            col_golden_bull: GoldenBull,
            col_world_founder_trophy: WorldFounderTrophy,

            // Props & Decor
            decor_tree_pine: PineTree,
            decor_tree_oak: OakTree,
            decor_bush: Bush,
            decor_flower_rose: Flower,
            decor_lamp_post: LampPost,
            decor_fountain: BusinessFountain,
            decor_street_sign: StreetSign,
            decor_gate: DistrictGate,
            decor_bridge: DistrictBridge,
            sky_sun: SkySun,
            sky_moon: SkyMoon,

            // Rewards
            reward_pp_token: PPTokenIcon,
            reward_xp_star: XPStarIcon,
            reward_skill_card: SkillCardIcon
        };

        // Fallback to standard PineTree decoration if key is unknown
        return registry[key] || PineTree;
    }
};
