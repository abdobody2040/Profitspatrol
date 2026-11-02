import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../../../store';
import { BusinessSimulation, VisualConfig } from '../../../../types';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

interface Props {
  config: BusinessSimulation;
  onExit: () => void;
}

const GRID_SIZE = 10;

const DrivingTemplate: React.FC<Props> = ({ config, onExit }) => {
  const { t } = useTranslation();
  const { completeGame } = useAppStore();
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.scoring?.time_limit || 30);
  const [gameOver, setGameOver] = useState(false);

  const visual: VisualConfig = config.visual_config || { 
      theme: 'light', 
      colors: { primary: '#3B82F6', secondary: '#1E3A8A', accent: '#EF4444', background: '#F3F4F6' },
      icon: '🚗'
  };

  const playerSprite = config.entities?.find(e => e.type === 'resource')?.emoji || '🛵';
  const targetSprite = config.entities?.find(e => e.type === 'target')?.emoji || '🏠';

  const handleExit = () => {
      completeGame(score, Math.floor(score * 0.5));
      onExit();
  };

  useEffect(() => {
      if (gameOver) return;
      const timer = setInterval(() => {
          setTimeLeft(t => {
              if (t <= 1) {
                  setGameOver(true);
                  return 0;
              }
              return t - 1;
          });
      }, 1000);
      return () => clearInterval(timer);
  }, [gameOver]);

  const spawnTarget = (currentX = playerPos.x, currentY = playerPos.y) => {
      let x, y;
      do {
          x = Math.floor(Math.random() * GRID_SIZE);
          y = Math.floor(Math.random() * GRID_SIZE);
      } while (x === currentX && y === currentY);
      setTargetPos({ x, y });
  };

  const move = (dx: number, dy: number) => {
      if (gameOver) return;
      setPlayerPos(curr => {
          const nx = Math.max(0, Math.min(GRID_SIZE - 1, curr.x + dx));
          const ny = Math.max(0, Math.min(GRID_SIZE - 1, curr.y + dy));
          
          if (nx === targetPos.x && ny === targetPos.y) {
              setScore(s => s + (config.scoring?.base_points || 10));
              setTimeLeft(t => t + 5);
              setTimeout(() => spawnTarget(nx, ny), 0); 
          }
          return { x: nx, y: ny };
      });
  };

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'ArrowUp') move(0, -1);
          if (e.key === 'ArrowDown') move(0, 1);
          if (e.key === 'ArrowLeft') move(-1, 0);
          if (e.key === 'ArrowRight') move(1, 0);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, targetPos, gameOver]);

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 relative" style={{ backgroundColor: visual.colors.background }}>
        
        {/* Header */}
        <div className="w-full max-w-md flex justify-between items-center mb-8 relative z-10">
            <div className="font-black text-2xl md:text-4xl drop-shadow-sm" style={{ color: visual.colors.primary }}>{t('games.score')}: {score}</div>
            <div className={`px-6 py-2 rounded-full font-black text-white text-2xl shadow-xl transition-all ${timeLeft < 10 ? 'bg-red-500 animate-pulse' : 'bg-gray-800'}`}>
                {timeLeft}s
            </div>
        </div>

        {/* Grid Container */}
        <div className="relative bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-white" style={{ width: 'min(90vw, 450px)', height: 'min(90vw, 450px)' }}>
            <div 
                className="absolute inset-0 pointer-events-none opacity-10"
                style={{ 
                    backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                    backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`
                }}
            />

            {/* Target */}
            <div 
                className="absolute flex items-center justify-center text-3xl md:text-5xl transition-all duration-300 drop-shadow-lg"
                style={{
                    width: `${100/GRID_SIZE}%`,
                    height: `${100/GRID_SIZE}%`,
                    left: `${targetPos.x * (100/GRID_SIZE)}%`,
                    top: `${targetPos.y * (100/GRID_SIZE)}%`
                }}
            >
                {targetSprite}
            </div>

            {/* Player */}
            <div 
                className="absolute flex items-center justify-center text-3xl md:text-5xl transition-all duration-150 drop-shadow-xl z-10"
                style={{
                    width: `${100/GRID_SIZE}%`,
                    height: `${100/GRID_SIZE}%`,
                    left: `${playerPos.x * (100/GRID_SIZE)}%`,
                    top: `${playerPos.y * (100/GRID_SIZE)}%`
                }}
            >
                {playerSprite}
            </div>

            {/* Game Over Overlay */}
            {gameOver && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white backdrop-blur-md z-20 p-8 text-center">
                    <h3 className="text-4xl md:text-6xl font-black mb-4 text-yellow-400 uppercase tracking-tighter">{t('games.time_up', "Time's Up!")}</h3>
                    <p className="text-2xl font-bold mb-10 opacity-80">{t('games.final_score')}: {score}</p>
                    <div className="flex flex-col gap-4 w-full">
                        <button onClick={handleExit} className="bg-white text-gray-900 py-5 rounded-[2rem] font-black shadow-[0_8px_0_0_rgba(200,200,200,1)] active:translate-y-2 active:shadow-none transition-all uppercase tracking-widest">{t('games.collect_rewards', 'Collect Rewards')}</button>
                        <button 
                            onClick={() => {
                                setScore(0);
                                setTimeLeft(config.scoring?.time_limit || 30);
                                setGameOver(false);
                                setPlayerPos({ x: 0, y: 0 });
                                spawnTarget(0, 0);
                            }}
                            className="bg-green-500 text-white py-5 rounded-[2rem] font-black shadow-[0_8px_0_0_rgba(21,128,61,1)] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-3 text-xl"
                        >
                            <RotateCcw size={24} /> {t('games.retry', 'Retry')}
                        </button>
                    </div>
                </div>
            )}
        </div>

        {/* Mobile Controls */}
        <div className="mt-8 grid grid-cols-3 gap-4 relative z-10">
            <div />
            <button onClick={() => move(0, -1)} className="p-6 bg-white rounded-2xl shadow-lg active:translate-y-1 transition-all border-2 border-gray-100"><ArrowUp /></button>
            <div />
            <button onClick={() => move(-1, 0)} className="p-6 bg-white rounded-2xl shadow-lg active:translate-y-1 transition-all border-2 border-gray-100"><ArrowLeft /></button>
            <button onClick={() => move(0, 1)} className="p-6 bg-white rounded-2xl shadow-lg active:translate-y-1 transition-all border-2 border-gray-100"><ArrowDown /></button>
            <button onClick={() => move(1, 0)} className="p-6 bg-white rounded-2xl shadow-lg active:translate-y-1 transition-all border-2 border-gray-100"><ArrowRight /></button>
        </div>
    </div>
  );
};

export default DrivingTemplate;
