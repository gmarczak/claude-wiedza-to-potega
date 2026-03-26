import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { AVATAR_CONFIGS, type AvatarConfig } from './CharacterModels';

interface Character3DProps {
  avatarId: string;
  name: string;
  position: [number, number, number];
  score?: number;
  reaction?: 'idle' | 'correct' | 'wrong' | 'hit' | 'celebrate';
  answered?: boolean;
  showScore?: boolean;
  delay?: number; // entrance delay in seconds
}

export default function Character3D({
  avatarId,
  name,
  position,
  score = 0,
  reaction = 'idle',
  answered = false,
  showScore = true,
  delay = 0,
}: Character3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const [visible, setVisible] = useState(delay === 0);
  const [currentReaction, setCurrentReaction] = useState(reaction);
  const reactionTimer = useRef(0);

  const config: AvatarConfig = AVATAR_CONFIGS[avatarId] || AVATAR_CONFIGS['robot'];

  // Entrance delay
  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setVisible(true), delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  // Handle reaction changes
  useEffect(() => {
    setCurrentReaction(reaction);
    reactionTimer.current = 0;
  }, [reaction]);

  // Create emoji texture for the head
  const emojiTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = config.color;
    ctx.beginPath();
    ctx.arc(64, 64, 64, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '64px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(config.emoji, 64, 64);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [config.emoji, config.color]);

  useFrame((state, delta) => {
    if (!groupRef.current || !visible) return;

    const t = state.clock.elapsedTime;
    reactionTimer.current += delta;

    // Reset reaction after 2 seconds
    if (currentReaction !== 'idle' && currentReaction !== 'celebrate' && reactionTimer.current > 2) {
      setCurrentReaction('idle');
    }

    switch (currentReaction) {
      case 'idle': {
        // Gentle floating bob
        groupRef.current.position.y = position[1] + Math.sin(t * 1.5 + position[0]) * 0.08;
        // Slight rotation
        groupRef.current.rotation.y = Math.sin(t * 0.5 + position[0] * 2) * 0.1;
        // Arm swing
        if (leftArmRef.current) leftArmRef.current.rotation.z = Math.sin(t * 1.2) * 0.15 + 0.3;
        if (rightArmRef.current) rightArmRef.current.rotation.z = -Math.sin(t * 1.2) * 0.15 - 0.3;
        break;
      }
      case 'correct': {
        // Jump animation
        const jumpProgress = reactionTimer.current;
        const jumpHeight = Math.max(0, Math.sin(jumpProgress * 4) * 1.5) * Math.max(0, 1 - jumpProgress * 0.5);
        groupRef.current.position.y = position[1] + jumpHeight;
        groupRef.current.rotation.y += delta * 6; // spin
        // Arms up
        if (leftArmRef.current) leftArmRef.current.rotation.z = -1.2;
        if (rightArmRef.current) rightArmRef.current.rotation.z = 1.2;
        break;
      }
      case 'wrong': {
        // Shake + shrink
        const shake = Math.sin(reactionTimer.current * 20) * 0.1 * Math.max(0, 1 - reactionTimer.current);
        groupRef.current.position.x = position[0] + shake;
        const shrink = 1 - Math.sin(reactionTimer.current * 2) * 0.15;
        groupRef.current.scale.setScalar(shrink);
        // Arms drooped
        if (leftArmRef.current) leftArmRef.current.rotation.z = 0.5;
        if (rightArmRef.current) rightArmRef.current.rotation.z = -0.5;
        break;
      }
      case 'hit': {
        // Flash + wobble from power-up
        const wobble = Math.sin(reactionTimer.current * 15) * 0.2 * Math.max(0, 1 - reactionTimer.current * 0.5);
        groupRef.current.rotation.z = wobble;
        if (bodyRef.current) {
          const mat = bodyRef.current.material as THREE.MeshStandardMaterial;
          mat.emissiveIntensity = Math.abs(Math.sin(reactionTimer.current * 10)) * 2;
        }
        break;
      }
      case 'celebrate': {
        // Bounce + wave
        groupRef.current.position.y = position[1] + Math.abs(Math.sin(t * 3)) * 0.5;
        groupRef.current.rotation.y = Math.sin(t * 2) * 0.3;
        if (leftArmRef.current) leftArmRef.current.rotation.z = Math.sin(t * 4) * 0.5 - 1;
        if (rightArmRef.current) rightArmRef.current.rotation.z = -Math.sin(t * 4 + 1) * 0.5 + 1;
        break;
      }
    }

    // Reset scale for non-wrong reactions
    if (currentReaction !== 'wrong') {
      groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
    // Reset position.x
    if (currentReaction !== 'wrong') {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, position[0], 0.1);
    }
    // Reset rotation.z
    if (currentReaction !== 'hit') {
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.1);
    }
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={position}>
      {/* Pedestal / platform */}
      <mesh position={[0, -0.1, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.5, 0.6, 0.15, 16]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive={config.color}
          emissiveIntensity={0.3}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Body (capsule shape via cylinder + spheres) */}
      <mesh
        ref={bodyRef}
        position={[0, 0.7, 0]}
        scale={config.bodyScale}
        castShadow
      >
        <capsuleGeometry args={[0.3, 0.5, 8, 16]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.color}
          emissiveIntensity={config.emissiveIntensity}
          metalness={0.2}
          roughness={0.6}
        />
      </mesh>

      {/* Head (sphere with emoji texture) */}
      <mesh
        ref={headRef}
        position={[0, 1.5, 0]}
        scale={[config.headScale, config.headScale, config.headScale]}
        castShadow
      >
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial
          map={emojiTexture}
          emissive={config.color}
          emissiveIntensity={config.emissiveIntensity * 0.5}
        />
      </mesh>

      {/* Left Arm */}
      <mesh ref={leftArmRef} position={[-0.45, 0.8, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.3, 4, 8]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.color}
          emissiveIntensity={config.emissiveIntensity * 0.5}
        />
      </mesh>

      {/* Right Arm */}
      <mesh ref={rightArmRef} position={[0.45, 0.8, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.3, 4, 8]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.color}
          emissiveIntensity={config.emissiveIntensity * 0.5}
        />
      </mesh>

      {/* Accessory */}
      {config.accessory && (
        <Accessory
          type={config.accessory}
          color={config.accessoryColor || config.color}
          headScale={config.headScale}
        />
      )}

      {/* Answered indicator */}
      {answered && (
        <mesh position={[0, 2.1, 0]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial
            color="#39FF14"
            emissive="#39FF14"
            emissiveIntensity={2}
          />
        </mesh>
      )}

      {/* Name + Score label (HTML overlay) */}
      <Html position={[0, -0.4, 0]} center distanceFactor={8}>
        <div
          style={{
            textAlign: 'center',
            fontFamily: 'Orbitron, sans-serif',
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              color: '#fff',
              fontSize: '14px',
              fontWeight: 'bold',
              textShadow: '0 0 8px rgba(0,0,0,0.8)',
            }}
          >
            {name}
          </div>
          {showScore && (
            <div
              style={{
                color: '#FFE033',
                fontSize: '12px',
                fontWeight: 'bold',
                textShadow: `0 0 8px ${config.color}`,
              }}
            >
              {score} pkt
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

function Accessory({ type, color, headScale }: { type: string; color: string; headScale: number }) {
  const yOffset = 1.5 + 0.35 * headScale;

  switch (type) {
    case 'hat':
      return (
        <group position={[0, yOffset, 0]}>
          {/* Brim */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 0.05, 16]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
          </mesh>
          {/* Top */}
          <mesh position={[0, 0.25, 0]}>
            <coneGeometry args={[0.25, 0.4, 16]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
          </mesh>
        </group>
      );
    case 'horns':
      return (
        <group position={[0, yOffset, 0]}>
          <mesh position={[-0.2, 0.1, 0]} rotation={[0, 0, 0.3]}>
            <coneGeometry args={[0.06, 0.25, 8]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0.2, 0.1, 0]} rotation={[0, 0, -0.3]}>
            <coneGeometry args={[0.06, 0.25, 8]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
          </mesh>
        </group>
      );
    case 'antenna':
      return (
        <group position={[0, yOffset, 0]}>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh position={[0, 0.32, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
          </mesh>
        </group>
      );
    case 'crown':
      return (
        <group position={[0, yOffset + 0.05, 0]}>
          <mesh>
            <torusGeometry args={[0.22, 0.04, 8, 5]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} metalness={0.8} />
          </mesh>
          {/* Crown points */}
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i / 5) * Math.PI * 2) * 0.22,
                0.1,
                Math.sin((i / 5) * Math.PI * 2) * 0.22,
              ]}
            >
              <coneGeometry args={[0.04, 0.12, 4]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
            </mesh>
          ))}
        </group>
      );
    case 'halo':
      return (
        <mesh position={[0, yOffset + 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.3, 0.03, 8, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2}
            transparent
            opacity={0.8}
          />
        </mesh>
      );
    case 'bandana':
      return (
        <mesh position={[0, yOffset - 0.05, 0]}>
          <torusGeometry args={[0.35 * headScale, 0.04, 8, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
        </mesh>
      );
    default:
      return null;
  }
}
