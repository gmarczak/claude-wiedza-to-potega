import type { GameResult } from '../types';
import { AVATARS } from '../types';

interface Props {
  result: GameResult;
}

const placeEmojis = ['🥇', '🥈', '🥉'];
const placeColors = ['#FFE033', '#94a3b8', '#f97316'];

export default function DisplayFinishedScreen({ result }: Props) {
  const isTie = result.winner === null;
  const top3 = result.players.slice(0, 3);
  const rest = result.players.slice(3);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center relative overflow-hidden p-10">
      <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-[0.04] z-10" />
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div
          className="w-[900px] h-[600px] rounded-full blur-3xl opacity-[0.06]"
          style={{ backgroundColor: isTie ? '#00F5FF' : '#FFE033' }}
        />
      </div>

      <div className="relative z-20 w-full max-w-4xl">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4 animate-bounce-in">{isTie ? '🤝' : '🏆'}</div>
          <h1
            className="font-orbitron font-black uppercase tracking-widest"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              color: isTie ? '#00F5FF' : '#FFE033',
              textShadow: isTie
                ? '0 0 40px rgba(0,245,255,0.5)'
                : '0 0 40px rgba(255,224,51,0.5)',
            }}
          >
            {isTie ? 'Remis!' : 'Wiedza to Potęga!'}
          </h1>
          {result.winner && (
            <p className="text-white/40 text-lg mt-2 uppercase tracking-widest">
              Zwycięzca: <span className="text-[#FFE033] font-semibold">{result.winner.name}</span>
            </p>
          )}
        </div>

        {/* Podium top 3 */}
        <div className="flex items-end justify-center gap-6 mb-8">
          {/* Reorder: 2nd, 1st, 3rd for visual podium */}
          {[
            top3[1] ? { player: top3[1], place: 1 } : null,
            top3[0] ? { player: top3[0], place: 0 } : null,
            top3[2] ? { player: top3[2], place: 2 } : null,
          ]
            .filter(Boolean)
            .map((item) => {
              const { player, place } = item!;
              const avatar = AVATARS.find((a) => a.id === player.avatarId) || AVATARS[0];
              const isFirst = place === 0;
              const podiumHeights = ['h-40', 'h-28', 'h-20'];
              return (
                <div key={player.id} className="flex flex-col items-center gap-2">
                  <span className="text-3xl">{placeEmojis[place]}</span>
                  <div
                    className="w-20 h-20 flex items-center justify-center text-4xl"
                    style={{
                      backgroundColor: avatar.color + '22',
                      border: `3px solid ${isFirst ? placeColors[0] : avatar.color}`,
                      boxShadow: isFirst
                        ? `0 0 20px ${placeColors[0]}66`
                        : `0 0 10px ${avatar.color}33`,
                    }}
                  >
                    {avatar.emoji}
                  </div>
                  <p
                    className="font-semibold text-center"
                    style={{ color: isFirst ? '#FFE033' : '#ffffff99', fontSize: isFirst ? '1.1rem' : '0.95rem' }}
                  >
                    {player.name}
                  </p>
                  <p
                    className="font-orbitron font-black"
                    style={{
                      color: placeColors[place],
                      fontSize: isFirst ? '2rem' : '1.5rem',
                      textShadow: `0 0 12px ${placeColors[place]}66`,
                    }}
                  >
                    {player.score}
                  </p>
                  {/* Podium block */}
                  <div
                    className={`w-28 ${podiumHeights[place]} flex items-center justify-center border-t-2`}
                    style={{
                      backgroundColor: placeColors[place] + '15',
                      borderColor: placeColors[place] + '60',
                    }}
                  >
                    <span className="font-orbitron text-2xl font-black" style={{ color: placeColors[place] + '60' }}>
                      {place + 1}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Rest of players */}
        {rest.length > 0 && (
          <div className="bg-[#12121a] border border-white/5 p-4 mb-6">
            <div className="flex justify-center gap-6 flex-wrap">
              {rest.map((p, i) => {
                const avatar = AVATARS.find((a) => a.id === p.avatarId) || AVATARS[0];
                return (
                  <div key={p.id} className="flex items-center gap-2 text-white/40">
                    <span className="font-orbitron text-sm">{i + 4}.</span>
                    <span className="text-xl">{avatar.emoji}</span>
                    <span className="text-sm">{p.name}</span>
                    <span className="font-orbitron text-sm font-bold text-white/60">{p.score}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Fun fact */}
        {result.funFact && (
          <div className="bg-[#12121a] border border-[#FFE033]/20 p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xl">📜</span>
              <span className="font-orbitron text-[#FFE033]/60 font-bold text-xs uppercase tracking-widest">
                Legendarny Zwój Wiedzy
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-2xl mx-auto">{result.funFact}</p>
          </div>
        )}
      </div>
    </div>
  );
}
