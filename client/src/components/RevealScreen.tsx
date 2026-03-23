import { useEffect } from 'react';
import type { QuestionData, RevealData } from '../types';
import { AVATARS } from '../types';
import { SFX } from '../sounds';

interface Props {
  question: QuestionData;
  reveal: RevealData;
  playerId: string;
}

const answerLabels = ['A', 'B', 'C', 'D'];

export default function RevealScreen({ question, reveal, playerId }: Props) {
  const me = reveal.players.find((p) => p.id === playerId);
  const myCorrect = me?.answer === reveal.correctIndex;

  useEffect(() => {
    if (myCorrect) SFX.correct();
    else SFX.wrong();
  }, [myCorrect]);

  const sortedPlayers = [...reveal.players].sort((a, b) => b.pointsEarned - a.pointsEarned);

  return (
    <div className={`min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-4 relative overflow-hidden ${myCorrect ? 'animate-correct-flash' : 'animate-wrong-flash'}`}>
      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-[0.04] z-10" />

      <div className="w-full max-w-lg animate-slide-up relative z-20">
        {question.imageUrl && (
          <div className="flex justify-center mb-3">
            <img src={question.imageUrl} alt="" className="max-h-20 border border-[#FFE033]/20 object-contain" />
          </div>
        )}

        {/* Question card */}
        <div className="bg-[#12121a] border border-[#FFE033]/15 p-4 mb-4">
          <p className="text-[#FFE033]/40 text-[10px] uppercase tracking-widest mb-1">{question.category}</p>
          <h2 className="text-lg font-bold text-white leading-snug">{question.question}</h2>
        </div>

        {/* Answers with player picks */}
        <div className="space-y-2 mb-4 stagger-children">
          {question.answers.map((answer, index) => {
            const isCorrect = index === reveal.correctIndex;
            const playersPicked = reveal.players.filter(p => p.answer === index);
            return (
              <div
                key={index}
                className={`p-3 font-medium flex items-center gap-3 transition-all border ${
                  isCorrect
                    ? 'bg-[#39FF14]/10 border-[#39FF14]/60 text-white animate-scale-in'
                    : 'bg-white/5 border-white/5 text-white/40'
                }`}
                style={isCorrect ? { boxShadow: '0 0 16px rgba(57,255,20,0.25)' } : undefined}
              >
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 text-sm font-bold shrink-0 font-orbitron border ${
                    isCorrect
                      ? 'bg-[#39FF14] text-[#0a0a0f] border-[#39FF14]'
                      : 'bg-white/5 border-white/10 text-white/30'
                  }`}
                >
                  {answerLabels[index]}
                </span>
                <span className="flex-1 text-sm">{answer}</span>
                <div className="flex gap-1 shrink-0">
                  {playersPicked.map(p => {
                    const avatar = AVATARS.find(a => a.id === p.avatarId) || AVATARS[0];
                    return <span key={p.id} className="text-lg" title={p.name}>{avatar.emoji}</span>;
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Scores panel */}
        <div className="bg-[#12121a] border border-[#FFE033]/15 p-4">
          <div className="flex flex-wrap justify-center gap-4">
            {sortedPlayers.map((p) => {
              const avatar = AVATARS.find(a => a.id === p.avatarId) || AVATARS[0];
              const isMe = p.id === playerId;
              return (
                <div
                  key={p.id}
                  className={`text-center animate-scale-in p-2 ${
                    isMe ? 'border border-[#FFE033]/40 bg-[#FFE033]/5' : ''
                  }`}
                >
                  <div className="text-xl">{avatar.emoji}</div>
                  <div className="text-white/70 text-xs font-medium">{p.name}</div>
                  <div
                    className={`text-lg font-bold font-orbitron ${
                      p.pointsEarned > 0 ? 'text-[#39FF14]' : 'text-[#FF2D78]'
                    }`}
                    style={p.pointsEarned > 0 ? { textShadow: '0 0 12px rgba(57,255,20,0.6)' } : undefined}
                  >
                    {p.pointsEarned > 0 ? `+${p.pointsEarned}` : '0'}
                  </div>
                  {p.pointsEarned > 0 && p.answerTime !== null && reveal.speedBonus && (
                    <div className="text-[#FFE033] text-[10px] font-semibold uppercase tracking-wide">+bonus!</div>
                  )}
                  <div className="text-white/30 text-xs font-mono">{p.score} pkt</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
