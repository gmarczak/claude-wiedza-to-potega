import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface CountdownOverlayProps {
  countdown: number; // 3, 2, 1, 0
}

export default function CountdownOverlay({ countdown }: CountdownOverlayProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [displayNum, setDisplayNum] = useState(countdown);
  const animProgress = useRef(0);

  useEffect(() => {
    setDisplayNum(countdown);
    animProgress.current = 0;
  }, [countdown]);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;
    animProgress.current += delta * 2;

    // Scale in then scale out
    const p = animProgress.current;
    if (p < 0.3) {
      // Scale in with bounce
      const t = p / 0.3;
      const scale = t * (2 - t) * 1.5; // overshoot bounce
      groupRef.current.scale.setScalar(scale);
    } else if (p < 0.8) {
      // Hold
      groupRef.current.scale.setScalar(1.5);
    } else {
      // Fade out / shrink
      const t = (p - 0.8) / 0.2;
      groupRef.current.scale.setScalar(Math.max(0, 1.5 * (1 - t)));
    }

    // Rotation
    groupRef.current.rotation.y = Math.sin(p * 2) * 0.1;
  });

  const isGo = displayNum === 0;
  const text = isGo ? 'START!' : String(displayNum);
  const color = isGo ? '#39FF14' : '#FFE033';

  return (
    <group ref={groupRef} position={[0, 3, 0]}>
      {/* Glow sphere behind number */}
      <mesh>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Number display */}
      <Html center distanceFactor={5} transform>
        <div
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: isGo ? '80px' : '120px',
            fontWeight: '900',
            color: color,
            textShadow: `0 0 40px ${color}, 0 0 80px ${color}`,
            userSelect: 'none',
            lineHeight: 1,
          }}
        >
          {text}
        </div>
      </Html>
    </group>
  );
}
