export type WallPattern = 'solid' | 'stripes' | 'dots' | 'floral' | 'geometric' | 'brick' | 'wood' | 'stars';
export type FloorPattern = 'hardwood' | 'tile' | 'carpet' | 'marble' | 'rug' | 'grass' | 'concrete';

export const WALL_PATTERNS: Record<WallPattern, { name: string; icon: string }> = {
    solid: { name: 'Solid Color', icon: '🎨' },
    stripes: { name: 'Stripes', icon: '📏' },
    dots: { name: 'Polka Dots', icon: '⚪' },
    floral: { name: 'Floral', icon: '🌸' },
    geometric: { name: 'Geometric', icon: '🔷' },
    brick: { name: 'Brick', icon: '🧱' },
    wood: { name: 'Wood Panels', icon: '🪵' },
    stars: { name: 'Stars', icon: '⭐' }
};

export const FLOOR_PATTERNS: Record<FloorPattern, { name: string; icon: string }> = {
    hardwood: { name: 'Hardwood', icon: '🪵' },
    tile: { name: 'Tile', icon: '⬜' },
    carpet: { name: 'Carpet', icon: '🟫' },
    marble: { name: 'Marble', icon: '⚪' },
    rug: { name: 'Decorative Rug', icon: '🧶' },
    grass: { name: 'Grass', icon: '🌱' },
    concrete: { name: 'Concrete', icon: '⬛' }
};

export function getWallStyle(pattern: WallPattern, color1: string, color2?: string): React.CSSProperties {
    switch (pattern) {
        case 'solid':
            return { background: color1 };
        case 'stripes':
            return {
                background: `repeating-linear-gradient(90deg, ${color1}, ${color1} 20px, ${color2 || color1} 20px, ${color2 || color1} 40px)`
            };
        case 'dots':
            return {
                background: `radial-gradient(circle, ${color2 || '#fff'} 3px, transparent 3px)`,
                backgroundColor: color1,
                backgroundSize: '20px 20px'
            };
        case 'floral':
            return {
                background: color1,
                backgroundImage: `radial-gradient(circle at 20% 50%, ${color2 || '#fff'} 5px, transparent 5px),
                                  radial-gradient(circle at 80% 50%, ${color2 || '#fff'} 5px, transparent 5px)`,
                backgroundSize: '40px 40px'
            };
        case 'geometric':
            return {
                background: `linear-gradient(45deg, ${color1} 25%, transparent 25%, transparent 75%, ${color1} 75%, ${color1}),
                            linear-gradient(45deg, ${color1} 25%, transparent 25%, transparent 75%, ${color1} 75%, ${color1})`,
                backgroundColor: color2 || color1,
                backgroundSize: '30px 30px',
                backgroundPosition: '0 0, 15px 15px'
            };
        case 'brick':
            return {
                background: `linear-gradient(to bottom, transparent 10px, ${color2 || '#8B4513'} 10px, ${color2 || '#8B4513'} 11px, transparent 11px),
                            linear-gradient(to right, ${color1} 50px, ${color2 || '#8B4513'} 50px, ${color2 || '#8B4513'} 51px, ${color1} 51px)`,
                backgroundSize: '100px 20px'
            };
        case 'wood':
            return {
                background: `linear-gradient(90deg, ${color1} 0%, ${color2 || '#A0522D'} 50%, ${color1} 100%)`,
                backgroundSize: '100px 100%'
            };
        case 'stars':
            return {
                background: color1,
                backgroundImage: `radial-gradient(circle, ${color2 || '#FFD700'} 2px, transparent 2px)`,
                backgroundSize: '50px 50px',
                backgroundPosition: '0 0, 25px 25px'
            };
        default:
            return { background: color1 };
    }
}

export function getFloorStyle(pattern: FloorPattern, color: string): React.CSSProperties {
    switch (pattern) {
        case 'hardwood':
            return {
                background: `linear-gradient(90deg, ${color} 0%, #A0522D 50%, ${color} 100%)`,
                backgroundSize: '100px 100%'
            };
        case 'tile':
            return {
                background: `repeating-conic-gradient(${color} 0% 25%, #FFFFFF 0% 50%)`,
                backgroundSize: '40px 40px'
            };
        case 'carpet':
            return {
                background: color,
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)'
            };
        case 'marble':
            return {
                background: `linear-gradient(135deg, ${color} 0%, #FFFFFF 50%, ${color} 100%)`,
                backgroundSize: '200px 200px'
            };
        case 'rug':
            return {
                background: color,
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 20px)`
            };
        case 'grass':
            return {
                background: color,
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 3px)'
            };
        case 'concrete':
            return {
                background: '#808080',
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
            };
        default:
            return { background: color };
    }
}
