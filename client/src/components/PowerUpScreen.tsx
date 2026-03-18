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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Zagrywka!</h2>
          <p className="text-purple-300 text-sm">
            {chosenPowerUp && data.opponents.length > 1 && !chosenTarget
              ? 'Wybierz cel zagrywki'
              : selectedOpponentName
                ? <>Utrudnij odpowiedź dla <span className="text-white font-semibold">{selectedOpponentName}</span></>
                : 'Wybierz zagrywkę'}
          </p>
          <div className={`text-lg font-mono font-bold mt-2 ${timeLeft <= 3 ? 'text-red-400' : 'text-white'}`}>
            {timeLeft}s
          </div>
        </div>

        {/* Show target selection if power-up chosen and multiple opponents */}
        {chosenPowerUp && data.opponents.length > 1 && !chosenTarget ? (
          <div className="space-y-3 mb-4">
            {data.opponents.map((opp) => (
              <button key={opp.id} onClick={() => handleSelectTarget(opp.id)} disabled={selected}
                className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${
                  selected ? 'opacity-50 bg-white/10' : 'bg-white/10 hover:bg-white/20 border border-white/20 hover:border-purple-400'
                }`}>
                <span className="text-2xl">🎯</span>
                <div className="text-left">
                  <div className="text-white font-semibold">{opp.name}</div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3 mb-4">
            {data.availablePowerUps.map((pu) => (
              <button key={pu.type} onClick={() => handleSelectPowerUp(pu.type)} disabled={selected}
                className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${
                  selected ? 'opacity-50 bg-white/10'
                    : chosenPowerUp === pu.type ? 'bg-purple-500/30 border border-purple-400'
                    : 'bg-white/10 hover:bg-white/20 border border-white/20 hover:border-purple-400'
                }`}>
                <span className="text-3xl">{pu.emoji}</span>
                <div className="text-left">
                  <div className="text-white font-semibold">{pu.name}</div>
                  <div className="text-purple-300 text-xs">{pu.description}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        <button onClick={handleSkip} disabled={selected}
          className="w-full py-3 text-purple-300 hover:text-white transition-colors disabled:opacity-50">
          Pomiń zagrywkę
        </button>
      </div>
    </div>
  );
}
