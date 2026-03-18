import type { QuestionData, RevealData } from '../types';
import { AVATARS } from '../types';

interface Props {
  question: QuestionData;
  reveal: RevealData;
  playerId: string;
}

const answerLabels = ['A', 'B', 'C', 'D'];

export default function RevealScreen({ question, reveal, playerId }: Props) {
  const me = reveal.players.find((p) => p.id === playerId);
  const opponent = reveal.players.find((p) => p.id !== playerId);
  const meAvatar = AVATARS.find((a) => a.id === me?.avatarId) || AVATARS[0];
  const oppAvatar = AVATARS.find((a) => a.id === opponent?.avatarId) || AVATARS[1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg animate-slide-up">
        {question.imageUrl && (
          <div className="flex justify-center mb-3">
            <img src={question.imageUrl} alt="" className="max-h-24 rounded-lg border border-white/20 object-contain" />
          </div>
        )}

        <div className="bg-white/10 rounded-2xl p-5 mb-4 border border-white/20">
          <p className="text-purple-300 text-xs mb-1">{question.category}</p>
          <h2 className="text-lg font-bold text-white">{question.question}</h2>
        </div>

        <div className="space-y-2 mb-4">
          {question.answers.map((answer, index) => {
            const isCorrect = index === reveal.correctIndex;
            const myPick = me?.answer === index;
            const oppPick = opponent?.answer === index;
            return (
              <div key={index} className={`p-3 rounded-xl font-medium flex items-center gap-3 transition-all ${
                isCorrect ? 'bg-green-500/30 border-2 border-green-400 text-white' : 'bg-white/5 border border-white/10 text-white/60'
              }`}>
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${
                  isCorrect ? 'bg-green-500 text-white' : 'bg-white/10'
                }`}>{answerLabels[index]}</span>
                <span className="flex-1">{answer}</span>
                <div className="flex gap-1">
                  {myPick && <span className="text-lg">{meAvatar.emoji}</span>}
                  {oppPick && <span className="text-lg">{oppAvatar.emoji}</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Score with speed bonus */}
        <div className="flex justify-between items-center bg-white/10 rounded-xl p-4 border border-white/20">
          <div className="text-center">
            <div className="text-lg">{meAvatar.emoji}</div>
            <div className={`text-2xl font-bold ${me?.pointsEarned ? 'text-green-400' : 'text-red-400'}`}>
              {me?.pointsEarned ? `+${me.pointsEarned}` : '0'}
            </div>
            {me?.pointsEarned && me.answerTime !== null && reveal.speedBonus && (
              <div className="text-yellow-400 text-xs font-semibold">+ bonus szybkości!</div>
            )}
            <div className="text-purple-300 text-xs mt-1">Łącznie: {me?.score}</div>
          </div>
          <div className="text-white/40 font-bold text-lg">VS</div>
          <div className="text-center">
            <div className="text-lg">{oppAvatar.emoji}</div>
            <div className={`text-2xl font-bold ${opponent?.pointsEarned ? 'text-green-400' : 'text-red-400'}`}>
              {opponent?.pointsEarned ? `+${opponent.pointsEarned}` : '0'}
            </div>
            {opponent?.pointsEarned && opponent.answerTime !== null && reveal.speedBonus && (
              <div className="text-yellow-400 text-xs font-semibold">+ bonus szybkości!</div>
            )}
            <div className="text-purple-300 text-xs mt-1">Łącznie: {opponent?.score}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
