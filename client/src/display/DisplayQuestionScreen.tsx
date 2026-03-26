import type { QuestionData, RoomState } from '../types';
import { AVATARS } from '../types';

interface Props {
  question: QuestionData;
  timeLeft: number;
  room: RoomState;
  answeredIds: Set<string>;
}

const answerColors = [
  { border: '#FF2D78', bg: '#FF2D78', label: 'A' },
  { border: '#00F5FF', bg: '#00F5FF', label: 'B' },
  { border: '#FFE033', bg: '#FFE033', label: 'C' },
  { border: '#39FF14', bg: '#39FF14', label: 'D' },
];

const difficultyLabels: Record<string, { text: string; color: string }> = {
  easy: { text: 'Łatwe', color: '#39FF14' },
  medium: { text: 'Średnie', color: '#FFE033' },
  hard: { text: 'Trudne', color: '#FF2D78' },
};

export default function DisplayQuestionScreen({ question, timeLeft, room, answeredIds }: Props) {
  const timerPercent = (timeLeft / question.timeLimit) * 100;
  const timerColor = timeLeft <= 5 ? '#FF2D78' : timeLeft <= 10 ? '#FFE033' : '#39FF14';
  const difficulty = difficultyLabels[question.difficulty] || difficultyLabels.easy;
  const answeredCount = room.players.filter((p) => answeredIds.has(p.id)).length;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-[0.04] z-10" />

      {/* Timer bar — full width, thick */}
      <div className="relative z-20 w-full h-3 bg-white/10">
        <div
          className="h-full transition-all duration-1000 ease-linear"
          style={{
            width: `${timerPercent}%`,
            backgroundColor: timerColor,
            boxShadow: `0 0 12px ${timerColor}99`,
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between px-10 py-4 border-b border-white/5">
        <div className="flex items-center gap-4">
          <span className="font-orbitron text-white/40 text-sm">
            {question.questionNumber}/{question.totalQuestions}
          </span>
          <span
            className="text-xs px-3 py-1 uppercase tracking-widest font-semibold border"
            style={{ color: difficulty.color, borderColor: difficulty.color + '60' }}
          >
            {difficulty.text}
          </span>
          <span className="text-[#FFE033]/50 text-sm uppercase tracking-widest">
            {question.category}
          </span>
        </div>

        {/* Timer number */}
        <div className="flex items-center gap-3">
          <span className="text-white/30 text-sm">{answeredCount}/{room.players.length} odpowiedzi</span>
          <span
            className="font-orbitron font-black min-w-[4rem] text-right"
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              color: timerColor,
              textShadow: `0 0 20px ${timerColor}88`,
            }}
          >
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="relative z-20 flex-1 flex flex-col justify-center px-10 py-6 gap-8">
        {question.imageUrl && (
          <div className="flex justify-center">
            <img
              src={question.imageUrl}
              alt="Pytanie"
              className="max-h-48 border border-[#FFE033]/20 object-contain"
            />
          </div>
        )}

        <div
          className="bg-[#12121a] border border-[#FFE033]/15 p-8 text-center"
          style={{ boxShadow: '0 0 40px rgba(255,224,51,0.05)' }}
        >
          <h2
            className="font-bold text-white leading-relaxed"
            style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}
          >
            {question.question}
          </h2>
        </div>

        {/* Answers grid — 2x2, informational only */}
        <div className="grid grid-cols-2 gap-4">
          {question.answers.map((answer, index) => {
            const color = answerColors[index];
            return (
              <div
                key={index}
                className="flex items-center gap-4 p-5 bg-[#12121a]"
                style={{
                  border: `2px solid ${color.border}60`,
                  fontSize: 'clamp(1rem, 2vw, 1.4rem)',
                }}
              >
                <span
                  className="inline-flex items-center justify-center w-10 h-10 font-orbitron font-black shrink-0 text-[#0a0a0f]"
                  style={{
                    backgroundColor: color.bg,
                    fontSize: '1.1rem',
                    boxShadow: `0 0 12px ${color.bg}66`,
                  }}
                >
                  {color.label}
                </span>
                <span className="text-white font-medium leading-snug">{answer}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Player avatars bottom bar */}
      <div className="relative z-20 border-t border-white/5 px-10 py-4">
        <div className="flex items-center gap-4 justify-center flex-wrap">
          {room.players.map((player) => {
            const avatar = AVATARS.find((a) => a.id === player.avatarId) || AVATARS[0];
            const hasAnswered = answeredIds.has(player.id);
            return (
              <div key={player.id} className="flex flex-col items-center gap-1">
                <div
                  className="w-12 h-12 flex items-center justify-center text-2xl relative"
                  style={{
                    backgroundColor: hasAnswered ? avatar.color + '33' : '#12121a',
                    border: `2px solid ${hasAnswered ? avatar.color : avatar.color + '40'}`,
                    boxShadow: hasAnswered ? `0 0 10px ${avatar.color}55` : 'none',
                    opacity: hasAnswered ? 1 : 0.5,
                    transition: 'all 0.3s',
                  }}
                >
                  {avatar.emoji}
                  {hasAnswered && (
                    <span
                      className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[10px] font-bold rounded-full bg-[#39FF14] text-[#0a0a0f]"
                    >
                      ✓
                    </span>
                  )}
                </div>
                <span className="text-white/40 text-[10px] uppercase tracking-wide max-w-[56px] truncate text-center">
                  {player.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
