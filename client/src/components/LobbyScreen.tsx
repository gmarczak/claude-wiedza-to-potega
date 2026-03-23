import type { RoomState } from '../types';
import { AVATARS } from '../types';

interface Props {
  room: RoomState;
  playerId: string;
  onStartGame: () => void;
  onLeave: () => void;
}

export default function LobbyScreen({ room, playerId, onStartGame, onLeave }: Props) {
  const isHost = room.players.length > 0 && room.players[0].id === playerId;
  const canStart = room.players.length >= 2;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-[0.04] z-10" />
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-[#FFE033] opacity-[0.03] blur-3xl" />

      <div className="w-full max-w-md animate-slide-up relative z-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-orbitron text-3xl font-black uppercase tracking-widest text-[#FFE033] glow-text mb-3">
            Poczekalnia
          </h2>
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-[#12121a] border border-[#00F5FF]/40 shadow-[0_0_12px_rgba(0,245,255,0.2)]">
            <span className="text-[#00F5FF]/60 text-xs uppercase tracking-widest">Kod pokoju</span>
            <span className="font-orbitron text-2xl font-bold text-[#00F5FF] tracking-[0.4em] glow-text-cyan">
              {room.id}
            </span>
          </div>
          <p className="text-white/30 text-xs mt-3 uppercase tracking-widest">Podaj ten kod innym graczom</p>
        </div>

        {/* Players list */}
        <div className="bg-[#12121a] border border-[#FFE033]/20 p-5 mb-5">
          <h3 className="font-orbitron text-[#FFE033]/80 text-xs font-bold uppercase tracking-widest mb-4">
            Gracze ({room.players.length}/6)
          </h3>
          <div className="space-y-2 stagger-children">
            {room.players.map((player, index) => {
              const avatar = AVATARS.find((a) => a.id === player.avatarId) || AVATARS[0];
              return (
                <div
                  key={player.id}
                  className="flex items-center gap-3 p-3 bg-[#0a0a0f] border border-[#FFE033]/10 animate-scale-in"
                >
                  <div
                    className="w-12 h-12 flex items-center justify-center text-2xl flex-shrink-0"
                    style={{
                      backgroundColor: avatar.color + '22',
                      border: `2px solid ${avatar.color}`,
                      boxShadow: `0 0 8px ${avatar.color}44`,
                    }}
                  >
                    {avatar.emoji}
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-white font-semibold tracking-wide">{player.name}</span>
                    {player.id === playerId && (
                      <span className="text-[#00F5FF]/60 text-xs ml-2 uppercase tracking-widest">(Ty)</span>
                    )}
                  </div>
                  {index === 0 && (
                    <span className="text-xs font-orbitron font-bold uppercase tracking-widest text-[#FFE033] border border-[#FFE033]/40 px-2 py-1">
                      Host
                    </span>
                  )}
                </div>
              );
            })}
            {Array.from({ length: Math.max(0, 2 - room.players.length) }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center gap-3 p-3 bg-[#0a0a0f] border-2 border-dashed border-white/10"
              >
                <div className="w-12 h-12 flex items-center justify-center border border-white/10 bg-white/5 flex-shrink-0">
                  <span className="text-white/20 text-xl">?</span>
                </div>
                <span className="text-white/25 text-sm tracking-wide">Oczekiwanie na gracza...</span>
              </div>
            ))}
          </div>
        </div>

        {/* Game format info */}
        <div className="bg-[#12121a] border border-white/5 p-4 mb-6">
          <p className="text-white/30 text-xs text-center leading-relaxed">
            Format gry: 3× pytania + minigra + 3× pytania + minigra + 3× pytania + Piramida Wiedzy
          </p>
          <p className="text-[#FFE033]/30 text-xs text-center mt-1 uppercase tracking-widest">
            2–6 graczy · wybór kategorii · zagrywki · mini-gry
          </p>
        </div>

        {/* Start / waiting */}
        {isHost ? (
          <button
            onClick={onStartGame}
            disabled={!canStart}
            className={`w-full py-4 font-orbitron font-bold text-lg uppercase tracking-widest transition-all duration-200 ${
              canStart
                ? 'border-2 border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14] hover:text-[#0a0a0f] hover:shadow-[0_0_24px_rgba(57,255,20,0.5)] animate-pulse-glow'
                : 'border-2 border-white/10 text-white/20 cursor-not-allowed'
            }`}
          >
            {canStart ? `Rozpocznij Grę! (${room.players.length} graczy)` : 'Czekam na drugiego gracza...'}
          </button>
        ) : (
          <div className="text-center py-4 text-[#00F5FF]/60 text-sm uppercase tracking-widest animate-float">
            Oczekiwanie na rozpoczęcie gry przez hosta...
          </div>
        )}

        <button
          onClick={onLeave}
          className="w-full mt-4 py-3 text-white/30 hover:text-[#FF2D78] uppercase tracking-widest text-sm transition-colors duration-200"
        >
          Opuść pokój
        </button>
      </div>
    </div>
  );
}
