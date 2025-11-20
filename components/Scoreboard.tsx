import React, { useMemo } from 'react';
import { Player, Suit } from '../types';
import { Crown, Heart, Diamond, Club, Spade } from 'lucide-react';
import { TranslationKey } from '../translations';

interface ScoreboardProps {
  players: Player[];
  dealerIndex: number;
  t: (key: TranslationKey, params?: Record<string, string>) => string;
}

const SuitIcon = ({ suit, className, filled = true }: { suit: Suit, className?: string, filled?: boolean }) => {
  const props = { className, fill: filled ? "currentColor" : "none" };
  switch (suit) {
    case 'hearts': return <Heart {...props} />;
    case 'diamonds': return <Diamond {...props} />;
    case 'clubs': return <Club {...props} />;
    case 'spades': return <Spade {...props} />;
  }
};

export const Scoreboard: React.FC<ScoreboardProps> = ({ players, dealerIndex, t }) => {
  
  const minScore = useMemo(() => {
      if (players.length === 0) return 0;
      return Math.min(...players.map(p => p.totalScore));
  }, [players]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 p-4 pb-32 max-w-6xl mx-auto">
      {players.map((player, index) => {
        const isLeader = player.totalScore === minScore && players.some(p => p.totalScore !== 0);
        const isDealer = index === dealerIndex;
        const suitColor = (player.suit === 'hearts' || player.suit === 'diamonds') ? 'text-suit-red' : 'text-suit-black dark:text-gray-900';
        const rank = player.name.charAt(0).toUpperCase();

        return (
          <div 
            key={player.id}
            className={`
              group relative flex flex-col items-center justify-center aspect-[2.5/3.5] rounded-2xl transition-all duration-300
              bg-white overflow-hidden select-none
              ${isLeader ? 'shadow-floating ring-4 ring-yellow-400 z-10 transform scale-[1.02]' : 'shadow-card hover:shadow-card-hover'}
            `}
          >
            {/* Watermark Background */}
            <div className={`absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none ${suitColor}`}>
               <SuitIcon suit={player.suit} className="w-[80%] h-[80%]" />
            </div>

            {/* Card Top-Left Corner */}
            <div className={`absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col items-center leading-none ${suitColor}`}>
              <span className="text-lg sm:text-xl font-serif font-bold">{rank}</span>
              <SuitIcon suit={player.suit} className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>

            {/* Dealer Chip */}
            {isDealer && (
               <div className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 bg-black text-white rounded-full flex items-center justify-center border-2 border-dashed border-white shadow-sm z-20" title="Dealer">
                 <span className="text-[10px] font-bold">D</span>
               </div>
            )}

             {/* Leader Crown */}
            {isLeader && (
               <div className="absolute -top-3 -right-3 bg-white rounded-full p-1.5 shadow-md z-30">
                  <Crown size={20} className="text-yellow-500 fill-yellow-500 animate-pulse" />
               </div>
            )}

            {/* Center Content (Score & Stats) */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full pt-4">
              
              {/* Main Score */}
              <div className={`text-5xl sm:text-6xl font-serif font-bold tracking-tighter mb-1 ${suitColor} tabular-nums`}>
                {player.totalScore}
              </div>
              
              {/* Name Badge */}
              <div className="max-w-[85%] px-3 py-1 bg-gray-50/90 backdrop-blur-sm rounded-lg border border-gray-100 text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide truncate shadow-sm">
                {player.name}
              </div>

              {/* Stats Row - Centered to avoid corners */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 mt-3 sm:mt-4 w-full px-2 opacity-80">
                 {/* Wins */}
                 <div className="flex flex-col items-center">
                   <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">{t('wins')}</span>
                   <span className="text-xs sm:text-sm font-bold text-gray-900 tabular-nums">{player.wins}</span>
                 </div>
                 
                 <div className="w-px h-6 bg-gray-200"></div>

                 {/* Last Round Score */}
                 <div className="flex flex-col items-center">
                   <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">{t('last')}</span>
                   <span className={`text-xs sm:text-sm font-bold tabular-nums ${player.scores.length > 0 && player.scores[player.scores.length - 1] === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                     {player.scores.length > 0 ? player.scores[player.scores.length - 1] : '-'}
                   </span>
                 </div>
              </div>
            </div>

             {/* Card Bottom-Right Corner (Rotated) */}
            <div className={`absolute bottom-2 right-2 sm:bottom-3 sm:right-3 flex flex-col items-center leading-none rotate-180 ${suitColor}`}>
              <span className="text-lg sm:text-xl font-serif font-bold">{rank}</span>
              <SuitIcon suit={player.suit} className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
};