import type { QuestionData, RevealData } from '../types';

interface Props {
  question: QuestionData;
  reveal: RevealData;
  playerId: string;
}

const answerLabels = ['A', 'B', 'C', 'D'];

export default function RevealScreen({ question, reveal, playerId }: Props) {
  const me = reveal.players.find(p => p.id === playerId);
  const opponent = reveal.players.find(p => p.id !== playerId);

  const myCorrect = me?.answer === reveal.correctIndex;
  const opponentCorrect = opponent?.answer === reveal.correctIndex;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg animate-slide-up">
        {/* Question */}
        <div className="bg-white/10 rounded-2xl p-5 mb-6 border border-white/20">
          <p className="text-purple-300 text-xs mb-1">{question.category}</p>
          <h2 className="text-lg font-bold text-white">{question.question}</h2>
        </div>

        {/* Answers with reveal */}
        <div className="space-y-2 mb-6">
          {question.answers.map((answer, index) => {
            const isCorrect = index === reveal.correctIndex;
            const myPick = me?.answer === index;
            const oppPick = opponent?.answer === index;

            return (
              <div
                key={index}
                className={`p-3 rounded-xl font-medium flex items-center gap-3 transition-all ${
                  isCorrect
                    ? 'bg-green-500/30 border-2 border-green-400 text-white'
                    : 'bg-white/5 border border-white/10 text-white/60'
                }`}
              >
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${
                  isCorrect ? 'bg-green-500 text-white' : 'bg-white/10'
                }`}>
                  {answerLabels[index]}
                </span>
                <span className="flex-1">{answer}</span>
                <div className="flex gap-1">
                  {myPick && (
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                      myCorrect ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'
                    }`}>
                      {me?.name}
                    </span>
                  )}
                  {oppPick && (
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                      opponentCorrect ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'
                    }`}>
                      {opponent?.name}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Score update */}
        <div className="flex justify-between items-center bg-white/10 rounded-xl p-4 border border-white/20">
          <div className="text-center">
            <div className={`text-2xl font-bold ${myCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {myCorrect ? '+' : ''}{me?.score || 0}
            </div>
            <div className="text-purple-300 text-sm">{me?.name}</div>
          </div>
          <div className="text-white/40 font-bold text-lg">VS</div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${opponentCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {opponentCorrect ? '+' : ''}{opponent?.score || 0}
            </div>
            <div className="text-purple-300 text-sm">{opponent?.name}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
