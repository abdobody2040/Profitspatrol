

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Howl, Howler } from 'howler';
import { useAppStore } from '../store';

interface SoundContextType {
    playClick: () => void;
    playSuccess: () => void;
    playMoney: () => void;
    playError: () => void;
    mute: boolean;
    toggleMute: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

// Using base64 encoded simple sounds (or URLs if we had them) to avoid asset dependency for now.
// Ideally, these would be mp3 files in /public/sounds/

const clickSound = new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'], // Placeholder click
    volume: 0.5,
    html5: true
});

const successSound = new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'], // Placeholder success
    volume: 0.5,
    html5: true
});

const moneySound = new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'], // Placeholder coin
    volume: 0.5,
    html5: true
});

const errorSound = new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3'], // Placeholder error
    volume: 0.3,
    html5: true
});


export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Import user settings from store instead of using local state
    const user = useAppStore((state) => state.user);
    const soundEnabled = user?.settings?.soundEnabled ?? true;
    const musicEnabled = user?.settings?.musicEnabled ?? true;

    // Sync Howler global mute with user settings
    useEffect(() => {
        Howler.mute(!soundEnabled);
    }, [soundEnabled]);

    // Legacy toggleMute for backward compatibility (updates store)
    const toggleMute = () => {
        const { updateUserSettings } = useAppStore.getState();
        updateUserSettings({ soundEnabled: !soundEnabled });
    };

    const playClick = () => {
        if (soundEnabled) clickSound.play();
    };

    const playSuccess = () => {
        if (soundEnabled) successSound.play();
    };

    const playMoney = () => {
        if (soundEnabled) moneySound.play();
    };

    const playError = () => {
        if (soundEnabled) errorSound.play();
    };

    return (
        <SoundContext.Provider value={{ playClick, playSuccess, playMoney, playError, mute: !soundEnabled, toggleMute }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useAppSound = () => {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error('useAppSound must be used within a SoundProvider');
    }
    return context;
};
