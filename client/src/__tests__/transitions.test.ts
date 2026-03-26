import { describe, it, expect } from 'vitest';
import { CAMERA_PRESETS } from '../display3d/transitions';

describe('Camera Transitions', () => {
  const ALL_PHASES = [
    'enter-room', 'lobby', 'countdown',
    'category_vote', 'category_result',
    'power_up', 'question', 'reveal',
    'minigame', 'minigame_results',
    'pyramid_intro', 'pyramid_question', 'pyramid_reveal',
    'finished',
  ];

  it('has a camera preset for every game phase', () => {
    for (const phase of ALL_PHASES) {
      expect(CAMERA_PRESETS[phase], `Missing preset for phase "${phase}"`).toBeDefined();
    }
  });

  it('every preset has position and lookAt as 3-element tuples', () => {
    for (const [phase, preset] of Object.entries(CAMERA_PRESETS)) {
      expect(preset.position, `${phase}.position`).toHaveLength(3);
      expect(preset.lookAt, `${phase}.lookAt`).toHaveLength(3);
      for (const v of preset.position) {
        expect(typeof v, `${phase}.position value`).toBe('number');
        expect(Number.isFinite(v), `${phase}.position must be finite`).toBe(true);
      }
      for (const v of preset.lookAt) {
        expect(typeof v, `${phase}.lookAt value`).toBe('number');
        expect(Number.isFinite(v), `${phase}.lookAt must be finite`).toBe(true);
      }
    }
  });

  it('camera is always above the floor (Y > 0)', () => {
    for (const [phase, preset] of Object.entries(CAMERA_PRESETS)) {
      expect(preset.position[1], `${phase} camera Y`).toBeGreaterThan(0);
    }
  });

  it('camera is always in front of the stage (Z > 0)', () => {
    for (const [phase, preset] of Object.entries(CAMERA_PRESETS)) {
      expect(preset.position[2], `${phase} camera Z`).toBeGreaterThan(0);
    }
  });

  it('question and reveal presets look at different camera positions', () => {
    const q = CAMERA_PRESETS['question'];
    const r = CAMERA_PRESETS['reveal'];
    const positionDiffers = q.position.some((v, i) => v !== r.position[i]);
    expect(positionDiffers).toBe(true);
  });
});
