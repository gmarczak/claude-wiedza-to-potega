export interface Question {
  id: string;
  question: string;
  answers: string[];
  correctIndex: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Player {
  id: string;
  name: string;
  score: number;
  currentAnswer: number | null;
  answered: boolean;
}

export interface Room {
  id: string;
  players: Player[];
  questions: Question[];
  currentQuestionIndex: number;
  state: 'waiting' | 'countdown' | 'question' | 'reveal' | 'finished';
  roundTime: number;
  totalRounds: number;
  timer: ReturnType<typeof setTimeout> | null;
}

export interface GameSettings {
  totalRounds: number;
  roundTime: number;
  category: string;
  difficulty: string;
}

// Socket events
export interface ServerToClientEvents {
  'room:created': (roomId: string) => void;
  'room:joined': (room: RoomState) => void;
  'room:player-joined': (player: { id: string; name: string }) => void;
  'room:player-left': (playerId: string) => void;
  'game:countdown': (seconds: number) => void;
  'game:question': (data: QuestionData) => void;
  'game:tick': (timeLeft: number) => void;
  'game:reveal': (data: RevealData) => void;
  'game:finished': (data: GameResult) => void;
  'error': (message: string) => void;
}

export interface ClientToServerEvents {
  'room:create': (data: { playerName: string; settings: GameSettings }) => void;
  'room:join': (data: { roomId: string; playerName: string }) => void;
  'game:start': () => void;
  'game:answer': (answerIndex: number) => void;
}

export interface RoomState {
  id: string;
  players: { id: string; name: string; score: number }[];
  state: Room['state'];
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
