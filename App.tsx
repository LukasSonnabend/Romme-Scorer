import React, { useState, useEffect } from 'react';
import { GameState, Player } from './types';
import { Lobby } from './components/Lobby';
import { Scoreboard } from './components/Scoreboard';
import { RoundEntry } from './components/RoundEntry';
import { History } from './components/History';
import { Button } from './components/ui/Button';
import { Plus, History as HistoryIcon, Settings, Moon, Sun, Languages } from 'lucide-react';
import confetti from 'canvas-confetti';
import { translations, Language, TranslationKey } from './translations';

function App() {
  // --- State ---
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLang] = useState<Language>('en');
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('romme_state');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      players: [],
      status: 'LOBBY',
      dealerIndex: 0,
      historyOpen: false,
      roundConfigOpen: false,
    };
  });

  // --- Effects ---
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#1a1a1a'; // midnight
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#F5F5DC'; // paper/cream
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('romme_state', JSON.stringify(gameState));
  }, [gameState]);

  // --- Helpers ---
  const t = (key: TranslationKey, params?: Record<string, string>) => {
    let text = translations[lang][key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }
    return text;
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'de' : 'en');
  };

  // --- Actions ---
  const updatePlayers = (players: Player[]) => {
    setGameState(prev => ({ ...prev, players }));
  };

  const startGame = () => {
    setGameState(prev => ({ ...prev, status: 'ACTIVE' }));
  };

  const handleRoundSubmit = (roundScores: Record<string, number>) => {
    const newPlayers = gameState.players.map(p => {
      const score = roundScores[p.id] || 0;
      const isWin = score === 0;
      return {
        ...p,
        scores: [...p.scores, score],
        totalScore: p.totalScore + score,
        wins: isWin ? p.wins + 1 : p.wins,
      };
    });

    // Trigger confetti if someone won (score 0)
    const hasWinner = Object.values(roundScores).some(s => s === 0);
    if (hasWinner) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#2F5233', '#B91C1C'] // Gold, Felt, Red
      });
    }

    // Rotate dealer
    const nextDealer = (gameState.dealerIndex + 1) % newPlayers.length;

    setGameState(prev => ({
      ...prev,
      players: newPlayers,
      dealerIndex: nextDealer,
      roundConfigOpen: false,
    }));
  };

  const deleteRound = (roundIndex: number) => {
    const newPlayers = gameState.players.map(p => {
      const scoreToRemove = p.scores[roundIndex];
      const newScores = p.scores.filter((_, i) => i !== roundIndex);
      const wasWin = scoreToRemove === 0;
      return {
        ...p,
        scores: newScores,
        totalScore: p.totalScore - scoreToRemove,
        wins: wasWin ? Math.max(0, p.wins - 1) : p.wins
      };
    });

    setGameState(prev => ({
      ...prev,
      players: newPlayers,
    }));
  };

  const resetGame = () => {
    if (confirm(t('resetConfirm'))) {
       setGameState({
        players: [],
        status: 'LOBBY',
        dealerIndex: 0,
        historyOpen: false,
        roundConfigOpen: false,
       });
       localStorage.removeItem('romme_state');
    }
  };

  // --- Render ---
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Navbar / Top Bar */}
      <header className="flex items-center justify-between p-4">
        {gameState.status === 'ACTIVE' && (
          <button onClick={resetGame} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-xs font-medium text-gray-500">
            {t('exit')}
          </button>
        )}
        <div className="flex-1"></div>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleLanguage}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 transition-all font-bold text-xs"
            title="Switch Language"
          >
            {lang.toUpperCase()}
          </button>
          <button 
            onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
            className="p-3 rounded-full bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 transition-all"
          >
            {theme === 'light' ? <Moon size={20} className="text-felt" /> : <Sun size={20} className="text-midnight-accent" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-0">
        {gameState.status === 'LOBBY' && (
          <Lobby 
            players={gameState.players} 
            setPlayers={updatePlayers} 
            onStartGame={startGame}
            t={t}
          />
        )}

        {gameState.status === 'ACTIVE' && (
          <>
            <div className="flex-1 overflow-y-auto">
              <Scoreboard 
                players={gameState.players} 
                dealerIndex={gameState.dealerIndex}
                t={t}
              />
            </div>

            {/* Sticky Action Bar */}
            <div className="sticky bottom-6 left-0 right-0 px-4 w-full max-w-md mx-auto z-30">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-floating p-2 flex items-center justify-between gap-2 border border-gray-100 dark:border-gray-700">
                
                <Button 
                  variant="ghost" 
                  onClick={() => setGameState(p => ({ ...p, historyOpen: true }))}
                  className="flex-1 flex-col gap-1 py-2 h-auto text-[10px] uppercase tracking-wider"
                >
                  <HistoryIcon size={20} />
                  {t('history')}
                </Button>

                <div className="relative -top-6">
                   <button
                    onClick={() => setGameState(p => ({ ...p, roundConfigOpen: true }))}
                    className="w-16 h-16 rounded-2xl bg-felt dark:bg-midnight-accent text-white dark:text-black shadow-lg shadow-felt/40 dark:shadow-yellow-500/20 flex items-center justify-center transform transition-transform active:scale-95 hover:-translate-y-1"
                   >
                     <Plus size={32} />
                   </button>
                </div>

                <Button 
                  variant="ghost" 
                  className="flex-1 flex-col gap-1 py-2 h-auto text-[10px] uppercase tracking-wider opacity-50 cursor-not-allowed"
                  title="Settings (Coming Soon)"
                >
                  <Settings size={20} />
                  {t('options')}
                </Button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Modals */}
      <RoundEntry 
        isOpen={gameState.roundConfigOpen} 
        onClose={() => setGameState(p => ({ ...p, roundConfigOpen: false }))}
        players={gameState.players}
        onSubmit={handleRoundSubmit}
        t={t}
      />

      {gameState.historyOpen && (
        <History 
          players={gameState.players} 
          onClose={() => setGameState(p => ({ ...p, historyOpen: false }))}
          onDeleteRound={deleteRound}
          t={t}
        />
      )}

    </div>
  );
}

export default App;