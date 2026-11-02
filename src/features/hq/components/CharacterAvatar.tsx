import React from 'react';

interface CharacterAvatarProps {
    className?: string;
}

const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ className = '' }) => {
    return (
        <div data-testid="character-avatar" className={`character-avatar ${className} relative flex flex-col items-center animate-breathe`}>
            {/* Shadow under character */}
            <div className="absolute -bottom-1 w-14 h-3 bg-black/25 rounded-[100%] blur-[2px]"></div>

            <div className="relative w-28 h-32 flex flex-col items-center justify-end z-10">
                
                {/* 1. HUGE HEAD (Toca Boca style) */}
                <div className="w-20 h-20 bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 rounded-[35px] border-[3px] border-amber-400 shadow-[0_8px_16px_rgba(0,0,0,0.15)] relative z-20 flex flex-col items-center">
                    
                    {/* Fluffy Hair */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-22 h-8 bg-gradient-to-br from-amber-800 to-amber-950 rounded-full shadow-inner">
                        <div className="absolute -bottom-1 left-2 w-6 h-4 bg-amber-800 rounded-full"></div>
                        <div className="absolute -bottom-1 right-2 w-6 h-4 bg-amber-800 rounded-full"></div>
                        <div className="absolute top-1 left-4 w-3 h-1.5 bg-white/20 rounded-full rotate-[-10deg]"></div>
                    </div>

                    {/* Cute Eyes (with blink animation) */}
                    <div className="absolute top-8 flex gap-6 animate-blink">
                        <div className="w-3.5 h-4 bg-gray-900 rounded-full relative shadow-inner">
                            <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                        <div className="w-3.5 h-4 bg-gray-900 rounded-full relative shadow-inner">
                            <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                    </div>

                    {/* Blush */}
                    <div className="absolute top-11 flex justify-between w-[64px]">
                        <div className="w-3 h-2 bg-pink-400/50 rounded-full blur-[1px]"></div>
                        <div className="w-3 h-2 bg-pink-400/50 rounded-full blur-[1px]"></div>
                    </div>

                    {/* Big Happy Smile */}
                    <div className="absolute bottom-3 w-6 h-3 border-b-[3px] border-gray-800 rounded-full"></div>
                </div>

                {/* 2. TINY PILL BODY */}
                <div className="w-12 h-10 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-[20px] border-[3px] border-blue-700 shadow-md -mt-4 relative z-10">
                    
                    {/* Cute Stubby Arms */}
                    <div className="absolute -left-3 top-2 w-4 h-7 bg-gradient-to-br from-amber-100 to-amber-300 rounded-full border-2 border-amber-400 shadow-sm origin-top rotate-[20deg]"></div>
                    <div className="absolute -right-3 top-2 w-4 h-7 bg-gradient-to-br from-amber-100 to-amber-300 rounded-full border-2 border-amber-400 shadow-sm origin-top -rotate-[20deg]"></div>

                    {/* Shirt Star / Detail */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-3 text-yellow-300 flex items-center justify-center">
                        ★
                    </div>
                </div>

                {/* 3. STUBBY LEGS */}
                <div className="flex gap-2 -mt-1 z-0">
                    <div className="w-4 h-5 bg-gradient-to-br from-gray-700 to-gray-900 rounded-b-full border-2 border-gray-950"></div>
                    <div className="w-4 h-5 bg-gradient-to-br from-gray-700 to-gray-900 rounded-b-full border-2 border-gray-950"></div>
                </div>
            </div>
        </div>
    );
};

export default CharacterAvatar;
