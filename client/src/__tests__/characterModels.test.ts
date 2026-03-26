import { describe, it, expect } from 'vitest';
import { AVATAR_CONFIGS, type AvatarConfig } from '../display3d/CharacterModels';

const ALL_AVATAR_IDS = [
  'hotdog', 'robot', 'wizard', 'alien', 'pirate', 'ninja',
  'vampire', 'astronaut', 'dragon', 'detective', 'unicorn', 'ghost',
];

describe('CharacterModels (Avatar Configs)', () => {
  it('has a config for all 12 avatars', () => {
    for (const id of ALL_AVATAR_IDS) {
      expect(AVATAR_CONFIGS[id], `Missing config for avatar "${id}"`).toBeDefined();
    }
  });

  it('does not have extra undefined avatar configs', () => {
    expect(Object.keys(AVATAR_CONFIGS).length).toBe(12);
  });

  it('every config has required fields', () => {
    for (const [id, config] of Object.entries(AVATAR_CONFIGS)) {
      expect(config.id, `${id}.id`).toBe(id);
      expect(config.emoji, `${id}.emoji`).toBeTruthy();
      expect(config.color, `${id}.color`).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(config.bodyScale, `${id}.bodyScale`).toHaveLength(3);
      expect(typeof config.headScale, `${id}.headScale`).toBe('number');
      expect(config.headScale, `${id}.headScale`).toBeGreaterThan(0);
      expect(typeof config.emissiveIntensity, `${id}.emissiveIntensity`).toBe('number');
    }
  });

  it('bodyScale values are all positive', () => {
    for (const [id, config] of Object.entries(AVATAR_CONFIGS)) {
      for (let i = 0; i < 3; i++) {
        expect(config.bodyScale[i], `${id}.bodyScale[${i}]`).toBeGreaterThan(0);
      }
    }
  });

  it('emissiveIntensity is between 0 and 1', () => {
    for (const [id, config] of Object.entries(AVATAR_CONFIGS)) {
      expect(config.emissiveIntensity, `${id}.emissiveIntensity`).toBeGreaterThanOrEqual(0);
      expect(config.emissiveIntensity, `${id}.emissiveIntensity`).toBeLessThanOrEqual(1);
    }
  });

  it('every color is unique across avatars', () => {
    const colors = Object.values(AVATAR_CONFIGS).map((c) => c.color);
    const unique = new Set(colors);
    expect(unique.size).toBe(colors.length);
  });

  it('accessory types are valid when present', () => {
    const validTypes = ['hat', 'horns', 'antenna', 'crown', 'halo', 'bandana'];
    for (const [id, config] of Object.entries(AVATAR_CONFIGS)) {
      if (config.accessory) {
        expect(validTypes, `${id}.accessory "${config.accessory}"`).toContain(config.accessory);
      }
    }
  });

  it('accessoryColor is present when accessory is defined', () => {
    for (const [id, config] of Object.entries(AVATAR_CONFIGS)) {
      if (config.accessory) {
        expect(config.accessoryColor, `${id} has accessory but no accessoryColor`).toBeTruthy();
      }
    }
  });

  it('specific avatars have expected accessories', () => {
    expect(AVATAR_CONFIGS.robot.accessory).toBe('antenna');
    expect(AVATAR_CONFIGS.wizard.accessory).toBe('hat');
    expect(AVATAR_CONFIGS.dragon.accessory).toBe('horns');
    expect(AVATAR_CONFIGS.unicorn.accessory).toBe('crown');
    expect(AVATAR_CONFIGS.astronaut.accessory).toBe('halo');
  });

  it('ghost has no accessory (floating sheet concept)', () => {
    expect(AVATAR_CONFIGS.ghost.accessory).toBeUndefined();
  });
});
