import type { RoomState } from '../types';
import { AVATARS } from '../types';

interface Props {
  room: RoomState;
}

export default function DisplayLobbyScreen({ room }: Props) {
  const playerUrl = `${window.location.origin}/?mode=player`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(playerUrl)}&bgcolor=0a0a0f&color=facc15&margin=10`;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-[0.04] z-10" />

      {/* Top bar */}
      <div className="relative z-20 flex items-center justify-between px-10 pt-8 pb-4 border-b border-white/5">
        <h1
          className="font-orbitron font-black uppercase tracking-widest text-[#facc15]"
          style={{ fontSize: '2rem', textShadow: '0 0 20px rgba(250,204,21,0.4)' }}
        >
          Wiedza to Potęga
        </h1>
        <span className="text-white/30 text-sm uppercase tracking-widest font-orbitron">
          {room.players.length}/6 graczy
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-20 flex flex-1 items-center justify-center gap-16 px-10">

        {/* QR + join info */}
        <div className="flex flex-col items-center gap-6">
          <div
            className="p-3 border-2 border-[#facc15]/40"
            style={{ boxShadow: '0 0 40px rgba(250,204,21,0.15)' }}
          >
            <img
              src={qrUrl}
              alt="QR kod do dołączenia"
              width={280}
              height={280}
              style={{ display: 'block', imageRendering: 'pixelated' }}
            />
          </div>

          <div className="text-center">
            <p className="text-white/40 text-sm uppercase tracking-widest mb-2">
              Zeskanuj QR lub wejdź na
            </p>
            <p
              className="font-orbitron font-bold text-[#00F5FF]"
              style={{ fontSize: '1.1rem', textShadow: '0 0 12px rgba(0,245,255,0.5)' }}
            >
              {window.location.host}
            </p>
            <p className="text-white/30 text-xs mt-1 uppercase tracking-widest">i wpisz kod pokoju</p>
          </div>
        </div>

        {/* Room code + players */}
        <div className="flex flex-col items-center gap-8 flex-1 max-w-xl">
          {/* Room code */}
          <div className="text-center">
            <p className="text-white/30 text-sm uppercase tracking-[0.4em] mb-3">Kod pokoju</p>
            <div
              className="font-orbitron font-black text-[#00F5FF] tracking-[0.4em] px-8 py-4 border-2 border-[#00F5FF]/40 bg-[#00F5FF]/5"
              style={{
                fontSize: 'clamp(3rem, 8vw, 5rem)',
                textShadow: '0 0 30px rgba(0,245,255,0.5), 0 0 60px rgba(0,245,255,0.2)',
              }}
            >
              {room.id}
            </div>
          </div>

          {/* Players list */}
          {room.players.length > 0 ? (
            <div className="w-full">
              <p className="text-white/30 text-xs uppercase tracking-widest text-center mb-4">
                Połączeni gracze
              </p>
              <div className="grid grid-cols-2 gap-3">
                {room.players.map((player, index) => {
                  const avatar = AVATARS.find((a) => a.id === player.avatarId) || AVATARS[0];
                  return (
                    <div
                      key={player.id}
                      className="flex items-center gap-3 p-3 bg-[#12121a] border border-white/10 animate-scale-in"
                    >
                      <div
                        className="w-12 h-12 flex items-center justify-center text-2xl shrink-0"
                        style={{
                          backgroundColor: avatar.color + '22',
                          border: `2px solid ${avatar.color}`,
                          boxShadow: `0 0 8px ${avatar.color}44`,
                        }}
                      >
                        {avatar.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate">{player.name}</p>
                        {index === 0 && (
                          <p className="text-[#facc15]/60 text-xs uppercase tracking-widest">Host</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {room.players.length < 2 && (
                <p className="text-white/25 text-sm text-center mt-4 uppercase tracking-widest animate-float">
                  Czekam na więcej graczy...
                </p>
              )}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-white/25 text-lg uppercase tracking-widest animate-float">
                Czekam na graczy...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom hint */}
      <div className="relative z-20 text-center pb-6">
        <p className="text-white/15 text-xs uppercase tracking-widest">
          Host rozpoczyna grę z telefonu · min. 2 graczy
        </p>
      </div>
    </div>
  );
}
