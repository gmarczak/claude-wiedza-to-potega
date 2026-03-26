import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleEffectsProps {
  type: 'confetti' | 'sparkle' | 'explosion';
  position?: [number, number, number];
  active: boolean;
  color?: string;
  count?: number;
}

export default function ParticleEffects({
  type,
  position = [0, 3, 0],
  active,
  color,
  count = 80,
}: ParticleEffectsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const velocities = useMemo(() => {
    const vels: { x: number; y: number; z: number; rx: number; ry: number }[] = [];
    for (let i = 0; i < count; i++) {
      if (type === 'confetti') {
        vels.push({
          x: (Math.random() - 0.5) * 0.08,
          y: Math.random() * 0.05 + 0.02,
          z: (Math.random() - 0.5) * 0.08,
          rx: (Math.random() - 0.5) * 0.1,
          ry: (Math.random() - 0.5) * 0.1,
        });
      } else if (type === 'sparkle') {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.03 + 0.01;
        vels.push({
          x: Math.cos(angle) * speed,
          y: Math.random() * 0.04 + 0.02,
          z: Math.sin(angle) * speed,
          rx: 0,
          ry: Math.random() * 0.05,
        });
      } else {
        // explosion
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const speed = Math.random() * 0.15 + 0.05;
        vels.push({
          x: Math.sin(phi) * Math.cos(theta) * speed,
          y: Math.cos(phi) * speed + 0.05,
          z: Math.sin(phi) * Math.sin(theta) * speed,
          rx: (Math.random() - 0.5) * 0.2,
          ry: (Math.random() - 0.5) * 0.2,
        });
      }
    }
    return vels;
  }, [count, type]);

  const colors = useMemo(() => {
    const confettiColors = ['#FF2D78', '#00F5FF', '#FFE033', '#39FF14', '#a855f7', '#f97316'];
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const c = color
        ? new THREE.Color(color)
        : new THREE.Color(confettiColors[Math.floor(Math.random() * confettiColors.length)]);
      arr[i * 3] = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    }
    return arr;
  }, [count, color]);

  const startTime = useRef(0);
  const initialized = useRef(false);

  useFrame((state) => {
    if (!meshRef.current) return;

    if (active && !initialized.current) {
      startTime.current = state.clock.elapsedTime;
      initialized.current = true;
    }
    if (!active) {
      initialized.current = false;
      meshRef.current.visible = false;
      return;
    }

    meshRef.current.visible = true;
    const elapsed = state.clock.elapsedTime - startTime.current;
    const lifetime = type === 'explosion' ? 2 : 4;

    if (elapsed > lifetime) {
      meshRef.current.visible = false;
      return;
    }

    const fade = Math.max(0, 1 - elapsed / lifetime);

    for (let i = 0; i < count; i++) {
      const v = velocities[i];
      const t = elapsed;
      const gravity = type === 'confetti' ? -0.01 : type === 'explosion' ? -0.03 : -0.005;

      dummy.position.set(
        position[0] + v.x * t * 60,
        position[1] + v.y * t * 60 + gravity * t * t * 600,
        position[2] + v.z * t * 60
      );
      dummy.rotation.set(v.rx * t * 60, v.ry * t * 60, 0);
      const s = fade * (type === 'sparkle' ? 0.5 : 1);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const geometry = useMemo(() => {
    if (type === 'sparkle') return new THREE.SphereGeometry(0.05, 4, 4);
    if (type === 'explosion') return new THREE.SphereGeometry(0.08, 6, 6);
    return new THREE.PlaneGeometry(0.1, 0.06); // confetti rectangles
  }, [type]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, undefined, count]}
      visible={false}
    >
      <meshStandardMaterial
        vertexColors
        emissive="#ffffff"
        emissiveIntensity={0.5}
        side={THREE.DoubleSide}
        transparent
      >
        <instancedBufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </meshStandardMaterial>
    </instancedMesh>
  );
}
