import { useState } from 'react';
import type { QuestionData, RoomState } from '../types';

interface Props {
  question: QuestionData;
  timeLeft: number;
  room: RoomState;
  playerId: string;
  onAnswer: (index: number) => void;
}

const answerColors = [
  'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
  'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
  'from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
  'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
];

const answerLabels = ['A', 'B', 'C', 'D'];

const difficultyLabels: Record<string, { text: string; color: string }> = {
  easy: { text: 'Łatwe', color: 'bg-green-500/20 text-green-300' },
  medium: { text: 'Średnie', color: 'bg-yellow-500/20 text-yellow-300' },
  hard: { text: 'Trudne', color: 'bg-red-500/20 text-red-300' },
};

export default function QuestionScreen({ question, timeLeft, room, playerId, onAnswer }: Props) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    onAnswer(index);
  };

  const timerPercent = (timeLeft / question.timeLimit) * 100;
  const timerColor = timeLeft <= 5 ? 'bg-red-500' : timeLeft <= 10 ? 'bg-yellow-500' : 'bg-green-500';
  const difficulty = difficultyLabels[question.difficulty] || difficultyLabels.easy;

  const me = room.players.find(p => p.id === playerId);
  const opponent = room.players.find(p => p.id !== playerId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col">
      {/* Header */}
      <div className="p-4">
        {/* Score bar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold">
              {me?.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-white font-semibold">{me?.score || 0}</span>
          </div>
          <div className="text-purple-300 text-sm font-medium">
            {question.questionNumber} / {question.totalQuestions}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">{opponent?.score || 0}</span>
            <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-sm font-bold">
              {opponent?.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Timer bar */}
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full ${timerColor} rounded-full transition-all duration-1000 ease-linear`}
            style={{ width: `${timerPercent}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className={`text-sm font-mono font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-white'}`}>
            {timeLeft}s
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${difficulty.color}`}>
            {difficulty.text}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center px-4 pb-4">
        <div className="mb-2 text-center">
          <span className="text-purple-300 text-xs font-medium">{question.category}</span>
        </div>
        <div className="bg-white/10 rounded-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-xl md:text-2xl font-bold text-white text-center leading-relaxed">
            {question.question}
          </h2>
        </div>

        {/* Answers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
              className={`relative p-4 rounded-xl font-semibold text-white text-left transition-all ${
                selectedAnswer === index
                  ? 'ring-4 ring-white scale-95 bg-gradient-to-r ' + answerColors[index]
                  : selectedAnswer !== null
                  ? 'opacity-50 bg-gradient-to-r ' + answerColors[index]
                  : 'bg-gradient-to-r ' + answerColors[index] + ' hover:scale-[1.02] active:scale-95 shadow-lg'
              }`}
            >
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/20 text-sm font-bold mr-3">
                {answerLabels[index]}
              </span>
              {answer}
            </button>
          ))}
        </div>

        {selectedAnswer !== null && (
          <p className="text-center text-purple-300 mt-4 animate-slide-up">
            Odpowiedź zapisana! Czekam na przeciwnika...
          </p>
        )}
      </div>
    </div>
  );
}
