import React from 'react';
import { BottomNav } from '../../features/ageMode/components/BottomNav';

/**
 * Backward compatibility alias for BottomNav.
 * The legacy 7-tab bar (HQ, Business, Employees, Collect, Empire, Achievements, Shop)
 * has been replaced by the modern 4-tab Adventure navigation: Map, Play, Missions, Profile.
 */
export const BottomNavigation: React.FC = () => {
    return <BottomNav />;
};

export default BottomNavigation;
