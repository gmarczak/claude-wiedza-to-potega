import type { Vector3Tuple } from 'three';

export interface CameraPreset {
  position: Vector3Tuple;
  lookAt: Vector3Tuple;
}

export const CAMERA_PRESETS: Record<string, CameraPreset> = {
  'enter-room': {
    position: [0, 3, 12],
    lookAt: [0, 1, 0],
  },
  lobby: {
    position: [0, 3, 10],
    lookAt: [0, 1, 0],
  },
  countdown: {
    position: [0, 3, 8],
    lookAt: [0, 2.5, 0],
  },
  category_vote: {
    position: [0, 4, 10],
    lookAt: [0, 2, 0],
  },
  category_result: {
    position: [0, 4, 10],
    lookAt: [0, 2, 0],
  },
  power_up: {
    position: [3, 3, 9],
    lookAt: [0, 1.5, 0],
  },
  question: {
    position: [0, 3.5, 9],
    lookAt: [0, 2, 0],
  },
  reveal: {
    position: [0, 3, 7],
    lookAt: [0, 1.5, 0],
  },
  minigame: {
    position: [0, 5, 9],
    lookAt: [0, 1, 0],
  },
  minigame_results: {
    position: [0, 3, 8],
    lookAt: [0, 1, 0],
  },
  pyramid_intro: {
    position: [5, 5, 10],
    lookAt: [0, 3, 0],
  },
  pyramid_question: {
    position: [4, 4, 9],
    lookAt: [0, 3, 0],
  },
  pyramid_reveal: {
    position: [4, 4, 9],
    lookAt: [0, 3, 0],
  },
  finished: {
    position: [0, 3, 7],
    lookAt: [0, 2, 0],
  },
};
