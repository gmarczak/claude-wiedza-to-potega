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
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-[0.04] z-10" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[500px] h-[500px] rounded-full bg-[#FFE033] opacity-[0.04] blur-3xl" />
        </div>
        <div className="text-center animate-slide-up relative z-20">
          <p className="text-[#FFE033]/50 text-xs uppercase tracking-widest mb-3 font-orbitron">
            Wybrana kategoria
          </p>
          <div className="font-orbitron text-5xl font-black text-[#FFE033] glow-text animate-countdown mb-4 uppercase tracking-widest">
            {resultData.selectedCategory}
          </div>
          {resultData.overrideUsed && (
            <p className="text-[#FF2D78] font-semibold text-sm uppercase tracking-widest glow-text-danger">
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
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-[0.04] z-10" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-64 bg-[#00F5FF] opacity-[0.03] blur-3xl" />

      <div className="w-full max-w-md animate-slide-up relative z-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-orbitron text-2xl font-black uppercase tracking-widest text-[#FFE033] glow-text mb-2">
            Wybierz kategorię
          </h2>
          <p className="text-white/30 text-xs uppercase tracking-widest">
            Zagłosuj na kategorię następnego pytania
          </p>
          <div className={`font-orbitron text-2xl font-bold mt-3 tracking-widest transition-colors duration-300 ${
            timeLeft <= 3 ? 'text-[#FF2D78] glow-text-danger animate-timer-urgent' : 'text-[#00F5FF] glow-text-cyan'
          }`}>
            {timeLeft}s
          </div>
        </div>

        {/* Category buttons */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {voteData.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => showOverride ? handleOverride(cat) : handleVote(cat)}
              disabled={voted}
              className={`p-4 font-semibold uppercase tracking-wide transition-all duration-200 ${
                voted
                  ? 'opacity-30 border border-white/10 text-white/30 cursor-not-allowed'
                  : showOverride
                  ? 'border-2 border-[#FF2D78] text-[#FF2D78] hover:bg-[#FF2D78] hover:text-[#0a0a0f] hover:shadow-[0_0_16px_rgba(255,45,120,0.5)]'
                  : 'border border-[#FFE033]/30 text-[#FFE033]/80 bg-[#12121a] hover:border-[#FFE033] hover:text-[#FFE033] hover:bg-[#FFE033]/5 hover:shadow-[0_0_12px_rgba(255,224,51,0.3)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Override button */}
        {hasOverride && !voted && !showOverride && (
          <button
            onClick={() => setShowOverride(true)}
            className="w-full py-3 border border-[#FF2D78]/40 bg-[#FF2D78]/5 text-[#FF2D78]/80 font-semibold uppercase tracking-widest text-sm hover:border-[#FF2D78] hover:text-[#FF2D78] hover:bg-[#FF2D78]/10 hover:shadow-[0_0_12px_rgba(255,45,120,0.3)] transition-all duration-200"
          >
            Użyj Przełamania (1× na grę)
          </button>
        )}

        {showOverride && !voted && (
          <p className="text-center text-[#FF2D78] text-sm mt-3 animate-slide-up uppercase tracking-widest glow-text-danger">
            Wybierz kategorię do wymuszenia!
          </p>
        )}

        {voted && (
          <p className="text-center text-[#00F5FF]/50 text-sm mt-4 uppercase tracking-widest">
            Zagłosowano! Czekam na przeciwnika...
          </p>
        )}
      </div>
    </div>
  );
}
