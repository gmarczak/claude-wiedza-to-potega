interface Props { count: number; }

export default function CountdownScreen({ count }: Props) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center relative overflow-hidden">
      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-[0.04] z-10" />
      {/* Pulsing glow behind number */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-80 h-80 rounded-full bg-[#FFE033] opacity-[0.05] blur-3xl animate-pulse" />
      </div>

      <div className="text-center relative z-20">
        {count > 0 ? (
          <>
            <p className="font-orbitron text-[#FFE033]/50 text-sm uppercase tracking-[0.4em] mb-6 animate-fade-in">
              Gra zaczyna się za
            </p>
            <div key={count} className="animate-countdown">
              <span className="font-orbitron text-[12rem] font-black leading-none text-[#FFE033] glow-text">
                {count}
              </span>
            </div>
          </>
        ) : (
          <div className="animate-bounce-in">
            <span className="font-orbitron text-7xl font-black text-[#39FF14] glow-text-success tracking-widest uppercase">
              START!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
