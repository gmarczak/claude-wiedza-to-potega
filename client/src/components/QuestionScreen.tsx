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
  'border-[#FF2D78] text-[#FF2D78] hover:bg-[#FF2D78] hover:text-[#0a0a0f]',
  'border-[#00F5FF] text-[#00F5FF] hover:bg-[#00F5FF] hover:text-[#0a0a0f]',
  'border-[#FFE033] text-[#FFE033] hover:bg-[#FFE033] hover:text-[#0a0a0f]',
  'border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14] hover:text-[#0a0a0f]',
];
const answerSelectedColors = [
  'bg-[#FF2D78] text-[#0a0a0f] border-[#FF2D78]',
  'bg-[#00F5FF] text-[#0a0a0f] border-[#00F5FF]',
  'bg-[#FFE033] text-[#0a0a0f] border-[#FFE033]',
  'bg-[#39FF14] text-[#0a0a0f] border-[#39FF14]',
];
const answerGlows = [
  '0 0 16px rgba(255,45,120,0.5)',
  '0 0 16px rgba(0,245,255,0.5)',
  '0 0 16px rgba(255,224,51,0.5)',
  '0 0 16px rgba(57,255,20,0.5)',
];
const answerLabels = ['A', 'B', 'C', 'D'];
const difficultyLabels: Record<string, { text: string; color: string }> = {
  easy: { text: 'Łatwe', color: 'border border-[#39FF14]/40 text-[#39FF14]/70' },
  medium: { text: 'Średnie', color: 'border border-[#FFE033]/40 text-[#FFE033]/70' },
  hard: { text: 'Trudne', color: 'border border-[#FF2D78]/40 text-[#FF2D78]/70' },
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
  const timerColor = timeLeft <= 5 ? 'bg-[#FF2D78]' : timeLeft <= 10 ? 'bg-[#FFE033]' : 'bg-[#39FF14]';
  const difficulty = difficultyLabels[question.difficulty] || difficultyLabels.easy;

  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);

  const hasSlime = powerUpHit?.type === 'slime' && !slimeCleared;
  const hasDouble = powerUpSelf?.type === 'double';
  const displayOrder = bombTriggered ? shuffledOrder : [0, 1, 2, 3];

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col relative overflow-hidden">
      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-[0.04] z-10" />

      {/* Freeze overlay */}
      {frozen && (
        <div className="absolute inset-0 z-50 bg-[#00F5FF]/20 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <div className="text-center animate-countdown border border-[#00F5FF]/40 bg-[#0a0a0f]/80 px-10 py-8">
            <span className="text-6xl">🧊</span>
            <p className="font-orbitron text-[#00F5FF] text-xl font-bold mt-3 uppercase tracking-widest glow-text-cyan">
              Zamrożony!
            </p>
            <p className="text-[#00F5FF]/50 text-xs mt-1 uppercase tracking-wide">
              {powerUpHit?.fromPlayerName} zamroził Twój ekran!
            </p>
          </div>
        </div>
      )}

      {/* Slime overlay */}
      {hasSlime && (
        <div
          className="absolute inset-x-0 bottom-0 z-40 pointer-events-auto"
          style={{ top: '40%' }}
          onClick={handleSlimeClick}
        >
          <div
            className="w-full h-full bg-[#39FF14]/60 backdrop-blur-md flex items-center justify-center cursor-pointer"
            style={{ opacity: 1 - slimeClicks / 8 }}
          >
            <div className="text-center">
              <span className="text-5xl">🟢</span>
              <p className="font-orbitron text-white font-bold mt-2 uppercase tracking-widest">
                Szlam! Klikaj aby wytrzeć! ({slimeClicks}/8)
              </p>
              <p className="text-[#39FF14]/70 text-xs mt-1 uppercase tracking-wide">
                {powerUpHit?.fromPlayerName} zamazał Twoje odpowiedzi
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Power-up notifications */}
      {powerUpHit && !frozen && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 border border-[#FF2D78]/50 bg-[#0a0a0f]/90 text-[#FF2D78] px-5 py-2 text-xs font-semibold uppercase tracking-widest animate-slide-down">
          {powerUpHit.fromPlayerName} użył:{' '}
          {powerUpHit.type === 'slime' ? 'Szlam' : powerUpHit.type === 'platypus' ? 'Dziobak' : powerUpHit.type === 'ice' ? 'Lód' : 'Bomba'}!
        </div>
      )}
      {hasDouble && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 border border-[#FFE033]/60 bg-[#0a0a0f]/90 text-[#FFE033] px-5 py-2 text-xs font-bold uppercase tracking-widest animate-slide-down animate-glow">
          ✦ Podwójne punkty aktywne! ✦
        </div>
      )}

      {/* Header — scoreboard */}
      <div className="p-3 relative z-20">
        <div className="flex items-center justify-between mb-2 gap-1 flex-wrap">
          {sortedPlayers.map((p) => {
            const avatar = AVATARS.find(a => a.id === p.avatarId) || AVATARS[0];
            const isMe = p.id === playerId;
            return (
              <div
                key={p.id}
                className={`flex items-center gap-1 px-2 py-1 ${
                  isMe
                    ? 'bg-[#FFE033]/10 border border-[#FFE033]/40'
                    : 'bg-white/5 border border-white/5'
                }`}
              >
                <span className="text-sm">{avatar.emoji}</span>
                <span className={`text-xs font-mono ${isMe ? 'text-[#FFE033] font-bold' : 'text-white/40'}`}>
                  {p.score}
                </span>
              </div>
            );
          })}
        </div>

        {/* Timer bar */}
        <div className="flex items-center gap-2 mb-1">
          <div className="flex-1 h-1.5 bg-white/10 overflow-hidden">
            <div
              className={`h-full ${timerColor} transition-all duration-1000 ease-linear`}
              style={{ width: `${timerPercent}%` }}
            />
          </div>
          <span className={`font-orbitron text-sm font-bold min-w-[2.5rem] text-right ${
            timeLeft <= 5 ? 'text-[#FF2D78] glow-text-danger animate-timer-urgent' : 'text-white/60'
          }`}>
            {timeLeft}s
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-white/30 text-xs font-mono">
            {question.questionNumber}/{question.totalQuestions}
          </span>
          <span className={`text-[10px] px-2 py-0.5 uppercase tracking-widest font-semibold ${difficulty.color}`}>
            {difficulty.text}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center px-4 pb-4 relative z-20">
        <div className="mb-2 text-center">
          <span className="text-[#FFE033]/40 text-xs uppercase tracking-widest">{question.category}</span>
        </div>

        {question.imageUrl && (
          <div className="flex justify-center mb-4">
            <img
              src={question.imageUrl}
              alt="Pytanie"
              className="max-h-40 border border-[#FFE033]/20 object-contain animate-scale-in"
            />
          </div>
        )}

        <div className="bg-[#12121a] border border-[#FFE033]/15 p-5 mb-5 animate-scale-in">
          <h2 className="text-lg md:text-xl font-bold text-white text-center leading-relaxed">
            {question.question}
          </h2>
        </div>

        {/* Answers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 stagger-children">
          {displayOrder.map((origIndex) => {
            const answer = question.answers[origIndex];
            const displayText = platypusTexts ? platypusTexts[origIndex] : answer;
            const isHidden = hiddenAnswers.includes(origIndex);
            const isSelected = selectedAnswer === origIndex;
            const isDisabled = selectedAnswer !== null && !isSelected;

            return (
              <button
                key={origIndex}
                onClick={() => handleAnswer(origIndex)}
                disabled={selectedAnswer !== null || frozen || isHidden}
                style={isSelected ? { boxShadow: answerGlows[origIndex] } : undefined}
                className={`relative p-4 border-2 font-semibold text-left transition-all duration-200 ${
                  isHidden
                    ? 'opacity-20 border-white/10 text-white/30 cursor-not-allowed'
                    : isSelected
                    ? answerSelectedColors[origIndex] + ' scale-95'
                    : isDisabled
                    ? 'opacity-30 border-white/10 text-white/30 cursor-not-allowed'
                    : answerColors[origIndex] + ' bg-[#12121a] hover:scale-[1.02] active:scale-95'
                }`}
              >
                <span className="inline-flex items-center justify-center w-7 h-7 border border-current/50 bg-current/10 text-sm font-bold mr-3 font-orbitron">
                  {answerLabels[origIndex]}
                </span>
                {isHidden ? '—' : displayText}
              </button>
            );
          })}
        </div>

        {selectedAnswer !== null && (
          <p className="text-center text-[#00F5FF]/40 text-xs mt-4 uppercase tracking-widest animate-slide-up">
            Odpowiedź zapisana! Czekam na pozostałych...
          </p>
        )}
      </div>
    </div>
  );
}
