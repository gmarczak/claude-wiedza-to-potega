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
      <div className="bg-black/80 backdrop-blur-lg rounded-2xl p-4 border border-purple-500/30 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">🎙️</span>
          </div>
          <div>
            <div className="text-purple-400 text-xs font-semibold mb-1">Maks - Prowadzący</div>
            <p className="text-white text-sm leading-relaxed">{displayComment}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
