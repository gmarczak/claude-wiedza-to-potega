import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface QuestionBoardProps {
  question: string;
  category: string;
  difficulty: string;
  questionNumber: number;
  totalQuestions: number;
  imageUrl?: string;
}

export default function QuestionBoard({
  question,
  category,
  difficulty,
  questionNumber,
  totalQuestions,
  imageUrl,
}: QuestionBoardProps) {
  const boardRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
    // Subtle float
    if (boardRef.current) {
      boardRef.current.position.y = 4.5 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
  });

  const diffColor = difficulty === 'hard' ? '#FF2D78' : difficulty === 'medium' ? '#FFE033' : '#39FF14';

  return (
    <group ref={boardRef} position={[0, 4.5, -3]}>
      {/* Board background */}
      <mesh ref={glowRef} castShadow>
        <boxGeometry args={[8, 2.5, 0.15]} />
        <meshStandardMaterial
          color="#12121a"
          emissive="#1a1a3e"
          emissiveIntensity={0.3}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Neon border */}
      <lineSegments position={[0, 0, 0.08]}>
        <edgesGeometry args={[new THREE.BoxGeometry(8.05, 2.55, 0.01)]} />
        <lineBasicMaterial color="#FFE033" linewidth={2} />
      </lineSegments>

      {/* Question text (HTML overlay for readability) */}
      <Html position={[0, 0, 0.1]} center distanceFactor={6} transform>
        <div
          style={{
            width: '600px',
            textAlign: 'center',
            fontFamily: 'Exo 2, sans-serif',
            userSelect: 'none',
            padding: '10px',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {category}
            </span>
            <span style={{ color: diffColor, fontSize: '12px', fontWeight: 'bold', fontFamily: 'Orbitron, sans-serif' }}>
              {questionNumber}/{totalQuestions}
            </span>
          </div>

          {/* Question */}
          <div
            style={{
              color: '#f1f5f9',
              fontSize: '22px',
              fontWeight: '600',
              lineHeight: '1.4',
              textShadow: '0 0 10px rgba(0,0,0,0.5)',
            }}
          >
            {question}
          </div>

          {/* Image */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt=""
              style={{
                maxWidth: '200px',
                maxHeight: '120px',
                margin: '8px auto',
                borderRadius: '8px',
                border: '1px solid #FFE033',
              }}
            />
          )}
        </div>
      </Html>
    </group>
  );
}
