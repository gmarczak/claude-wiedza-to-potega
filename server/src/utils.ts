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
