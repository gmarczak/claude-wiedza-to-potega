import { Html } from '@react-three/drei';
import type { PlayerInfo } from '../types';
import { AVATARS } from '../types';

interface ScoreBoard3DProps {
  players: PlayerInfo[];
  highlightId?: string; // highlight winner or current leader
}

export default function ScoreBoard3D({ players, highlightId }: ScoreBoard3DProps) {
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <group position={[5.5, 4, -2]}>
      {/* Background panel */}
      <mesh>
        <boxGeometry args={[2.8, 0.5 + sorted.length * 0.55, 0.08]} />
        <meshStandardMaterial
          color="#0a0a12"
          emissive="#1a1a3e"
          emissiveIntensity={0.2}
          transparent
          opacity={0.85}
          metalness={0.5}
        />
      </mesh>

      <Html center distanceFactor={6} transform>
        <div
          style={{
            width: '220px',
            fontFamily: 'Exo 2, sans-serif',
            userSelect: 'none',
          }}
        >
          {/* Header */}
          <div
            style={{
              textAlign: 'center',
              color: '#FFE033',
              fontSize: '13px',
              fontWeight: 'bold',
              fontFamily: 'Orbitron, sans-serif',
              marginBottom: '8px',
              letterSpacing: '0.1em',
            }}
          >
            RANKING
          </div>

          {/* Players */}
          {sorted.map((player, i) => {
            const avatar = AVATARS.find((a) => a.id === player.avatarId) || AVATARS[0];
            const isHighlighted = player.id === highlightId;
            return (
              <div
                key={player.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 6px',
                  borderRadius: '4px',
                  background: isHighlighted ? 'rgba(255,224,51,0.15)' : 'transparent',
                  marginBottom: '2px',
                }}
              >
                <span style={{ fontSize: '11px', color: '#64748b', width: '14px', fontWeight: 'bold' }}>
                  {i + 1}.
                </span>
                <span style={{ fontSize: '16px' }}>{avatar.emoji}</span>
                <span
                  style={{
                    color: isHighlighted ? '#FFE033' : '#e2e8f0',
                    fontSize: '12px',
                    fontWeight: isHighlighted ? 'bold' : 'normal',
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {player.name}
                </span>
                <span
                  style={{
                    color: '#FFE033',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    fontFamily: 'Orbitron, sans-serif',
                  }}
                >
                  {player.score}
                </span>
              </div>
            );
          })}
        </div>
      </Html>
    </group>
  );
}
