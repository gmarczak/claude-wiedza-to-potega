import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import {
  Room, Player, GameSettings, ServerToClientEvents, ClientToServerEvents,
  RoomState, PlayerInfo, PowerUpType, POWER_UPS,
} from './types';
import {
  getQuestions, getAvailableCategories, getMiniGames,
  shuffleArray, getHostComment, getRandomFunFact,
} from './questions';

const app = express();

const ALLOWED_ORIGINS = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL, 'http://localhost:5173']
  : ['http://localhost:5173'];

app.use(cors({ origin: ALLOWED_ORIGINS }));
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: { origin: ALLOWED_ORIGINS, methods: ['GET', 'POST'] },
});

const rooms = new Map<string, Room>();

function generateRoomId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

function getPlayerInfo(p: Player): PlayerInfo {
  return { id: p.id, name: p.name, avatarId: p.avatarId, score: p.score, hasOverride: p.hasOverride && !p.usedOverride };
}

function getRoomState(room: Room): RoomState {
  return {
    id: room.id,
    players: room.players.map(getPlayerInfo),
    phase: room.phase,
    currentQuestionIndex: room.currentQuestionIndex,
    totalRounds: room.totalRounds,
  };
}

function clearTimer(room: Room) {
  if (room.timer) { clearTimeout(room.timer); clearInterval(room.timer); room.timer = null; }
}

function cleanupRoom(roomId: string) {
  const room = rooms.get(roomId);
  if (room) clearTimer(room);
  rooms.delete(roomId);
}

function findRoom(socketId: string): Room | undefined {
  return [...rooms.values()].find((r) => r.players.some((p) => p.id === socketId));
}

function sendHostComment(room: Room, key: Parameters<typeof getHostComment>[0]) {
  const comment = getHostComment(key);
  room.hostComment = comment;
  io.to(room.id).emit('game:host-comment', comment);
}

// ===== SPEED SCORING =====
function getSpeedBonus(answerTime: number | null, roundTime: number): number {
  if (answerTime === null) return 0;
  const timeSpent = answerTime;
  const ratio = Math.max(0, 1 - timeSpent / (roundTime * 1000));
  return Math.round(ratio * 10); // up to 10 bonus points
}

function getBasePoints(difficulty: string): number {
  switch (difficulty) {
    case 'easy': return 10;
    case 'medium': return 20;
    case 'hard': return 30;
    default: return 10;
  }
}

// ===== GAME FLOW =====
// Structure: [vote→powerup→Q, vote→powerup→Q, vote→powerup→Q] → minigame → repeat 2x → pyramid

const QUESTIONS_PER_GROUP = 3;
const TOTAL_GROUPS = 3;
const PYRAMID_QUESTIONS = 5;

async function startGame(room: Room) {
  // Prepare questions: 9 for rounds + 5 for pyramid
  const allQuestions = await getQuestions(QUESTIONS_PER_GROUP * TOTAL_GROUPS + PYRAMID_QUESTIONS, room.difficulty);
  room.questions = allQuestions.slice(0, QUESTIONS_PER_GROUP * TOTAL_GROUPS);
  room.pyramidQuestions = allQuestions.slice(QUESTIONS_PER_GROUP * TOTAL_GROUPS);
  room.totalRounds = room.questions.length;
  room.miniGames = getMiniGames();
  room.pyramidSize = 5;
  room.roundGroup = 0;
  room.roundInGroup = 0;
  room.currentQuestionIndex = 0;
  room.currentMiniGame = 0;

  room.players.forEach((p) => {
    p.score = 0;
    p.pyramidPosition = 0;
    p.hasOverride = true;
    p.usedOverride = false;
  });

  sendHostComment(room, 'gameStart');

  room.phase = 'countdown';
  io.to(room.id).emit('game:countdown', 3);
  let countdown = 3;
  const interval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      io.to(room.id).emit('game:countdown', countdown);
    } else {
      clearInterval(interval);
      startCategoryVote(room);
    }
  }, 1000);
}

function startCategoryVote(room: Room) {
  room.phase = 'category_vote';
  room.players.forEach((p) => { p.categoryVote = null; });

  const cats = getAvailableCategories([...room.questions, ...room.pyramidQuestions]);
  room.availableCategories = cats;

  io.to(room.id).emit('game:category-vote', { categories: cats, timeLimit: 10 });

  let timeLeft = 10;
  const tickInterval = setInterval(() => {
    timeLeft--;
    io.to(room.id).emit('game:tick', timeLeft);
    if (timeLeft <= 0) {
      clearInterval(tickInterval);
      resolveCategoryVote(room);
    }
  }, 1000);
  room.timer = tickInterval;
}

