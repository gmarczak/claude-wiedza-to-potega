import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMERA_PRESETS } from './transitions';

interface CameraControllerProps {
  phase: string;
}

export default function CameraController({ phase }: CameraControllerProps) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 3, 12));
  const targetLook = useRef(new THREE.Vector3(0, 1, 0));
  const currentLook = useRef(new THREE.Vector3(0, 1, 0));

  useEffect(() => {
    const preset = CAMERA_PRESETS[phase] || CAMERA_PRESETS['lobby'];
    targetPos.current.set(...preset.position);
    targetLook.current.set(...preset.lookAt);
  }, [phase]);

  useFrame((_state, delta) => {
    // Smooth camera movement with lerp
    const speed = 2 * delta;
    camera.position.lerp(targetPos.current, speed);
    currentLook.current.lerp(targetLook.current, speed);
    camera.lookAt(currentLook.current);
  });

  return null;
}
