import { useState, useEffect } from 'react';
import type { CategoryVoteData, CategoryResultData } from '../types';

interface Props {
  voteData: CategoryVoteData | null;
  resultData: CategoryResultData | null;
  hasOverride: boolean;
  timeLeft: number;
  onVote: (category: string) => void;
  onOverride: (category: string) => void;
}

export default function CategoryVoteScreen({ voteData, resultData, hasOverride, timeLeft, onVote, onOverride }: Props) {
  const [voted, setVoted] = useState(false);
  const [showOverride, setShowOverride] = useState(false);

  // Reset state when new vote data arrives
  useEffect(() => {
    setVoted(false);
    setShowOverride(false);
  }, [voteData]);

  if (resultData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="text-center animate-slide-up">
          <h2 className="text-2xl font-bold text-white mb-4">Wybrana kategoria</h2>
          <div className="text-5xl font-black text-yellow-400 mb-4 animate-countdown">
            {resultData.selectedCategory}
          </div>
          {resultData.overrideUsed && (
            <p className="text-orange-400 font-semibold">
              {resultData.overrideBy} użył przełamania!
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!voteData) return null;

  const handleVote = (cat: string) => {
    if (voted) return;
    setVoted(true);
    onVote(cat);
  };

  const handleOverride = (cat: string) => {
    if (voted) return;
    setVoted(true);
    onOverride(cat);
    setShowOverride(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Wybierz kategorię</h2>
          <p className="text-purple-300 text-sm">Zagłosuj na kategorię następnego pytania</p>
          <div className={`text-lg font-mono font-bold mt-2 ${timeLeft <= 3 ? 'text-red-400' : 'text-white'}`}>
            {timeLeft}s
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {voteData.categories.map((cat) => (
            <button key={cat} onClick={() => showOverride ? handleOverride(cat) : handleVote(cat)}
              disabled={voted}
              className={`p-4 rounded-xl font-semibold text-white transition-all ${
                voted ? 'opacity-50 bg-white/10' :
                showOverride ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg' :
                'bg-white/10 hover:bg-white/20 border border-white/20 hover:border-purple-400'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {hasOverride && !voted && !showOverride && (
          <button onClick={() => setShowOverride(true)}
            className="w-full py-3 bg-orange-500/20 border border-orange-500/50 rounded-xl text-orange-300 font-semibold hover:bg-orange-500/30 transition-all">
            Użyj Przełamania (1x na grę)
          </button>
        )}

        {showOverride && !voted && (
          <p className="text-center text-orange-300 text-sm mt-2 animate-slide-up">
            Wybierz kategorię do wymuszenia!
          </p>
        )}

        {voted && <p className="text-center text-purple-300 mt-4">Zagłosowano! Czekam na przeciwnika...</p>}
      </div>
    </div>
  );
}
