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
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center animate-slide-up">
          <h2 className="text-2xl font-bold text-white mb-6">Wyniki Mini Gry</h2>
          <div className="space-y-3 stagger-children">
            {sorted.map((p, i) => {
              const avatar = AVATARS.find((a) => a.id === p.avatarId) || AVATARS[0];
              const isMe = p.id === playerId;
              return (
                <div key={p.id} className={`flex items-center gap-3 p-4 bg-white/10 rounded-xl border ${isMe ? 'border-purple-400' : 'border-white/20'}`}>
                  <span className="text-lg font-bold text-white/60 w-6">{i + 1}.</span>
                  <span className="text-2xl">{avatar.emoji}</span>
                  <div className="flex-1 text-left">
                    <div className="text-white font-semibold">{p.name}</div>
                    <div className="text-purple-300 text-xs">{p.miniGameScore} trafień</div>
                  </div>
                  <div className="text-xl font-bold text-green-400">+{p.miniGameScore * 5}</div>
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-white mb-1">{game.title}</h2>
          <p className="text-purple-300 text-sm">Kliknij lewą, potem prawą stronę aby połączyć</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <span className={`font-mono font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-white'}`}>{timeLeft}s</span>
            <span className="text-green-400 font-semibold">{score}/{game.pairs.length}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            {game.pairs.map((pair) => (
              <button key={pair.left} onClick={() => !matched.has(pair.left) && setSelectedLeft(pair.left)}
                disabled={matched.has(pair.left) || submitted}
                className={`w-full p-3 rounded-lg text-sm font-semibold transition-all ${
                  matched.has(pair.left) ? 'bg-green-500/30 text-green-300 border border-green-400' :
                  selectedLeft === pair.left ? 'bg-purple-500/40 text-white border-2 border-purple-400' :
                  'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                }`}>
                {pair.left}
              </button>
            ))}
          </div>
          <div className="flex-1 space-y-2">
            {shuffledRight.map((right) => {
              const isMatched = game.pairs.some((p) => p.right === right && matched.has(p.left));
              return (
                <button key={right} onClick={() => handleRightClick(right)}
                  disabled={isMatched || !selectedLeft || submitted}
                  className={`w-full p-3 rounded-lg text-sm font-semibold transition-all ${
                    isMatched ? 'bg-green-500/30 text-green-300 border border-green-400' :
                    'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                  }`}>
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white mb-1">{game.title}</h2>
          <p className="text-purple-300 text-sm">Przypisz każdy element do kategorii</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <span className={`font-mono font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-white'}`}>{timeLeft}s</span>
            <span className="text-green-400 font-semibold">{score}/{shuffledItems.length}</span>
            <span className="text-purple-300 text-xs">{currentIndex + 1}/{shuffledItems.length}</span>
          </div>
        </div>

        {currentItem && !submitted ? (
          <>
            <div className={`bg-white/10 rounded-2xl p-6 mb-6 border-2 text-center transition-all ${
              lastResult === 'correct' ? 'border-green-400 bg-green-500/20' :
              lastResult === 'wrong' ? 'border-red-400 bg-red-500/20' : 'border-white/20'
            }`}>
              <span className="text-3xl font-bold text-white">{currentItem.item}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {game.categories.map((cat) => (
                <button key={cat} onClick={() => handleSort(cat)}
                  className="p-6 rounded-xl bg-gradient-to-br from-purple-500/30 to-indigo-500/30 border-2 border-white/20 hover:border-purple-400 text-white font-bold text-lg transition-all hover:scale-105 active:scale-95">
                  {cat}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-white text-xl font-bold">Gotowe!</p>
            <p className="text-green-400 text-lg">{score} poprawnych odpowiedzi</p>
          </div>
        )}
      </div>
    </div>
  );
}
