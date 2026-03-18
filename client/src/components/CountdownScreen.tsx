interface Props { count: number; }

export default function CountdownScreen({ count }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="text-center">
        {count > 0 ? (
          <>
            <p className="text-purple-300 text-xl mb-4 font-semibold animate-fade-in">Gra zaczyna się za</p>
            <div key={count} className="animate-countdown">
              <span className="text-[10rem] font-black text-white text-shadow-lg leading-none">{count}</span>
            </div>
          </>
        ) : (
          <div className="animate-bounce-in">
            <span className="text-7xl font-black text-yellow-400 text-shadow-lg">START!</span>
          </div>
        )}
      </div>
    </div>
  );
}
