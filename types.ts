export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

export interface Player {
  id: string;
  name: string;
  scores: number[];
  totalScore: number;
  wins: number;
  suit: Suit;
}

export type GameStatus = 'LOBBY' | 'ACTIVE';

export interface GameState {
  players: Player[];
  status: GameStatus;
  dealerIndex: number;
  historyOpen: boolean;
  roundConfigOpen: boolean;
}

export type Theme = 'light' | 'dark';

export const PRESET_SCORES = [
  { label: 'Win', value: 0 },
  { label: 'Joker', value: -10 }, // Hand Rommé often rewards negative or zero
  { label: 'High', value: 100 },
];