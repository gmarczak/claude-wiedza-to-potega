import { useState, useEffect, useCallback, useMemo } from 'react';
import type { QuestionData, RoomState, PowerUpHitData, PowerUpSelfData } from '../types';
import { AVATARS } from '../types';
import { SFX } from '../sounds';

interface Props {
  question: QuestionData;
  timeLeft: number;
  room: RoomState;
  playerId: string;
  powerUpHit: PowerUpHitData | null;
  powerUpSelf: PowerUpSelfData | null;
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

function applyPlatypus(text: string, seed: number): string {
  const chars = text.split('');
  const removeCount = Math.floor(chars.length * 0.4);
  const indices = chars.map((_, i) => i).filter((i) => chars[i] !== ' ');
  let s = seed;
  const seededRandom = () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < removeCount && indices.length > 0; i++) {
    const idx = Math.floor(seededRandom() * indices.length);
    chars[indices[idx]] = '_';
    indices.splice(idx, 1);
  }
  return chars.join('');
}

export default function QuestionScreen({ question, timeLeft, room, playerId, powerUpHit, powerUpSelf, onAnswer }: Props) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [slimeCleared, setSlimeCleared] = useState(false);
  const [slimeClicks, setSlimeClicks] = useState(0);
  const [frozen, setFrozen] = useState(false);
  const [shuffledOrder, setShuffledOrder] = useState<number[]>([0, 1, 2, 3]);
  const [bombTriggered, setBombTriggered] = useState(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setSlimeCleared(false);
    setSlimeClicks(0);
    setFrozen(false);
    setShuffledOrder([0, 1, 2, 3]);
    setBombTriggered(false);
  }, [question.questionNumber]);

  useEffect(() => {
    if (!powerUpHit) return;
    if (powerUpHit.type === 'ice') {
      setFrozen(true);
      SFX.freeze();
      const timer = setTimeout(() => setFrozen(false), 3000);
      return () => clearTimeout(timer);
    }
    if (powerUpHit.type === 'bomb') {
      const bombTimer = setTimeout(() => {
        SFX.bomb();
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

  const platypusTexts = useMemo(() => {
    if (powerUpHit?.type !== 'platypus') return null;
    const seed = question.questionNumber * 1000;
    return question.answers.map((a, i) => applyPlatypus(a, seed + i));
  }, [question.questionNumber, question.answers, powerUpHit]);

  // 50/50: which answers to hide
  const hiddenAnswers = powerUpSelf?.type === 'fifty' ? (powerUpSelf.hiddenAnswers || []) : [];

  const handleAnswer = useCallback((index: number) => {
    if (selectedAnswer !== null || frozen) return;
    setSelectedAnswer(index);
    onAnswer(index);
  }, [selectedAnswer, frozen, onAnswer]);

  const handleSlimeClick = useCallback(() => {
    if (slimeCleared) return;
    SFX.slimeWipe();
    setSlimeClicks((prev) => {
      const next = prev + 1;
      if (next >= 8) setSlimeCleared(true);
      return next;
    });
  }, [slimeCleared]);

  const timerPercent = (timeLeft / question.timeLimit) * 100;
  const timerColor = timeLeft <= 5 ? 'bg-red-500' : timeLeft <= 10 ? 'bg-yellow-500' : 'bg-green-500';
  const difficulty = difficultyLabels[question.difficulty] || difficultyLabels.easy;

  // Show all players' scores in header for multiplayer
  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);

  const hasSlime = powerUpHit?.type === 'slime' && !slimeCleared;
  const hasDouble = powerUpSelf?.type === 'double';
  const displayOrder = bombTriggered ? shuffledOrder : [0, 1, 2, 3];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col relative">
      {/* Freeze overlay */}
      {frozen && (
        <div className="absolute inset-0 z-50 bg-cyan-400/30 backdrop-blur-sm flex items-center justify-center animate-fade-in">
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

      {/* Power-up notifications */}
      {powerUpHit && !frozen && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-orange-500/90 text-white px-4 py-2 rounded-full text-sm font-semibold animate-slide-down">
          {powerUpHit.fromPlayerName} użył: {powerUpHit.type === 'slime' ? 'Szlam' : powerUpHit.type === 'platypus' ? 'Dziobak' : powerUpHit.type === 'ice' ? 'Lód' : 'Bomba'}!
        </div>
      )}
      {hasDouble && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-yellow-500/90 text-white px-4 py-2 rounded-full text-sm font-semibold animate-slide-down animate-glow">
          ✨ Podwójne punkty aktywne! ✨
        </div>
      )}

      {/* Header - scoreboard */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2 gap-1 flex-wrap">
          {sortedPlayers.map((p) => {
            const avatar = AVATARS.find(a => a.id === p.avatarId) || AVATARS[0];
            const isMe = p.id === playerId;
            return (
              <div key={p.id} className={`flex items-center gap-1 px-2 py-1 rounded-lg ${isMe ? 'bg-white/15 ring-1 ring-purple-400' : 'bg-white/5'}`}>
                <span className="text-sm">{avatar.emoji}</span>
                <span className={`text-xs ${isMe ? 'text-white font-semibold' : 'text-purple-300'}`}>{p.score}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className={`h-full ${timerColor} rounded-full transition-all duration-1000 ease-linear`} style={{ width: `${timerPercent}%` }} />
          </div>
          <span className={`text-sm font-mono font-bold min-w-[2rem] text-right ${timeLeft <= 5 ? 'text-red-400 animate-timer-urgent' : 'text-white'}`}>{timeLeft}s</span>
        </div>
        <div className="flex justify-between">
          <span className="text-purple-300 text-xs font-medium">{question.questionNumber}/{question.totalQuestions}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${difficulty.color}`}>{difficulty.text}</span>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center px-4 pb-4">
        <div className="mb-2 text-center">
          <span className="text-purple-300 text-xs font-medium">{question.category}</span>
        </div>

        {question.imageUrl && (
          <div className="flex justify-center mb-4">
            <img src={question.imageUrl} alt="Pytanie" className="max-h-40 rounded-xl border-2 border-white/20 object-contain animate-scale-in" />
          </div>
        )}

        <div className="bg-white/10 rounded-2xl p-5 mb-5 border border-white/20 animate-scale-in">
          <h2 className="text-lg md:text-xl font-bold text-white text-center leading-relaxed">{question.question}</h2>
        </div>

        {/* Answers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 stagger-children">
          {displayOrder.map((origIndex) => {
            const answer = question.answers[origIndex];
            const displayText = platypusTexts ? platypusTexts[origIndex] : answer;
            const isHidden = hiddenAnswers.includes(origIndex);
            return (
              <button key={origIndex} onClick={() => handleAnswer(origIndex)}
                disabled={selectedAnswer !== null || frozen || isHidden}
                className={`relative p-4 rounded-xl font-semibold text-white text-left transition-all ${
                  isHidden ? 'opacity-20 bg-gray-700 cursor-not-allowed' :
                  selectedAnswer === origIndex ? 'ring-4 ring-white scale-95 bg-gradient-to-r ' + answerColors[origIndex] :
                  selectedAnswer !== null ? 'opacity-50 bg-gradient-to-r ' + answerColors[origIndex] :
                  'bg-gradient-to-r ' + answerColors[origIndex] + ' hover:scale-[1.02] active:scale-95 shadow-lg'
                }`}>
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/20 text-sm font-bold mr-3">
                  {answerLabels[origIndex]}
                </span>
                {isHidden ? '—' : displayText}
              </button>
            );
          })}
        </div>

        {selectedAnswer !== null && (
          <p className="text-center text-purple-300 mt-4 animate-slide-up">Odpowiedź zapisana! Czekam na pozostałych...</p>
        )}
      </div>
    </div>
  );
}
