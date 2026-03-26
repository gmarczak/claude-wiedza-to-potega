import type { QuestionData, RevealData } from '../types';
import { AVATARS } from '../types';

interface Props {
  question: QuestionData;
  reveal: RevealData;
}

const answerColors = [
  { border: '#FF2D78', bg: '#FF2D78', label: 'A' },
  { border: '#00F5FF', bg: '#00F5FF', label: 'B' },
  { border: '#FFE033', bg: '#FFE033', label: 'C' },
  { border: '#39FF14', bg: '#39FF14', label: 'D' },
];

export default function DisplayRevealScreen({ question, reveal }: Props) {
  const sortedPlayers = [...reveal.players].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-[0.04] z-10" />

      {/* Header */}
      <div className="relative z-20 px-10 pt-6 pb-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <span className="font-orbitron text-white/30 text-sm uppercase tracking-widest">
            Pytanie {question.questionNumber}/{question.totalQuestions}
          </span>
          <span className="text-[#FFE033]/40 text-sm uppercase tracking-widest">{question.category}</span>
        </div>
      </div>

      {/* Main area: question + answers (left) | scores (right) */}
      <div className="relative z-20 flex flex-1 gap-6 px-10 py-6 overflow-hidden">

        {/* Left: question + answers */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          {/* Question */}
          <div className="bg-[#12121a] border border-[#FFE033]/15 px-6 py-5">
            <h2
              className="font-bold text-white leading-snug"
              style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.8rem)' }}
            >
              {question.question}
            </h2>
          </div>

          {/* Answers */}
          <div className="space-y-3 stagger-children">
            {question.answers.map((answer, index) => {
              const isCorrect = index === reveal.correctIndex;
              const playersPicked = reveal.players.filter((p) => p.answer === index);
              const color = answerColors[index];

              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 border-2 transition-all"
                  style={
                    isCorrect
                      ? {
                          backgroundColor: '#39FF14' + '15',
                          borderColor: '#39FF14',
                          boxShadow: '0 0 24px rgba(57,255,20,0.3)',
                        }
                      : {
                          backgroundColor: '#12121a',
                          borderColor: color.border + '30',
                          opacity: 0.5,
                        }
                  }
                >
                  <span
                    className="inline-flex items-center justify-center w-10 h-10 font-orbitron font-black shrink-0 text-sm"
                    style={
                      isCorrect
                        ? { backgroundColor: '#39FF14', color: '#0a0a0f' }
                        : { backgroundColor: color.bg + '20', color: color.bg, border: `2px solid ${color.bg}40` }
                    }
                  >
                    {color.label}
                  </span>
                  <span
                    className="flex-1 font-medium leading-snug"
                    style={{
                      color: isCorrect ? '#fff' : '#ffffff60',
                      fontSize: 'clamp(0.9rem, 1.8vw, 1.3rem)',
                    }}
                  >
                    {answer}
                  </span>
                  {/* Avatars who picked this */}
                  <div className="flex gap-1 shrink-0">
                    {playersPicked.map((p) => {
                      const avatar = AVATARS.find((a) => a.id === p.avatarId) || AVATARS[0];
                      return (
                        <span key={p.id} className="text-2xl" title={p.name}>
                          {avatar.emoji}
                        </span>
                      );
                    })}
                  </div>
                  {isCorrect && (
                    <span
                      className="font-orbitron font-black text-[#39FF14] text-lg shrink-0"
                      style={{ textShadow: '0 0 10px rgba(57,255,20,0.7)' }}
                    >
                      ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: ranking */}
        <div className="w-80 shrink-0 flex flex-col gap-3">
          <p className="font-orbitron text-white/30 text-xs uppercase tracking-widest text-center">
            Ranking
          </p>
          <div className="space-y-2 stagger-children">
            {sortedPlayers.map((p, index) => {
              const avatar = AVATARS.find((a) => a.id === p.avatarId) || AVATARS[0];
              const isCorrect = p.answer === reveal.correctIndex;
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 bg-[#12121a] border animate-scale-in"
                  style={{
                    borderColor: index === 0 ? '#facc1540' : '#ffffff10',
                    backgroundColor: index === 0 ? '#facc1508' : '#12121a',
                  }}
                >
                  <span className="font-orbitron text-white/30 text-sm w-5 text-center shrink-0">
                    {index + 1}
                  </span>
                  <div
                    className="w-10 h-10 flex items-center justify-center text-xl shrink-0"
                    style={{
                      backgroundColor: avatar.color + '22',
                      border: `2px solid ${avatar.color}`,
                    }}
                  >
                    {avatar.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{p.name}</p>
                    <p
                      className="text-xs font-orbitron font-bold"
                      style={{ color: p.pointsEarned > 0 ? '#39FF14' : '#FF2D78' }}
                    >
                      {p.pointsEarned > 0 ? `+${p.pointsEarned}` : '0'}
                      {p.pointsEarned > 0 && isCorrect && reveal.speedBonus && (
                        <span className="text-[#FFE033] ml-1">+bonus</span>
                      )}
                    </p>
                  </div>
                  <span className="font-orbitron font-black text-white text-lg shrink-0">
                    {p.score}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
