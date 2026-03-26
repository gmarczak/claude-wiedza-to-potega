interface Props {
  countdown: number;
}

export default function DisplayCountdownScreen({ countdown }: Props) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-[0.04]" />
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="w-[800px] h-[800px] rounded-full blur-3xl opacity-[0.08] bg-[#facc15]" />
      </div>
      <p className="font-orbitron text-white/20 text-2xl uppercase tracking-[0.5em] mb-4 relative z-10">
        Gra startuje za
      </p>
      <span
        className="font-orbitron font-black text-[#facc15] relative z-10 animate-countdown leading-none"
        style={{
          fontSize: 'clamp(8rem, 30vw, 20rem)',
          textShadow: '0 0 80px rgba(250,204,21,0.6), 0 0 160px rgba(250,204,21,0.3)',
        }}
      >
        {countdown}
      </span>
    </div>
  );
}
