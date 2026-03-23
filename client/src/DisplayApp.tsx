import { useState, useEffect } from 'react';
import { socket } from './socket';
import type {
  RoomState, QuestionData, RevealData, GameResult,
  CategoryVoteData, CategoryResultData,
  MiniGameData, MiniGameResultsData, PyramidIntroData, PyramidQuestionData, PyramidRevealData,
} from './types';

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

  const joinRoom = (id: string) => {
    const upper = id.toUpperCase();
    setRoomId(upper);
    setError(null);
    socket.connect();
    socket.emit('display:join', { roomId: upper });
  };

  useEffect(() => {
    if (urlRoom) {
      socket.connect();
      socket.emit('display:join', { roomId: urlRoom });
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
      setPhase('question');
    });

    socket.on('game:tick', (t: number) => {
      setTimeLeft(t);
    });

    socket.on('game:reveal', (data: RevealData) => {
      setReveal(data);
      setPhase('reveal');
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1.5rem' }}>
        <h1 style={{ fontSize: '3rem', fontFamily: 'Orbitron, sans-serif', color: '#facc15' }}>
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

  // ── placeholder screens (zastąpione w krokach 4-8) ────────────────────────

  const placeholderStyle: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', height: '100vh', gap: '1rem', color: '#94a3b8',
  };

  switch (phase) {
    case 'lobby':
      return (
        <div style={placeholderStyle}>
          <p style={{ fontSize: '1rem', color: '#475569' }}>LOBBY — DisplayLobbyScreen (Krok 4)</p>
          <p style={{ fontSize: '2rem', color: '#facc15', fontFamily: 'Orbitron' }}>{room?.id}</p>
          <p>{room?.players.length ?? 0} graczy</p>
        </div>
      );
    case 'countdown':
      return (
        <div style={placeholderStyle}>
          <p style={{ fontSize: '8rem', color: '#facc15', fontFamily: 'Orbitron' }}>{countdown}</p>
        </div>
      );
    case 'category_vote':
    case 'category_result':
      return (
        <div style={placeholderStyle}>
          <p>Głosowanie na kategorię — {categoryVote?.categories.join(', ')}</p>
          {categoryResult && <p style={{ color: '#22c55e' }}>Wybrano: {categoryResult.selectedCategory}</p>}
        </div>
      );
    case 'power_up':
      return (
        <div style={placeholderStyle}>
          <p style={{ fontSize: '2rem' }}>Gracze wybierają zagrywki...</p>
        </div>
      );
    case 'question':
      return (
        <div style={placeholderStyle}>
          <p style={{ fontSize: '1rem', color: '#475569' }}>PYTANIE — DisplayQuestionScreen (Krok 4)</p>
          <p style={{ fontSize: '1.5rem', maxWidth: '60vw', textAlign: 'center', color: '#f1f5f9' }}>
            {question?.question}
          </p>
          <p style={{ fontSize: '3rem', color: '#facc15', fontFamily: 'Orbitron' }}>{timeLeft}s</p>
        </div>
      );
    case 'reveal':
      return (
        <div style={placeholderStyle}>
          <p style={{ fontSize: '1rem', color: '#475569' }}>REVEAL — DisplayRevealScreen (Krok 4)</p>
          {question && reveal && (
            <p style={{ fontSize: '1.5rem', color: '#22c55e' }}>
              Poprawna: {question.answers[reveal.correctIndex]}
            </p>
          )}
        </div>
      );
    case 'minigame':
    case 'minigame_results':
      return (
        <div style={placeholderStyle}>
          <p style={{ fontSize: '1.5rem' }}>Mini-gra {miniGameData?.gameNumber}</p>
          {miniGameResults && <p style={{ color: '#22c55e' }}>Wyniki mini-gry</p>}
        </div>
      );
    case 'pyramid_intro':
    case 'pyramid_question':
    case 'pyramid_reveal':
      return (
        <div style={placeholderStyle}>
          <p style={{ fontSize: '2rem', color: '#a855f7', fontFamily: 'Orbitron' }}>PIRAMIDA</p>
          {pyramidQuestion && (
            <p style={{ fontSize: '1.2rem', textAlign: 'center', maxWidth: '60vw' }}>
              {pyramidQuestion.question}
            </p>
          )}
        </div>
      );
    case 'finished':
      return (
        <div style={placeholderStyle}>
          <p style={{ fontSize: '1rem', color: '#475569' }}>KONIEC — DisplayFinishedScreen (Krok 4)</p>
          <p style={{ fontSize: '2rem', color: '#facc15', fontFamily: 'Orbitron' }}>
            {result?.winner?.name ?? 'Brak zwycięzcy'}
          </p>
        </div>
      );
    default:
      return null;
  }
}
