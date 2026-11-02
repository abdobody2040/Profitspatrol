import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store';
import { useEconomyStore } from '../store/economyStore';

export function usePassiveIncome() {
    const { user } = useAppStore();
    const { collectAllRent } = useEconomyStore();
    const [accruedAmount, setAccruedAmount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const checkedRef = useRef(false);

    useEffect(() => {
        // Run only once when user is loaded and authenticated
        if (user && user.role === 'KID' && !checkedRef.current) {
            checkedRef.current = true;
            
            // Wait a small bit to ensure everything is settled
            const timer = setTimeout(() => {
                const earned = collectAllRent();
                if (earned > 0) {
                    setAccruedAmount(earned);
                    setIsModalOpen(true);
                }
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [user, collectAllRent]);

    return {
        accruedAmount,
        isModalOpen,
        closeModal: () => setIsModalOpen(false),
        propertyCount: user?.properties?.length || 0
    };
}
