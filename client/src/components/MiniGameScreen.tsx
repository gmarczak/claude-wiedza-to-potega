import { useState, useEffect, useCallback } from 'react';
import type { MiniGameData, MiniGameResultsData } from '../types';
import { AVATARS } from '../types';
import { SFX } from '../sounds';

interface Props {
  data: MiniGameData;
  resultsData: MiniGameResultsData | null;
  timeLeft: number;
  playerId: string;
  onResult: (score: number) => void;
}

export default function MiniGameScreen({ data, resultsData, timeLeft, playerId, onResult }: Props) {
  if (resultsData) {
    const sorted = [...resultsData.players].sort((a, b) => b.miniGameScore - a.miniGameScore);
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-[0.04] z-10" />
        <div className="w-full max-w-md text-center animate-slide-up relative z-20">
          <h2 className="font-orbitron text-2xl font-black uppercase tracking-widest text-[#00F5FF] glow-text-cyan mb-6">
            Wyniki Mini Gry
          </h2>
          <div className="space-y-3 stagger-children">
            {sorted.map((p, i) => {
              const avatar = AVATARS.find((a) => a.id === p.avatarId) || AVATARS[0];
              const isMe = p.id === playerId;
              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-3 p-4 bg-[#12121a] border ${
                    isMe ? 'border-[#FFE033]/50' : 'border-white/10'
                  }`}
                >
                  <span className="font-orbitron text-sm font-bold text-white/30 w-6">{i + 1}.</span>
                  <span className="text-2xl">{avatar.emoji}</span>
                  <div className="flex-1 text-left">
                    <div className="text-white font-semibold">{p.name}</div>
                    <div className="text-[#00F5FF]/50 text-xs font-mono">{p.miniGameScore} trafień</div>
                  </div>
                  <div
                    className="font-orbitron text-xl font-bold text-[#39FF14]"
                    style={{ textShadow: '0 0 10px rgba(57,255,20,0.6)' }}
                  >
                    +{p.miniGameScore * 5}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (data.game.type === 'connect') {
    return <ConnectGame data={data} timeLeft={timeLeft} onResult={onResult} />;
  }
  return <SortGame data={data} timeLeft={timeLeft} onResult={onResult} />;
}

// ===== CONNECT GAME =====
function ConnectGame({ data, timeLeft, onResult }: { data: MiniGameData; timeLeft: number; onResult: (s: number) => void }) {
  const game = data.game as MiniGameData['game'] & { type: 'connect' };
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [shuffledRight, setShuffledRight] = useState<string[]>([]);

  useEffect(() => {
    const rights = game.pairs.map((p) => p.right);
    for (let i = rights.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rights[i], rights[j]] = [rights[j], rights[i]];
    }
    setShuffledRight(rights);
  }, []);

  const handleRightClick = useCallback((right: string) => {
    if (!selectedLeft || matched.has(selectedLeft) || submitted) return;
    const pair = game.pairs.find((p) => p.left === selectedLeft && p.right === right);
    if (pair) {
      SFX.miniGameCorrect();
      setMatched((prev) => new Set([...prev, selectedLeft!]));
      setScore((prev) => {
        const newScore = prev + 1;
        if (newScore === game.pairs.length) {
          setSubmitted(true);
          onResult(newScore);
        }
        return newScore;
      });
    }
    setSelectedLeft(null);
  }, [selectedLeft, matched, submitted, game.pairs, onResult]);

  useEffect(() => {
    if (timeLeft <= 0 && !submitted) {
      setSubmitted(true);
      onResult(score);
    }
  }, [timeLeft, submitted, score, onResult]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-[0.04] z-10" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-64 bg-[#00F5FF] opacity-[0.03] blur-3xl" />

      <div className="w-full max-w-lg relative z-20">
        <div className="text-center mb-4">
          <h2 className="font-orbitron text-xl font-black uppercase tracking-widest text-[#00F5FF] glow-text-cyan mb-1">
            {game.title}
          </h2>
          <p className="text-white/30 text-xs uppercase tracking-widest">
            Kliknij lewą, potem prawą stronę aby połączyć
          </p>
          <div className="flex items-center justify-center gap-5 mt-3">
            <span className={`font-orbitron font-bold ${timeLeft <= 5 ? 'text-[#FF2D78] animate-timer-urgent' : 'text-[#00F5FF]'}`}>
              {timeLeft}s
            </span>
            <span className="font-orbitron text-[#39FF14] font-semibold" style={{ textShadow: '0 0 8px rgba(57,255,20,0.5)' }}>
              {score}/{game.pairs.length}
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            {game.pairs.map((pair) => (
              <button
                key={pair.left}
                onClick={() => !matched.has(pair.left) && setSelectedLeft(pair.left)}
                disabled={matched.has(pair.left) || submitted}
                className={`w-full p-3 text-sm font-semibold transition-all duration-200 border ${
                  matched.has(pair.left)
                    ? 'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/50'
                    : selectedLeft === pair.left
                    ? 'bg-[#00F5FF]/10 text-[#00F5FF] border-[#00F5FF] shadow-[0_0_10px_rgba(0,245,255,0.3)]'
                    : 'bg-[#12121a] text-white border-white/10 hover:border-[#FFE033]/40 hover:text-[#FFE033]'
                }`}
              >
                {pair.left}
              </button>
            ))}
          </div>
          <div className="flex-1 space-y-2">
            {shuffledRight.map((right) => {
              const isMatched = game.pairs.some((p) => p.right === right && matched.has(p.left));
              return (
                <button
                  key={right}
                  onClick={() => handleRightClick(right)}
                  disabled={isMatched || !selectedLeft || submitted}
                  className={`w-full p-3 text-sm font-semibold transition-all duration-200 border ${
                    isMatched
                      ? 'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/50'
                      : 'bg-[#12121a] text-white border-white/10 hover:border-[#FF2D78]/40 hover:text-[#FF2D78]'
                  }`}
                >
                  {right}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== SORT GAME =====
function SortGame({ data, timeLeft, onResult }: { data: MiniGameData; timeLeft: number; onResult: (s: number) => void }) {
  const game = data.game as MiniGameData['game'] & { type: 'sort' };
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [shuffledItems, setShuffledItems] = useState(game.items);
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    const items = [...game.items];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    setShuffledItems(items);
  }, []);

  const handleSort = useCallback((category: string) => {
    if (submitted || currentIndex >= shuffledItems.length) return;
    const item = shuffledItems[currentIndex];
    const correct = item.category === category;
    if (correct) {
      SFX.miniGameCorrect();
      setScore((prev) => prev + 1);
      setLastResult('correct');
    } else {
      SFX.miniGameWrong();
      setLastResult('wrong');
    }

    setTimeout(() => setLastResult(null), 300);

    const next = currentIndex + 1;
    setCurrentIndex(next);

    if (next >= shuffledItems.length) {
      setSubmitted(true);
      onResult(correct ? score + 1 : score);
    }
  }, [currentIndex, shuffledItems, submitted, score, onResult]);

  useEffect(() => {
    if (timeLeft <= 0 && !submitted) {
      setSubmitted(true);
      onResult(score);
    }
  }, [timeLeft, submitted, score, onResult]);

  const currentItem = currentIndex < shuffledItems.length ? shuffledItems[currentIndex] : null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-[0.04] z-10" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-64 bg-[#FFE033] opacity-[0.03] blur-3xl" />

      <div className="w-full max-w-md relative z-20">
        <div className="text-center mb-6">
          <h2 className="font-orbitron text-xl font-black uppercase tracking-widest text-[#FFE033] glow-text mb-1">
            {game.title}
          </h2>
          <p className="text-white/30 text-xs uppercase tracking-widest">Przypisz każdy element do kategorii</p>
          <div className="flex items-center justify-center gap-5 mt-3">
            <span className={`font-orbitron font-bold ${timeLeft <= 5 ? 'text-[#FF2D78] animate-timer-urgent' : 'text-[#00F5FF]'}`}>
              {timeLeft}s
            </span>
            <span className="font-orbitron text-[#39FF14] font-semibold" style={{ textShadow: '0 0 8px rgba(57,255,20,0.5)' }}>
              {score}/{shuffledItems.length}
            </span>
            <span className="text-white/30 text-xs font-mono">{currentIndex + 1}/{shuffledItems.length}</span>
          </div>
        </div>

        {currentItem && !submitted ? (
          <>
            <div
              className={`bg-[#12121a] p-6 mb-6 border-2 text-center transition-all duration-200 ${
                lastResult === 'correct'
                  ? 'border-[#39FF14] bg-[#39FF14]/10'
                  : lastResult === 'wrong'
                  ? 'border-[#FF2D78] bg-[#FF2D78]/10'
                  : 'border-[#FFE033]/20'
              }`}
            >
              <span className="font-orbitron text-3xl font-bold text-white">{currentItem.item}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {game.categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleSort(cat)}
                  className="p-6 border-2 border-[#00F5FF]/30 bg-[#12121a] text-[#00F5FF] font-bold text-lg uppercase tracking-wide transition-all hover:border-[#00F5FF] hover:bg-[#00F5FF]/10 hover:shadow-[0_0_16px_rgba(0,245,255,0.3)] hover:scale-105 active:scale-95"
                >
                  {cat}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="font-orbitron text-xl font-black text-[#FFE033] glow-text uppercase tracking-widest">Gotowe!</p>
            <p className="text-[#39FF14] text-lg mt-2 font-mono">{score} poprawnych odpowiedzi</p>
          </div>
        )}
      </div>
    </div>
  );
}
