import { describe, it, expect } from 'vitest';
import {
  computeCategoryVoteResult,
  computeRoundScore,
  computePyramidStartPositions,
  computeFinalScores,
} from '../utils';

// ─── computeCategoryVoteResult ────────────────────────────────────────────────

describe('computeCategoryVoteResult', () => {
  const cats = ['Nauka', 'Historia', 'Sport', 'Kultura'];

  it('selects the unanimously voted category', () => {
    const players = [
      { id: 'p1', name: 'Ala', categoryVote: 'Nauka' },
      { id: 'p2', name: 'Bob', categoryVote: 'Nauka' },
    ];
    const result = computeCategoryVoteResult(players, cats);
    expect(result.selectedCategory).toBe('Nauka');
    expect(result.overrideUsed).toBe(false);
    expect(result.overrideBy).toBeNull();
  });

  it('picks one of the tied categories on a split vote', () => {
    const players = [
      { id: 'p1', name: 'Ala', categoryVote: 'Nauka' },
      { id: 'p2', name: 'Bob', categoryVote: 'Historia' },
    ];
    // Run many times to confirm only valid choices are returned
    for (let i = 0; i < 20; i++) {
      const result = computeCategoryVoteResult(players, cats);
      expect(['Nauka', 'Historia']).toContain(result.selectedCategory);
    }
  });

  it('uses the fallback category when a player has not voted', () => {
    const players = [
      { id: 'p1', name: 'Ala', categoryVote: null },
      { id: 'p2', name: 'Bob', categoryVote: null },
    ];
    const result = computeCategoryVoteResult(players, cats);
    expect(result.selectedCategory).toBe(cats[0]); // fallback = first available
    expect(result.votes['p1']).toBe(cats[0]);
  });

  it('honours an override vote', () => {
    const players = [
      { id: 'p1', name: 'Ala', categoryVote: 'OVERRIDE:Sport' },
      { id: 'p2', name: 'Bob', categoryVote: 'Nauka' },
    ];
    const result = computeCategoryVoteResult(players, cats);
    expect(result.selectedCategory).toBe('Sport');
    expect(result.overrideUsed).toBe(true);
    expect(result.overrideBy).toBe('Ala');
    expect(result.overridePlayerId).toBe('p1');
  });

  it('strips the OVERRIDE: prefix from the votes map', () => {
    const players = [
      { id: 'p1', name: 'Ala', categoryVote: 'OVERRIDE:Sport' },
      { id: 'p2', name: 'Bob', categoryVote: 'Nauka' },
    ];
    const { votes } = computeCategoryVoteResult(players, cats);
    expect(votes['p1']).toBe('Sport');
    expect(votes['p2']).toBe('Nauka');
  });

  it('includes every player id in the votes map', () => {
    const players = [
      { id: 'p1', name: 'Ala', categoryVote: 'Nauka' },
      { id: 'p2', name: 'Bob', categoryVote: 'Historia' },
      { id: 'p3', name: 'Cel', categoryVote: null },
    ];
    const { votes } = computeCategoryVoteResult(players, cats);
    expect(Object.keys(votes)).toEqual(['p1', 'p2', 'p3']);
  });
});

// ─── computeRoundScore ────────────────────────────────────────────────────────

describe('computeRoundScore', () => {
  const NOW = 1_000_000;
  const ROUND_TIME = 20; // seconds

  const makePlayer = (answer: number | null, answeredAt: number | null) => ({
    currentAnswer: answer,
    answeredAt,
  });

  it('returns 0 points for a wrong answer', () => {
    const { pointsEarned } = computeRoundScore(makePlayer(1, NOW), { correctIndex: 0, difficulty: 'easy' }, null, NOW, ROUND_TIME);
    expect(pointsEarned).toBe(0);
  });

  it('returns 0 points for no answer (null)', () => {
    const { pointsEarned } = computeRoundScore(makePlayer(null, null), { correctIndex: 0, difficulty: 'easy' }, null, NOW, ROUND_TIME);
    expect(pointsEarned).toBe(0);
  });

  it('awards base points + speed bonus for a correct instant answer', () => {
    // answeredAt === questionStartTime → answerTime = 0 → max speed bonus (10)
    const { pointsEarned, speedBonusGiven } = computeRoundScore(
      makePlayer(2, NOW), { correctIndex: 2, difficulty: 'easy' }, null, NOW, ROUND_TIME
    );
    expect(pointsEarned).toBe(20); // 10 base + 10 speed bonus
    expect(speedBonusGiven).toBe(true);
  });

  it('awards only base points when answer time equals round time', () => {
    const { pointsEarned, speedBonusGiven } = computeRoundScore(
      makePlayer(0, NOW + ROUND_TIME * 1000), { correctIndex: 0, difficulty: 'medium' }, null, NOW, ROUND_TIME
    );
    expect(pointsEarned).toBe(20); // 20 base + 0 speed bonus
    expect(speedBonusGiven).toBe(false);
  });

  it('doubles points when the double power-up is active', () => {
    const { pointsEarned } = computeRoundScore(
      makePlayer(0, NOW), { correctIndex: 0, difficulty: 'easy' }, { type: 'double' }, NOW, ROUND_TIME
    );
    expect(pointsEarned).toBe(40); // (10 + 10) * 2
  });

  it('does not double points for non-double power-ups', () => {
    const { pointsEarned } = computeRoundScore(
      makePlayer(0, NOW), { correctIndex: 0, difficulty: 'easy' }, { type: 'slime' }, NOW, ROUND_TIME
    );
    expect(pointsEarned).toBe(20); // 10 + 10, no doubling
  });

  it('speedBonusGiven is false for a null answeredAt', () => {
    // Correct answer but no answeredAt → treated as no answer time
    // But currentAnswer matches correctIndex, so it IS a correct answer with no time
    const { speedBonusGiven } = computeRoundScore(
      makePlayer(0, null), { correctIndex: 0, difficulty: 'easy' }, null, NOW, ROUND_TIME
    );
    expect(speedBonusGiven).toBe(false);
  });
});

