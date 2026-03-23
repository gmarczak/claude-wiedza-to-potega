import { useState, useEffect } from 'react';
import type { PyramidIntroData, PyramidQuestionData, PyramidRevealData } from '../types';
import { AVATARS } from '../types';
import { SFX } from '../sounds';

// ===== PYRAMID INTRO =====
export function PyramidIntro({ data }: { data: PyramidIntroData }) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-[0.04] z-10" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full bg-[#FFE033] opacity-[0.04] blur-3xl" />
      </div>

      <div className="w-full max-w-md text-center animate-slide-up relative z-20">
        <h1
          className="font-orbitron text-4xl font-black text-[#FFE033] uppercase tracking-widest mb-2 animate-glow"
          style={{ textShadow: '0 0 30px rgba(255,224,51,0.7), 0 0 60px rgba(255,224,51,0.3)' }}
        >
          Piramida Wiedzy
        </h1>
        <p className="text-white/30 text-xs uppercase tracking-widest mb-8">
          Kto pierwszy dotrze na szczyt, wygrywa!
        </p>

        <div className="relative mx-auto" style={{ width: '280px', height: '300px' }}>
          {Array.from({ length: data.pyramidSize + 1 }).map((_, level) => {
            const width = 280 - level * (200 / data.pyramidSize);
            const playersAtLevel = data.players.filter((p) => p.startPosition === level);
            return (
              <div
                key={level}
                className="absolute flex items-center justify-center"
                style={{
                  bottom: `${level * (100 / data.pyramidSize)}%`,
                  left: `${(280 - width) / 2}px`,
                  width: `${width}px`,
                  height: '40px',
                }}
              >
                <div
                  className={`w-full h-full flex items-center justify-center gap-1 border ${
                    level === data.pyramidSize
                      ? 'bg-[#FFE033]/10 border-[#FFE033] animate-glow'
                      : 'bg-[#12121a] border-white/10'
                  }`}
                  style={level === data.pyramidSize ? { boxShadow: '0 0 16px rgba(255,224,51,0.4)' } : undefined}
                >
                  {level === data.pyramidSize && (
                    <span className="font-orbitron text-[#FFE033] text-xs font-bold uppercase tracking-widest">
                      SZCZYT
                    </span>
                  )}
                  {playersAtLevel.map((p) => {
                    const avatar = AVATARS.find((a) => a.id === p.avatarId) || AVATARS[0];
                    return (
                      <span key={p.id} className="text-xl animate-bounce-in" title={p.name}>
                        {avatar.emoji}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-6">
          {data.players.map((p) => {
            const avatar = AVATARS.find((a) => a.id === p.avatarId) || AVATARS[0];
            return (
              <div key={p.id} className="text-center">
                <span className="text-2xl">{avatar.emoji}</span>
                <div className="text-white text-sm font-semibold mt-1">{p.name}</div>
                <div className="text-white/30 text-xs font-mono">{p.score} pkt</div>
                <div className="text-[#FFE033]/60 text-xs">Start: poz. {p.startPosition}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ===== PYRAMID QUESTION =====
export function PyramidQuestion({ data, timeLeft, onAnswer }: {
  data: PyramidQuestionData; timeLeft: number; onAnswer: (i: number) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const answerLabels = ['A', 'B', 'C', 'D'];
  const answerColors = [
    'border-[#FF2D78] text-[#FF2D78] hover:bg-[#FF2D78] hover:text-[#0a0a0f]',
    'border-[#00F5FF] text-[#00F5FF] hover:bg-[#00F5FF] hover:text-[#0a0a0f]',
    'border-[#FFE033] text-[#FFE033] hover:bg-[#FFE033] hover:text-[#0a0a0f]',
    'border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14] hover:text-[#0a0a0f]',
  ];
  const answerSelectedColors = [
    'bg-[#FF2D78] text-[#0a0a0f] border-[#FF2D78]',
    'bg-[#00F5FF] text-[#0a0a0f] border-[#00F5FF]',
    'bg-[#FFE033] text-[#0a0a0f] border-[#FFE033]',
    'bg-[#39FF14] text-[#0a0a0f] border-[#39FF14]',
  ];

  useEffect(() => { setSelected(null); }, [data.question]);

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    onAnswer(i);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-[0.04] z-10" />

      {/* Pyramid progress */}
      <div className="p-3 relative z-20">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-2">
          {Object.entries(data.positions).map(([pid, pos]) => (
            <div key={pid} className="flex items-center gap-1">
              <div className="flex gap-0.5">
                {Array.from({ length: data.pyramidSize }).map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 transition-all duration-500"
                    style={i < pos
                      ? { backgroundColor: '#FFE033', boxShadow: '0 0 4px rgba(255,224,51,0.6)' }
                      : { backgroundColor: 'rgba(255,255,255,0.1)' }
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <span className={`font-orbitron text-2xl font-bold ${timeLeft <= 3 ? 'text-[#FF2D78] animate-timer-urgent glow-text-danger' : 'text-[#00F5FF] glow-text-cyan'}`}>
            {timeLeft}s
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-4 pb-4 relative z-20">
        <div className="mb-2 text-center">
          <span className="text-[#FFE033]/40 text-xs uppercase tracking-widest">{data.category}</span>
        </div>

        {data.imageUrl && (
          <div className="flex justify-center mb-4">
            <img src={data.imageUrl} alt="Pytanie" className="max-h-32 border border-[#FFE033]/20 object-contain" />
          </div>
        )}

        <div className="bg-[#12121a] border border-[#FFE033]/20 p-5 mb-6 animate-scale-in">
          <h2 className="text-xl font-bold text-white text-center">{data.question}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 stagger-children">
          {data.answers.map((answer, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={selected !== null}
              className={`p-4 border-2 font-semibold text-left transition-all duration-200 ${
                selected === i
                  ? answerSelectedColors[i] + ' scale-95'
                  : selected !== null
                  ? 'opacity-30 border-white/10 text-white/30 cursor-not-allowed'
                  : answerColors[i] + ' bg-[#12121a] hover:scale-[1.02] active:scale-95'
              }`}
            >
              <span className="inline-flex items-center justify-center w-7 h-7 border border-current/50 bg-current/10 text-sm font-bold mr-3 font-orbitron">
                {answerLabels[i]}
              </span>
              {answer}
            </button>
          ))}
        </div>

        {selected !== null && (
          <p className="text-center text-[#00F5FF]/40 text-xs mt-4 uppercase tracking-widest animate-slide-up">
            Odpowiedź zapisana!
          </p>
        )}
      </div>
    </div>
  );
}

// ===== PYRAMID REVEAL =====
export function PyramidReveal({ data }: { data: PyramidRevealData }) {
  useEffect(() => {
    data.players.forEach(p => {
      if (p.correct) SFX.pyramidClimb();
    });
  }, [data]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-[0.04] z-10" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[400px] h-[400px] rounded-full bg-[#FFE033] opacity-[0.04] blur-3xl" />
      </div>

      <div className="w-full max-w-lg text-center animate-slide-up relative z-20">
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          {data.players.map((p) => {
            const avatar = AVATARS.find((a) => a.id === p.avatarId) || AVATARS[0];
            return (
              <div key={p.id} className="text-center">
                <span className="text-3xl">{avatar.emoji}</span>
                <div className="text-white/70 text-sm font-semibold mt-1">{p.name}</div>
                <div
                  className={`font-orbitron text-lg font-bold mt-1 ${
                    p.correct ? 'text-[#39FF14] animate-bounce-in' : 'text-[#FF2D78] animate-shake'
                  }`}
                  style={p.correct ? { textShadow: '0 0 12px rgba(57,255,20,0.6)' } : undefined}
                >
                  {p.correct ? 'Dobrze! +1' : 'Źle!'}
                </div>
                <div className="flex gap-1 justify-center mt-3">
                  {Array.from({ length: data.pyramidSize }).map((_, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 transition-all duration-500"
                      style={i < p.newPosition
                        ? { backgroundColor: '#FFE033', boxShadow: '0 0 6px rgba(255,224,51,0.7)', transform: 'scale(1.1)' }
                        : { backgroundColor: 'rgba(255,255,255,0.1)' }
                      }
                    />
                  ))}
                </div>
                <div className="text-[#FFE033]/50 text-xs mt-1 font-mono">
                  Poziom {p.newPosition}/{data.pyramidSize}
                </div>
                {p.newPosition >= data.pyramidSize && (
                  <div
                    className="font-orbitron text-[#FFE033] font-black text-sm mt-2 uppercase tracking-widest animate-glow"
                    style={{ textShadow: '0 0 20px rgba(255,224,51,0.8)' }}
                  >
                    SZCZYT!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
