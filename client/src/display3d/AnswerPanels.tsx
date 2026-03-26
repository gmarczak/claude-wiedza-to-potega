import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const ANSWER_COLORS = ['#FF2D78', '#00F5FF', '#FFE033', '#39FF14'];
const ANSWER_LABELS = ['A', 'B', 'C', 'D'];

interface AnswerPanelsProps {
  answers: string[];
  correctIndex?: number | null; // null = not revealed yet
  phase: 'question' | 'reveal';
}

export default function AnswerPanels({ answers, correctIndex, phase }: AnswerPanelsProps) {
  return (
    <group position={[0, 1.5, -1.5]}>
      {answers.map((answer, i) => (
        <AnswerPanel
          key={i}
          index={i}
          answer={answer}
          label={ANSWER_LABELS[i]}
          color={ANSWER_COLORS[i]}
          isCorrect={correctIndex === i}
          isRevealed={phase === 'reveal'}
          position={[
            (i % 2 === 0 ? -2.2 : 2.2),
            i < 2 ? 0.7 : -0.7,
            0,
          ]}
        />
      ))}
    </group>
  );
}

interface AnswerPanelProps {
  index: number;
  answer: string;
  label: string;
  color: string;
  isCorrect: boolean;
  isRevealed: boolean;
  position: [number, number, number];
}

function AnswerPanel({ answer, label, color, isCorrect, isRevealed, position }: AnswerPanelProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [animProgress, setAnimProgress] = useState(0);

  useEffect(() => {
    setAnimProgress(0);
  }, [isRevealed]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const t = state.clock.elapsedTime;

    if (isRevealed) {
      setAnimProgress((p) => Math.min(p + delta * 2, 1));
      if (isCorrect) {
        // Correct: glow bright + pulse
        mat.emissiveIntensity = 1 + Math.sin(t * 4) * 0.5;
        meshRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.03);
      } else {
        // Wrong: fade out
        mat.emissiveIntensity = Math.max(0.05, 0.3 - animProgress * 0.25);
        mat.opacity = Math.max(0.3, 1 - animProgress * 0.7);
        meshRef.current.scale.setScalar(1 - animProgress * 0.05);
      }
    } else {
      // Question phase: gentle hover
      mat.emissiveIntensity = 0.3 + Math.sin(t * 1.5 + position[0]) * 0.1;
      mat.opacity = 1;
      meshRef.current.scale.setScalar(1);
    }
  });

  return (
    <group position={position}>
      {/* Panel background */}
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[3.8, 1, 0.12]} />
        <meshStandardMaterial
          color={isRevealed && !isCorrect ? '#2a2a3a' : color}
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.3}
          roughness={0.4}
          transparent
        />
      </mesh>

      {/* Answer text */}
      <Html position={[0, 0, 0.08]} center distanceFactor={7} transform>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontFamily: 'Exo 2, sans-serif',
            userSelect: 'none',
            opacity: isRevealed && !isCorrect ? 0.4 : 1,
            transition: 'opacity 0.5s',
          }}
        >
          <span
            style={{
              color: '#0a0a0f',
              background: color,
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '16px',
              fontFamily: 'Orbitron, sans-serif',
              flexShrink: 0,
            }}
          >
            {label}
          </span>
          <span
            style={{
              color: '#f1f5f9',
              fontSize: '16px',
              fontWeight: '600',
              maxWidth: '280px',
              textShadow: '0 0 8px rgba(0,0,0,0.5)',
            }}
          >
            {answer}
          </span>
        </div>
      </Html>

      {/* Correct answer checkmark */}
      {isRevealed && isCorrect && (
        <Html position={[1.7, 0, 0.1]} center distanceFactor={7} transform>
          <span style={{ fontSize: '28px' }}>✅</span>
        </Html>
      )}
    </group>
  );
}
