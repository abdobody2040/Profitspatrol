import React from 'react';
import { AdventureMap } from './AdventureMap';

interface KidMapProps {
    onStartLesson: (moduleId: string) => void;
    onNavigate?: (tab: string) => void;
}

/**
 * KidMap - Adventure Map for Profits Patrol
 * Powered by AdventureMap with Duolingo-grade polish and dual age modes (Junior & Explorer)
 */
export const KidMap: React.FC<KidMapProps> = ({ onStartLesson, onNavigate }) => {
    return <AdventureMap onStartLesson={onStartLesson} onNavigate={onNavigate} />;
};

export default KidMap;
