import { useState, useEffect, useCallback } from 'react';
import { socket } from './socket';
import type {
  RoomState, QuestionData, RevealData, GameResult, GameScreen, GameSettings,
  CategoryVoteData, CategoryResultData, PowerUpPhaseData, PowerUpHitData, PowerUpType,
  MiniGameData, MiniGameResultsData, PyramidIntroData, PyramidQuestionData, PyramidRevealData,
} from './types';
import HomeScreen from './components/HomeScreen';
import LobbyScreen from './components/LobbyScreen';
import CountdownScreen from './components/CountdownScreen';
import CategoryVoteScreen from './components/CategoryVoteScreen';
import PowerUpScreen from './components/PowerUpScreen';
import QuestionScreen from './components/QuestionScreen';
import RevealScreen from './components/RevealScreen';
import MiniGameScreen from './components/MiniGameScreen';
import { PyramidIntro, PyramidQuestion, PyramidReveal } from './components/PyramidScreen';
import FinishedScreen from './components/FinishedScreen';
import HostComment from './components/HostComment';

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
  const [hostComment, setHostComment] = useState<string | null>(null);

  // New state for features
  const [categoryVote, setCategoryVote] = useState<CategoryVoteData | null>(null);
  const [categoryResult, setCategoryResult] = useState<CategoryResultData | null>(null);
  const [powerUpPhase, setPowerUpPhase] = useState<PowerUpPhaseData | null>(null);
  const [powerUpHit, setPowerUpHit] = useState<PowerUpHitData | null>(null);
  const [miniGameData, setMiniGameData] = useState<MiniGameData | null>(null);
  const [miniGameResults, setMiniGameResults] = useState<MiniGameResultsData | null>(null);
  const [pyramidIntro, setPyramidIntro] = useState<PyramidIntroData | null>(null);
  const [pyramidQuestion, setPyramidQuestion] = useState<PyramidQuestionData | null>(null);
  const [pyramidReveal, setPyramidReveal] = useState<PyramidRevealData | null>(null);

  const resetGame = useCallback(() => {
    setScreen('home'); setRoom(null); setCountdown(3); setQuestion(null);
    setTimeLeft(0); setReveal(null); setResult(null); setError(null);
    setHostComment(null); setCategoryVote(null); setCategoryResult(null);
    setPowerUpPhase(null); setPowerUpHit(null); setMiniGameData(null);
    setMiniGameResults(null); setPyramidIntro(null); setPyramidQuestion(null);
    setPyramidReveal(null);
    socket.disconnect();
  }, []);

  useEffect(() => {
    socket.on('connect', () => setPlayerId(socket.id || ''));
    socket.on('room:created', () => {});
    socket.on('room:joined', (roomState: RoomState) => { setRoom(roomState); setScreen('lobby'); setError(null); });
    socket.on('room:player-joined', (player) => {
      setRoom((prev) => {
        if (!prev) return prev;
        if (prev.players.some((p) => p.id === player.id)) return prev;
        return { ...prev, players: [...prev.players, player] };
      });
    });
    socket.on('room:player-left', (leftId: string) => {
      setRoom((prev) => prev ? { ...prev, players: prev.players.filter((p) => p.id !== leftId) } : prev);
    });
    socket.on('game:countdown', (s: number) => { setCountdown(s); setScreen('countdown'); });

    socket.on('game:category-vote', (data: CategoryVoteData) => {
      setCategoryVote(data); setCategoryResult(null); setTimeLeft(data.timeLimit); setScreen('category_vote');
    });
    socket.on('game:category-result', (data: CategoryResultData) => {
      setCategoryResult(data); setScreen('category_result');
    });
    socket.on('game:power-up-phase', (data: PowerUpPhaseData) => {
      setPowerUpPhase(data); setPowerUpHit(null); setTimeLeft(data.timeLimit); setScreen('power_up');
    });
    socket.on('game:question', (data: QuestionData) => {
      setQuestion(data); setTimeLeft(data.timeLimit); setPowerUpHit(null); setScreen('question');
    });
    socket.on('game:tick', (t: number) => setTimeLeft(t));
    socket.on('game:power-up-hit', (data: PowerUpHitData) => setPowerUpHit(data));
    socket.on('game:reveal', (data: RevealData) => {
      setReveal(data); setScreen('reveal');
      setRoom((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          players: prev.players.map((p) => {
            const u = data.players.find((dp) => dp.id === p.id);
            return u ? { ...p, score: u.score } : p;
          }),
        };
      });
    });

    socket.on('game:minigame-start', (data: MiniGameData) => {
      setMiniGameData(data); setMiniGameResults(null); setTimeLeft(data.timeLimit); setScreen('minigame');
    });
    socket.on('game:minigame-results', (data: MiniGameResultsData) => {
      setMiniGameResults(data); setScreen('minigame_results');
    });

    socket.on('game:pyramid-intro', (data: PyramidIntroData) => {
      setPyramidIntro(data); setScreen('pyramid_intro');
    });
    socket.on('game:pyramid-question', (data: PyramidQuestionData) => {
      setPyramidQuestion(data); setPyramidReveal(null); setTimeLeft(data.timeLimit); setScreen('pyramid_question');
    });
    socket.on('game:pyramid-reveal', (data: PyramidRevealData) => {
      setPyramidReveal(data); setScreen('pyramid_reveal');
    });

    socket.on('game:finished', (data: GameResult) => { setResult(data); setScreen('finished'); });
    socket.on('game:host-comment', (c: string) => setHostComment(c));
    socket.on('error', (msg: string) => setError(msg));

    return () => { socket.removeAllListeners(); socket.disconnect(); };
  }, []);

  const handleCreateRoom = (name: string, avatarId: string, settings: GameSettings) => {
    socket.connect();
    socket.emit('room:create', { playerName: name, avatarId, settings });
  };

  const handleJoinRoom = (name: string, avatarId: string, roomId: string) => {
    socket.connect();
    socket.emit('room:join', { roomId, playerName: name, avatarId });
  };

  const myPlayer = room?.players.find((p) => p.id === playerId);

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <HomeScreen onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} error={error} />;
      case 'lobby':
        return room ? <LobbyScreen room={room} playerId={playerId} onStartGame={() => socket.emit('game:start')} onLeave={resetGame} /> : null;
      case 'countdown':
        return <CountdownScreen count={countdown} />;
      case 'category_vote':
      case 'category_result':
        return (
          <CategoryVoteScreen
            voteData={categoryVote} resultData={screen === 'category_result' ? categoryResult : null}
            hasOverride={myPlayer?.hasOverride || false} timeLeft={timeLeft}
            onVote={(cat) => socket.emit('game:category-vote', cat)}
            onOverride={(cat) => socket.emit('game:use-override', cat)}
          />
        );
      case 'power_up':
        return powerUpPhase ? (
          <PowerUpScreen data={powerUpPhase} timeLeft={timeLeft}
            onSelect={(pu: PowerUpType) => socket.emit('game:power-up-select', { powerUp: pu, targetId: powerUpPhase.opponentId })}
            onSkip={() => socket.emit('game:power-up-skip')}
          />
        ) : null;
      case 'question':
        return question && room ? (
          <QuestionScreen question={question} timeLeft={timeLeft} room={room} playerId={playerId}
            powerUpHit={powerUpHit} onAnswer={(i) => socket.emit('game:answer', i)}
          />
        ) : null;
      case 'reveal':
        return question && reveal ? <RevealScreen question={question} reveal={reveal} playerId={playerId} /> : null;
      case 'minigame':
      case 'minigame_results':
        return miniGameData ? (
          <MiniGameScreen data={miniGameData} resultsData={screen === 'minigame_results' ? miniGameResults : null}
            timeLeft={timeLeft} playerId={playerId}
            onResult={(score) => socket.emit('game:minigame-result', score)}
          />
        ) : null;
      case 'pyramid_intro':
        return pyramidIntro ? <PyramidIntro data={pyramidIntro} playerId={playerId} /> : null;
      case 'pyramid_question':
        return pyramidQuestion ? (
          <PyramidQuestion data={pyramidQuestion} timeLeft={timeLeft} playerId={playerId}
            onAnswer={(i) => socket.emit('game:pyramid-answer', i)}
          />
        ) : null;
      case 'pyramid_reveal':
        return pyramidReveal ? <PyramidReveal data={pyramidReveal} playerId={playerId} /> : null;
      case 'finished':
        return result ? <FinishedScreen result={result} playerId={playerId} onPlayAgain={resetGame} onLeave={resetGame} /> : null;
      default:
        return null;
    }
  };

  return (
    <>
      <HostComment comment={hostComment} />
      {renderScreen()}
    </>
  );
}

export default App;
