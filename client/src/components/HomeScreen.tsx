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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 animate-slide-up">
          <h1 className="text-5xl font-black text-white text-shadow mb-2">Wiedza</h1>
          <p className="text-2xl font-bold text-purple-300">to Potęga</p>
          <div className="mt-2 inline-block px-4 py-1 bg-white/10 rounded-full">
            <span className="text-sm font-semibold text-purple-200">2-6 graczy</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        {mode === 'menu' && (
          <div className="space-y-4 animate-slide-up">
            <input
              type="text" placeholder="Twoje imię..." value={playerName}
              onChange={(e) => setPlayerName(e.target.value)} maxLength={20}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg"
            />

            {/* Avatar selection */}
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <p className="text-purple-200 text-sm mb-3 font-medium">Wybierz postać</p>
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => setSelectedAvatar(avatar.id)}
                    className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                      selectedAvatar === avatar.id
                        ? 'bg-white/20 ring-2 ring-purple-400 scale-105'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-3xl mb-1">{avatar.emoji}</span>
                    <span className="text-[10px] text-white/70">{avatar.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setMode('create')} disabled={!playerName.trim()}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-lg rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              Stwórz Pokój
            </button>
            <button
              onClick={() => setMode('join')} disabled={!playerName.trim()}
              className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-lg rounded-xl border border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Dołącz do Pokoju
            </button>
          </div>
        )}

        {mode === 'create' && (
          <div className="space-y-4 animate-slide-up">
            <div className="bg-white/10 rounded-xl p-4 space-y-4">
              <h3 className="text-white font-semibold text-lg">Ustawienia gry</h3>
              <div>
                <label className="block text-purple-200 text-sm mb-1">Czas na odpowiedź</label>
                <select value={settings.roundTime} onChange={(e) => setSettings({ ...settings, roundTime: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 [&>option]:bg-gray-800 [&>option]:text-white">
                  <option value={10}>10 sekund</option>
                  <option value={15}>15 sekund</option>
                  <option value={20}>20 sekund</option>
                  <option value={30}>30 sekund</option>
                </select>
              </div>
              <div>
                <label className="block text-purple-200 text-sm mb-1">Trudność</label>
                <select value={settings.difficulty} onChange={(e) => setSettings({ ...settings, difficulty: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 [&>option]:bg-gray-800 [&>option]:text-white">
                  <option value="mixed">Mieszana</option>
                  <option value="easy">Łatwa</option>
                  <option value="medium">Średnia</option>
                  <option value="hard">Trudna</option>
                </select>
              </div>
              <p className="text-purple-300/60 text-xs">Format: 3 rundy pytań + minigra + 3 rundy + minigra + 3 rundy + Piramida Wiedzy</p>
            </div>
            <button onClick={handleCreate}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg rounded-xl transition-all shadow-lg">
              Stwórz Pokój
            </button>
            <button onClick={() => setMode('menu')} className="w-full py-3 text-purple-300 hover:text-white transition-colors">Wróć</button>
          </div>
        )}

        {mode === 'join' && (
          <div className="space-y-4 animate-slide-up">
            <input type="text" placeholder="Kod pokoju (np. ABC123)" value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())} maxLength={6}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg text-center tracking-widest font-mono uppercase"
            />
            <button onClick={handleJoin} disabled={!roomCode.trim()}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">
              Dołącz
            </button>
            <button onClick={() => setMode('menu')} className="w-full py-3 text-purple-300 hover:text-white transition-colors">Wróć</button>
          </div>
        )}
      </div>
    </div>
  );
}
