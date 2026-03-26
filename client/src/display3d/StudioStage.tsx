import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Neon grid floor + lights + fog backdrop for the quiz show stage
export default function StudioStage() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (gridRef.current) {
      // Subtle grid pulse
      const t = state.clock.elapsedTime;
      gridRef.current.material.opacity = 0.15 + Math.sin(t * 0.5) * 0.05;
    }
  });

  const floorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0a0a0f',
        metalness: 0.8,
        roughness: 0.3,
      }),
    []
  );

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <primitive object={floorMaterial} attach="material" />
      </mesh>

      {/* Neon grid */}
      <gridHelper
        ref={gridRef as React.RefObject<THREE.GridHelper & { material: THREE.Material }>}
        args={[40, 40, '#FFE033', '#1a1a3e']}
        position={[0, 0, 0]}
      />

      {/* Ambient light */}
      <ambientLight intensity={0.3} color="#1a1a3e" />

      {/* Main spotlight from above */}
      <spotLight
        position={[0, 12, 4]}
        angle={0.5}
        penumbra={0.8}
        intensity={2}
        color="#FFE033"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Side lights for neon effect */}
      <pointLight position={[-8, 4, 2]} intensity={1.5} color="#00F5FF" distance={20} />
      <pointLight position={[8, 4, 2]} intensity={1.5} color="#FF2D78" distance={20} />
      <pointLight position={[0, 3, -5]} intensity={1} color="#8b5cf6" distance={15} />

      {/* Back wall with subtle glow */}
      <mesh position={[0, 5, -6]} receiveShadow>
        <planeGeometry args={[30, 12]} />
        <meshStandardMaterial
          color="#0a0a12"
          emissive="#0a0a2e"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Fog for depth */}
      <fog attach="fog" args={['#0a0a0f', 10, 30]} />

      {/* Neon strips on floor edges */}
      <NeonStrip position={[-6, 0.02, 0]} color="#00F5FF" length={12} />
      <NeonStrip position={[6, 0.02, 0]} color="#FF2D78" length={12} />
    </group>
  );
}

function NeonStrip({ position, color, length }: { position: [number, number, number]; color: string; length: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <mesh ref={ref} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.08, length]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}
