import type { RoomState } from '../types';

interface Props {
  room: RoomState;
  playerId: string;
  onStartGame: () => void;
  onLeave: () => void;
}

export default function LobbyScreen({ room, playerId, onStartGame, onLeave }: Props) {
  const isHost = room.players.length > 0 && room.players[0].id === playerId;
  const canStart = room.players.length === 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Poczekalnia</h2>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/20">
            <span className="text-purple-200 text-sm">Kod pokoju:</span>
            <span className="text-2xl font-mono font-bold text-white tracking-widest">
              {room.id}
            </span>
          </div>
          <p className="text-purple-300 text-sm mt-2">
            Podaj ten kod drugiej osobie
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-6 mb-6 border border-white/20">
          <h3 className="text-white font-semibold mb-4">
            Gracze ({room.players.length}/2)
          </h3>
          <div className="space-y-3">
            {room.players.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center gap-3 p-3 bg-white/10 rounded-lg"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  index === 0 ? 'bg-indigo-500' : 'bg-pink-500'
                }`}>
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-left">
                  <span className="text-white font-medium">{player.name}</span>
                  {player.id === playerId && (
                    <span className="text-purple-300 text-xs ml-2">(Ty)</span>
                  )}
                </div>
                {index === 0 && (
                  <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                    Host
                  </span>
                )}
              </div>
            ))}
            {room.players.length < 2 && (
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border-2 border-dashed border-white/20">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-white/30 text-xl">?</span>
                </div>
                <span className="text-white/40">Oczekiwanie na przeciwnika...</span>
              </div>
            )}
          </div>
        </div>

        {isHost && (
          <button
            onClick={onStartGame}
            disabled={!canStart}
            className={`w-full py-4 font-bold text-lg rounded-xl transition-all shadow-lg ${
              canStart
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white animate-pulse-glow'
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            }`}
          >
            {canStart ? 'Rozpocznij Grę!' : 'Czekam na drugiego gracza...'}
          </button>
        )}

        {!isHost && (
          <div className="text-center py-4 text-purple-300">
            Oczekiwanie na rozpoczęcie gry przez hosta...
          </div>
        )}

        <button
          onClick={onLeave}
          className="w-full mt-4 py-3 text-purple-300 hover:text-white transition-colors"
        >
          Opuść pokój
        </button>
      </div>
    </div>
  );
}
