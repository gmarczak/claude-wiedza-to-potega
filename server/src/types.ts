// ===== AVATARS =====
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

// ===== POWER-UPS (Zagrywki) =====
export type PowerUpType = 'slime' | 'platypus' | 'ice' | 'bomb' | 'double' | 'fifty';

export interface PowerUp {
  type: PowerUpType;
  name: string;
  description: string;
  emoji: string;
  selfBuff?: boolean; // true = applies to self, false = attacks opponent
}

export const POWER_UPS: PowerUp[] = [
  { type: 'slime', name: 'Szlam', description: 'Zamazuje odpowiedzi przeciwnika - musi je wytrzeć!', emoji: '🟢' },
  { type: 'platypus', name: 'Dziobak', description: 'Zjada losowe litery z odpowiedzi przeciwnika', emoji: '🦆' },
  { type: 'ice', name: 'Lód', description: 'Zamraża ekran przeciwnika na 3 sekundy', emoji: '🧊' },
  { type: 'bomb', name: 'Bomba', description: 'Miesza kolejność odpowiedzi w trakcie pytania', emoji: '💣' },
  { type: 'double', name: 'Podwójne Punkty', description: 'Zdobywasz podwójne punkty za tę rundę!', emoji: '✨', selfBuff: true },
  { type: 'fifty', name: '50/50', description: 'Usuwa dwie błędne odpowiedzi z pytania', emoji: '✂️', selfBuff: true },
];

// ===== QUESTIONS =====
export interface Question {
  id: string;
  question: string;
  answers: string[];
  correctIndex: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
}

// ===== MINI-GAMES =====
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

// ===== PLAYER =====
export interface Player {
  id: string;
  name: string;
  avatarId: string;
  score: number;
  currentAnswer: number | null;
  answeredAt: number | null;
  answered: boolean;
  powerUps: PowerUpType[];
  hasOverride: boolean; // przełamanie - one per game
  categoryVote: string | null;
  usedOverride: boolean;
  // Mini-game
  miniGameScore: number;
  miniGameDone: boolean;
  // Pyramid
  pyramidPosition: number;
}

// ===== ROOM =====
export type RoomPhase =
  | 'waiting'
  | 'countdown'
  | 'category_vote'
  | 'power_up'
  | 'question'
  | 'reveal'
  | 'minigame'
  | 'minigame_results'
  | 'pyramid_intro'
  | 'pyramid_question'
  | 'pyramid_reveal'
  | 'finished';

export interface Room {
  id: string;
  players: Player[];
  questions: Question[];
  currentQuestionIndex: number;
  phase: RoomPhase;
  roundTime: number;
  totalRounds: number;
  timer: ReturnType<typeof setTimeout> | null;
  // Category voting
  availableCategories: string[];
  selectedCategory: string | null;
  // Power-ups for current round
  currentPowerUps: Record<string, { type: PowerUpType; targetId: string } | null>; // playerId -> power used on target
  // Game structure: 3 rounds of questions, minigame, 3 rounds, minigame, 3 rounds, pyramid
  roundGroup: number; // 0, 1, 2 (which group of 3 questions)
  roundInGroup: number; // 0, 1, 2 (which question in the group)
  miniGames: MiniGameDef[];
  currentMiniGame: number;
  // Pyramid
  pyramidQuestions: Question[];
  pyramidQuestionIndex: number;
  pyramidSize: number;
  // Host comments
  hostComment: string | null;
  // Settings
  difficulty: string;
}

export interface GameSettings {
  totalRounds: number;
  roundTime: number;
  category: string;
  difficulty: string;
}

// ===== SOCKET EVENTS =====
export interface ServerToClientEvents {
  'room:created': (roomId: string) => void;
  'room:joined': (room: RoomState) => void;
  'room:player-joined': (player: PlayerInfo) => void;
  'room:player-left': (playerId: string) => void;
  'game:countdown': (seconds: number) => void;
  'game:category-vote': (data: CategoryVoteData) => void;
  'game:category-result': (data: CategoryResultData) => void;
  'game:power-up-phase': (data: PowerUpPhaseData) => void;
  'game:question': (data: QuestionData) => void;
  'game:tick': (timeLeft: number) => void;
  'game:power-up-hit': (data: PowerUpHitData) => void;
  'game:power-up-self': (data: PowerUpSelfData) => void;
  'game:reveal': (data: RevealData) => void;
  'game:minigame-start': (data: MiniGameData) => void;
  'game:minigame-results': (data: MiniGameResultsData) => void;
  'game:pyramid-intro': (data: PyramidIntroData) => void;
  'game:pyramid-question': (data: PyramidQuestionData) => void;
  'game:pyramid-reveal': (data: PyramidRevealData) => void;
  'game:finished': (data: GameResult) => void;
  'game:host-comment': (comment: string) => void;
  'error': (message: string) => void;
}

export interface ClientToServerEvents {
  'room:create': (data: { playerName: string; avatarId: string; settings: GameSettings }) => void;
  'room:join': (data: { roomId: string; playerName: string; avatarId: string }) => void;
  'game:start': () => void;
  'game:category-vote': (category: string) => void;
  'game:use-override': (category: string) => void;
  'game:power-up-select': (data: { powerUp: PowerUpType; targetId: string }) => void;
  'game:power-up-skip': () => void;
  'game:answer': (answerIndex: number) => void;
  'game:minigame-result': (score: number) => void;
  'game:pyramid-answer': (answerIndex: number) => void;
}

// ===== DATA TYPES (sent to clients) =====
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
  phase: RoomPhase;
  currentQuestionIndex: number;
  totalRounds: number;
}

export interface CategoryVoteData {
  categories: string[];
  timeLimit: number;
}

export interface CategoryResultData {
  selectedCategory: string;
  votes: Record<string, string>; // playerId -> category
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
  hiddenAnswers?: number[]; // for 'fifty' - indices of hidden wrong answers
}

export interface PowerUpSelfData {
  type: PowerUpType;
  hiddenAnswers?: number[]; // for 'fifty' - indices of hidden wrong answers
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
