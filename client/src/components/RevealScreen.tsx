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

  // Sort players by points earned this round
  const sortedPlayers = [...reveal.players].sort((a, b) => b.pointsEarned - a.pointsEarned);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-4 ${myCorrect ? 'animate-correct-flash' : 'animate-wrong-flash'}`}>
      <div className="w-full max-w-lg animate-slide-up">
        {question.imageUrl && (
          <div className="flex justify-center mb-3">
            <img src={question.imageUrl} alt="" className="max-h-20 rounded-lg border border-white/20 object-contain" />
          </div>
        )}

        <div className="bg-white/10 rounded-2xl p-4 mb-4 border border-white/20">
          <p className="text-purple-300 text-xs mb-1">{question.category}</p>
          <h2 className="text-lg font-bold text-white">{question.question}</h2>
        </div>

        {/* Answers with player picks */}
        <div className="space-y-2 mb-4 stagger-children">
          {question.answers.map((answer, index) => {
            const isCorrect = index === reveal.correctIndex;
            const playersPicked = reveal.players.filter(p => p.answer === index);
            return (
              <div key={index} className={`p-3 rounded-xl font-medium flex items-center gap-3 transition-all ${
                isCorrect ? 'bg-green-500/30 border-2 border-green-400 text-white animate-scale-in' : 'bg-white/5 border border-white/10 text-white/60'
              }`}>
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold shrink-0 ${
                  isCorrect ? 'bg-green-500 text-white' : 'bg-white/10'
                }`}>{answerLabels[index]}</span>
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

        {/* Scores */}
        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
          <div className="flex flex-wrap justify-center gap-4">
            {sortedPlayers.map((p) => {
              const avatar = AVATARS.find(a => a.id === p.avatarId) || AVATARS[0];
              const isMe = p.id === playerId;
              return (
                <div key={p.id} className={`text-center animate-scale-in ${isMe ? 'ring-2 ring-purple-400 rounded-lg p-2' : 'p-2'}`}>
                  <div className="text-xl">{avatar.emoji}</div>
                  <div className="text-white text-xs font-medium">{p.name}</div>
                  <div className={`text-lg font-bold ${p.pointsEarned > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {p.pointsEarned > 0 ? `+${p.pointsEarned}` : '0'}
                  </div>
                  {p.pointsEarned > 0 && p.answerTime !== null && reveal.speedBonus && (
                    <div className="text-yellow-400 text-[10px] font-semibold">+bonus!</div>
                  )}
                  <div className="text-purple-300 text-xs">{p.score} pkt</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
