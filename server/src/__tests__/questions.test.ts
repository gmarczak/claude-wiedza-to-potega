import { describe, it, expect } from 'vitest';
import {
  shuffleArray,
  getAvailableCategories,
  getQuestions,
  getMiniGames,
  getHostComment,
  getRandomFunFact,
  builtInQuestions,
  funFacts,
} from '../questions';
import type { Question } from '../types';

// ─── shuffleArray ───────────────────────────────────────────────────────────

describe('shuffleArray', () => {
  it('returns a new array (does not mutate input)', () => {
    const arr = [1, 2, 3, 4, 5];
    const copy = [...arr];
    const shuffled = shuffleArray(arr);
    expect(arr).toEqual(copy);
    expect(shuffled).not.toBe(arr);
  });

  it('preserves all elements', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(shuffleArray(arr).sort()).toEqual([...arr].sort());
  });

  it('handles an empty array', () => {
    expect(shuffleArray([])).toEqual([]);
  });

  it('handles a single-element array', () => {
    expect(shuffleArray([42])).toEqual([42]);
  });

  it('produces different orderings over many runs (statistical)', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8];
    const results = new Set(
      Array.from({ length: 50 }, () => shuffleArray(arr).join(','))
    );
    // With 8 elements the chance of getting the same order 50 times is astronomically small
    expect(results.size).toBeGreaterThan(1);
  });
});

// ─── getAvailableCategories ─────────────────────────────────────────────────

describe('getAvailableCategories', () => {
  it('returns an empty array for empty input', () => {
    expect(getAvailableCategories([])).toEqual([]);
  });

  it('deduplicates categories', () => {
    const qs: Question[] = [
      { id: '1', question: 'Q', answers: [], correctIndex: 0, category: 'A', difficulty: 'easy' },
      { id: '2', question: 'Q', answers: [], correctIndex: 0, category: 'A', difficulty: 'easy' },
      { id: '3', question: 'Q', answers: [], correctIndex: 0, category: 'B', difficulty: 'easy' },
    ];
    const cats = getAvailableCategories(qs);
    expect(new Set(cats).size).toBe(cats.length);
  });

  it('returns at most 4 categories', () => {
    const qs: Question[] = ['A', 'B', 'C', 'D', 'E', 'F'].map((c, i) => ({
      id: String(i), question: 'Q', answers: [], correctIndex: 0,
      category: c, difficulty: 'easy' as const,
    }));
    expect(getAvailableCategories(qs).length).toBeLessThanOrEqual(4);
  });

  it('returns all categories when there are fewer than 4', () => {
    const qs: Question[] = ['X', 'Y'].map((c, i) => ({
      id: String(i), question: 'Q', answers: [], correctIndex: 0,
      category: c, difficulty: 'easy' as const,
    }));
    const cats = getAvailableCategories(qs);
    expect(cats).toHaveLength(2);
    expect(cats).toContain('X');
    expect(cats).toContain('Y');
  });
});

// ─── getQuestions ───────────────────────────────────────────────────────────

describe('getQuestions', () => {
  it('returns the requested number of questions', async () => {
    const qs = await getQuestions(5);
    expect(qs).toHaveLength(5);
  });

  it('returns no duplicate question IDs', async () => {
    const qs = await getQuestions(10);
    const ids = qs.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('filters by easy difficulty', async () => {
    const qs = await getQuestions(5, 'easy');
    qs.forEach((q) => expect(q.difficulty).toBe('easy'));
  });

  it('filters by medium difficulty', async () => {
    const qs = await getQuestions(5, 'medium');
    qs.forEach((q) => expect(q.difficulty).toBe('medium'));
  });

  it('filters by hard difficulty', async () => {
    const qs = await getQuestions(5, 'hard');
    qs.forEach((q) => expect(q.difficulty).toBe('hard'));
  });

  it('returns questions across all difficulties for "mixed"', async () => {
    // Request a larger set to ensure we cover multiple difficulties
    const qs = await getQuestions(14, 'mixed');
    const diffs = new Set(qs.map((q) => q.difficulty));
    expect(diffs.size).toBeGreaterThan(1);
  });

  it('each returned question has required fields', async () => {
    const qs = await getQuestions(3);
    for (const q of qs) {
      expect(q).toHaveProperty('id');
      expect(q).toHaveProperty('question');
      expect(Array.isArray(q.answers)).toBe(true);
      expect(typeof q.correctIndex).toBe('number');
      expect(q).toHaveProperty('category');
      expect(['easy', 'medium', 'hard']).toContain(q.difficulty);
    }
  });
});

// ─── getMiniGames ───────────────────────────────────────────────────────────

describe('getMiniGames', () => {
  it('returns exactly 2 games', () => {
    expect(getMiniGames()).toHaveLength(2);
  });

  it('always returns one connect and one sort game', () => {
    for (let i = 0; i < 10; i++) {
      const types = getMiniGames().map((g) => g.type);
      expect(types).toContain('connect');
      expect(types).toContain('sort');
    }
  });

  it('connect game has a pairs array', () => {
    const games = getMiniGames();
    const connect = games.find((g) => g.type === 'connect');
    expect(connect).toBeDefined();
    expect(Array.isArray((connect as any).pairs)).toBe(true);
  });

  it('sort game has items and categories arrays', () => {
    const games = getMiniGames();
    const sort = games.find((g) => g.type === 'sort');
    expect(sort).toBeDefined();
    expect(Array.isArray((sort as any).items)).toBe(true);
    expect(Array.isArray((sort as any).categories)).toBe(true);
  });
});

// ─── getHostComment ─────────────────────────────────────────────────────────

describe('getHostComment', () => {
  const keys = [
    'gameStart', 'correctBoth', 'correctOne', 'bothWrong',
    'powerUpUsed', 'miniGameStart', 'pyramidStart', 'closeGame',
  ] as const;

  for (const key of keys) {
    it(`returns a non-empty string for key "${key}"`, () => {
      const comment = getHostComment(key);
      expect(typeof comment).toBe('string');
      expect(comment.length).toBeGreaterThan(0);
    });
  }
});

// ─── getRandomFunFact ────────────────────────────────────────────────────────

describe('getRandomFunFact', () => {
  it('returns a non-empty string', () => {
    const fact = getRandomFunFact();
    expect(typeof fact).toBe('string');
    expect(fact.length).toBeGreaterThan(0);
  });

  it('returns a fact from the known pool', () => {
    const fact = getRandomFunFact();
    expect(funFacts).toContain(fact);
  });
});

// ─── builtInQuestions data integrity ────────────────────────────────────────

describe('builtInQuestions', () => {
  it('contains at least 30 questions', () => {
    expect(builtInQuestions.length).toBeGreaterThanOrEqual(30);
  });

  it('every question has a unique id', () => {
    const ids = builtInQuestions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every correctIndex is a valid answer index', () => {
    for (const q of builtInQuestions) {
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.answers.length);
    }
  });
});
