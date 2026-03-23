import { useEffect } from 'react';
import type { GameResult } from '../types';
import { AVATARS } from '../types';
import { SFX } from '../sounds';

interface Props {
  result: GameResult;
  playerId: string;
  onPlayAgain: () => void;
  onLeave: () => void;
}

const placeEmojis = ['🥇', '🥈', '🥉'];

export default function FinishedScreen({ result, playerId, onPlayAgain, onLeave }: Props) {
  const isWinner = result.winner?.id === playerId;
  const isTie = result.winner === null;

  useEffect(() => {
    if (isWinner) SFX.victory();
    else if (isTie) SFX.correct();
    else SFX.defeat();
  }, [isWinner, isTie]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-[0.04] z-10" />
      {/* Ambient glow matching outcome */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div
          className="w-[600px] h-[400px] rounded-full blur-3xl opacity-[0.06]"
          style={{ backgroundColor: isWinner ? '#FFE033' : isTie ? '#00F5FF' : '#FF2D78' }}
        />
      </div>

      <div className="w-full max-w-md text-center animate-slide-up relative z-20">
        <div className="text-8xl mb-4 animate-bounce-in">
          {isTie ? '🤝' : isWinner ? '🏆' : '😔'}
        </div>

        <h1
          className={`font-orbitron text-4xl font-black mb-2 uppercase tracking-widest ${
            isWinner ? 'text-[#FFE033] glow-text' : isTie ? 'text-[#00F5FF] glow-text-cyan' : 'text-[#FF2D78]'
          }`}
        >
          {isTie ? 'Remis!' : isWinner ? 'Zwycięstwo!' : 'Przegrana'}
        </h1>
        <p className="text-white/30 text-sm mb-6 uppercase tracking-widest">
          {isTie ? 'Równy pojedynek!' : isWinner ? 'Wiedza to potęga!' : 'Następnym razem będzie lepiej!'}
        </p>

        {/* Ranking */}
        <div className="bg-[#12121a] border border-[#FFE033]/15 p-5 mb-5">
          <h3 className="font-orbitron text-[#FFE033]/50 font-bold mb-4 text-xs uppercase tracking-widest">
            Ranking końcowy
          </h3>
          <div className="space-y-3 stagger-children">
            {result.players.map((p, index) => {
              const avatar = AVATARS.find(a => a.id === p.avatarId) || AVATARS[0];
              const isMe = p.id === playerId;
              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-3 p-3 border transition-all ${
                    index === 0
                      ? 'bg-[#FFE033]/5 border-[#FFE033]/30'
                      : isMe
                      ? 'bg-[#00F5FF]/5 border-[#00F5FF]/20'
                      : 'bg-white/5 border-white/5'
                  }`}
                >
                  <span className="text-2xl w-8 text-center">{placeEmojis[index] || `${index + 1}.`}</span>
                  <div
                    className="w-10 h-10 flex items-center justify-center text-xl shrink-0"
                    style={{
                      backgroundColor: avatar.color + '22',
                      border: `2px solid ${avatar.color}`,
                      boxShadow: `0 0 8px ${avatar.color}44`,
                    }}
                  >
                    {avatar.emoji}
                  </div>
                  <div className="flex-1 text-left">
                    <span className={`font-semibold ${isMe ? 'text-white' : 'text-white/70'}`}>
                      {p.name}{' '}
                      {isMe && <span className="text-[#00F5FF]/50 text-xs uppercase tracking-wide">(Ty)</span>}
                    </span>
                  </div>
                  <span className="font-orbitron text-2xl font-black text-white">{p.score}</span>
                  <span className="text-white/30 text-xs font-mono">pkt</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fun fact */}
        <div className="bg-[#12121a] border border-[#FFE033]/20 p-4 mb-6 animate-scale-in">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">📜</span>
            <span className="font-orbitron text-[#FFE033]/70 font-bold text-xs uppercase tracking-widest">
              Legendarny Zwój Wiedzy
            </span>
          </div>
          <p className="text-white/50 text-sm leading-relaxed">{result.funFact}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onPlayAgain}
            className="w-full py-4 border-2 border-[#39FF14] text-[#39FF14] font-orbitron font-bold text-lg uppercase tracking-widest hover:bg-[#39FF14] hover:text-[#0a0a0f] hover:shadow-[0_0_24px_rgba(57,255,20,0.5)] transition-all duration-200"
          >
            Zagraj ponownie
          </button>
          <button
            onClick={onLeave}
            className="w-full py-3 text-white/25 hover:text-[#FF2D78] uppercase tracking-widest text-sm transition-colors duration-200"
          >
            Wróć do menu
          </button>
        </div>
      </div>
    </div>
  );
}
