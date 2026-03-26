import type { CategoryVoteData, CategoryResultData } from '../types';

interface Props {
  categoryVote: CategoryVoteData | null;
  categoryResult: CategoryResultData | null;
  timeLeft: number;
}

const categoryColors = ['#FF2D78', '#00F5FF', '#FFE033', '#39FF14', '#a855f7', '#f97316'];

export default function DisplayCategoryScreen({ categoryVote, categoryResult, timeLeft }: Props) {
  if (categoryResult) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-[0.04] z-10" />
        <div className="relative z-20 text-center">
          <p className="font-orbitron text-white/30 text-sm uppercase tracking-[0.4em] mb-4">
            Wybrana kategoria
          </p>
          <h2
            className="font-orbitron font-black uppercase tracking-widest text-[#FFE033]"
            style={{
              fontSize: 'clamp(2rem, 6vw, 5rem)',
              textShadow: '0 0 40px rgba(255,224,51,0.5)',
            }}
          >
            {categoryResult.selectedCategory}
          </h2>
          {categoryResult.overrideUsed && categoryResult.overrideBy && (
            <p className="text-[#FF2D78] text-sm mt-4 uppercase tracking-widest">
              Override przez: {categoryResult.overrideBy}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!categoryVote) return null;

  const timerPercent = (timeLeft / categoryVote.timeLimit) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-[0.04] z-10" />

      {/* Timer bar */}
      <div className="relative z-20 w-full h-3 bg-white/10">
        <div
          className="h-full bg-[#00F5FF] transition-all duration-1000 ease-linear"
          style={{ width: `${timerPercent}%`, boxShadow: '0 0 12px rgba(0,245,255,0.6)' }}
        />
      </div>

      <div className="relative z-20 flex-1 flex flex-col items-center justify-center gap-10 px-10">
        <div className="text-center">
          <p className="font-orbitron text-white/30 text-sm uppercase tracking-[0.4em] mb-2">
            Głosowanie na kategorię
          </p>
          <p
            className="font-orbitron font-black text-[#00F5FF]"
            style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', textShadow: '0 0 30px rgba(0,245,255,0.4)' }}
          >
            {timeLeft}s
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full max-w-3xl">
          {categoryVote.categories.map((cat, index) => {
            const color = categoryColors[index % categoryColors.length];
            return (
              <div
                key={cat}
                className="flex items-center justify-center p-6 bg-[#12121a] text-center font-semibold"
                style={{
                  border: `2px solid ${color}50`,
                  color,
                  fontSize: 'clamp(0.9rem, 1.8vw, 1.3rem)',
                }}
              >
                {cat}
              </div>
            );
          })}
        </div>

        <p className="text-white/20 text-sm uppercase tracking-widest">
          Zagłosuj na telefonie
        </p>
      </div>
    </div>
  );
}