function resolveCategoryVote(room: Room) {
  clearTimer(room);

  const votes: Record<string, string> = {};
  let overrideUsed = false;
  let overrideBy: string | null = null;

  // Check for override
  const overridePlayer = room.players.find((p) => p.categoryVote?.startsWith('OVERRIDE:'));
  if (overridePlayer) {
    const cat = overridePlayer.categoryVote!.replace('OVERRIDE:', '');
    room.selectedCategory = cat;
    overrideUsed = true;
    overrideBy = overridePlayer.name;
    overridePlayer.usedOverride = true;
    overridePlayer.hasOverride = false;
    room.players.forEach((p) => { votes[p.id] = p.categoryVote?.replace('OVERRIDE:', '') || room.availableCategories[0]; });
  } else {
    room.players.forEach((p) => { votes[p.id] = p.categoryVote || room.availableCategories[0]; });

    const voteCounts: Record<string, number> = {};
    Object.values(votes).forEach((v) => { voteCounts[v] = (voteCounts[v] || 0) + 1; });

    const maxVotes = Math.max(...Object.values(voteCounts));
    const topCats = Object.keys(voteCounts).filter((c) => voteCounts[c] === maxVotes);
    room.selectedCategory = topCats[Math.floor(Math.random() * topCats.length)];
  }

  io.to(room.id).emit('game:category-result', {
    selectedCategory: room.selectedCategory!,
    votes,
    overrideUsed,
    overrideBy,
  });

  room.timer = setTimeout(() => {
    startPowerUpPhase(room);
  }, 3000);
}

function startPowerUpPhase(room: Room) {
  room.phase = 'power_up';
  room.currentPowerUps = {};

  room.players.forEach((p) => {
    const opponent = room.players.find((o) => o.id !== p.id);
    if (opponent) {
      io.to(p.id).emit('game:power-up-phase', {
        availablePowerUps: POWER_UPS,
        opponentId: opponent.id,
        opponentName: opponent.name,
        timeLimit: 8,
      });
    }
  });

  let timeLeft = 8;
  const tickInterval = setInterval(() => {
    timeLeft--;
    io.to(room.id).emit('game:tick', timeLeft);
    if (timeLeft <= 0) {
      clearInterval(tickInterval);
      startQuestion(room);
    }
  }, 1000);
  room.timer = tickInterval;
}

function checkAllPowerUpsSelected(room: Room): boolean {
  return room.players.every((p) => p.id in room.currentPowerUps);
}

function startQuestion(room: Room) {
  clearTimer(room);
  room.phase = 'question';

  const question = room.questions[room.currentQuestionIndex];
  room.players.forEach((p) => {
    p.currentAnswer = null;
    p.answeredAt = null;
    p.answered = false;
  });

  const questionStartTime = Date.now();

  io.to(room.id).emit('game:question', {
    questionNumber: room.currentQuestionIndex + 1,
    totalQuestions: room.totalRounds,
    question: question.question,
    answers: question.answers,
    category: question.category,
    difficulty: question.difficulty,
    timeLimit: room.roundTime,
    imageUrl: question.imageUrl,
    roundGroup: room.roundGroup,
    roundInGroup: room.roundInGroup,
  });

  // Send power-up effects after 1 second
  setTimeout(() => {
    room.players.forEach((p) => {
      const attackerEntry = Object.entries(room.currentPowerUps).find(
        ([attackerId, _]) => attackerId !== p.id
      );
      if (attackerEntry) {
        const [attackerId, powerUp] = attackerEntry;
        if (powerUp) {
          const attacker = room.players.find((pl) => pl.id === attackerId);
          io.to(p.id).emit('game:power-up-hit', {
            type: powerUp,
            fromPlayerName: attacker?.name || '?',
          });
          sendHostComment(room, 'powerUpUsed');
        }
      }
    });
  }, 1000);

  // Store start time on room for speed calc
  (room as any)._questionStartTime = questionStartTime;

  let timeLeft = room.roundTime;
  const tickInterval = setInterval(() => {
    timeLeft--;
    io.to(room.id).emit('game:tick', timeLeft);
    if (timeLeft <= 0) {
      clearInterval(tickInterval);
      revealAnswer(room);
    }
  }, 1000);
  room.timer = tickInterval;
}

