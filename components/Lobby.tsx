import React, { useState } from 'react';
import { Plus, Users, Play, X } from 'lucide-react';
import { Button } from './ui/Button';
import { Player, Suit } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { TranslationKey } from '../translations';

interface LobbyProps {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  onStartGame: () => void;
  t: (key: TranslationKey, params?: Record<string, string>) => string;
}

export const Lobby: React.FC<LobbyProps> = ({ players, setPlayers, onStartGame, t }) => {
  const [newPlayerName, setNewPlayerName] = useState('');

  const addPlayer = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newPlayerName.trim()) return;
    if (players.length >= 6) return;

    const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const randomSuit = suits[Math.floor(Math.random() * suits.length)];

    const newPlayer: Player = {
      id: uuidv4(),
      name: newPlayerName.trim(),
      scores: [],
      totalScore: 0,
      wins: 0,
      suit: randomSuit
    };

    setPlayers([...players, newPlayer]);
    setNewPlayerName('');
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 max-w-md mx-auto w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-floating mb-4 text-felt dark:text-midnight-accent">
          <Users size={32} />
        </div>
        <h1 className="text-4xl font-serif font-bold text-felt-dark dark:text-paper mb-2">{t('appTitle')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('addPlayers')}</p>
      </div>

      <div className="w-full space-y-4 mb-8">
        <form onSubmit={addPlayer} className="relative">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder={t('enterName')}
            className="w-full h-14 pl-5 pr-12 rounded-xl bg-white dark:bg-gray-800 border-2 border-transparent focus:border-felt dark:focus:border-midnight-accent shadow-card outline-none text-lg transition-all placeholder:text-gray-400 dark:text-white"
            autoFocus
          />
          <button 
            type="submit"
            disabled={!newPlayerName.trim() || players.length >= 6}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-felt dark:bg-midnight-accent text-white dark:text-black rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95"
          >
            <Plus size={20} />
          </button>
        </form>

        <div className="space-y-2">
          {players.map((player, index) => (
            <div 
              key={player.id}
              className="flex items-center justify-between p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-black/5 dark:border-white/10 animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 bg-paper dark:bg-gray-700 rounded-full text-xs font-bold text-felt dark:text-midnight-accent">
                  {index + 1}
                </span>
                <span className="font-medium text-lg text-gray-900 dark:text-gray-100">{player.name}</span>
              </div>
              <button 
                onClick={() => removePlayer(player.id)}
                className="p-2 text-gray-400 hover:text-suit-red transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          ))}
          
          {players.length === 0 && (
            <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
              {t('noPlayers')}
            </div>
          )}
        </div>
      </div>

      <Button 
        onClick={onStartGame} 
        fullWidth 
        size="lg"
        variant="gold"
        disabled={players.length < 2}
        icon={<Play size={20} fill="currentColor" />}
      >
        {t('startGame')}
      </Button>
    </div>
  );
};