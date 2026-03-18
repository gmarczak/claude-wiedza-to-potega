import { useState, useEffect, useCallback } from 'react';
import type { QuestionData, RoomState, PowerUpHitData } from '../types';

interface Props {
  question: QuestionData;
  timeLeft: number;
  room: RoomState;
  playerId: string;
  powerUpHit: PowerUpHitData | null;
  onAnswer: (index: number) => void;
}

const answerColors = [
  'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
  'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
  'from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
  'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
];
const answerLabels = ['A', 'B', 'C', 'D'];
const difficultyLabels: Record<string, { text: string; color: string }> = {
  easy: { text: 'Łatwe', color: 'bg-green-500/20 text-green-300' },
  medium: { text: 'Średnie', color: 'bg-yellow-500/20 text-yellow-300' },
  hard: { text: 'Trudne', color: 'bg-red-500/20 text-red-300' },
};

// Power-up effects
function applyPlatypus(text: string): string {
  const chars = text.split('');
  const removeCount = Math.floor(chars.length * 0.4);
  const indices = chars.map((_, i) => i).filter((i) => chars[i] !== ' ');
  for (let i = 0; i < removeCount && indices.length > 0; i++) {
    const idx = Math.floor(Math.random() * indices.length);
    chars[indices[idx]] = '_';
    indices.splice(idx, 1);
  }
  return chars.join('');
}

