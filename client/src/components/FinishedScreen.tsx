import type { GameResult } from '../types';
import { AVATARS } from '../types';

interface Props {
  result: GameResult;
  playerId: string;
  onPlayAgain: () => void;
  onLeave: () => void;
}

export default function FinishedScreen({ result, playerId, onPlayAgain, onLeave }: Props) {
  const isWinner = result.winner?.id === playerId;
  const isTie = result.winner === null;
  const me = result.players.find((p) => p.id === playerId);
  const opponent = result.players.find((p) => p.id !== playerId);
  const meAvatar = AVATARS.find((a) => a.id === me?.avatarId) || AVATARS[0];
  const oppAvatar = AVATARS.find((a) => a.id === opponent?.avatarId) || AVATARS[1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center animate-slide-up">
        <div className="text-8xl mb-4">
          {isTie ? '🤝' : isWinner ? '🏆' : '😔'}
        </div>

        <h1 className="text-4xl font-black text-white mb-2">
          {isTie ? 'Remis!' : isWinner ? 'Zwycięstwo!' : 'Przegrana'}
        </h1>
        <p className="text-purple-300 text-lg mb-6">
          {isTie ? 'Równy pojedynek!' : isWinner ? 'Gratulacje, wiedza to potęga!' : 'Następnym razem będzie lepiej!'}
        </p>

        {/* Scoreboard */}
        <div className="bg-white/10 rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-3xl ${
                isWinner || isTie ? 'ring-4 ring-yellow-400' : ''
              }`} style={{ backgroundColor: meAvatar.color + '33' }}>
                {meAvatar.emoji}
              </div>
              <div className="text-white font-semibold">{me?.name}</div>
              <div className="text-3xl font-black text-white mt-1">{me?.score}</div>
              <div className="text-purple-300 text-sm">punktów</div>
            </div>
            <div className="text-white/30 text-2xl font-bold">VS</div>
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-3xl ${
                !isWinner && !isTie ? 'ring-4 ring-yellow-400' : ''
              }`} style={{ backgroundColor: oppAvatar.color + '33' }}>
                {oppAvatar.emoji}
              </div>
              <div className="text-white font-semibold">{opponent?.name}</div>
              <div className="text-3xl font-black text-white mt-1">{opponent?.score}</div>
              <div className="text-purple-300 text-sm">punktów</div>
            </div>
          </div>
        </div>

        {/* Fun fact - "Legendarny zwój wiedzy" */}
        <div className="bg-yellow-500/10 rounded-xl p-4 mb-6 border border-yellow-500/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">📜</span>
            <span className="text-yellow-400 font-semibold text-sm">Legendarny Zwój Wiedzy</span>
          </div>
          <p className="text-yellow-200 text-sm leading-relaxed">{result.funFact}</p>
        </div>

        <div className="space-y-3">
          <button onClick={onPlayAgain}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-lg rounded-xl transition-all shadow-lg">
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