function revealAnswer(room: Room) {
  clearTimer(room);

  const question = room.questions[room.currentQuestionIndex];
  room.phase = 'reveal';

  const questionStartTime = (room as any)._questionStartTime || Date.now();
  let speedBonusGiven = false;

  // Calculate scores with speed bonus
  const playerResults = room.players.map((p) => {
    const correct = p.currentAnswer === question.correctIndex;
    let pointsEarned = 0;
    const answerTime = p.answeredAt ? p.answeredAt - questionStartTime : null;

    if (correct) {
      pointsEarned = getBasePoints(question.difficulty);
      const bonus = getSpeedBonus(answerTime, room.roundTime);
      if (bonus > 0) speedBonusGiven = true;
      pointsEarned += bonus;
      p.score += pointsEarned;
    }

    return {
      id: p.id, name: p.name, avatarId: p.avatarId,
      score: p.score, pointsEarned, answer: p.currentAnswer,
      answerTime,
    };
  });

  // Host comment based on results
  const correctCount = playerResults.filter((p) => p.answer === question.correctIndex).length;
  if (correctCount === 2) sendHostComment(room, 'correctBoth');
  else if (correctCount === 1) sendHostComment(room, 'correctOne');
  else sendHostComment(room, 'bothWrong');

  io.to(room.id).emit('game:reveal', {
    correctIndex: question.correctIndex,
    players: playerResults,
    speedBonus: speedBonusGiven,
  });

  room.currentQuestionIndex++;
  room.roundInGroup++;

  room.timer = setTimeout(() => {
    advanceGameFlow(room);
  }, 4000);
}

function advanceGameFlow(room: Room) {
  // Check if group is done
  if (room.roundInGroup >= QUESTIONS_PER_GROUP) {
    room.roundInGroup = 0;

    // After group 0 or 1: mini-game
    if (room.roundGroup < TOTAL_GROUPS - 1) {
      startMiniGame(room);
      return;
    }

    // After group 2: pyramid
    startPyramidIntro(room);
    return;
  }

  // Next question in same group
  startCategoryVote(room);
}

function startMiniGame(room: Room) {
  room.phase = 'minigame';
  room.players.forEach((p) => { p.miniGameScore = 0; p.miniGameDone = false; });

  const game = room.miniGames[room.currentMiniGame];
  sendHostComment(room, 'miniGameStart');

  io.to(room.id).emit('game:minigame-start', {
    gameNumber: room.currentMiniGame + 1,
    game,
    timeLimit: 30,
  });

  let timeLeft = 30;
  const tickInterval = setInterval(() => {
    timeLeft--;
    io.to(room.id).emit('game:tick', timeLeft);
    if (timeLeft <= 0) {
      clearInterval(tickInterval);
      endMiniGame(room);
    }
  }, 1000);
  room.timer = tickInterval;
}

function checkAllMiniGameDone(room: Room): boolean {
  return room.players.every((p) => p.miniGameDone);
}

function endMiniGame(room: Room) {
  clearTimer(room);
  room.phase = 'minigame_results';

  // Award points based on mini-game scores
  room.players.forEach((p) => {
    p.score += p.miniGameScore * 5; // 5 points per correct match
  });

  io.to(room.id).emit('game:minigame-results', {
    players: room.players.map((p) => ({
      id: p.id, name: p.name, avatarId: p.avatarId,
      score: p.score, miniGameScore: p.miniGameScore,
    })),
  });

  room.currentMiniGame++;
  room.roundGroup++;

  room.timer = setTimeout(() => {
    startCategoryVote(room);
  }, 5000);
}

// ===== PYRAMID =====
function startPyramidIntro(room: Room) {
  room.phase = 'pyramid_intro';
  room.pyramidQuestionIndex = 0;

  sendHostComment(room, 'pyramidStart');

  // Starting position based on score difference
  const sorted = [...room.players].sort((a, b) => b.score - a.score);
  if (sorted.length === 2) {
    const scoreDiff = sorted[0].score - sorted[1].score;
    const headStart = Math.min(2, Math.floor(scoreDiff / 30)); // max 2 step advantage
    sorted[0].pyramidPosition = headStart;
    sorted[1].pyramidPosition = 0;
  }

  // Check close game
  const scores = room.players.map((p) => p.score);
  if (scores.length === 2 && Math.abs(scores[0] - scores[1]) <= 20) {
    sendHostComment(room, 'closeGame');
  }

  io.to(room.id).emit('game:pyramid-intro', {
    players: room.players.map((p) => ({
      id: p.id, name: p.name, avatarId: p.avatarId,
      score: p.score, startPosition: p.pyramidPosition,
    })),
    pyramidSize: room.pyramidSize,
  });

  room.timer = setTimeout(() => {
    nextPyramidQuestion(room);
  }, 5000);
}

