import React from 'react';

interface CharacterAvatarProps {
    className?: string;
}

const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ className = '' }) => {
    return (
        <div data-testid="character-avatar" className={`character-avatar ${className} relative`}>
            {/* Character with better proportions and details */}
            <div className="relative w-24 h-32 flex flex-col items-center justify-end">
                {/* Shadow under character */}
                <div className="absolute bottom-0 w-16 h-3 bg-black/20 rounded-full blur-sm"></div>

                {/* Head */}
                <div className="w-14 h-14 bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 rounded-full border-3 border-amber-400 shadow-lg relative z-10">
                    {/* Hair */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-6 bg-gradient-to-br from-amber-800 to-amber-900 rounded-t-full"></div>

                    {/* Eyes */}
                    <div className="absolute top-5 left-3 w-2.5 h-2.5 bg-gray-900 rounded-full">
                        <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full"></div>
                    </div>
                    <div className="absolute top-5 right-3 w-2.5 h-2.5 bg-gray-900 rounded-full">
                        <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full"></div>
                    </div>

                    {/* Smile */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-7 h-3 border-b-2 border-gray-800 rounded-full"></div>

                    {/* Blush */}
                    <div className="absolute bottom-5 left-2 w-3 h-2 bg-pink-300/50 rounded-full"></div>
                    <div className="absolute bottom-5 right-2 w-3 h-2 bg-pink-300/50 rounded-full"></div>
                </div>

                {/* Body */}
                <div className="w-16 h-14 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-t-lg border-2 border-blue-700 shadow-md -mt-2 relative">
                    {/* Arms */}
                    <div className="absolute -left-3 top-1 w-4 h-10 bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 rounded-full border border-amber-400 shadow-sm"></div>
                    <div className="absolute -right-3 top-1 w-4 h-10 bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 rounded-full border border-amber-400 shadow-sm"></div>

                    {/* Shirt detail */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full"></div>
                </div>

                {/* Legs */}
                <div className="flex gap-1 -mt-1">
                    <div className="w-7 h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-b-lg border border-gray-900"></div>
                    <div className="w-7 h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-b-lg border border-gray-900"></div>
                </div>
            </div>
        </div>
    );
};

export default CharacterAvatar;
