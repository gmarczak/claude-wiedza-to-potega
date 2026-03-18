import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import {
  Room,
  Player,
  GameSettings,
  ServerToClientEvents,
  ClientToServerEvents,
  RoomState,
} from './types';
import { getQuestions } from './questions';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const rooms = new Map<string, Room>();

function generateRoomId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function getRoomState(room: Room): RoomState {
  return {
    id: room.id,
    players: room.players.map((p) => ({ id: p.id, name: p.name, score: p.score })),
    state: room.state,
    currentQuestionIndex: room.currentQuestionIndex,
    totalRounds: room.totalRounds,
  };
}

function cleanupRoom(roomId: string) {
  const room = rooms.get(roomId);
  if (room?.timer) {
    clearTimeout(room.timer);
    clearInterval(room.timer);
  }
  rooms.delete(roomId);
}

async function startGame(room: Room) {
  room.state = 'countdown';
  io.to(room.id).emit('game:countdown', 3);

  let countdown = 3;
  const countdownInterval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      io.to(room.id).emit('game:countdown', countdown);
    } else {
      clearInterval(countdownInterval);
      nextQuestion(room);
    }
  }, 1000);
}

function nextQuestion(room: Room) {
  if (room.currentQuestionIndex >= room.questions.length) {
    endGame(room);
    return;
  }

  const question = room.questions[room.currentQuestionIndex];
  room.state = 'question';

  // Reset player answers
  room.players.forEach((p) => {
    p.currentAnswer = null;
    p.answered = false;
  });

  io.to(room.id).emit('game:question', {
    questionNumber: room.currentQuestionIndex + 1,
    totalQuestions: room.totalRounds,
    question: question.question,
    answers: question.answers,
    category: question.category,
    difficulty: question.difficulty,
    timeLimit: room.roundTime,
  });

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

function checkAllAnswered(room: Room): boolean {
  return room.players.every((p) => p.answered);
}

function revealAnswer(room: Room) {
  if (room.timer) {
    clearInterval(room.timer);
    room.timer = null;
  }

  const question = room.questions[room.currentQuestionIndex];
  room.state = 'reveal';

  // Calculate scores
  room.players.forEach((p) => {
    if (p.currentAnswer === question.correctIndex) {
      p.score += getPoints(question.difficulty);
    }
  });

  io.to(room.id).emit('game:reveal', {
    correctIndex: question.correctIndex,
    players: room.players.map((p) => ({
      id: p.id,
      name: p.name,
      score: p.score,
      answer: p.currentAnswer,
    })),
  });

  room.currentQuestionIndex++;

  // Wait 4 seconds then move to next question
  room.timer = setTimeout(() => {
    nextQuestion(room);
  }, 4000);
}

function getPoints(difficulty: string): number {
  switch (difficulty) {
    case 'easy':
      return 10;
    case 'medium':
      return 20;
    case 'hard':
      return 30;
    default:
      return 10;
  }
}

function endGame(room: Room) {
  room.state = 'finished';

  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);
  const winner =
    sortedPlayers.length > 0 && sortedPlayers[0].score > 0
      ? { id: sortedPlayers[0].id, name: sortedPlayers[0].name }
      : null;

  // Check for tie
  const isTie =
    sortedPlayers.length === 2 && sortedPlayers[0].score === sortedPlayers[1].score;

  io.to(room.id).emit('game:finished', {
    players: sortedPlayers.map((p) => ({ id: p.id, name: p.name, score: p.score })),
    winner: isTie ? null : winner,
  });
}

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  socket.on('room:create', async ({ playerName, settings }) => {
    const roomId = generateRoomId();

    const questions = await getQuestions(
      settings.totalRounds,
      settings.difficulty
    );

    const player: Player = {
      id: socket.id,
      name: playerName,
      score: 0,
      currentAnswer: null,
      answered: false,
    };

    const room: Room = {
      id: roomId,
      players: [player],
      questions,
      currentQuestionIndex: 0,
      state: 'waiting',
      roundTime: settings.roundTime,
      totalRounds: settings.totalRounds,
      timer: null,
    };

    rooms.set(roomId, room);
    socket.join(roomId);

    socket.emit('room:created', roomId);
    socket.emit('room:joined', getRoomState(room));
  });

  socket.on('room:join', ({ roomId, playerName }) => {
    const room = rooms.get(roomId.toUpperCase());

    if (!room) {
      socket.emit('error', 'Pokój nie istnieje');
      return;
    }

    if (room.players.length >= 2) {
      socket.emit('error', 'Pokój jest pełny');
      return;
    }

    if (room.state !== 'waiting') {
      socket.emit('error', 'Gra już trwa');
      return;
    }

    const player: Player = {
      id: socket.id,
      name: playerName,
      score: 0,
      currentAnswer: null,
      answered: false,
    };

    room.players.push(player);
    socket.join(roomId.toUpperCase());

    io.to(room.id).emit('room:player-joined', { id: player.id, name: player.name });
    socket.emit('room:joined', getRoomState(room));
  });

  socket.on('game:start', () => {
    const room = [...rooms.values()].find((r) =>
      r.players.some((p) => p.id === socket.id)
    );

    if (!room) return;
    if (room.players.length < 2) {
      socket.emit('error', 'Potrzeba 2 graczy aby rozpocząć grę');
      return;
    }
    if (room.state !== 'waiting') return;

    startGame(room);
  });

  socket.on('game:answer', (answerIndex) => {
    const room = [...rooms.values()].find((r) =>
      r.players.some((p) => p.id === socket.id)
    );

    if (!room || room.state !== 'question') return;

    const player = room.players.find((p) => p.id === socket.id);
    if (!player || player.answered) return;

    player.currentAnswer = answerIndex;
    player.answered = true;

    if (checkAllAnswered(room)) {
      revealAnswer(room);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);

    for (const [roomId, room] of rooms.entries()) {
      const playerIndex = room.players.findIndex((p) => p.id === socket.id);

      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        io.to(roomId).emit('room:player-left', socket.id);

        if (room.players.length === 0) {
          cleanupRoom(roomId);
        } else if (room.state !== 'waiting' && room.state !== 'finished') {
          // If a player leaves during a game, end it
          endGame(room);
        }

        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
