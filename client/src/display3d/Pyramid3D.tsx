import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import Character3D from './Character3D';
import { AVATARS } from '../types';

interface Pyramid3DProps {
  players: { id: string; name: string; avatarId: string; position: number }[];
  pyramidSize: number;
  phase: 'intro' | 'question' | 'reveal';
  question?: string;
  answers?: string[];
  correctIndex?: number;
  timeLeft?: number;
  revealPlayers?: { id: string; correct: boolean; newPosition: number }[];
}

export default function Pyramid3D({
  players,
  pyramidSize,
  phase,
  question,
  answers,
  correctIndex,
  timeLeft,
  revealPlayers,
}: Pyramid3DProps) {
  const pyramidRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (pyramidRef.current) {
      pyramidRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  // Build pyramid steps
  const steps = useMemo(() => {
    const s: { y: number; width: number; depth: number; color: string }[] = [];
    for (let i = 0; i < pyramidSize; i++) {
      const ratio = 1 - i / pyramidSize;
      s.push({
        y: i * 0.8,
        width: 6 * ratio + 2,
        depth: 3 * ratio + 1.5,
        color: i === pyramidSize - 1 ? '#FFE033' : `hsl(${270 - i * 20}, 70%, ${30 + i * 8}%)`,
      });
    }
    return s;
  }, [pyramidSize]);

  // Get player positions on the pyramid
  const getPlayerXOnStep = (playerIdx: number, totalOnStep: number, stepWidth: number) => {
    if (totalOnStep === 1) return 0;
    const spacing = Math.min(1.5, (stepWidth - 1) / totalOnStep);
    const startX = -((totalOnStep - 1) * spacing) / 2;
    return startX + playerIdx * spacing;
  };

  // Determine current positions (use revealPlayers if in reveal phase)
  const currentPositions = players.map((p) => {
    if (phase === 'reveal' && revealPlayers) {
      const rp = revealPlayers.find((r) => r.id === p.id);
      if (rp) return { ...p, position: rp.newPosition };
    }
    return p;
  });

  // Group players by step
  const playersByStep: Record<number, typeof currentPositions> = {};
  currentPositions.forEach((p) => {
    if (!playersByStep[p.position]) playersByStep[p.position] = [];
    playersByStep[p.position].push(p);
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Pyramid structure */}
      <group ref={pyramidRef} position={[-1, 0, -2]}>
        {steps.map((step, i) => (
          <mesh key={i} position={[0, step.y + 0.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[step.width, 0.6, step.depth]} />
            <meshStandardMaterial
              color={step.color}
              emissive={step.color}
              emissiveIntensity={i === pyramidSize - 1 ? 0.5 : 0.15}
              metalness={0.4}
              roughness={0.3}
            />
          </mesh>
        ))}

        {/* Crown at top */}
        <mesh position={[0, pyramidSize * 0.8 + 0.8, 0]}>
          <octahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial
            color="#FFE033"
            emissive="#FFE033"
            emissiveIntensity={1.5}
            metalness={0.8}
          />
        </mesh>

        {/* Players on steps */}
        {Object.entries(playersByStep).map(([stepStr, stepPlayers]) => {
          const stepIdx = parseInt(stepStr);
          const step = steps[stepIdx];
          if (!step) return null;
          return stepPlayers.map((p, pi) => {
            const x = getPlayerXOnStep(pi, stepPlayers.length, step.width);
            const reaction =
              phase === 'reveal' && revealPlayers
                ? revealPlayers.find((r) => r.id === p.id)?.correct
                  ? 'correct'
                  : 'wrong'
                : 'idle';
            return (
              <Character3D
                key={p.id}
                avatarId={p.avatarId}
                name={p.name}
                position={[x, step.y + 0.7, step.depth / 2 + 0.3]}
                reaction={reaction as 'idle' | 'correct' | 'wrong'}
                showScore={false}
              />
            );
          });
        })}
      </group>

      {/* Title */}
      <Html position={[0, 6, -2]} center distanceFactor={6} transform>
        <div
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '32px',
            fontWeight: '900',
            color: '#a855f7',
            textShadow: '0 0 30px rgba(168,85,247,0.6)',
            userSelect: 'none',
          }}
        >
          🔺 PIRAMIDA WIEDZY
        </div>
      </Html>

      {/* Question display */}
      {(phase === 'question' || phase === 'reveal') && question && (
        <Html position={[0, 4.5, 1]} center distanceFactor={6} transform>
          <div
            style={{
              width: '500px',
              textAlign: 'center',
              background: 'rgba(10,10,15,0.9)',
              padding: '16px 24px',
              borderRadius: '12px',
              border: '1px solid #a855f7',
            }}
          >
            <div style={{ color: '#f1f5f9', fontSize: '20px', fontFamily: 'Exo 2, sans-serif', fontWeight: '600' }}>
              {question}
            </div>
            {answers && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
                {answers.map((a, i) => {
                  const colors = ['#FF2D78', '#00F5FF', '#FFE033', '#39FF14'];
                  const isCorrect = phase === 'reveal' && correctIndex === i;
                  return (
                    <div
                      key={i}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        background: isCorrect ? 'rgba(57,255,20,0.2)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${isCorrect ? '#39FF14' : colors[i]}`,
                        color: isCorrect ? '#39FF14' : '#e2e8f0',
                        fontSize: '14px',
                        fontFamily: 'Exo 2, sans-serif',
                      }}
                    >
                      {['A', 'B', 'C', 'D'][i]}. {a}
                    </div>
                  );
                })}
              </div>
            )}
            {phase === 'question' && timeLeft !== undefined && (
              <div
                style={{
                  marginTop: '10px',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  fontFamily: 'Orbitron, sans-serif',
                  color: timeLeft <= 3 ? '#FF2D78' : '#FFE033',
                }}
              >
                {timeLeft}s
              </div>
            )}
          </div>
        </Html>
      )}

      {/* Player status legend */}
      <Html position={[5, 2, 0]} center distanceFactor={7} transform>
        <div style={{ width: '160px' }}>
          {currentPositions
            .sort((a, b) => b.position - a.position)
            .map((p) => {
              const avatar = AVATARS.find((a) => a.id === p.avatarId) || AVATARS[0];
              return (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '3px',
                    fontFamily: 'Exo 2, sans-serif',
                  }}
                >
                  <span style={{ fontSize: '14px' }}>{avatar.emoji}</span>
                  <span style={{ color: '#e2e8f0', fontSize: '11px', flex: 1 }}>{p.name}</span>
                  <span
                    style={{
                      color: '#a855f7',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      fontFamily: 'Orbitron',
                    }}
                  >
                    {p.position}/{pyramidSize}
                  </span>
                </div>
              );
            })}
        </div>
      </Html>
    </group>
  );
}
