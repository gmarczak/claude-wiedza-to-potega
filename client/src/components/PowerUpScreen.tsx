import { useState, useEffect } from 'react';
import type { PowerUpPhaseData, PowerUpType } from '../types';

interface Props {
  data: PowerUpPhaseData;
  timeLeft: number;
  onSelect: (powerUp: PowerUpType, targetId: string) => void;
  onSkip: () => void;
}

export default function PowerUpScreen({ data, timeLeft, onSelect, onSkip }: Props) {
  const [selected, setSelected] = useState(false);
  const [chosenPowerUp, setChosenPowerUp] = useState<PowerUpType | null>(null);
  const [chosenTarget, setChosenTarget] = useState<string | null>(null);

  // Reset state when new power-up phase arrives
  useEffect(() => {
    setSelected(false);
    setChosenPowerUp(null);
    setChosenTarget(null);
  }, [data]);

  // Auto-select target if only one opponent
  useEffect(() => {
    if (data.opponents.length === 1) {
      setChosenTarget(data.opponents[0].id);
    }
  }, [data.opponents]);

  const handleSelectPowerUp = (type: PowerUpType) => {
    if (selected) return;
    setChosenPowerUp(type);

    // If only one opponent, send immediately
    if (data.opponents.length === 1) {
      setSelected(true);
      onSelect(type, data.opponents[0].id);
    }
  };

  const handleSelectTarget = (targetId: string) => {
    if (selected || !chosenPowerUp) return;
    setChosenTarget(targetId);
    setSelected(true);
    onSelect(chosenPowerUp, targetId);
  };

  const handleSkip = () => {
    if (selected) return;
    setSelected(true);
    onSkip();
  };

  const selectedOpponentName = data.opponents.length === 1
    ? data.opponents[0].name
    : chosenTarget
      ? data.opponents.find((o) => o.id === chosenTarget)?.name
      : null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-[0.04] z-10" />
      {/* Ambient magenta glow — powerup vibe */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-64 bg-[#FF2D78] opacity-[0.04] blur-3xl" />

      <div className="w-full max-w-md animate-slide-up relative z-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-orbitron text-3xl font-black uppercase tracking-widest text-[#FF2D78] glow-text-danger mb-2">
            Zagrywka!
          </h2>
          <p className="text-white/40 text-xs uppercase tracking-widest">
            {chosenPowerUp && data.opponents.length > 1 && !chosenTarget
              ? 'Wybierz cel zagrywki'
              : selectedOpponentName
                ? <>Utrudnij odpowiedź dla <span className="text-[#FF2D78]">{selectedOpponentName}</span></>
                : 'Wybierz zagrywkę'}
          </p>
          <div className={`font-orbitron text-2xl font-bold mt-3 tracking-widest transition-colors duration-300 ${
            timeLeft <= 3 ? 'text-[#FF2D78] glow-text-danger animate-timer-urgent' : 'text-[#00F5FF] glow-text-cyan'
          }`}>
            {timeLeft}s
          </div>
        </div>

        {/* Target selection */}
        {chosenPowerUp && data.opponents.length > 1 && !chosenTarget ? (
          <div className="space-y-3 mb-5">
            {data.opponents.map((opp) => (
              <button
                key={opp.id}
                onClick={() => handleSelectTarget(opp.id)}
                disabled={selected}
                className={`w-full p-4 flex items-center gap-4 transition-all duration-200 ${
                  selected
                    ? 'opacity-30 border border-white/10 cursor-not-allowed'
                    : 'border border-[#FF2D78]/40 bg-[#12121a] hover:border-[#FF2D78] hover:bg-[#FF2D78]/5 hover:shadow-[0_0_12px_rgba(255,45,120,0.3)]'
                }`}
              >
                <span className="text-2xl">🎯</span>
                <div className="text-left">
                  <div className="text-white font-semibold tracking-wide">{opp.name}</div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* Power-up selection */
          <div className="space-y-3 mb-5">
            {data.availablePowerUps.map((pu) => (
              <button
                key={pu.type}
                onClick={() => handleSelectPowerUp(pu.type)}
                disabled={selected}
                className={`w-full p-4 flex items-center gap-4 transition-all duration-200 ${
                  selected
                    ? 'opacity-30 border border-white/10 cursor-not-allowed'
                    : chosenPowerUp === pu.type
                    ? 'border-2 border-[#FF2D78] bg-[#FF2D78]/10 shadow-[0_0_16px_rgba(255,45,120,0.4)]'
                    : 'border border-[#FF2D78]/30 bg-[#12121a] hover:border-[#FF2D78]/70 hover:bg-[#FF2D78]/5 hover:shadow-[0_0_10px_rgba(255,45,120,0.2)]'
                }`}
              >
                <span className="text-3xl">{pu.emoji}</span>
                <div className="text-left">
                  <div className="text-white font-semibold tracking-wide">{pu.name}</div>
                  <div className="text-[#FF2D78]/60 text-xs mt-0.5">{pu.description}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={handleSkip}
          disabled={selected}
          className="w-full py-3 text-white/25 hover:text-[#FFE033] uppercase tracking-widest text-sm transition-colors duration-200 disabled:opacity-30"
        >
          Pomiń zagrywkę
        </button>
      </div>
    </div>
  );
}
