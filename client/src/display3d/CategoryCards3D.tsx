import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { CategoryVoteData, CategoryResultData } from '../types';

interface CategoryCards3DProps {
  categoryVote: CategoryVoteData | null;
  categoryResult: CategoryResultData | null;
  timeLeft: number;
}

const CARD_COLORS = ['#FF2D78', '#00F5FF', '#FFE033'];

export default function CategoryCards3D({ categoryVote, categoryResult, timeLeft }: CategoryCards3DProps) {
  if (!categoryVote) return null;

  const categories = categoryVote.categories;
  const selectedCategory = categoryResult?.selectedCategory;

  return (
    <group position={[0, 3, -1]}>
      {/* Title */}
      <Html position={[0, 2.5, 0]} center distanceFactor={6} transform>
        <div
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '28px',
            fontWeight: '900',
            color: '#FFE033',
            textShadow: '0 0 20px rgba(255,224,51,0.5)',
            userSelect: 'none',
          }}
        >
          {categoryResult ? 'WYBRANA KATEGORIA' : 'WYBIERZ KATEGORIĘ'}
        </div>
      </Html>

      {/* Timer */}
      {!categoryResult && (
        <Html position={[0, 1.8, 0]} center distanceFactor={6} transform>
          <div
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '24px',
              fontWeight: 'bold',
              color: timeLeft <= 3 ? '#FF2D78' : '#00F5FF',
              textShadow: `0 0 15px ${timeLeft <= 3 ? '#FF2D78' : '#00F5FF'}`,
            }}
          >
            {timeLeft}s
          </div>
        </Html>
      )}

      {/* Category cards */}
      {categories.map((cat, i) => (
        <CategoryCard
          key={cat}
          category={cat}
          index={i}
          total={categories.length}
          color={CARD_COLORS[i % CARD_COLORS.length]}
          isSelected={selectedCategory === cat}
          isRevealed={!!categoryResult}
        />
      ))}

      {/* Override info */}
      {categoryResult?.overrideUsed && (
        <Html position={[0, -1.5, 0]} center distanceFactor={6} transform>
          <div
            style={{
              fontFamily: 'Exo 2, sans-serif',
              fontSize: '16px',
              color: '#f97316',
              textShadow: '0 0 10px rgba(249,115,22,0.5)',
            }}
          >
            ⚡ Przełamanie użyte!
          </div>
        </Html>
      )}
    </group>
  );
}

function CategoryCard({
  category,
  index,
  total,
  color,
  isSelected,
  isRevealed,
}: {
  category: string;
  index: number;
  total: number;
  color: string;
  isSelected: boolean;
  isRevealed: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Spread cards horizontally
  const spacing = 3;
  const xOffset = (index - (total - 1) / 2) * spacing;

  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return;
    const t = state.clock.elapsedTime;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;

    if (isRevealed) {
      if (isSelected) {
        // Selected card pulses and moves forward
        mat.emissiveIntensity = 0.8 + Math.sin(t * 3) * 0.3;
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, 1, 0.05);
        groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, 1.2, 0.05));
      } else {
        // Non-selected cards fade and shrink
        mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0.05, 0.05);
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.3, 0.05);
        groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, 0.8, 0.05));
      }
    } else {
      // Idle hover animation
      groupRef.current.position.y = Math.sin(t * 1.2 + index * 1.5) * 0.15;
      groupRef.current.rotation.y = Math.sin(t * 0.5 + index) * 0.08;
      mat.emissiveIntensity = 0.3 + Math.sin(t * 2 + index) * 0.1;
      mat.opacity = 1;
    }
  });

  return (
    <group ref={groupRef} position={[xOffset, 0, 0]}>
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[2.2, 1.2, 0.12]} />
        <meshStandardMaterial
          color={isRevealed && !isSelected ? '#2a2a3a' : color}
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.3}
          roughness={0.4}
          transparent
        />
      </mesh>

      {/* Border glow */}
      <lineSegments position={[0, 0, 0.065]}>
        <edgesGeometry args={[new THREE.BoxGeometry(2.25, 1.25, 0.01)]} />
        <lineBasicMaterial color={color} transparent opacity={isRevealed && !isSelected ? 0.2 : 0.8} />
      </lineSegments>

      <Html center distanceFactor={6} transform position={[0, 0, 0.08]}>
        <div
          style={{
            textAlign: 'center',
            fontFamily: 'Exo 2, sans-serif',
            userSelect: 'none',
            width: '160px',
          }}
        >
          <div
            style={{
              color: '#f1f5f9',
              fontSize: '16px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              opacity: isRevealed && !isSelected ? 0.3 : 1,
              transition: 'opacity 0.5s',
            }}
          >
            {category}
          </div>
          {isSelected && (
            <div style={{ color: '#39FF14', fontSize: '12px', marginTop: '4px', fontWeight: 'bold' }}>
              ✓ WYBRANO
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