export default function QuestionScreen({ question, timeLeft, room, playerId, powerUpHit, onAnswer }: Props) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [slimeCleared, setSlimeCleared] = useState(false);
  const [slimeClicks, setSlimeClicks] = useState(0);
  const [frozen, setFrozen] = useState(false);
  const [shuffledOrder, setShuffledOrder] = useState<number[]>([0, 1, 2, 3]);
  const [bombTriggered, setBombTriggered] = useState(false);

  // Apply power-up effects
  useEffect(() => {
    if (!powerUpHit) return;
    if (powerUpHit.type === 'ice') {
      setFrozen(true);
      const timer = setTimeout(() => setFrozen(false), 3000);
      return () => clearTimeout(timer);
    }
    if (powerUpHit.type === 'bomb') {
      const bombTimer = setTimeout(() => {
        const order = [0, 1, 2, 3];
        for (let i = order.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [order[i], order[j]] = [order[j], order[i]];
        }
        setShuffledOrder(order);
        setBombTriggered(true);
      }, 3000);
      return () => clearTimeout(bombTimer);
    }
  }, [powerUpHit]);

  const handleAnswer = useCallback((index: number) => {
    if (selectedAnswer !== null || frozen) return;
    setSelectedAnswer(index);
    onAnswer(index);
  }, [selectedAnswer, frozen, onAnswer]);

  const handleSlimeClick = useCallback(() => {
    if (slimeCleared) return;
    setSlimeClicks((prev) => {
      const next = prev + 1;
      if (next >= 8) setSlimeCleared(true);
      return next;
    });
  }, [slimeCleared]);

  const timerPercent = (timeLeft / question.timeLimit) * 100;
  const timerColor = timeLeft <= 5 ? 'bg-red-500' : timeLeft <= 10 ? 'bg-yellow-500' : 'bg-green-500';
  const difficulty = difficultyLabels[question.difficulty] || difficultyLabels.easy;
  const me = room.players.find((p) => p.id === playerId);
  const opponent = room.players.find((p) => p.id !== playerId);

  const hasSlime = powerUpHit?.type === 'slime' && !slimeCleared;
  const hasPlatypus = powerUpHit?.type === 'platypus';
  const displayOrder = bombTriggered ? shuffledOrder : [0, 1, 2, 3];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col relative">
      {/* Freeze overlay */}
      {frozen && (
        <div className="absolute inset-0 z-50 bg-cyan-400/30 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center animate-countdown">
            <span className="text-6xl">🧊</span>
            <p className="text-white text-xl font-bold mt-2">Zamrożony!</p>
            <p className="text-cyan-200 text-sm">{powerUpHit?.fromPlayerName} zamroził Twój ekran!</p>
          </div>
        </div>
      )}

      {/* Slime overlay */}
      {hasSlime && (
        <div className="absolute inset-x-0 bottom-0 z-40 flex items-end justify-center pointer-events-auto"
          style={{ top: '40%' }} onClick={handleSlimeClick}>
          <div className="w-full h-full bg-green-500/70 backdrop-blur-md flex items-center justify-center cursor-pointer"
            style={{ opacity: 1 - slimeClicks / 8 }}>
            <div className="text-center">
              <span className="text-5xl">🟢</span>
              <p className="text-white font-bold mt-2">Szlam! Klikaj aby wytrzeć! ({slimeClicks}/8)</p>
              <p className="text-green-200 text-xs">{powerUpHit?.fromPlayerName} zamazał Twoje odpowiedzi</p>
            </div>
          </div>
        </div>
      )}

      {/* Power-up notification */}
      {powerUpHit && !frozen && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-orange-500/90 text-white px-4 py-2 rounded-full text-sm font-semibold animate-slide-up">
          {powerUpHit.fromPlayerName} użył: {powerUpHit.type === 'slime' ? 'Szlam' : powerUpHit.type === 'platypus' ? 'Dziobak' : powerUpHit.type === 'ice' ? 'Lód' : 'Bomba'}!
        </div>
      )}

      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">{me?.score || 0}</span>
            <span className="text-sm text-purple-300">{me?.name}</span>
          </div>
          <div className="text-purple-300 text-sm font-medium">{question.questionNumber}/{question.totalQuestions}</div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-purple-300">{opponent?.name}</span>
            <span className="text-white font-semibold">{opponent?.score || 0}</span>
          </div>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div className={`h-full ${timerColor} rounded-full transition-all duration-1000 ease-linear`} style={{ width: `${timerPercent}%` }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className={`text-sm font-mono font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-white'}`}>{timeLeft}s</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${difficulty.color}`}>{difficulty.text}</span>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center px-4 pb-4">
        <div className="mb-2 text-center">
          <span className="text-purple-300 text-xs font-medium">{question.category}</span>
        </div>

        {/* Image */}
        {question.imageUrl && (
          <div className="flex justify-center mb-4">
            <img src={question.imageUrl} alt="Pytanie" className="max-h-40 rounded-xl border-2 border-white/20 object-contain" />
          </div>
        )}

        <div className="bg-white/10 rounded-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-xl md:text-2xl font-bold text-white text-center leading-relaxed">{question.question}</h2>
        </div>

        {/* Answers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {displayOrder.map((origIndex) => {
            const answer = question.answers[origIndex];
            const displayText = hasPlatypus ? applyPlatypus(answer) : answer;
            return (
              <button key={origIndex} onClick={() => handleAnswer(origIndex)} disabled={selectedAnswer !== null || frozen}
                className={`relative p-4 rounded-xl font-semibold text-white text-left transition-all ${
                  selectedAnswer === origIndex ? 'ring-4 ring-white scale-95 bg-gradient-to-r ' + answerColors[origIndex] :
                  selectedAnswer !== null ? 'opacity-50 bg-gradient-to-r ' + answerColors[origIndex] :
                  'bg-gradient-to-r ' + answerColors[origIndex] + ' hover:scale-[1.02] active:scale-95 shadow-lg'
                }`}>
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/20 text-sm font-bold mr-3">
                  {answerLabels[origIndex]}
                </span>
                {displayText}
              </button>
            );
          })}
        </div>

        {selectedAnswer !== null && (
          <p className="text-center text-purple-300 mt-4 animate-slide-up">Odpowiedź zapisana! Czekam na przeciwnika...</p>
        )}
      </div>
    </div>
  );
}
