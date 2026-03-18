export interface Avatar {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export const AVATARS: Avatar[] = [
  { id: 'hotdog', name: 'Hot Dog', emoji: '🌭', color: '#ef4444' },
  { id: 'robot', name: 'Robot', emoji: '🤖', color: '#3b82f6' },
  { id: 'wizard', name: 'Czarodziej', emoji: '🧙', color: '#8b5cf6' },
  { id: 'alien', name: 'Kosmita', emoji: '👽', color: '#22c55e' },
  { id: 'pirate', name: 'Pirat', emoji: '🏴‍☠️', color: '#f59e0b' },
  { id: 'ninja', name: 'Ninja', emoji: '🥷', color: '#6366f1' },
  { id: 'vampire', name: 'Wampir', emoji: '🧛', color: '#dc2626' },
  { id: 'astronaut', name: 'Astronauta', emoji: '👨‍🚀', color: '#0ea5e9' },
  { id: 'dragon', name: 'Smok', emoji: '🐉', color: '#16a34a' },
  { id: 'detective', name: 'Detektyw', emoji: '🕵️', color: '#78716c' },
  { id: 'unicorn', name: 'Jednorożec', emoji: '🦄', color: '#e879f9' },
  { id: 'ghost', name: 'Duch', emoji: '👻', color: '#94a3b8' },
];

export type PowerUpType = 'slime' | 'platypus' | 'ice' | 'bomb' | 'double' | 'fifty';

export interface PowerUp {
  type: PowerUpType;
  name: string;
  description: string;
  emoji: string;
}

export interface PlayerInfo {
  id: string;
  name: string;
  avatarId: string;
  score: number;
  hasOverride: boolean;
}

export interface RoomState {
  id: string;
  players: PlayerInfo[];
  phase: string;
  currentQuestionIndex: number;
  totalRounds: number;
}

export interface CategoryVoteData {
  categories: string[];
  timeLimit: number;
}

export interface CategoryResultData {
  selectedCategory: string;
  votes: Record<string, string>;
  overrideUsed: boolean;
  overrideBy: string | null;
}

export interface PowerUpPhaseData {
  availablePowerUps: PowerUp[];
  opponents: { id: string; name: string }[];
  timeLimit: number;
}

export interface QuestionData {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  answers: string[];
  category: string;
  difficulty: string;
  timeLimit: number;
  imageUrl?: string;
  roundGroup: number;
  roundInGroup: number;
}

export interface PowerUpHitData {
  type: PowerUpType;
  fromPlayerName: string;
  hiddenAnswers?: number[];
}

export interface PowerUpSelfData {
  type: PowerUpType;
  hiddenAnswers?: number[];
}

export interface RevealData {
  correctIndex: number;
  players: {
    id: string;
    name: string;
    avatarId: string;
    score: number;
    pointsEarned: number;
    answer: number | null;
    answerTime: number | null;
  }[];
  speedBonus: boolean;
}

export interface ConnectPair {
  left: string;
  right: string;
}

export interface SortItem {
  item: string;
  category: string;
}

export interface MiniGameConnect {
  type: 'connect';
  title: string;
  pairs: ConnectPair[];
}

export interface MiniGameSort {
  type: 'sort';
  title: string;
  categories: string[];
  items: SortItem[];
}

export type MiniGameDef = MiniGameConnect | MiniGameSort;

export interface MiniGameData {
  gameNumber: number;
  game: MiniGameDef;
  timeLimit: number;
}

export interface MiniGameResultsData {
  players: { id: string; name: string; avatarId: string; score: number; miniGameScore: number }[];
}

export interface PyramidIntroData {
  players: { id: string; name: string; avatarId: string; score: number; startPosition: number }[];
  pyramidSize: number;
}

export interface PyramidQuestionData {
  question: string;
  answers: string[];
  category: string;
  timeLimit: number;
  positions: Record<string, number>;
  pyramidSize: number;
  imageUrl?: string;
}

export interface PyramidRevealData {
  correctIndex: number;
  players: {
    id: string;
    name: string;
    avatarId: string;
    answer: number | null;
    correct: boolean;
    newPosition: number;
  }[];
  pyramidSize: number;
}

export interface GameResult {
  players: { id: string; name: string; avatarId: string; score: number }[];
  winner: { id: string; name: string } | null;
  funFact: string;
}

export interface GameSettings {
  totalRounds: number;
  roundTime: number;
  category: string;
  difficulty: string;
}

export type GameScreen =
  | 'home' | 'lobby' | 'countdown'
  | 'category_vote' | 'category_result'
  | 'power_up' | 'question' | 'reveal'
  | 'minigame' | 'minigame_results'
  | 'pyramid_intro' | 'pyramid_question' | 'pyramid_reveal'
  | 'finished';
