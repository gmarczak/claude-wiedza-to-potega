const ROOM_ID_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateRoomId(): string {
  let result = '';
  for (let i = 0; i < 6; i++) result += ROOM_ID_CHARS.charAt(Math.floor(Math.random() * ROOM_ID_CHARS.length));
  return result;
}

export function getBasePoints(difficulty: string): number {
  switch (difficulty) {
    case 'easy': return 10;
    case 'medium': return 20;
    case 'hard': return 30;
    default: return 10;
  }
}

export function getSpeedBonus(answerTime: number | null, roundTime: number): number {
  if (answerTime === null) return 0;
  const ratio = Math.max(0, 1 - answerTime / (roundTime * 1000));
  return Math.round(ratio * 10);
}

// ─── Pure game-logic helpers ─────────────────────────────────────────────────
// These functions are free of side-effects and can be unit-tested in isolation.

// ── Category vote ────────────────────────────────────────────────────────────

export interface CategoryVoteResult {
  selectedCategory: string;
  overrideUsed: boolean;
  overrideBy: string | null;
  overridePlayerId: string | null;
  votes: Record<string, string>;
}

export function computeCategoryVoteResult(
  players: { id: string; name: string; categoryVote: string | null }[],
  availableCategories: string[],
): CategoryVoteResult {
  const fallback = availableCategories[0] ?? '';
  const votes: Record<string, string> = {};

  const overridePlayer = players.find((p) => p.categoryVote?.startsWith('OVERRIDE:'));

  if (overridePlayer) {
    const selectedCategory = overridePlayer.categoryVote!.replace('OVERRIDE:', '');
    players.forEach((p) => {
      votes[p.id] = p.categoryVote?.replace('OVERRIDE:', '') || fallback;
    });
    return {
      selectedCategory,
      overrideUsed: true,
      overrideBy: overridePlayer.name,
      overridePlayerId: overridePlayer.id,
      votes,
    };
  }

  players.forEach((p) => { votes[p.id] = p.categoryVote || fallback; });

  const voteCounts: Record<string, number> = {};
  Object.values(votes).forEach((v) => { voteCounts[v] = (voteCounts[v] || 0) + 1; });
  const maxVotes = Math.max(...Object.values(voteCounts));
  const topCats = Object.keys(voteCounts).filter((c) => voteCounts[c] === maxVotes);

  return {
    selectedCategory: topCats[Math.floor(Math.random() * topCats.length)],
    overrideUsed: false,
    overrideBy: null,
    overridePlayerId: null,
    votes,
  };
}

// ── Round scoring ─────────────────────────────────────────────────────────────

export function computeRoundScore(
  player: { currentAnswer: number | null; answeredAt: number | null },
  question: { correctIndex: number; difficulty: string },
  powerUp: { type: string } | null | undefined,
  questionStartTime: number,
  roundTime: number,
): { pointsEarned: number; speedBonusGiven: boolean } {
  if (player.currentAnswer !== question.correctIndex) {
    return { pointsEarned: 0, speedBonusGiven: false };
  }
  const answerTime = player.answeredAt !== null ? player.answeredAt - questionStartTime : null;
  let pointsEarned = getBasePoints(question.difficulty);
  const bonus = getSpeedBonus(answerTime, roundTime);
  pointsEarned += bonus;
  if (powerUp?.type === 'double') pointsEarned *= 2;
  return { pointsEarned, speedBonusGiven: bonus > 0 };
}

// ── Pyramid start positions ───────────────────────────────────────────────────

export function computePyramidStartPositions(
  players: { id: string; score: number }[],
): { positions: Record<string, number>; isCloseGame: boolean } {
  if (players.length === 0) return { positions: {}, isCloseGame: true };

  const sorted = [...players].sort((a, b) => b.score - a.score);
  const topScore = sorted[0].score;
  const bottomScore = sorted[sorted.length - 1].score;
  const scoreRange = topScore - bottomScore;

  const positions: Record<string, number> = {};
  for (const p of sorted) {
    positions[p.id] = scoreRange > 0
      ? Math.round(((p.score - bottomScore) / scoreRange) * 2)
      : 0;
  }

  return { positions, isCloseGame: scoreRange <= 20 };
}

// ── Final scores ──────────────────────────────────────────────────────────────

export interface FinalScoresResult {
  sorted: { id: string; name: string; score: number }[];
  winner: { id: string; name: string } | null;
  isTie: boolean;
}

export function computeFinalScores(
  players: { id: string; name: string; score: number; pyramidPosition: number }[],
  pyramidSize: number,
): FinalScoresResult {
  const withBonus = players.map((p) => ({ ...p, score: p.score + p.pyramidPosition * 20 }));
  const sorted = [...withBonus].sort((a, b) => b.score - a.score);
  const isTie = sorted.length >= 2 && sorted[0].score === sorted[1].score;

  const pyramidWinner = withBonus.find((p) => p.pyramidPosition >= pyramidSize);
  const scoreWinner = isTie || sorted.length === 0
    ? null
    : { id: sorted[0].id, name: sorted[0].name };
  const finalWinner = pyramidWinner
    ? { id: pyramidWinner.id, name: pyramidWinner.name }
    : scoreWinner;

  return {
    sorted: sorted.map((p) => ({ id: p.id, name: p.name, score: p.score })),
    winner: isTie ? null : finalWinner,
    isTie,
  };
}
