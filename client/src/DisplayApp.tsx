import { useState, useEffect } from 'react';
import { socket } from './socket';
import type {
  RoomState, QuestionData, RevealData, GameResult,
  CategoryVoteData, CategoryResultData,
  MiniGameData, MiniGameResultsData, PyramidIntroData, PyramidQuestionData, PyramidRevealData,
} from './types';
import { AVATARS } from './types';
import DisplayCountdownScreen from './display/DisplayCountdownScreen';
import DisplayLobbyScreen from './display/DisplayLobbyScreen';
import DisplayQuestionScreen from './display/DisplayQuestionScreen';
import DisplayRevealScreen from './display/DisplayRevealScreen';
import DisplayFinishedScreen from './display/DisplayFinishedScreen';
import DisplayCategoryScreen from './display/DisplayCategoryScreen';

type DisplayPhase =
  | 'enter-room'
  | 'lobby'
  | 'countdown'
  | 'category_vote'
  | 'category_result'
  | 'power_up'
  | 'question'
  | 'reveal'
  | 'minigame'
  | 'minigame_results'
  | 'pyramid_intro'
  | 'pyramid_question'
  | 'pyramid_reveal'
  | 'finished';

export default function DisplayApp() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlRoom = urlParams.get('room')?.toUpperCase() ?? null;

  const [, setRoomId] = useState<string | null>(urlRoom);
  const [inputRoom, setInputRoom] = useState('');
  const [phase, setPhase] = useState<DisplayPhase>(urlRoom ? 'lobby' : 'enter-room');
  const [room, setRoom] = useState<RoomState | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [reveal, setReveal] = useState<RevealData | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [categoryVote, setCategoryVote] = useState<CategoryVoteData | null>(null);
  const [categoryResult, setCategoryResult] = useState<CategoryResultData | null>(null);
  const [miniGameData, setMiniGameData] = useState<MiniGameData | null>(null);
  const [miniGameResults, setMiniGameResults] = useState<MiniGameResultsData | null>(null);
  const [, setPyramidIntro] = useState<PyramidIntroData | null>(null);
  const [pyramidQuestion, setPyramidQuestion] = useState<PyramidQuestionData | null>(null);
  const [, setPyramidReveal] = useState<PyramidRevealData | null>(null);
  // Track which players have already answered (populated from reveal data)
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());

  const joinRoom = (id: string) => {
    const upper = id.toUpperCase();
    setRoomId(upper);
    setError(null);
    if (socket.connected) {
      socket.emit('display:join', { roomId: upper });
    } else {
      socket.once('connect', () => {
        socket.emit('display:join', { roomId: upper });
      });
      socket.connect();
    }
  };

  useEffect(() => {
    if (urlRoom) {
      if (socket.connected) {
        socket.emit('display:join', { roomId: urlRoom });
      } else {
        socket.once('connect', () => {
          socket.emit('display:join', { roomId: urlRoom });
        });
        socket.connect();
      }
    }

    socket.on('room:joined', (roomState: RoomState) => {
      setRoom(roomState);
      setPhase('lobby');
      setError(null);
    });

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

    socket.on('game:countdown', (s: number) => {
      setCountdown(s);
      setPhase('countdown');
    });

    socket.on('game:category-vote', (data: CategoryVoteData) => {
      setCategoryVote(data);
      setCategoryResult(null);
      setTimeLeft(data.timeLimit);
      setPhase('category_vote');
    });

    socket.on('game:category-result', (data: CategoryResultData) => {
      setCategoryResult(data);
      setPhase('category_result');
    });

    socket.on('game:power-up-phase', () => {
      setPhase('power_up');
    });

    socket.on('game:question', (data: QuestionData) => {
      setQuestion(data);
      setTimeLeft(data.timeLimit);
      setAnsweredIds(new Set());
      setPhase('question');
    });

    socket.on('game:tick', (t: number) => {
      setTimeLeft(t);
    });

    socket.on('game:reveal', (data: RevealData) => {
      setReveal(data);
      setPhase('reveal');
      // Update scores and track who answered
      const answered = new Set(data.players.filter((p) => p.answer !== null).map((p) => p.id));
      setAnsweredIds(answered);
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
      setMiniGameData(data);
      setMiniGameResults(null);
      setTimeLeft(data.timeLimit);
      setPhase('minigame');
    });

    socket.on('game:minigame-results', (data: MiniGameResultsData) => {
      setMiniGameResults(data);
      setPhase('minigame_results');
    });

    socket.on('game:pyramid-intro', (data: PyramidIntroData) => {
      setPyramidIntro(data);
      setPhase('pyramid_intro');
    });

    socket.on('game:pyramid-question', (data: PyramidQuestionData) => {
      setPyramidQuestion(data);
      setPyramidReveal(null);
      setTimeLeft(data.timeLimit);
      setPhase('pyramid_question');
    });

    socket.on('game:pyramid-reveal', (data: PyramidRevealData) => {
      setPyramidReveal(data);
      setPhase('pyramid_reveal');
    });

    socket.on('game:finished', (data: GameResult) => {
      setResult(data);
      setPhase('finished');
    });

    socket.on('error', (msg: string) => {
      setError(msg);
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  // ── enter-room screen ──────────────────────────────────────────────────────

  if (phase === 'enter-room') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1.5rem', background: '#0a0a0f' }}>
        <h1 style={{ fontSize: '3rem', fontFamily: 'Orbitron, sans-serif', color: '#facc15', textShadow: '0 0 20px rgba(250,204,21,0.4)' }}>
          TRYB TV
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Wpisz kod pokoju aby podłączyć ekran</p>
        {error && <p style={{ color: '#ef4444' }}>{error}</p>}
        <input
          value={inputRoom}
          onChange={(e) => setInputRoom(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && inputRoom.length >= 4 && joinRoom(inputRoom)}
          placeholder="KOD POKOJU"
          maxLength={8}
          style={{
            fontSize: '2rem', padding: '0.75rem 1.5rem', textAlign: 'center',
            background: '#1a1a2e', border: '2px solid #facc15', borderRadius: '0.5rem',
            color: '#facc15', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.2em',
            outline: 'none',
          }}
        />
        <button
          onClick={() => inputRoom.length >= 4 && joinRoom(inputRoom)}
          style={{
            fontSize: '1.5rem', padding: '0.75rem 3rem',
            background: '#facc15', color: '#0a0a0f', border: 'none',
            borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold',
          }}
        >
          Połącz
        </button>
      </div>
    );
  }

  // ── main screens ───────────────────────────────────────────────────────────

  const placeholderStyle: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', height: '100vh', gap: '1rem', color: '#94a3b8',
    background: '#0a0a0f',
  };

  switch (phase) {
    case 'lobby':
      return room ? <DisplayLobbyScreen room={room} /> : <div style={placeholderStyle}><p>Łączenie...</p></div>;

    case 'countdown':
      return <DisplayCountdownScreen countdown={countdown} />;

    case 'category_vote':
    case 'category_result':
      return (
        <DisplayCategoryScreen
          categoryVote={categoryVote}
          categoryResult={phase === 'category_result' ? categoryResult : null}
          timeLeft={timeLeft}
        />
      );

    case 'power_up':
      return (
        <div style={placeholderStyle}>
          <p style={{ fontSize: '2rem', fontFamily: 'Orbitron, sans-serif', color: '#a855f7' }}>
            ⚡ Gracze wybierają zagrywki...
          </p>
        </div>
      );

    case 'question':
      return question && room ? (
        <DisplayQuestionScreen
          question={question}
          timeLeft={timeLeft}
          room={room}
          answeredIds={answeredIds}
        />
      ) : null;

    case 'reveal':
      return question && reveal ? (
        <DisplayRevealScreen question={question} reveal={reveal} />
      ) : null;

    case 'minigame':
    case 'minigame_results': {
      const sortedMini = miniGameResults
        ? [...miniGameResults.players].sort((a, b) => b.score - a.score)
        : null;
      return (
        <div style={placeholderStyle}>
          <p style={{ fontSize: '2rem', fontFamily: 'Orbitron, sans-serif', color: '#00F5FF' }}>
            🎮 Mini-gra {miniGameData?.gameNumber}
          </p>
          {sortedMini && (
            <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
              {sortedMini.map((p, i) => {
                const avatar = AVATARS.find((a) => a.id === p.avatarId) || AVATARS[0];
                return (
                  <div key={p.id} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem' }}>{avatar.emoji}</div>
                    <div style={{ color: '#fff', fontSize: '0.9rem' }}>{p.name}</div>
                    <div style={{ color: '#39FF14', fontFamily: 'Orbitron', fontWeight: 'bold' }}>
                      {i === 0 ? '🥇' : ''} {p.score}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    case 'pyramid_intro':
    case 'pyramid_question':
    case 'pyramid_reveal':
      return (
        <div style={placeholderStyle}>
          <p style={{ fontSize: '3rem', color: '#a855f7', fontFamily: 'Orbitron', fontWeight: 'bold', textShadow: '0 0 30px rgba(168,85,247,0.5)' }}>
            🔺 PIRAMIDA WIEDZY
          </p>
          {pyramidQuestion && (
            <p style={{ fontSize: '1.5rem', textAlign: 'center', maxWidth: '60vw', color: '#f1f5f9', marginTop: '1rem' }}>
              {pyramidQuestion.question}
            </p>
          )}
          {pyramidQuestion && (
            <p style={{ fontSize: '3rem', color: '#facc15', fontFamily: 'Orbitron', fontWeight: 'bold' }}>
              {timeLeft}s
            </p>
          )}
        </div>
      );

    case 'finished':
      return result ? <DisplayFinishedScreen result={result} /> : null;

    default:
      return null;
  }
}
