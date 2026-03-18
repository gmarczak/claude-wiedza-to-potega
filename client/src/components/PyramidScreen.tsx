import { useState, useEffect } from 'react';
import type { PyramidIntroData, PyramidQuestionData, PyramidRevealData } from '../types';
import { AVATARS } from '../types';
import { SFX } from '../sounds';

// ===== PYRAMID INTRO =====
export function PyramidIntro({ data }: { data: PyramidIntroData }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center animate-slide-up">
        <h1 className="text-4xl font-black text-yellow-400 text-shadow-lg mb-2 animate-glow">Piramida Wiedzy</h1>
        <p className="text-orange-200 mb-8">Kto pierwszy dotrze na szczyt, wygrywa!</p>

        <div className="relative mx-auto" style={{ width: '280px', height: '300px' }}>
          {Array.from({ length: data.pyramidSize + 1 }).map((_, level) => {
            const width = 280 - level * (200 / data.pyramidSize);
            const playersAtLevel = data.players.filter((p) => p.startPosition === level);
            return (
              <div key={level} className="absolute flex items-center justify-center"
                style={{ bottom: `${level * (100 / data.pyramidSize)}%`, left: `${(280 - width) / 2}px`, width: `${width}px`, height: '40px' }}>
                <div className={`w-full h-full rounded-lg flex items-center justify-center gap-1 ${
                  level === data.pyramidSize ? 'bg-yellow-500/50 border-2 border-yellow-400 animate-glow' : 'bg-white/10 border border-white/20'
                }`}>
                  {level === data.pyramidSize && <span className="text-yellow-400 text-xs font-bold">SZCZYT</span>}
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

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {data.players.map((p) => {
            const avatar = AVATARS.find((a) => a.id === p.avatarId) || AVATARS[0];
            return (
              <div key={p.id} className="text-center">
                <span className="text-2xl">{avatar.emoji}</span>
                <div className="text-white text-sm font-semibold">{p.name}</div>
                <div className="text-orange-300 text-xs">{p.score} pkt</div>
                <div className="text-yellow-400 text-xs">Start: poz. {p.startPosition}</div>
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

  // Reset when question changes
  useEffect(() => { setSelected(null); }, [data.question]);

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    onAnswer(i);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 flex flex-col">
      {/* Pyramid progress bars */}
      <div className="p-3">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-2">
          {Object.entries(data.positions).map(([pid, pos]) => {
            return (
              <div key={pid} className="flex items-center gap-1">
                <div className="flex gap-0.5">
                  {Array.from({ length: data.pyramidSize }).map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-sm transition-all ${i < pos ? 'bg-yellow-400' : 'bg-white/20'}`} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center">
          <span className={`text-2xl font-mono font-bold ${timeLeft <= 3 ? 'text-red-400 animate-timer-urgent' : 'text-white'}`}>{timeLeft}s</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-4 pb-4">
        <div className="mb-2 text-center">
          <span className="text-orange-300 text-xs font-medium">{data.category}</span>
        </div>

        {data.imageUrl && (
          <div className="flex justify-center mb-4">
            <img src={data.imageUrl} alt="Pytanie" className="max-h-32 rounded-xl border-2 border-white/20 object-contain" />
          </div>
        )}

        <div className="bg-white/10 rounded-2xl p-5 mb-6 border border-yellow-500/30 animate-scale-in">
          <h2 className="text-xl font-bold text-white text-center">{data.question}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 stagger-children">
          {data.answers.map((answer, i) => (
            <button key={i} onClick={() => handleAnswer(i)} disabled={selected !== null}
              className={`p-4 rounded-xl font-semibold text-white text-left transition-all ${
                selected === i ? 'ring-4 ring-yellow-400 scale-95 bg-orange-600' :
                selected !== null ? 'opacity-50 bg-orange-700/50' :
                'bg-orange-700/50 hover:bg-orange-600 hover:scale-[1.02] active:scale-95 border border-orange-500/30'
              }`}>
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/20 text-sm font-bold mr-3">
                {answerLabels[i]}
              </span>
              {answer}
            </button>
          ))}
        </div>

        {selected !== null && (
          <p className="text-center text-orange-300 mt-4 animate-slide-up">Odpowiedź zapisana!</p>
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg text-center animate-slide-up">
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {data.players.map((p) => {
            const avatar = AVATARS.find((a) => a.id === p.avatarId) || AVATARS[0];
            return (
              <div key={p.id} className="text-center">
                <span className="text-3xl">{avatar.emoji}</span>
                <div className="text-white text-sm font-semibold">{p.name}</div>
                <div className={`text-lg font-bold ${p.correct ? 'text-green-400 animate-bounce-in' : 'text-red-400 animate-shake'}`}>
                  {p.correct ? 'Dobrze! +1' : 'Źle!'}
                </div>
                <div className="flex gap-1 justify-center mt-2">
                  {Array.from({ length: data.pyramidSize }).map((_, i) => (
                    <div key={i} className={`w-4 h-4 rounded-sm transition-all duration-500 ${
                      i < p.newPosition ? 'bg-yellow-400 scale-110' : 'bg-white/20'
                    }`} />
                  ))}
                </div>
                <div className="text-yellow-400 text-xs mt-1">Poziom {p.newPosition}/{data.pyramidSize}</div>
                {p.newPosition >= data.pyramidSize && (
                  <div className="text-yellow-300 font-bold text-sm mt-1 animate-glow">SZCZYT!</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