function nextPyramidQuestion(room: Room) {
  // Check if someone reached the top
  const winner = room.players.find((p) => p.pyramidPosition >= room.pyramidSize);
  if (winner || room.pyramidQuestionIndex >= room.pyramidQuestions.length) {
    endGame(room);
    return;
  }

  room.phase = 'pyramid_question';
  const question = room.pyramidQuestions[room.pyramidQuestionIndex];
  room.players.forEach((p) => {
    p.currentAnswer = null;
    p.answeredAt = null;
    p.answered = false;
  });

  (room as any)._questionStartTime = Date.now();

  io.to(room.id).emit('game:pyramid-question', {
    question: question.question,
    answers: question.answers,
    category: question.category,
    timeLimit: 10,
    positions: Object.fromEntries(room.players.map((p) => [p.id, p.pyramidPosition])),
    pyramidSize: room.pyramidSize,
    imageUrl: question.imageUrl,
  });

  let timeLeft = 10;
  const tickInterval = setInterval(() => {
    timeLeft--;
    io.to(room.id).emit('game:tick', timeLeft);
    if (timeLeft <= 0) {
      clearInterval(tickInterval);
      revealPyramidAnswer(room);
    }
  }, 1000);
  room.timer = tickInterval;
}

function revealPyramidAnswer(room: Room) {
  clearTimer(room);
  room.phase = 'pyramid_reveal';

  const question = room.pyramidQuestions[room.pyramidQuestionIndex];

  const results = room.players.map((p) => {
    const correct = p.currentAnswer === question.correctIndex;
    if (correct) p.pyramidPosition++;
    return {
      id: p.id, name: p.name, avatarId: p.avatarId,
      answer: p.currentAnswer, correct, newPosition: p.pyramidPosition,
    };
  });

  io.to(room.id).emit('game:pyramid-reveal', {
    correctIndex: question.correctIndex,
    players: results,
    pyramidSize: room.pyramidSize,
  });

  room.pyramidQuestionIndex++;

  room.timer = setTimeout(() => {
    nextPyramidQuestion(room);
  }, 3000);
}

function endGame(room: Room) {
  clearTimer(room);
  room.phase = 'finished';

  // Final score = quiz score + pyramid bonus (position * 20)
  room.players.forEach((p) => {
    p.score += p.pyramidPosition * 20;
  });

  const sorted = [...room.players].sort((a, b) => b.score - a.score);
  const isTie = sorted.length === 2 && sorted[0].score === sorted[1].score;
  const winner = isTie ? null : sorted.length > 0 ? { id: sorted[0].id, name: sorted[0].name } : null;

  // Also check pyramid winner
  const pyramidWinner = room.players.find((p) => p.pyramidPosition >= room.pyramidSize);
  const finalWinner = pyramidWinner ? { id: pyramidWinner.id, name: pyramidWinner.name } : winner;

  io.to(room.id).emit('game:finished', {
    players: sorted.map((p) => ({ id: p.id, name: p.name, avatarId: p.avatarId, score: p.score })),
    winner: isTie ? null : finalWinner,
    funFact: getRandomFunFact(),
  });
}

