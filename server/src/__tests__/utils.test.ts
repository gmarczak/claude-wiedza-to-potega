import { describe, it, expect } from 'vitest';
import { generateRoomId, getBasePoints, getSpeedBonus } from '../utils';

describe('generateRoomId', () => {
  const ALLOWED = new Set('ABCDEFGHJKLMNPQRSTUVWXYZ23456789');

  it('returns a 6-character string', () => {
    expect(generateRoomId()).toHaveLength(6);
  });

  it('only contains allowed characters', () => {
    for (let i = 0; i < 20; i++) {
      const id = generateRoomId();
      for (const ch of id) {
        expect(ALLOWED.has(ch), `Unexpected char "${ch}" in room ID "${id}"`).toBe(true);
      }
    }
  });

  it('generates different IDs across calls', () => {
    const ids = new Set(Array.from({ length: 20 }, () => generateRoomId()));
    expect(ids.size).toBeGreaterThan(1);
  });
});

describe('getBasePoints', () => {
  it('returns 10 for easy', () => expect(getBasePoints('easy')).toBe(10));
  it('returns 20 for medium', () => expect(getBasePoints('medium')).toBe(20));
  it('returns 30 for hard', () => expect(getBasePoints('hard')).toBe(30));
  it('returns 10 for unknown difficulty', () => expect(getBasePoints('unknown')).toBe(10));
  it('returns 10 for empty string', () => expect(getBasePoints('')).toBe(10));
});

describe('getSpeedBonus', () => {
  it('returns 0 when answerTime is null', () => {
    expect(getSpeedBonus(null, 20)).toBe(0);
  });

  it('returns 10 for an instant answer (answerTime = 0)', () => {
    expect(getSpeedBonus(0, 20)).toBe(10);
  });

  it('returns 0 when time spent equals the full round time', () => {
    expect(getSpeedBonus(20_000, 20)).toBe(0);
  });

  it('returns 0 when time spent exceeds the round time', () => {
    expect(getSpeedBonus(30_000, 20)).toBe(0);
  });

  it('returns ~5 at the halfway point', () => {
    expect(getSpeedBonus(10_000, 20)).toBe(5);
  });

  it('always returns a value between 0 and 10', () => {
    for (const ms of [0, 2000, 5000, 10000, 19999, 20000, 25000]) {
      const bonus = getSpeedBonus(ms, 20);
      expect(bonus).toBeGreaterThanOrEqual(0);
      expect(bonus).toBeLessThanOrEqual(10);
    }
  });
});
