import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, DollarSign, ArrowUp, Plus, Building2 } from 'lucide-react';
import { BusinessSimulation, OfficeConfig } from '../../../../types';

interface OfficeTemplateProps {
    config?: BusinessSimulation;
    onComplete: (score: number, data: any) => void;
}

const OfficeTemplate: React.FC<OfficeTemplateProps> = ({ config, onComplete }) => {
    const { t } = useTranslation();
    const officeConfig = config?.office_config || { max_floors: 10, tenant_types: [] };
    const { tenant_types, max_floors } = officeConfig;
    const colors = config?.visual_config?.colors || { primary: '#1E40AF', background: '#EFF6FF' };

    const [floors, setFloors] = useState<string[]>([]); // Array of Tenant IDs. Empty string = Vacant.
    const [money, setMoney] = useState(200);
    const [income, setIncome] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes to build empire

    // Income Loop
    useEffect(() => {
        const timer = setInterval(() => {
            if (timeLeft <= 0) return;

            let totalIncome = 0;
            floors.forEach(tenantId => {
                const tenant = tenant_types.find(t => t.id === tenantId);
                if (tenant) totalIncome += tenant.income;
            });

            setIncome(totalIncome);
            setMoney(prev => prev + totalIncome);
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleFinish();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000); // Monthly cycle = 1 sec
        return () => clearInterval(timer);
    }, [floors, timeLeft]);

    const handleFinish = () => {
        onComplete(money, { floors: floors.length });
    };

    const addFloor = () => {
        if (floors.length >= max_floors) return;
        const buildCost = 100 * (floors.length + 1);
        if (money >= buildCost) {
            setMoney(m => m - buildCost);
            setFloors([...floors, '']); // Add vacant floor
        }
    };

    const rentFloor = (floorIndex: number, tenantId: string) => {
        const tenant = tenant_types.find(t => t.id === tenantId);
        if (!tenant) return;

        if (money >= tenant.cost) {
            setMoney(m => m - tenant.cost);
            const newFloors = [...floors];
            newFloors[floorIndex] = tenantId;
            setFloors(newFloors);
        }
    };

    // Derived
    const nextFloorCost = 100 * (floors.length + 1);

    return (
        <div className="flex flex-col h-full overflow-hidden relative" style={{ backgroundColor: colors.background }}>
            {/* HUD */}
            <div className="p-4 bg-white/80 backdrop-blur-md shadow-sm z-20 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-xl font-black text-xl flex items-center gap-2">
                        <DollarSign size={20} /> {money}
                    </div>
                    <div className="text-sm font-bold text-green-600 flex items-center gap-1">
                        <ArrowUp size={14} /> ${income}/mo
                    </div>
                </div>
                <div className="text-xl font-black text-gray-700">
                    0:{timeLeft.toString().padStart(2, '0')}
                </div>
            </div>

            {/* TOWER VIEW */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse items-center justify-start gap-1 pb-20">

                {/* GROUND FLOOR (Lobby) */}
                <div className="w-64 h-24 bg-gray-800 rounded-b-xl flex items-center justify-center text-white font-black z-10 shadow-2xl">
                    <Building2 size={32} className="mr-2" /> LOBBY
                </div>

                {/* FLOORS */}
                <AnimatePresence>
                    {floors.map((tenantId, index) => {
                        const tenant = tenant_types.find(t => t.id === tenantId);
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className="w-64 h-24 relative group"
                            >
                                {tenant ? (
                                    <div
                                        className="w-full h-full rounded-xl border-4 flex items-center justify-center shadow-lg relative overflow-hidden"
                                        style={{
                                            backgroundColor: tenant.color,
                                            borderColor: 'rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <div className="text-5xl opacity-50 absolute right-2 bottom-0">{tenant.icon}</div>
                                        <div className="font-bold text-white text-lg z-10 shadow-black drop-shadow-md">{tenant.name}</div>
                                        <div className="absolute top-1 right-1 text-xs font-mono text-white/80">+${tenant.income}</div>
                                    </div>
                                ) : (
                                    <div className="w-full h-full bg-gray-100 border-4 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 font-bold">
                                        VACANT

                                        {/* RENT MENU OVERLAY */}
                                        <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-wrap items-center justify-center gap-1 p-1 overflow-hidden">
                                            {tenant_types.map(t => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => rentFloor(index, t.id)}
                                                    disabled={money < t.cost}
                                                    title={`${t.name} (Cost: ${t.cost}, Income: ${t.income})`}
                                                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-transform hover:scale-110
                                                        ${money >= t.cost ? 'bg-white shadow-md cursor-pointer' : 'bg-gray-200 opacity-50 cursor-not-allowed'}
                                                    `}
                                                    style={{ border: `2px solid ${t.color}` }}
                                                >
                                                    {t.icon}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                                    L{index + 1}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* BUILD BUTTON */}
                {floors.length < max_floors && (
                    <motion.button
                        layout
                        onClick={addFloor}
                        disabled={money < nextFloorCost}
                        className={`w-64 h-16 rounded-xl border-4 border-dashed flex items-center justify-center font-bold gap-2 transition-all
                            ${money >= nextFloorCost
                                ? 'border-blue-400 bg-blue-50 text-blue-600 hover:bg-blue-100'
                                : 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'}
                        `}
                    >
                        <Plus size={20} /> Build Floor (${nextFloorCost})
                    </motion.button>
                )}

            </div>
        </div>
    );
};

export default OfficeTemplate;
