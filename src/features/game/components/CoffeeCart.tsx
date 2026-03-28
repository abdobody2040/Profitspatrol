
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../../store';
import { motion } from 'framer-motion';
import { Coffee, ArrowLeft, RotateCcw, DollarSign, Cloud, Sun, CloudRain } from 'lucide-react';
import GameTutorialModal from './common/GameTutorialModal';
import { useTranslation } from 'react-i18next';
import { useEnergy } from '../../../hooks/useEnergy';
import InvestorPitchModal from './InvestorPitchModal';

interface Props {
    onBack: () => void;
}

const CoffeeCart: React.FC<Props> = ({ onBack }) => {
    const { t } = useTranslation();
    const { completeGame } = useAppStore();
    const { consumeEnergy } = useEnergy();
    const [phase, setPhase] = useState<'PREP' | 'BREW' | 'RESULT'>('PREP');
    const [funds, setFunds] = useState(50);
    const [stock, setStock] = useState({ beans: 0, milk: 0, cups: 0 });
    const [recipe, setRecipe] = useState({ roast: 5, foam: 5, price: 3.5 });
    const [weather, setWeather] = useState('Sunny');
    const [showTutorial, setShowTutorial] = useState(true);
    const [showPaywall, setShowPaywall] = useState(false);

    // Brew Phase
    const [progress, setProgress] = useState(0);
    const [stats, setStats] = useState({ sold: 0, revenue: 0, tips: 0 });

    useEffect(() => {
        const r = Math.random();
        setWeather(r > 0.6 ? 'Rainy' : r > 0.3 ? 'Cloudy' : 'Sunny');
    }, []);

    const buy = (item: 'beans' | 'milk' | 'cups', cost: number, amount: number) => {
        if (funds >= cost) {
            setFunds(f => f - cost);
            setStock(s => ({ ...s, [item]: s[item] + amount }));
        }
    };

    const startDay = () => {
        if (stock.cups === 0) return alert(t('games.coffee.alert_cups'));

        // Energy Check
        if (!consumeEnergy()) {
            setShowPaywall(true);
            return;
        }

        setPhase('BREW');

        // Simulation
        let sold = 0;
        const demand = weather === 'Rainy' ? 40 : weather === 'Cloudy' ? 25 : 15; // Rainy = More coffee!
        const quality = (recipe.roast + recipe.foam) / 20; // 0.1 to 1.0
        const priceFactor = 5 / recipe.price;

        const potential = Math.floor(demand * quality * priceFactor);
        sold = Math.min(potential, stock.cups, stock.beans, stock.milk);

        const revenue = sold * recipe.price;
        const tips = Math.floor(sold * quality); // Better quality = tips

        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    setStats({ sold, revenue, tips });
                    completeGame(revenue + tips, (revenue + tips) * 2);
                    setPhase('RESULT');
                    return 100;
                }
                return p + 2;
            });
        }, 50);
    };

    return (
        <div className="bg-[#3e2723] rounded-3xl overflow-hidden shadow-2xl text-[#d7ccc8] flex flex-col relative h-full">
            <InvestorPitchModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />

            {showTutorial && (
                <GameTutorialModal
                    onStart={() => setShowTutorial(false)}
                    title={t('games.coffee.title')}
                    description={t('games.coffee.desc')}
                    icon="☕"
                    color="bg-[#5d4037]"
                    // @ts-ignore
                    instructions={(t('games.coffee.instructions', { returnObjects: true }) as any) as string[]}
                />
            )}

            <div className="p-4 md:p-6 flex justify-between items-center bg-[#281916] shrink-0 z-10">
                <button onClick={onBack} className="text-[#a1887f] hover:text-white"><ArrowLeft /></button>
                <div className="text-xl md:text-2xl font-black">{t('games.coffee.title')} ☕</div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowTutorial(true)} className="bg-[#5d4037] hover:bg-[#8d6e63] px-3 py-1 rounded text-xs font-bold">{t('common.help' as any)}</button>
                    <div className="bg-[#5d4037] px-3 py-1 md:px-4 md:py-1 rounded-full font-mono font-bold text-sm md:text-base">${funds.toFixed(2)}</div>
                </div>
            </div>

            <div className="flex-1 p-4 md:p-8 pb-40 flex flex-col items-center overflow-y-auto">
                {phase === 'PREP' && (
                    <div className="w-full max-w-2xl space-y-6 md:space-y-8">
                        <div className="flex justify-between items-center bg-[#4e342e] p-4 rounded-2xl">
                            <div className="flex items-center gap-2">
                                {weather === 'Sunny' ? <Sun className="text-yellow-500" /> : weather === 'Rainy' ? <CloudRain className="text-blue-400" /> : <Cloud className="text-gray-400" />}
                                <span className="font-bold text-sm md:text-base">{t(`games.coffee.weather.${weather.toLowerCase()}` as any)} {t('games.coffee.forecast')}</span>
                            </div>
                            <div className="text-xs md:text-sm opacity-70">{t('games.coffee.tip_rain')}</div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-[#5d4037] p-4 rounded-xl text-center">
                                <div className="text-3xl mb-2">🫘</div>
                                <div className="font-bold mb-1 text-sm md:text-base">{t('games.coffee.item_beans')}: {stock.beans}</div>
                                <button onClick={() => buy('beans', 5, 10)} className="w-full bg-[#8d6e63] hover:bg-[#a1887f] py-2 rounded font-bold text-xs">{t('games.coffee.buy')} 10 ($5)</button>
                            </div>
                            <div className="bg-[#5d4037] p-4 rounded-xl text-center">
                                <div className="text-3xl mb-2">🥛</div>
                                <div className="font-bold mb-1 text-sm md:text-base">{t('games.coffee.item_milk')}: {stock.milk}</div>
                                <button onClick={() => buy('milk', 3, 10)} className="w-full bg-[#8d6e63] hover:bg-[#a1887f] py-2 rounded font-bold text-xs">{t('games.coffee.buy')} 10 ($3)</button>
                            </div>
                            <div className="bg-[#5d4037] p-4 rounded-xl text-center col-span-2 md:col-span-1">
                                <div className="text-3xl mb-2">🥤</div>
                                <div className="font-bold mb-1 text-sm md:text-base">{t('games.coffee.item_cups')}: {stock.cups}</div>
                                <button onClick={() => buy('cups', 2, 20)} className="w-full bg-[#8d6e63] hover:bg-[#a1887f] py-2 rounded font-bold text-xs">{t('games.coffee.buy')} 20 ($2)</button>
                            </div>
                        </div>

                        <div className="bg-[#4e342e] p-6 rounded-2xl space-y-4">
                            <div>
                                <div className="flex justify-between mb-1 text-sm font-bold">{t('games.coffee.price')}: ${recipe.price}</div>
                                <input type="range" min="1" max="8" step="0.5" value={recipe.price} onChange={e => setRecipe({ ...recipe, price: parseFloat(e.target.value) })} className="w-full accent-[#d7ccc8]" />
                            </div>
                            <div>
                                <div className="flex justify-between mb-1 text-sm font-bold">{t('games.coffee.roast')}: {recipe.roast}</div>
                                <input type="range" min="1" max="10" value={recipe.roast} onChange={e => setRecipe({ ...recipe, roast: parseInt(e.target.value) })} className="w-full accent-[#d7ccc8]" />
                            </div>
                        </div>

                        <button onClick={startDay} className="w-full py-4 bg-[#8d6e63] hover:bg-[#a1887f] text-white font-black text-xl rounded-2xl shadow-lg mb-8">{t('games.coffee.start_brewing')}</button>
                    </div>
                )}

                {phase === 'BREW' && (
                    <div className="text-center my-auto">
                        <div className="text-9xl mb-8 animate-bounce">☕</div>
                        <div className="w-64 h-4 bg-[#4e342e] rounded-full overflow-hidden mx-auto">
                            <div className="h-full bg-[#d7ccc8] transition-all duration-75" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="mt-4 font-bold text-xl">{t('games.coffee.serving')}</div>
                    </div>
                )}

                {phase === 'RESULT' && (
                    <div className="text-center space-y-6 my-auto w-full max-w-md">
                        <h2 className="text-3xl md:text-4xl font-black">{t('games.coffee.day_complete')}</h2>
                        <div className="grid grid-cols-2 gap-4 text-start bg-[#4e342e] p-6 rounded-2xl">
                            <div>{t('games.coffee.sold')}:</div><div className="font-black text-end">{stats.sold} {t('games.coffee.unit_cups')}</div>
                            <div>{t('games.coffee.revenue')}:</div><div className="font-black text-end text-green-400">${stats.revenue.toFixed(2)}</div>
                            <div>{t('games.coffee.tips')}:</div><div className="font-black text-end text-yellow-400">${stats.tips.toFixed(2)}</div>
                            <div className="pt-2 border-t border-[#5d4037]">{t('games.coffee.total')}:</div><div className="pt-2 border-t border-[#5d4037] font-black text-end text-xl">${(stats.revenue + stats.tips).toFixed(2)}</div>
                        </div>
                        <div className="flex gap-4 justify-center">
                            <button onClick={onBack} className="px-6 py-3 rounded-xl border border-[#a1887f] hover:bg-[#4e342e]">{t('common.leave' as any)}</button>
                            <button onClick={() => { setPhase('PREP'); setFunds(f => f + stats.revenue + stats.tips); }} className="px-6 py-3 rounded-xl bg-[#8d6e63] hover:bg-[#a1887f] font-black text-white">{t('games.coffee.next_day')}</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoffeeCart;
