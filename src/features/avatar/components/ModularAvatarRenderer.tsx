import React from 'react';
import { motion } from 'framer-motion';
import { ModularAvatarConfig, DEFAULT_AVATAR_CONFIG } from '../types/avatar';
import { getAvatarItemById, resolveAvatarConfigFromEquipped } from '../data/avatarCatalog';

export interface ModularAvatarRendererProps {
    config?: Partial<ModularAvatarConfig>;
    equippedIds?: string[];
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
    className?: string;
    showBackground?: boolean;
    showShadow?: boolean;
    showAura?: boolean;
    interactive?: boolean;
    onClick?: () => void;
    animation?: 'idle' | 'bounce' | 'none';
}

const SIZE_MAP: Record<string, { width: number; height: number }> = {
    xs: { width: 48, height: 62 },
    sm: { width: 80, height: 104 },
    md: { width: 140, height: 182 },
    lg: { width: 220, height: 286 },
    xl: { width: 300, height: 390 },
    '2xl': { width: 380, height: 494 },
};

export const ModularAvatarRenderer: React.FC<ModularAvatarRendererProps> = ({
    config: directConfig,
    equippedIds,
    size = 'lg',
    className = '',
    showBackground = true,
    showShadow = true,
    showAura = true,
    interactive = false,
    onClick,
    animation = 'idle',
}) => {
    // Resolve final config from directConfig or equippedIds or defaults
    const resolvedConfig: ModularAvatarConfig = React.useMemo(() => {
        if (directConfig && Object.keys(directConfig).length > 0) {
            return {
                ...DEFAULT_AVATAR_CONFIG,
                ...directConfig,
            };
        }
        if (equippedIds && equippedIds.length > 0) {
            return resolveAvatarConfigFromEquipped(equippedIds);
        }
        return DEFAULT_AVATAR_CONFIG;
    }, [directConfig, equippedIds]);

    const {
        skinTone = 'Tint 1',
        faceId = 'kenney_face_complete_1',
        hairId = 'kenney_hair_brown2_man5',
        shirtId = 'kenney_shirt_red_1',
        pantsId = 'kenney_pants_light_blue_3',
        shoesId = 'kenney_shoe_brown1_5',
        accessoryId,
        backgroundId = 'avatar_bg_office_clean_001',
        completeCharacterUrl,
    } = resolvedConfig;

    // Numerical dimensions for container
    const dimensions = typeof size === 'number'
        ? { width: size, height: Math.round(size * 1.3) }
        : SIZE_MAP[size] || SIZE_MAP.lg;

    // Resolve asset items from catalog
    const skinItem = getAvatarItemById(skinTone.startsWith('kenney_') ? skinTone : `kenney_skin_tint_${skinTone.replace(/\D/g, '') || '1'}`);
    const faceItem = getAvatarItemById(faceId);
    const hairItem = getAvatarItemById(hairId);
    const shirtItem = getAvatarItemById(shirtId);
    const pantsItem = getAvatarItemById(pantsId);
    const shoesItem = getAvatarItemById(shoesId);
    const accessoryItem = accessoryId ? getAvatarItemById(accessoryId) : undefined;
    const backgroundItem = backgroundId ? getAvatarItemById(backgroundId) : undefined;

    // Extract tint number for skin (1..8)
    const tintNumMatch = (skinItem?.filePath || '').match(/tint(\d)/i) || (skinTone.match(/(\d)/)) || ['1', '1'];
    const tintNum = tintNumMatch[1] || '1';
    const tintFolder = `Tint%20${tintNum}`;

    // Asset cache version buster to guarantee updated textures are loaded
    const assetUrl = (p: string) => (p ? `${p}${p.includes('?') ? '&' : '?'}v=2` : p);

    // Asset paths with sensible defaults
    const headPath = assetUrl(skinItem?.filePath || `/images/personal%20profile/PNG/Skin/${tintFolder}/tint${tintNum}_head.png`);
    const neckPath = assetUrl(`/images/personal%20profile/PNG/Skin/${tintFolder}/tint${tintNum}_neck.png`);
    const handPath = assetUrl(`/images/personal%20profile/PNG/Skin/${tintFolder}/tint${tintNum}_hand.png`);

    const facePath = assetUrl(faceItem?.filePath || '/images/personal%20profile/PNG/Face/Completes/face1.png');
    const hairPath = assetUrl(hairItem?.filePath || '/images/personal%20profile/PNG/Hair/Brown%202/brown2Man5.png');

    const isOutfit = shirtItem?.category === 'business' || (shirtItem?.id || '').includes('business');
    const defaultArm = isOutfit
        ? ((shirtItem?.id || '').includes('tux')
            ? '/images/personal%20profile/PNG/Shirts/Grey/greyArm_long.png'
            : (shirtItem?.id || '').includes('vest')
            ? '/images/personal%20profile/PNG/Shirts/White/whiteArm_long.png'
            : '/images/personal%20profile/PNG/Shirts/Navy/navyArm_long.png')
        : '/images/personal%20profile/PNG/Shirts/Red/redArm_long.png';
    const shirtPath = assetUrl(shirtItem?.filePath || '/images/personal%20profile/PNG/Shirts/Red/redShirt1.png');
    const armPath = assetUrl(shirtItem?.armFilePath || defaultArm);

    const pantsPath = assetUrl(pantsItem?.filePath || '/images/personal%20profile/PNG/Pants/Light%20Blue/pantsLightBlue3.png');
    const legPath = assetUrl(pantsItem?.legFilePath || '/images/personal%20profile/PNG/Pants/Light%20Blue/pantsLightBlue_long.png');

    const shoePath = assetUrl(shoesItem?.filePath || '/images/personal%20profile/PNG/Shoes/Brown%201/brownShoe5.png');

    // Animation variants
    const idleVariants = {
        idle: {
            y: [0, -3, 0],
            transition: {
                duration: 3.2,
                repeat: Infinity,
                ease: 'easeInOut' as const,
            },
        },
        bounce: {
            y: [0, -8, 0],
            transition: {
                duration: 1.2,
                repeat: Infinity,
                ease: 'easeInOut' as const,
            },
        },
        none: {},
    };

    const auraColor = backgroundItem?.color || shirtItem?.color || '#6366F1';

    // Dimension and positioning helper for hairstyles
    // Kenney head is placed at x: 113, y: 30, width: 173, height: 168 (center is x: 200)
    // Hair is scaled to wrap head properly without bare skull gaps
    const hairPlacement = React.useMemo(() => {
        const p = hairPath.toLowerCase();

        // 1. Women's hairstyles (checked FIRST so "woman2" doesn't falsely match "man2" or "man")
        if (p.includes('woman1')) {
            // Long flowing straight hair
            return { x: 113, y: 10, width: 174, height: 314 };
        }
        if (p.includes('woman2')) {
            // Sleek founder ponytail
            return { x: 112, y: 10, width: 176, height: 250 };
        }
        if (p.includes('woman3')) {
            // Long wavy hair
            return { x: 113, y: 10, width: 174, height: 315 };
        }
        if (p.includes('woman4')) {
            // Twin pigtails
            return { x: 109, y: 10, width: 182, height: 250 };
        }
        if (p.includes('woman5')) {
            // Side ponytail / bob
            return { x: 110, y: 10, width: 180, height: 234 };
        }
        if (p.includes('woman6')) {
            // Elegant bob
            return { x: 108, y: 10, width: 185, height: 234 };
        }
        if (p.includes('woman')) {
            return { x: 112, y: 10, width: 176, height: 250 };
        }

        // 2. Men's hairstyles (with explicit !p.includes('woman') guard as extra defensive precaution)
        if (p.includes('man8') && !p.includes('woman')) {
            // Balding side-burns / temple tufts: sits at temple/ear level (ear rows 88..110)
            return { x: 113, y: 88, width: 173, height: 52 };
        }
        if (p.includes('man2') && !p.includes('woman')) {
            // Pompadour / tall quiff
            return { x: 113, y: 2, width: 174, height: 152 };
        }
        if (p.includes('man5') && !p.includes('woman')) {
            // Classic executive part
            return { x: 112, y: 8, width: 176, height: 134 };
        }
        if (p.includes('man') && !p.includes('woman')) {
            // Standard male haircuts (man1, 3, 4, 6, 7) scaled to wrap head
            return { x: 113, y: 10, width: 174, height: 131 };
        }
        return { x: 113, y: 10, width: 174, height: 132 };
    }, [hairPath]);

    const accPath = accessoryItem?.filePath || accessoryItem?.thumbnailPath || '';
    const accId = (accessoryItem?.id || '').toLowerCase();
    const isWatch = accId.includes('watch');
    const isSunglasses = accId.includes('shades') || accId.includes('sunglasses');
    const isGlasses = accId.includes('glasses') && !isSunglasses;
    const isBowtie = accId.includes('bowtie');
    const isTie = accId.includes('money_tie') || (accId.includes('tie') && !accId.includes('bowtie'));
    const isTophat = accId.includes('tophat');
    const isCap = accId.includes('cap');
    const isHelmet = accId.includes('builder_hat') || accId.includes('helmet');
    const isMedal = accId.includes('tank_champion') || accId.includes('medal') || accId.includes('wreath');
    const isCrown = (accId.includes('crown') || accId.includes('tycoon')) && !isMedal;
    const isShield = accId.includes('shield') || accId.includes('cape') || accId.includes('risk');
    const isPin = accId.includes('first_sale') || accId.includes('pin');

    return (
        <motion.div
            className={`relative flex items-center justify-center select-none overflow-hidden ${className} ${
                interactive ? 'cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform' : ''
            }`}
            style={{
                width: dimensions.width,
                height: dimensions.height,
            }}
            onClick={onClick}
            variants={animation !== 'none' ? idleVariants : undefined}
            animate={animation !== 'none' ? animation : undefined}
            data-testid="modular-avatar-renderer"
        >
            {/* Background Ambient Aura */}
            {showBackground && (
                <div
                    className="absolute inset-0 rounded-3xl opacity-20 pointer-events-none transition-colors duration-700"
                    style={{
                        background: `radial-gradient(circle at 50% 45%, ${auraColor} 0%, transparent 70%)`,
                    }}
                />
            )}

            {/* Optional Complete Character Fallback Mode */}
            {completeCharacterUrl ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center p-2">
                    <img
                        src={completeCharacterUrl}
                        alt="Character Avatar"
                        className="w-full h-full object-contain drop-shadow-xl"
                        loading="lazy"
                    />
                    {showShadow && (
                        <div className="w-3/4 h-3 bg-black/20 rounded-full blur-[3px] mt-[-8px]" />
                    )}
                </div>
            ) : (
                /* Primary Layered Modular SVG Character with Extended Headroom */
                <svg
                    viewBox="0 -100 400 620"
                    className="w-full h-full drop-shadow-lg"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        {/* Soft ambient ground shadow gradient */}
                        <radialGradient id="avatarShadowGrad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#0f172a" stopOpacity="0.45" />
                            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                        </radialGradient>

                        {/* Aura glow filter */}
                        {showAura && (
                            <filter id="avatarGlow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="12" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        )}
                    </defs>

                    {/* Ambient Glow */}
                    {showAura && (
                        <circle
                            cx="200"
                            cy="260"
                            r="170"
                            fill={auraColor}
                            opacity="0.12"
                        />
                    )}

                    {/* Ground Shadow */}
                    {showShadow && (
                        <ellipse
                            cx="200"
                            cy="495"
                            rx="110"
                            ry="16"
                            fill="url(#avatarShadowGrad)"
                        />
                    )}

                    {/* ===================================================
                        MODULAR CHARACTER LAYER STACK (SEAMLESS ALIGNED)
                        1. Neck
                        2. Arms & Hands & Smartwatch (behind shirt body)
                        3. Torso Shirt (enters pants waistband cleanly)
                        4. Legs (tucked between shirt and waistband, 153px width)
                        5. Shoes (over leg cuffs)
                        6. Pants Waistband (on top of shirt and legs)
                        7. Head
                        8. Face Features (eyes, eyebrows, mouth)
                        9. Eyewear Accessories (glasses/sunglasses over eyes)
                        10. Hair (centered cleanly by hairstyle)
                        11. Lapel / Collar Accessories (bowtie, tie, pin)
                        12. Headwear Accessories (top hat, cap, helmet, crown)
                        13. Hand Accessories (shield, briefcase)
                    =================================================== */}

                    {/* 1. Neck */}
                    <image
                        href={neckPath}
                        x="152"
                        y="175"
                        width="96"
                        height="37"
                    />

                    {/* 2. Arms & Hands (Behind Torso Shirt) */}
                    {/* Left Arm: mirrored */}
                    <g transform="translate(183, 0) scale(-1, 1)">
                        <image
                            href={armPath}
                            x="0"
                            y="165"
                            width="171"
                            height="142"
                        />
                    </g>
                    {/* Left Hand: normal */}
                    <image
                        href={handPath}
                        x="0"
                        y="250"
                        width="61"
                        height="71"
                    />

                    {/* Smartwatch: On Left Wrist */}
                    {isWatch && accPath && (
                        <image
                            href={accPath}
                            x="14"
                            y="242"
                            width="38"
                            height="38"
                            className="filter drop-shadow-sm"
                        />
                    )}

                    {/* Right Arm: normal */}
                    <image
                        href={armPath}
                        x="217"
                        y="165"
                        width="171"
                        height="142"
                    />
                    {/* Right Hand: mirrored */}
                    <g transform="translate(399, 0) scale(-1, 1)">
                        <image
                            href={handPath}
                            x="0"
                            y="250"
                            width="61"
                            height="71"
                        />
                    </g>

                    {/* 3. Torso Shirt / Business Outfit (tucked inside waistband) */}
                    <image
                        href={shirtPath}
                        x={isOutfit ? "112" : "123"}
                        y={isOutfit ? "140" : "145"}
                        width={isOutfit ? "176" : "153"}
                        height={isOutfit ? "176" : "174"}
                    />

                    {/* Lapel Pin on Shirt */}
                    {isPin && accPath && (
                        <image
                            href={accPath}
                            x="145"
                            y="190"
                            width="34"
                            height="34"
                            className="filter drop-shadow-sm"
                        />
                    )}

                    {/* 4. Legs (Width 108 each, perfectly aligned with 153px waistband) */}
                    {/* Left Leg: mirrored (spans x=123..231) */}
                    <g transform="translate(231, 0) scale(-1, 1)">
                        <image
                            href={legPath}
                            x="0"
                            y="300"
                            width="108"
                            height="166"
                        />
                    </g>
                    {/* Right Leg: normal (spans x=168..276) */}
                    <image
                        href={legPath}
                        x="168"
                        y="300"
                        width="108"
                        height="166"
                    />

                    {/* 5. Shoes */}
                    {/* Left Shoe: mirrored (toe points left) */}
                    <g transform="translate(192, 0) scale(-1, 1)">
                        <image
                            href={shoePath}
                            x="0"
                            y="442"
                            width="94"
                            height="42"
                        />
                    </g>
                    {/* Right Shoe: normal (toe points right) */}
                    <image
                        href={shoePath}
                        x="208"
                        y="442"
                        width="94"
                        height="42"
                    />

                    {/* 6. Pants Waistband (Seamless tucked belt on top of shirt & legs) */}
                    <image
                        href={pantsPath}
                        x="123"
                        y="285"
                        width="153"
                        height="47"
                    />

                    {/* 7. Head */}
                    <image
                        href={headPath}
                        x="113"
                        y="30"
                        width="173"
                        height="168"
                    />

                    {/* 8. Face Features (eyes/smile) */}
                    <image
                        href={facePath}
                        x="150"
                        y="65"
                        width="100"
                        height="101"
                    />

                    {/* 9. Eyewear Accessories (Glasses / Sunglasses directly over eyes) */}
                    {(isSunglasses || isGlasses) && accPath && (
                        <image
                            href={accPath}
                            x="137"
                            y="78"
                            width="126"
                            height="63"
                            className="filter drop-shadow"
                        />
                    )}

                    {/* 10. Hair (Centered on head by exact dimensions) */}
                    <image
                        href={hairPath}
                        x={hairPlacement.x}
                        y={hairPlacement.y}
                        width={hairPlacement.width}
                        height={hairPlacement.height}
                    />

                    {/* 11. Bowtie, Golden Tie & Chest Medal (At collar and chest) */}
                    {isBowtie && accPath && (
                        <image
                            href={accPath}
                            x="162"
                            y="160"
                            width="76"
                            height="53"
                            className="filter drop-shadow-sm"
                        />
                    )}

                    {isTie && accPath && (
                        <image
                            href={accPath}
                            x="160"
                            y="157"
                            width="80"
                            height="160"
                            className="filter drop-shadow-sm"
                        />
                    )}

                    {isMedal && accPath && (
                        <image
                            href={accPath}
                            x="145"
                            y="175"
                            width="110"
                            height="110"
                            className="filter drop-shadow-md"
                        />
                    )}

                    {/* 12. Headwear Accessories (On top of head & hair) */}
                    {isTophat && accPath && (
                        <image
                            href={accPath}
                            x="98"
                            y="-85"
                            width="205"
                            height="205"
                            className="filter drop-shadow-md"
                        />
                    )}

                    {isCap && accPath && (
                        <image
                            href={accPath}
                            x="83"
                            y="-25"
                            width="234"
                            height="164"
                            className="filter drop-shadow-md"
                        />
                    )}

                    {isHelmet && accPath && (
                        <image
                            href={accPath}
                            x="98"
                            y="-42"
                            width="204"
                            height="204"
                            className="filter drop-shadow-md"
                        />
                    )}

                    {isCrown && accPath && (
                        <image
                            href={accPath}
                            x="107"
                            y="-70"
                            width="185"
                            height="185"
                            className="filter drop-shadow-md"
                        />
                    )}

                    {/* 13. Shield Accessory */}
                    {isShield && accPath && (
                        <image
                            href={accPath}
                            x="310"
                            y="220"
                            width="110"
                            height="110"
                            className="filter drop-shadow-md"
                        />
                    )}
                </svg>
            )}
        </motion.div>
    );
};

export default ModularAvatarRenderer;
