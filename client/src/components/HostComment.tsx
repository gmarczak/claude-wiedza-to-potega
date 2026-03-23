import { useState, useEffect } from 'react';

interface Props {
  comment: string | null;
}

export default function HostComment({ comment }: Props) {
  const [visible, setVisible] = useState(false);
  const [displayComment, setDisplayComment] = useState('');

  useEffect(() => {
    if (comment) {
      setDisplayComment(comment);
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [comment]);

  if (!visible || !displayComment) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4 animate-slide-up">
      <div className="bg-[#0a0a0f]/90 backdrop-blur-lg p-4 border border-[#00F5FF]/30"
        style={{ boxShadow: '0 0 20px rgba(0,245,255,0.1)' }}>
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 flex items-center justify-center flex-shrink-0 border border-[#00F5FF]/40"
            style={{ backgroundColor: 'rgba(0,245,255,0.08)' }}
          >
            <span className="text-lg">🎙️</span>
          </div>
          <div>
            <div className="font-orbitron text-[#00F5FF]/60 text-xs font-bold mb-1 uppercase tracking-widest">
              Maks — Prowadzący
            </div>
            <p className="text-white/80 text-sm leading-relaxed">{displayComment}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
