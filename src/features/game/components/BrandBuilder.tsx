import React, { useState } from 'react';
import { useAppStore } from '../../../store';
import { BusinessLogo } from '../../../types';
import {
    Save, Rocket, Pizza, Star, Smile, Lightbulb, Coffee, Music, Camera, Globe, Anchor, Cpu, Car, Zap,
    Circle, Square, AppWindow,
    // New Icons (Animals)
    Cat, Dog, Fish, Bird, Rabbit, Snail, Bug, PawPrint,
    // Tech & Science
    Gamepad, Laptop, Smartphone, Database, Atom, Microscope, Beaker, Code, Wifi, Server,
    // Nature
    Leaf, TreeDeciduous, Flower, Sun, Moon, Cloud, CloudRain, Flame, Droplets, Mountain, Snowflake,
    // Objects & Tools
    Hammer, Wrench, Crown, Trophy, Key, Bell, Gift, ShoppingCart, ShoppingBag, Wallet, PiggyBank,
    // Food
    Apple, Carrot, IceCream, Sandwich, Cake, Utensils,
    // Misc
    Heart, Diamond, Ghost, Skull, Shield, Target, Flag, MapPin, Compass, Plane, Bike, Ship
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BrandBuilderProps {
    onBack: () => void;
}

const COLORS = [
    '#FFC800', '#F59E0B', '#58CC02', '#10B981', '#2B70C9', '#3B82F6', '#6366F1',
    '#EF4444', '#EC4899', '#8B5CF6', '#14B8A6', '#64748B', '#000000', '#FFFFFF',
    '#7C3AED', '#DB2777', '#EA580C', '#84CC16', '#06B6D4'
];

const ICONS = [
    // Mascots / Animals
    { id: 'cat', icon: Cat, label: 'Cat' },
    { id: 'dog', icon: Dog, label: 'Dog' },
    { id: 'rabbit', icon: Rabbit, label: 'Rabbit' },
    { id: 'bird', icon: Bird, label: 'Bird' },
    { id: 'fish', icon: Fish, label: 'Fish' },
    { id: 'snail', icon: Snail, label: 'Snail' },
    { id: 'bug', icon: Bug, label: 'Bug' },
    { id: 'paw', icon: PawPrint, label: 'Paw' },

    // Classic
    { id: 'rocket', icon: Rocket, label: 'Rocket' },
    { id: 'star', icon: Star, label: 'Star' },
    { id: 'smile', icon: Smile, label: 'Happy' },
    { id: 'crown', icon: Crown, label: 'Crown' },
    { id: 'trophy', icon: Trophy, label: 'Win' },
    { id: 'heart', icon: Heart, label: 'Heart' },
    { id: 'diamond', icon: Diamond, label: 'Gem' },
    { id: 'ghost', icon: Ghost, label: 'Ghost' },
    { id: 'shield', icon: Shield, label: 'Shield' },

    // Tech
    { id: 'gamepad', icon: Gamepad, label: 'Game' },
    { id: 'laptop', icon: Laptop, label: 'Tech' },
    { id: 'code', icon: Code, label: 'Code' },
    { id: 'cpu', icon: Cpu, label: 'Chip' },
    { id: 'atom', icon: Atom, label: 'Atom' },
    { id: 'robot', icon: Database, label: 'Data' }, // Using Database as "Server/Data"
    { id: 'wifi', icon: Wifi, label: 'Net' },

    // Nature
    { id: 'tree', icon: TreeDeciduous, label: 'Tree' },
    { id: 'leaf', icon: Leaf, label: 'Nature' },
    { id: 'flower', icon: Flower, label: 'Flower' },
    { id: 'sun', icon: Sun, label: 'Sun' },
    { id: 'flame', icon: Flame, label: 'Fire' },
    { id: 'water', icon: Droplets, label: 'Water' },
    { id: 'snow', icon: Snowflake, label: 'Ice' },

    // Food
    { id: 'pizza', icon: Pizza, label: 'Pizza' },
    { id: 'burger', icon: Sandwich, label: 'Food' },
    { id: 'icecream', icon: IceCream, label: 'Sweet' },
    { id: 'apple', icon: Apple, label: 'Fruit' },
    { id: 'coffee', icon: Coffee, label: 'Cafe' },

    // Business / Tools
    { id: 'bulb', icon: Lightbulb, label: 'Idea' },
    { id: 'key', icon: Key, label: 'Key' },
    { id: 'tools', icon: Wrench, label: 'Fix' },
    { id: 'cart', icon: ShoppingCart, label: 'Shop' },
    { id: 'money', icon: PiggyBank, label: 'Bank' },
    { id: 'target', icon: Target, label: 'Aim' },

    // Transport / Travel
    { id: 'car', icon: Car, label: 'Auto' },
    { id: 'plane', icon: Plane, label: 'Fly' },
    { id: 'ship', icon: Ship, label: 'Sea' },
    { id: 'bike', icon: Bike, label: 'Ride' },
    { id: 'globe', icon: Globe, label: 'World' },
    { id: 'map', icon: MapPin, label: 'Place' },
    { id: 'anchor', icon: Anchor, label: 'Port' },

    // Arts
    { id: 'music', icon: Music, label: 'Music' },
    { id: 'camera', icon: Camera, label: 'Photo' },
];

const BrandBuilder: React.FC<BrandBuilderProps> = ({ onBack }) => {
    const { user, updateBusinessLogo, completeGame } = useAppStore();
    const { t } = useTranslation();
    const [logoState, setLogoState] = useState<BusinessLogo>(user?.businessLogo || {
        companyName: 'My Business',
        backgroundColor: '#FFC800',
        icon: 'rocket',
        iconColor: '#FFFFFF',
        shape: 'circle',
        estText: 'Est. 2026'
    });

    // Ensure default for legacy data
    if (!logoState.estText) {
        setLogoState(prev => ({ ...prev, estText: 'Est. 2026' }));
    }

    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        updateBusinessLogo(logoState);
        completeGame(100, 25); // Award some XP for being creative
        setSaved(true);
        setTimeout(() => {
            setSaved(false);
            onBack();
        }, 1500);
    };

    const SelectedIcon = ICONS.find(i => i.id === logoState.icon)?.icon || Rocket;

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 flex flex-col md:flex-row h-[calc(100vh-140px)] md:h-[calc(100vh-100px)]">

            {/* Controls Sidebar */}
            <div className="w-full md:w-1/3 bg-gray-50 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-200 overflow-y-auto custom-scrollbar shrink-0">
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                    <button onClick={onBack} className="text-gray-400 font-bold hover:text-gray-600 flex items-center gap-1 rtl:flex-row-reverse">
                        <span className="rtl:rotate-180">&larr;</span> {t('common.back')}
                    </button>
                    <h2 className="text-xl md:text-2xl font-black text-gray-800">{t('brand.title')}</h2>
                </div>

                <div className="space-y-4 md:space-y-6">
                    {/* Name Input */}
                    <div>
                        <label className="block text-xs md:text-sm font-bold text-gray-500 mb-2 uppercase">{t('brand.label_name')}</label>
                        <input
                            type="text"
                            maxLength={15}
                            value={logoState.companyName}
                            onChange={(e) => setLogoState({ ...logoState, companyName: e.target.value })}
                            className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold text-gray-800 focus:border-kid-accent outline-none"
                            placeholder="Kid Inc."
                        />
                    </div>

                    {/* Est Year Input */}
                    <div>
                        <label className="block text-xs md:text-sm font-bold text-gray-500 mb-2 uppercase">{t('brand.established_text')}</label>
                        <input
                            type="text"
                            maxLength={15}
                            value={logoState.estText || 'Est. 2026'}
                            onChange={(e) => setLogoState({ ...logoState, estText: e.target.value })}
                            className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold text-gray-800 focus:border-kid-accent outline-none"
                            placeholder={t('brand.est') + " 2026"}
                        />
                    </div>

                    {/* Shape Picker */}
                    <div>
                        <label className="block text-xs md:text-sm font-bold text-gray-500 mb-2 uppercase">{t('brand.label_shape')}</label>
                        <div className="flex gap-4 bg-white p-2 rounded-xl border border-gray-200">
                            <button
                                onClick={() => setLogoState({ ...logoState, shape: 'circle' })}
                                className={`flex-1 p-2 rounded-lg flex justify-center ${logoState.shape === 'circle' ? 'bg-kid-primary text-yellow-900' : 'text-gray-400'}`}
                            >
                                <Circle size={24} fill={logoState.shape === 'circle' ? "currentColor" : "none"} />
                            </button>
                            <button
                                onClick={() => setLogoState({ ...logoState, shape: 'rounded' })}
                                className={`flex-1 p-2 rounded-lg flex justify-center ${logoState.shape === 'rounded' ? 'bg-kid-primary text-yellow-900' : 'text-gray-400'}`}
                            >
                                <AppWindow size={24} fill={logoState.shape === 'rounded' ? "currentColor" : "none"} />
                            </button>
                            <button
                                onClick={() => setLogoState({ ...logoState, shape: 'square' })}
                                className={`flex-1 p-2 rounded-lg flex justify-center ${logoState.shape === 'square' ? 'bg-kid-primary text-yellow-900' : 'text-gray-400'}`}
                            >
                                <Square size={24} fill={logoState.shape === 'square' ? "currentColor" : "none"} />
                            </button>
                        </div>
                    </div>

                    {/* Background Color Picker */}
                    <div>
                        <label className="block text-xs md:text-sm font-bold text-gray-500 mb-2 uppercase">{t('brand.label_bg')}</label>
                        <div className="flex flex-wrap gap-2">
                            {COLORS.map(color => (
                                <button
                                    key={color}
                                    onClick={() => setLogoState({ ...logoState, backgroundColor: color })}
                                    className={`w-8 h-8 rounded-full border-4 transition-transform hover:scale-110 ${logoState.backgroundColor === color ? 'border-gray-800 scale-110' : 'border-white shadow-sm'}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Icon Picker */}
                    <div>
                        <label className="block text-xs md:text-sm font-bold text-gray-500 mb-2 uppercase">{t('brand.label_icon')}</label>
                        <div className="grid grid-cols-5 md:grid-cols-4 lg:grid-cols-5 gap-2 bg-white p-2 rounded-xl border border-gray-200 h-64 md:h-80 overflow-y-auto custom-scrollbar">
                            {ICONS.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setLogoState({ ...logoState, icon: item.id })}
                                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all aspect-square
                                ${logoState.icon === item.id
                                            ? 'bg-blue-50 border-kid-accent text-kid-accent shadow-sm'
                                            : 'bg-white border-transparent hover:bg-gray-50 text-gray-500'}
                            `}
                                >
                                    <item.icon size={24} />
                                    <span className="text-[9px] font-bold mt-1 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Icon Color Picker */}
                    <div>
                        <label className="block text-xs md:text-sm font-bold text-gray-500 mb-2 uppercase">{t('brand.label_color')}</label>
                        <div className="flex flex-wrap gap-2">
                            {COLORS.map(color => (
                                <button
                                    key={color}
                                    onClick={() => setLogoState({ ...logoState, iconColor: color })}
                                    className={`w-8 h-8 rounded-full border-4 transition-transform hover:scale-110 ${logoState.iconColor === color ? 'border-gray-800 scale-110' : 'border-white shadow-sm'}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saved}
                        className={`w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 btn-juicy transition-all mt-4 mb-8 md:mb-0
                    ${saved ? 'bg-green-500 text-white' : 'bg-kid-primary text-yellow-900 shadow-[0_4px_0_0_rgba(202,138,4,1)] hover:bg-yellow-400'}
                `}
                    >
                        {saved ? t('brand.saved') : <><Save size={20} /> {t('brand.save')}</>}
                    </button>
                </div>
            </div>

            {/* Preview Canvas */}
            <div className="flex-1 flex items-center justify-center bg-gray-100 p-8 relative">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                <div className="relative text-center">
                    <div
                        className={`w-48 h-48 md:w-64 md:h-64 flex items-center justify-center shadow-2xl mb-8 mx-auto transition-all duration-300 border-4 border-white
                    ${logoState.shape === 'circle' ? 'rounded-full' : logoState.shape === 'rounded' ? 'rounded-3xl' : 'rounded-none'}
                `}
                        style={{ backgroundColor: logoState.backgroundColor }}
                    >
                        <SelectedIcon size={100} color={logoState.iconColor} strokeWidth={2.5} className="drop-shadow-md md:w-[120px] md:h-[120px]" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-gray-800 tracking-tight drop-shadow-sm break-words max-w-md mx-auto leading-tight">{logoState.companyName}</h1>
                    <p className="text-gray-500 font-bold mt-4 uppercase tracking-widest text-xs md:text-sm flex items-center justify-center gap-2">
                        <span className="w-8 h-[2px] bg-gray-300"></span> {logoState.estText || 'Est. 2026'} <span className="w-8 h-[2px] bg-gray-300"></span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BrandBuilder;
