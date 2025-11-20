import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Check } from 'lucide-react';
import { Button } from './ui/Button';
import { Player, PRESET_SCORES } from '../types';
import { TranslationKey } from '../translations';

interface RoundEntryProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  onSubmit: (scores: Record<string, number>) => void;
  t: (key: TranslationKey, params?: Record<string, string>) => string;
}

export const RoundEntry: React.FC<RoundEntryProps> = ({
  isOpen,
  onClose,
  players,
  onSubmit,
  t
}) => {
  const [scores, setScores] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [activePlayerId, setActivePlayerId] = useState<string>(players[0]?.id || '');

  useEffect(() => {
    if (isOpen) {
      setScores(players.reduce((acc, p) => ({ ...acc, [p.id]: '0' }), {}));
      setActivePlayerId(players[0]?.id);
      setError(null);
    }
  }, [isOpen, players]);

  if (!isOpen) return null;

  const handleNumberClick = (num: number) => {
    const current = scores[activePlayerId] || '0';
    if (current === '0') {
      setScores({ ...scores, [activePlayerId]: num.toString() });
    } else if (current === '-0') {
      setScores({ ...scores, [activePlayerId]: '-' + num.toString() });
    } else {
      setScores({ ...scores, [activePlayerId]: current + num.toString() });
    }
  };

  const handleBackspace = () => {
    const current = scores[activePlayerId] || '0';
    const sliced = current.slice(0, -1);
    if (sliced === '' || sliced === '-') {
      setScores({ ...scores, [activePlayerId]: '0' });
    } else {
      setScores({ ...scores, [activePlayerId]: sliced });
    }
  };

  const handleClear = () => {
    setScores({ ...scores, [activePlayerId]: '0' });
  };

  const handlePreset = (val: number) => {
    setScores({ ...scores, [activePlayerId]: val.toString() });
  };

  const validateAndSubmit = () => {
    const finalScores: Record<string, number> = {};
    let winnerCount = 0;

    for (const p of players) {
      const val = scores[p.id];
      if (val === '' || val === undefined || val === '-') {
        setError(t('scoreError', { name: p.name }));
        return;
      }
      const num = parseInt(val, 10);
      if (isNaN(num)) {
        setError(t('invalidScore', { name: p.name }));
        return;
      }
      if (num === 0) winnerCount++;
      finalScores[p.id] = num;
    }

    if (winnerCount === 0) {
       setError(t('winnerError'));
       return;
    }

    onSubmit(finalScores);
    onClose();
  };

  const toggleSign = () => {
    const current = scores[activePlayerId] || '0';
    if (current.startsWith('-')) {
      setScores({ ...scores, [activePlayerId]: current.substring(1) });
    } else {
      setScores({ ...scores, [activePlayerId]: '-' + current });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-paper dark:bg-gray-900 w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden transition-all animate-in slide-in-from-bottom-10">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-serif font-bold text-felt-dark dark:text-white">{t('recordScores')}</h2>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full dark:text-gray-300">
            <X size={24} />
          </button>
        </div>

        {/* Content Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          
          {/* Player Selector */}
          <div className="flex gap-3 overflow-x-auto p-2 pb-4 scrollbar-hide snap-x">
            {players.map(p => (
              <button
                key={p.id}
                onClick={() => setActivePlayerId(p.id)}
                className={`
                  snap-center shrink-0 flex flex-col items-center justify-center w-24 h-24 rounded-2xl border-2 transition-all
                  ${activePlayerId === p.id 
                    ? 'border-felt bg-felt/10 dark:border-midnight-accent dark:bg-midnight-accent/20 scale-105' 
                    : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 opacity-70'}
                `}
              >
                <span className="font-serif font-bold text-2xl mb-1 text-gray-900 dark:text-white">
                  {scores[p.id] ?? '0'}
                </span>
                <span className="text-xs font-medium truncate w-full text-center px-2 text-gray-600 dark:text-gray-400">
                  {p.name}
                </span>
              </button>
            ))}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400 text-sm animate-in slide-in-from-top-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Input Area */}
          <div className="grid grid-cols-4 gap-3 h-64 sm:h-auto">
            {/* Keypad */}
            <div className="col-span-3 grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                <button 
                  key={n} 
                  onClick={() => handleNumberClick(n)}
                  className="h-14 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 text-2xl font-medium active:scale-95 transition-transform hover:bg-gray-50 dark:text-white"
                >
                  {n}
                </button>
              ))}
              <button onClick={toggleSign} className="h-14 rounded-xl bg-gray-100 dark:bg-gray-700 text-lg font-medium dark:text-white">+/-</button>
              <button onClick={() => handleNumberClick(0)} className="h-14 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 text-2xl font-medium active:scale-95 transition-transform dark:text-white">0</button>
              <button onClick={handleBackspace} className="h-14 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center dark:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Presets */}
            <div className="col-span-1 flex flex-col gap-2">
               {PRESET_SCORES.map(preset => (
                 <button
                  key={preset.label}
                  onClick={() => handlePreset(preset.value)}
                  className="flex-1 rounded-xl bg-felt/5 dark:bg-midnight-accent/10 border border-felt/20 dark:border-midnight-accent/20 text-felt dark:text-midnight-accent font-medium text-sm hover:bg-felt/10 active:scale-95 transition-transform"
                 >
                   {/* Map preset label to translation if possible, or just use label */}
                   {preset.label === 'Win' ? t('winLabel') : 
                    preset.label === 'Joker' ? t('jokerLabel') :
                    preset.label === 'High' ? t('highLabel') : preset.label}
                 </button>
               ))}
               <button onClick={handleClear} className="h-14 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-medium text-xs dark:border-red-800 dark:hover:bg-red-900/20">
                 {t('clear')}
               </button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <Button onClick={validateAndSubmit} fullWidth size="lg" variant="primary" icon={<Check size={20}/>}>
            {t('submitRound')}
          </Button>
        </div>
      </div>
    </div>
  );
};