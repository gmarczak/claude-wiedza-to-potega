import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface TimerBar3DProps {
  timeLeft: number;
  maxTime: number;
}

export default function TimerBar3D({ timeLeft, maxTime }: TimerBar3DProps) {
  const barRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const progress = Math.max(0, timeLeft / maxTime);
  const isUrgent = timeLeft <= 5;

  // Color transitions: green → yellow → red
  const getColor = () => {
    if (progress > 0.5) return '#39FF14';
    if (progress > 0.25) return '#FFE033';
    return '#FF2D78';
  };

  useFrame((state) => {
    if (!barRef.current) return;
    const mat = barRef.current.material as THREE.MeshStandardMaterial;
    const color = getColor();
    mat.color.set(color);
    mat.emissive.set(color);

    if (isUrgent) {
      // Pulse when urgent
      mat.emissiveIntensity = 1 + Math.sin(state.clock.elapsedTime * 6) * 0.5;
      if (glowRef.current) {
        glowRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 6) * 0.02;
      }
    } else {
      mat.emissiveIntensity = 0.6;
    }

    // Animate bar width
    const targetWidth = 7 * progress;
    barRef.current.scale.x = THREE.MathUtils.lerp(barRef.current.scale.x, targetWidth, 0.1);
  });

  return (
    <group position={[0, 6.2, -3]}>
      {/* Background bar */}
      <mesh>
        <boxGeometry args={[7.2, 0.2, 0.05]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Progress bar */}
      <mesh ref={barRef} position={[0, 0, 0.03]}>
        <boxGeometry args={[1, 0.16, 0.05]} />
        <meshStandardMaterial
          color="#39FF14"
          emissive="#39FF14"
          emissiveIntensity={0.6}
          metalness={0.3}
        />
      </mesh>

      {/* Glow backdrop */}
      <mesh ref={glowRef} position={[0, 0, -0.02]}>
        <boxGeometry args={[7.4, 0.4, 0.01]} />
        <meshStandardMaterial
          color={getColor()}
          emissive={getColor()}
          emissiveIntensity={0.2}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Time text */}
      <Html position={[3.9, 0, 0.1]} center distanceFactor={6} transform>
        <span
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: isUrgent ? '20px' : '16px',
            fontWeight: 'bold',
            color: getColor(),
            textShadow: `0 0 10px ${getColor()}`,
            transition: 'font-size 0.3s',
          }}
        >
          {timeLeft}s
        </span>
      </Html>
    </group>
  );
}
