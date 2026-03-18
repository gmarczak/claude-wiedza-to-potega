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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center animate-slide-up">
        <div className="text-8xl mb-4 animate-bounce-in">
          {isTie ? '🤝' : isWinner ? '🏆' : '😔'}
        </div>

        <h1 className="text-4xl font-black text-white mb-2 text-shadow-lg">
          {isTie ? 'Remis!' : isWinner ? 'Zwycięstwo!' : 'Przegrana'}
        </h1>
        <p className="text-purple-300 text-lg mb-6">
          {isTie ? 'Równy pojedynek!' : isWinner ? 'Gratulacje, wiedza to potęga!' : 'Następnym razem będzie lepiej!'}
        </p>

        {/* Ranking */}
        <div className="bg-white/10 rounded-2xl p-5 mb-6 border border-white/20">
          <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Ranking końcowy</h3>
          <div className="space-y-3 stagger-children">
            {result.players.map((p, index) => {
              const avatar = AVATARS.find(a => a.id === p.avatarId) || AVATARS[0];
              const isMe = p.id === playerId;
              return (
                <div key={p.id} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  index === 0 ? 'bg-yellow-500/15 border border-yellow-500/30' :
                  isMe ? 'bg-purple-500/15 border border-purple-500/30' : 'bg-white/5'
                }`}>
                  <span className="text-2xl w-8 text-center">{placeEmojis[index] || `${index + 1}.`}</span>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
                    style={{ backgroundColor: avatar.color + '33', border: `2px solid ${avatar.color}` }}>
                    {avatar.emoji}
                  </div>
                  <div className="flex-1 text-left">
                    <span className={`font-semibold ${isMe ? 'text-white' : 'text-white/80'}`}>
                      {p.name} {isMe && <span className="text-purple-300 text-xs">(Ty)</span>}
                    </span>
                  </div>
                  <span className="text-2xl font-black text-white">{p.score}</span>
                  <span className="text-purple-300 text-xs">pkt</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fun fact */}
        <div className="bg-yellow-500/10 rounded-xl p-4 mb-6 border border-yellow-500/30 animate-scale-in">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">📜</span>
            <span className="text-yellow-400 font-semibold text-sm">Legendarny Zwój Wiedzy</span>
          </div>
          <p className="text-yellow-200 text-sm leading-relaxed">{result.funFact}</p>
        </div>

        <div className="space-y-3">
          <button onClick={onPlayAgain}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:scale-[1.02] active:scale-95">
            Zagraj ponownie
          </button>
          <button onClick={onLeave} className="w-full py-3 text-purple-300 hover:text-white transition-colors">
            Wróć do menu
          </button>
        </div>
      </div>
    </div>
  );
}
