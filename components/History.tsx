import React from 'react';
import { Player } from '../types';
import { Trash2, ArrowLeft } from 'lucide-react';
import { TranslationKey } from '../translations';

interface HistoryProps {
  players: Player[];
  onClose: () => void;
  onDeleteRound: (roundIndex: number) => void;
  t: (key: TranslationKey, params?: Record<string, string>) => string;
}

export const History: React.FC<HistoryProps> = ({ players, onClose, onDeleteRound, t }) => {
  const roundCount = players[0]?.scores.length || 0;
  const rounds = Array.from({ length: roundCount }, (_, i) => i).reverse();

  return (
    <div className="fixed inset-0 z-40 bg-paper dark:bg-gray-900 overflow-y-auto animate-in slide-in-from-right">
      <div className="sticky top-0 z-10 bg-paper/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 -ml-2 hover:bg-black/5 rounded-full dark:text-white">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-serif font-bold text-felt-dark dark:text-white">{t('scoreSheet')}</h2>
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto">
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">{t('round')}</th>
                {players.map(p => (
                  <th key={p.id} className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {p.name}
                  </th>
                ))}
                <th className="px-6 py-4 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {rounds.map((roundIndex) => (
                <tr key={roundIndex} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    #{roundIndex + 1}
                  </td>
                  {players.map(p => (
                    <td key={p.id} className="px-6 py-4">
                      <span className={`
                        inline-block px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${p.scores[roundIndex] === 0 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'text-gray-600 dark:text-gray-300'}
                      `}>
                        {p.scores[roundIndex]}
                      </span>
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onDeleteRound(roundIndex)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title={t('deleteRound')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {/* Totals Row */}
              <tr className="bg-gray-50 dark:bg-gray-700 font-bold border-t-2 border-gray-200 dark:border-gray-600">
                <td className="px-6 py-4">{t('total')}</td>
                {players.map(p => (
                  <td key={p.id} className="px-6 py-4 text-felt dark:text-midnight-accent text-base">
                    {p.totalScore}
                  </td>
                ))}
                <td className="px-6 py-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};