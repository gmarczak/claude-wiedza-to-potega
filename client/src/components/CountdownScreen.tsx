interface Props {
  count: number;
}

export default function CountdownScreen({ count }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-purple-300 text-xl mb-4 font-semibold">Gra zaczyna się za</p>
        <div key={count} className="animate-countdown">
          <span className="text-9xl font-black text-white text-shadow">
            {count}
          </span>
        </div>
      </div>
    </div>
  );
}
