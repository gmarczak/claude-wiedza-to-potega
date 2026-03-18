export interface RoomState {
  id: string;
  players: { id: string; name: string; score: number }[];
  state: 'waiting' | 'countdown' | 'question' | 'reveal' | 'finished';
  currentQuestionIndex: number;
  totalRounds: number;
}

export interface QuestionData {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  answers: string[];
  category: string;
  difficulty: string;
  timeLimit: number;
}

export interface RevealData {
  correctIndex: number;
  players: { id: string; name: string; score: number; answer: number | null }[];
}

export interface GameResult {
  players: { id: string; name: string; score: number }[];
  winner: { id: string; name: string } | null;
}

export interface GameSettings {
  totalRounds: number;
  roundTime: number;
  category: string;
  difficulty: string;
}

export type GameScreen = 'home' | 'lobby' | 'countdown' | 'question' | 'reveal' | 'finished';
