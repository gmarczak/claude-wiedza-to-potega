import { useState } from 'react';
import type { GameSettings } from '../types';
import { AVATARS } from '../types';

interface Props {
  onCreateRoom: (name: string, avatarId: string, settings: GameSettings) => void;
  onJoinRoom: (name: string, avatarId: string, roomId: string) => void;
  error: string | null;
}

export default function HomeScreen({ onCreateRoom, onJoinRoom, error }: Props) {
  const [playerName, setPlayerName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].id);
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
  const [settings, setSettings] = useState<GameSettings>({
    totalRounds: 9,
    roundTime: 15,
    category: 'mixed',
    difficulty: 'mixed',
  });

  const handleCreate = () => {
    if (!playerName.trim()) return;
    onCreateRoom(playerName.trim(), selectedAvatar, settings);
  };

  const handleJoin = () => {
    if (!playerName.trim() || !roomCode.trim()) return;
    onJoinRoom(playerName.trim(), selectedAvatar, roomCode.trim().toUpperCase());
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-[0.04] z-10" />
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#FFE033] opacity-[0.03] blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#00F5FF] opacity-[0.03] blur-3xl" />

      <div className="w-full max-w-md relative z-20">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="font-orbitron text-5xl font-black uppercase tracking-widest text-[#FFE033] glow-text animate-neon-flicker">
            Wiedza
          </h1>
          <p className="font-orbitron text-2xl font-bold uppercase tracking-[0.3em] text-[#00F5FF] glow-text-cyan mt-1">
            to Potęga
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <span className="text-2xl">🧠</span>
            <span className="text-2xl">⚡</span>
            <span className="text-2xl">🏆</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 border border-[#FF2D78]/50 bg-[#FF2D78]/10 text-[#FF2D78] text-sm text-center tracking-wide">
            {error}
          </div>
        )}

        {mode === 'menu' && (
          <div className="space-y-5 animate-slide-up">
            <p className="text-white/50 text-center text-sm tracking-wide leading-relaxed">
              Quizowa gra towarzyska dla 2–6 graczy.<br />
              Sprawdź kto wie więcej!
            </p>
            <button
              onClick={() => setMode('create')}
              className="w-full py-5 border-2 border-[#FFE033] text-[#FFE033] font-bold text-xl uppercase tracking-widest hover:bg-[#FFE033] hover:text-[#0a0a0f] hover:shadow-[0_0_20px_rgba(255,224,51,0.5)] transition-all duration-200 font-orbitron"
            >
              Stwórz Pokój
            </button>
            <button
              onClick={() => setMode('join')}
              className="w-full py-5 border-2 border-[#00F5FF] text-[#00F5FF] font-bold text-xl uppercase tracking-widest hover:bg-[#00F5FF] hover:text-[#0a0a0f] hover:shadow-[0_0_20px_rgba(0,245,255,0.5)] transition-all duration-200 font-orbitron"
            >
              Dołącz do Pokoju
            </button>
          </div>
        )}

        {mode === 'create' && (
          <div className="space-y-4 animate-slide-up">
            <input
              type="text"
              placeholder="Twoje imię..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
              className="w-full px-4 py-3 bg-[#12121a] border border-[#FFE033]/30 text-white placeholder-white/30 focus:outline-none focus:border-[#FFE033] focus:shadow-[0_0_10px_rgba(255,224,51,0.3)] text-lg tracking-wide transition-all duration-200"
            />

            {/* Avatar selection */}
            <div className="bg-[#12121a] border border-[#FFE033]/20 p-4">
              <p className="text-[#FFE033]/60 text-xs mb-3 font-semibold uppercase tracking-widest">
                Wybierz postać
              </p>
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => setSelectedAvatar(avatar.id)}
                    className={`flex flex-col items-center p-2 transition-all duration-150 ${
                      selectedAvatar === avatar.id
                        ? 'bg-[#FFE033]/10 border border-[#FFE033] shadow-[0_0_8px_rgba(255,224,51,0.4)]'
                        : 'bg-white/5 border border-transparent hover:border-[#FFE033]/30 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-3xl mb-1">{avatar.emoji}</span>
                    <span className="text-[10px] text-white/50 tracking-wide">{avatar.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#12121a] border border-[#FFE033]/20 p-4 space-y-4">
              <h3 className="font-orbitron text-[#FFE033] font-bold text-base uppercase tracking-widest">
                Ustawienia gry
              </h3>
              <div>
                <label className="block text-[#FFE033]/60 text-xs mb-2 uppercase tracking-widest">
                  Czas na odpowiedź
                </label>
                <select
                  value={settings.roundTime}
                  onChange={(e) => setSettings({ ...settings, roundTime: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-[#FFE033]/30 text-white focus:outline-none focus:border-[#FFE033] [&>option]:bg-[#0a0a0f] [&>option]:text-white transition-all duration-200"
                >
                  <option value={10}>10 sekund</option>
                  <option value={15}>15 sekund</option>
                  <option value={20}>20 sekund</option>
                  <option value={30}>30 sekund</option>
                </select>
              </div>
              <div>
                <label className="block text-[#FFE033]/60 text-xs mb-2 uppercase tracking-widest">
                  Trudność
                </label>
                <select
                  value={settings.difficulty}
                  onChange={(e) => setSettings({ ...settings, difficulty: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-[#FFE033]/30 text-white focus:outline-none focus:border-[#FFE033] [&>option]:bg-[#0a0a0f] [&>option]:text-white transition-all duration-200"
                >
                  <option value="mixed">Mieszana</option>
                  <option value="easy">Łatwa</option>
                  <option value="medium">Średnia</option>
                  <option value="hard">Trudna</option>
                </select>
              </div>
              <p className="text-white/30 text-xs leading-relaxed">
                Format: 3 rundy pytań + minigra + 3 rundy + minigra + 3 rundy + Piramida Wiedzy
              </p>
            </div>
            <button
              onClick={handleCreate}
              disabled={!playerName.trim()}
              className="w-full py-4 border-2 border-[#39FF14] text-[#39FF14] font-bold text-lg uppercase tracking-widest hover:bg-[#39FF14] hover:text-[#0a0a0f] hover:shadow-[0_0_20px_rgba(57,255,20,0.5)] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed font-orbitron"
            >
              Stwórz Pokój
            </button>
            <button
              onClick={() => setMode('menu')}
              className="w-full py-3 text-white/40 hover:text-[#FFE033] uppercase tracking-widest text-sm transition-colors duration-200"
            >
              Wróć
            </button>
          </div>
        )}

        {mode === 'join' && (
          <div className="space-y-4 animate-slide-up">
            <input
              type="text"
              placeholder="Twoje imię..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
              className="w-full px-4 py-3 bg-[#12121a] border border-[#FFE033]/30 text-white placeholder-white/30 focus:outline-none focus:border-[#FFE033] focus:shadow-[0_0_10px_rgba(255,224,51,0.3)] text-lg tracking-wide transition-all duration-200"
            />

            {/* Avatar selection */}
            <div className="bg-[#12121a] border border-[#FFE033]/20 p-4">
              <p className="text-[#FFE033]/60 text-xs mb-3 font-semibold uppercase tracking-widest">
                Wybierz postać
              </p>
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => setSelectedAvatar(avatar.id)}
                    className={`flex flex-col items-center p-2 transition-all duration-150 ${
                      selectedAvatar === avatar.id
                        ? 'bg-[#FFE033]/10 border border-[#FFE033] shadow-[0_0_8px_rgba(255,224,51,0.4)]'
                        : 'bg-white/5 border border-transparent hover:border-[#FFE033]/30 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-3xl mb-1">{avatar.emoji}</span>
                    <span className="text-[10px] text-white/50 tracking-wide">{avatar.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              placeholder="Kod pokoju (np. ABC123)"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="w-full px-4 py-3 bg-[#12121a] border border-[#00F5FF]/30 text-[#00F5FF] placeholder-[#00F5FF]/30 focus:outline-none focus:border-[#00F5FF] focus:shadow-[0_0_10px_rgba(0,245,255,0.3)] text-xl text-center tracking-[0.5em] font-mono uppercase font-orbitron transition-all duration-200"
            />
            <button
              onClick={handleJoin}
              disabled={!playerName.trim() || !roomCode.trim()}
              className="w-full py-4 border-2 border-[#39FF14] text-[#39FF14] font-bold text-lg uppercase tracking-widest hover:bg-[#39FF14] hover:text-[#0a0a0f] hover:shadow-[0_0_20px_rgba(57,255,20,0.5)] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed font-orbitron"
            >
              Dołącz
            </button>
            <button
              onClick={() => setMode('menu')}
              className="w-full py-3 text-white/40 hover:text-[#FFE033] uppercase tracking-widest text-sm transition-colors duration-200"
            >
              Wróć
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