// ===== SOCKET HANDLERS =====
io.on('connection', (socket) => {
  console.log(`Connected: ${socket.id}`);

  socket.on('room:create', async ({ playerName, avatarId, settings }) => {
    const roomId = generateRoomId();

    const player: Player = {
      id: socket.id, name: playerName, avatarId, score: 0,
      currentAnswer: null, answeredAt: null, answered: false,
      powerUps: [], hasOverride: true, categoryVote: null, usedOverride: false,
      miniGameScore: 0, miniGameDone: false, pyramidPosition: 0,
    };

    const room: Room = {
      id: roomId, players: [player], questions: [], currentQuestionIndex: 0,
      phase: 'waiting', roundTime: settings.roundTime, totalRounds: 9,
      timer: null, availableCategories: [], selectedCategory: null,
      currentPowerUps: {}, roundGroup: 0, roundInGroup: 0,
      miniGames: [], currentMiniGame: 0, pyramidQuestions: [],
      pyramidQuestionIndex: 0, pyramidSize: 5, hostComment: null,
      difficulty: settings.difficulty || 'mixed',
    };

    rooms.set(roomId, room);
    socket.join(roomId);
    socket.emit('room:created', roomId);
    socket.emit('room:joined', getRoomState(room));
  });

  socket.on('room:join', ({ roomId, playerName, avatarId }) => {
    const room = rooms.get(roomId.toUpperCase());
    if (!room) { socket.emit('error', 'Pokój nie istnieje'); return; }
    if (room.players.length >= 2) { socket.emit('error', 'Pokój jest pełny'); return; }
    if (room.phase !== 'waiting') { socket.emit('error', 'Gra już trwa'); return; }

    const player: Player = {
      id: socket.id, name: playerName, avatarId, score: 0,
      currentAnswer: null, answeredAt: null, answered: false,
      powerUps: [], hasOverride: true, categoryVote: null, usedOverride: false,
      miniGameScore: 0, miniGameDone: false, pyramidPosition: 0,
    };

    room.players.push(player);
    socket.join(roomId.toUpperCase());
    io.to(room.id).emit('room:player-joined', getPlayerInfo(player));
    socket.emit('room:joined', getRoomState(room));
  });

  socket.on('game:start', () => {
    const room = findRoom(socket.id);
    if (!room || room.players.length < 2 || room.phase !== 'waiting') return;
    startGame(room);
  });

  socket.on('game:category-vote', (category) => {
    const room = findRoom(socket.id);
    if (!room || room.phase !== 'category_vote') return;
    const player = room.players.find((p) => p.id === socket.id);
    if (!player || player.categoryVote) return;
    player.categoryVote = category;
    if (room.players.every((p) => p.categoryVote)) resolveCategoryVote(room);
  });

  socket.on('game:use-override', (category) => {
    const room = findRoom(socket.id);
    if (!room || room.phase !== 'category_vote') return;
    const player = room.players.find((p) => p.id === socket.id);
    if (!player || !player.hasOverride || player.usedOverride) return;
    player.categoryVote = 'OVERRIDE:' + category;
    if (room.players.every((p) => p.categoryVote)) resolveCategoryVote(room);
  });

  socket.on('game:power-up-select', ({ powerUp, targetId }) => {
    const room = findRoom(socket.id);
    if (!room || room.phase !== 'power_up') return;
    if (room.currentPowerUps[socket.id] !== undefined) return;
    room.currentPowerUps[socket.id] = powerUp;
    if (checkAllPowerUpsSelected(room)) { clearTimer(room); startQuestion(room); }
  });

  socket.on('game:power-up-skip', () => {
    const room = findRoom(socket.id);
    if (!room || room.phase !== 'power_up') return;
    if (room.currentPowerUps[socket.id] !== undefined) return;
    room.currentPowerUps[socket.id] = null;
    if (checkAllPowerUpsSelected(room)) { clearTimer(room); startQuestion(room); }
  });

  socket.on('game:answer', (answerIndex) => {
    const room = findRoom(socket.id);
    if (!room || room.phase !== 'question') return;
    const player = room.players.find((p) => p.id === socket.id);
    if (!player || player.answered) return;
    player.currentAnswer = answerIndex;
    player.answeredAt = Date.now();
    player.answered = true;
    if (room.players.every((p) => p.answered)) revealAnswer(room);
  });

  socket.on('game:minigame-result', (score) => {
    const room = findRoom(socket.id);
    if (!room || room.phase !== 'minigame') return;
    const player = room.players.find((p) => p.id === socket.id);
    if (!player || player.miniGameDone) return;
    player.miniGameScore = score;
    player.miniGameDone = true;
    if (checkAllMiniGameDone(room)) endMiniGame(room);
  });

  socket.on('game:pyramid-answer', (answerIndex) => {
    const room = findRoom(socket.id);
    if (!room || room.phase !== 'pyramid_question') return;
    const player = room.players.find((p) => p.id === socket.id);
    if (!player || player.answered) return;
    player.currentAnswer = answerIndex;
    player.answeredAt = Date.now();
    player.answered = true;
    if (room.players.every((p) => p.answered)) revealPyramidAnswer(room);
  });

  socket.on('disconnect', () => {
    for (const [roomId, room] of rooms.entries()) {
      const idx = room.players.findIndex((p) => p.id === socket.id);
      if (idx !== -1) {
        room.players.splice(idx, 1);
        io.to(roomId).emit('room:player-left', socket.id);
        if (room.players.length === 0) cleanupRoom(roomId);
        else if (room.phase !== 'waiting' && room.phase !== 'finished') endGame(room);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