// ─── computePyramidStartPositions ─────────────────────────────────────────────

describe('computePyramidStartPositions', () => {
  it('gives all players position 0 when scores are tied', () => {
    const players = [
      { id: 'p1', score: 50 },
      { id: 'p2', score: 50 },
    ];
    const { positions } = computePyramidStartPositions(players);
    expect(positions['p1']).toBe(0);
    expect(positions['p2']).toBe(0);
  });

  it('gives the leader position 2 and the trailer position 0', () => {
    const players = [
      { id: 'p1', score: 100 },
      { id: 'p2', score: 0 },
    ];
    const { positions } = computePyramidStartPositions(players);
    expect(positions['p1']).toBe(2);
    expect(positions['p2']).toBe(0);
  });

  it('returns isCloseGame true when score range is ≤ 20', () => {
    const { isCloseGame } = computePyramidStartPositions([{ id: 'p1', score: 60 }, { id: 'p2', score: 50 }]);
    expect(isCloseGame).toBe(true);
  });

  it('returns isCloseGame false when score range is > 20', () => {
    const { isCloseGame } = computePyramidStartPositions([{ id: 'p1', score: 100 }, { id: 'p2', score: 50 }]);
    expect(isCloseGame).toBe(false);
  });

  it('returns isCloseGame true for tied players', () => {
    const { isCloseGame } = computePyramidStartPositions([{ id: 'p1', score: 40 }, { id: 'p2', score: 40 }]);
    expect(isCloseGame).toBe(true);
  });

  it('handles an empty player list', () => {
    const { positions, isCloseGame } = computePyramidStartPositions([]);
    expect(positions).toEqual({});
    expect(isCloseGame).toBe(true);
  });

  it('each position is between 0 and 2 inclusive', () => {
    const players = [
      { id: 'p1', score: 120 },
      { id: 'p2', score: 80 },
      { id: 'p3', score: 20 },
    ];
    const { positions } = computePyramidStartPositions(players);
    for (const pos of Object.values(positions)) {
      expect(pos).toBeGreaterThanOrEqual(0);
      expect(pos).toBeLessThanOrEqual(2);
    }
  });
});

// ─── computeFinalScores ───────────────────────────────────────────────────────

describe('computeFinalScores', () => {
  it('adds pyramidPosition * 20 to each player score', () => {
    const players = [
      { id: 'p1', name: 'Ala', score: 100, pyramidPosition: 3 },
      { id: 'p2', name: 'Bob', score: 80, pyramidPosition: 1 },
    ];
    const { sorted } = computeFinalScores(players, 5);
    expect(sorted.find((p) => p.id === 'p1')!.score).toBe(160); // 100 + 3*20
    expect(sorted.find((p) => p.id === 'p2')!.score).toBe(100); // 80 + 1*20
  });

  it('returns players sorted by final score descending', () => {
    const players = [
      { id: 'p1', name: 'Ala', score: 50, pyramidPosition: 0 },
      { id: 'p2', name: 'Bob', score: 100, pyramidPosition: 0 },
    ];
    const { sorted } = computeFinalScores(players, 5);
    expect(sorted[0].id).toBe('p2');
    expect(sorted[1].id).toBe('p1');
  });

  it('detects a tie when final scores are equal', () => {
    const players = [
      { id: 'p1', name: 'Ala', score: 100, pyramidPosition: 0 },
      { id: 'p2', name: 'Bob', score: 100, pyramidPosition: 0 },
    ];
    const { winner, isTie } = computeFinalScores(players, 5);
    expect(isTie).toBe(true);
    expect(winner).toBeNull();
  });

  it('returns the higher-scoring player as the winner', () => {
    const players = [
      { id: 'p1', name: 'Ala', score: 120, pyramidPosition: 0 },
      { id: 'p2', name: 'Bob', score: 80, pyramidPosition: 0 },
    ];
    const { winner, isTie } = computeFinalScores(players, 5);
    expect(isTie).toBe(false);
    expect(winner).toEqual({ id: 'p1', name: 'Ala' });
  });

  it('overrides the score-based winner with the pyramid finisher', () => {
    const players = [
      { id: 'p1', name: 'Ala', score: 200, pyramidPosition: 0 }, // higher score
      { id: 'p2', name: 'Bob', score: 50, pyramidPosition: 5 },  // reached pyramid top
    ];
    const { winner } = computeFinalScores(players, 5);
    expect(winner).toEqual({ id: 'p2', name: 'Bob' });
  });

  it('returns null winner for a tie even when pyramid winner exists and is also tied', () => {
    // Tie takes precedence — winner=null regardless of pyramid
    const players = [
      { id: 'p1', name: 'Ala', score: 0, pyramidPosition: 0 },
      { id: 'p2', name: 'Bob', score: 0, pyramidPosition: 0 },
    ];
    const { isTie } = computeFinalScores(players, 5);
    expect(isTie).toBe(true);
  });

  it('does not mutate the input array', () => {
    const players = [
      { id: 'p1', name: 'Ala', score: 100, pyramidPosition: 2 },
      { id: 'p2', name: 'Bob', score: 50, pyramidPosition: 1 },
    ];
    const scoresBefore = players.map((p) => p.score);
    computeFinalScores(players, 5);
    expect(players.map((p) => p.score)).toEqual(scoresBefore);
  });
});
