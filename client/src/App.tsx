import { useState, useEffect, useCallback } from 'react';
import { socket } from './socket';
import type { RoomState, QuestionData, RevealData, GameResult, GameScreen, GameSettings } from './types';
import HomeScreen from './components/HomeScreen';
import LobbyScreen from './components/LobbyScreen';
import CountdownScreen from './components/CountdownScreen';
import QuestionScreen from './components/QuestionScreen';
import RevealScreen from './components/RevealScreen';
import FinishedScreen from './components/FinishedScreen';

function App() {
  const [screen, setScreen] = useState<GameScreen>('home');
  const [room, setRoom] = useState<RoomState | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [reveal, setReveal] = useState<RevealData | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState('');

  const resetGame = useCallback(() => {
    setScreen('home');
    setRoom(null);
    setCountdown(3);
    setQuestion(null);
    setTimeLeft(0);
    setReveal(null);
    setResult(null);
    setError(null);
    socket.disconnect();
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      setPlayerId(socket.id || '');
    });

    socket.on('room:created', (_roomId: string) => {
      // Room ID is handled in room:joined
    });

    socket.on('room:joined', (roomState: RoomState) => {
      setRoom(roomState);
      setScreen('lobby');
      setError(null);
    });

    socket.on('room:player-joined', (player: { id: string; name: string }) => {
      setRoom(prev => {
        if (!prev) return prev;
        const exists = prev.players.some(p => p.id === player.id);
        if (exists) return prev;
        return {
          ...prev,
          players: [...prev.players, { ...player, score: 0 }],
        };
      });
    });

    socket.on('room:player-left', (leftPlayerId: string) => {
      setRoom(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          players: prev.players.filter(p => p.id !== leftPlayerId),
        };
      });
    });

    socket.on('game:countdown', (seconds: number) => {
      setCountdown(seconds);
      setScreen('countdown');
    });

    socket.on('game:question', (data: QuestionData) => {
      setQuestion(data);
      setTimeLeft(data.timeLimit);
      setScreen('question');
    });

    socket.on('game:tick', (time: number) => {
      setTimeLeft(time);
    });

    socket.on('game:reveal', (data: RevealData) => {
      setReveal(data);
      setScreen('reveal');
      // Update room scores
      setRoom(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          players: prev.players.map(p => {
            const updated = data.players.find(dp => dp.id === p.id);
            return updated ? { ...p, score: updated.score } : p;
          }),
        };
      });
    });

    socket.on('game:finished', (data: GameResult) => {
      setResult(data);
      setScreen('finished');
    });

    socket.on('error', (message: string) => {
      setError(message);
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  const handleCreateRoom = (name: string, settings: GameSettings) => {
    socket.connect();
    socket.emit('room:create', { playerName: name, settings });
  };

  const handleJoinRoom = (name: string, roomId: string) => {
    socket.connect();
    socket.emit('room:join', { roomId, playerName: name });
  };

  const handleStartGame = () => {
    socket.emit('game:start');
  };

  const handleAnswer = (answerIndex: number) => {
    socket.emit('game:answer', answerIndex);
  };

  const handlePlayAgain = () => {
    resetGame();
  };

  switch (screen) {
    case 'home':
      return (
        <HomeScreen
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          error={error}
        />
      );

    case 'lobby':
      return room ? (
        <LobbyScreen
          room={room}
          playerId={playerId}
          onStartGame={handleStartGame}
          onLeave={resetGame}
        />
      ) : null;

    case 'countdown':
      return <CountdownScreen count={countdown} />;

    case 'question':
      return question && room ? (
        <QuestionScreen
          question={question}
          timeLeft={timeLeft}
          room={room}
          playerId={playerId}
          onAnswer={handleAnswer}
        />
      ) : null;

    case 'reveal':
      return question && reveal ? (
        <RevealScreen
          question={question}
          reveal={reveal}
          playerId={playerId}
        />
      ) : null;

    case 'finished':
      return result ? (
        <FinishedScreen
          result={result}
          playerId={playerId}
          onPlayAgain={handlePlayAgain}
          onLeave={resetGame}
        />
      ) : null;

    default:
      return null;
  }
}

export default App;
