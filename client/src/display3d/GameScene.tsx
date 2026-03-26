import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import StudioStage from './StudioStage';
import CameraController from './CameraController';
import Character3D from './Character3D';
import QuestionBoard from './QuestionBoard';
import AnswerPanels from './AnswerPanels';
import TimerBar3D from './TimerBar3D';
import ScoreBoard3D from './ScoreBoard3D';
import CountdownOverlay from './CountdownOverlay';
import ParticleEffects from './ParticleEffects';
import Pyramid3D from './Pyramid3D';
import CategoryCards3D from './CategoryCards3D';
import type {
  RoomState, QuestionData, RevealData, GameResult,
  CategoryVoteData, CategoryResultData,
  MiniGameData, MiniGameResultsData,
  PyramidIntroData, PyramidQuestionData, PyramidRevealData,
} from '../types';
import { AVATARS } from '../types';

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

export interface GameSceneProps {
  phase: DisplayPhase;
  room: RoomState | null;
  countdown: number;
  question: QuestionData | null;
  timeLeft: number;
  reveal: RevealData | null;
  result: GameResult | null;
  categoryVote: CategoryVoteData | null;
  categoryResult: CategoryResultData | null;
  miniGameData: MiniGameData | null;
  miniGameResults: MiniGameResultsData | null;
  pyramidIntro: PyramidIntroData | null;
  pyramidQuestion: PyramidQuestionData | null;
  pyramidReveal: PyramidRevealData | null;
  answeredIds: Set<string>;
}

export default function GameScene(props: GameSceneProps) {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a0f' }}>
      <Canvas
        camera={{ position: [0, 3, 12], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#0a0a0f' }}
      >
        <Suspense fallback={null}>
          <SceneContent {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function SceneContent(props: GameSceneProps) {
  const {
    phase, room, countdown, question, timeLeft, reveal, result,
    categoryVote, categoryResult,
    miniGameData, miniGameResults,
    pyramidIntro, pyramidQuestion, pyramidReveal,
    answeredIds,
  } = props;

  // Character positions in a semicircle
  const playerPositions = useMemo(() => {
    if (!room?.players) return [];
    const count = room.players.length;
    const spread = Math.min(count * 1.8, 8);
    return room.players.map((p, i) => {
      const t = count > 1 ? i / (count - 1) : 0.5;
      const x = (t - 0.5) * spread;
      return { ...p, pos: [x, 0, 2] as [number, number, number] };
    });
  }, [room?.players]);

  // Determine character reactions based on phase
  const getReaction = (playerId: string): 'idle' | 'correct' | 'wrong' | 'hit' | 'celebrate' => {
    if (phase === 'reveal' && reveal) {
      const p = reveal.players.find((rp) => rp.id === playerId);
      if (p) return p.answer === reveal.correctIndex ? 'correct' : 'wrong';
    }
    if (phase === 'finished' && result?.winner?.id === playerId) return 'celebrate';
    return 'idle';
  };

  const isPyramidPhase = phase === 'pyramid_intro' || phase === 'pyramid_question' || phase === 'pyramid_reveal';

  return (
    <>
      {/* Camera always active */}
      <CameraController phase={phase} />

      {/* Stage always present */}
      <StudioStage />

      {/* ── LOBBY ────────────────────────────────── */}
      {phase === 'lobby' && room && (
        <>
          {playerPositions.map((p, i) => (
            <Character3D
              key={p.id}
              avatarId={p.avatarId}
              name={p.name}
              position={p.pos}
              score={p.score}
              reaction="idle"
              delay={i * 0.3}
            />
          ))}
          <LobbyInfo room={room} />
        </>
      )}

      {/* ── COUNTDOWN ────────────────────────────── */}
      {phase === 'countdown' && (
        <>
          {playerPositions.map((p) => (
            <Character3D
              key={p.id}
              avatarId={p.avatarId}
              name={p.name}
              position={p.pos}
              score={p.score}
              reaction="idle"
            />
          ))}
          <CountdownOverlay countdown={countdown} />
        </>
      )}

      {/* ── CATEGORY VOTE / RESULT ───────────────── */}
      {(phase === 'category_vote' || phase === 'category_result') && (
        <>
          {playerPositions.map((p) => (
            <Character3D
              key={p.id}
              avatarId={p.avatarId}
              name={p.name}
              position={p.pos}
              score={p.score}
              reaction="idle"
            />
          ))}
          <CategoryCards3D
            categoryVote={categoryVote}
            categoryResult={phase === 'category_result' ? categoryResult : null}
            timeLeft={timeLeft}
          />
        </>
      )}

      {/* ── POWER UP ─────────────────────────────── */}
      {phase === 'power_up' && (
        <>
          {playerPositions.map((p) => (
            <Character3D
              key={p.id}
              avatarId={p.avatarId}
              name={p.name}
              position={p.pos}
              score={p.score}
              reaction="idle"
            />
          ))}
          <PowerUpOverlay />
        </>
      )}

      {/* ── QUESTION ─────────────────────────────── */}
      {phase === 'question' && question && room && (
        <>
          {playerPositions.map((p) => (
            <Character3D
              key={p.id}
              avatarId={p.avatarId}
              name={p.name}
              position={p.pos}
              score={p.score}
              reaction="idle"
              answered={answeredIds.has(p.id)}
            />
          ))}
          <QuestionBoard
            question={question.question}
            category={question.category}
            difficulty={question.difficulty}
            questionNumber={question.questionNumber}
            totalQuestions={question.totalQuestions}
            imageUrl={question.imageUrl}
          />
          <AnswerPanels answers={question.answers} correctIndex={null} phase="question" />
          <TimerBar3D timeLeft={timeLeft} maxTime={question.timeLimit} />
          <ScoreBoard3D players={room.players} />
        </>
      )}

      {/* ── REVEAL ───────────────────────────────── */}
      {phase === 'reveal' && question && reveal && room && (
        <>
          {playerPositions.map((p) => (
            <Character3D
              key={p.id}
              avatarId={p.avatarId}
              name={p.name}
              position={p.pos}
              score={reveal.players.find((rp) => rp.id === p.id)?.score ?? p.score}
              reaction={getReaction(p.id)}
            />
          ))}
          <QuestionBoard
            question={question.question}
            category={question.category}
            difficulty={question.difficulty}
            questionNumber={question.questionNumber}
            totalQuestions={question.totalQuestions}
            imageUrl={question.imageUrl}
          />
          <AnswerPanels answers={question.answers} correctIndex={reveal.correctIndex} phase="reveal" />
          <ScoreBoard3D players={room.players} />

          {/* Confetti for correct answers */}
          {reveal.players
            .filter((p) => p.answer === reveal.correctIndex)
            .map((p) => {
              const pp = playerPositions.find((pp) => pp.id === p.id);
              return pp ? (
                <ParticleEffects
                  key={`confetti-${p.id}`}
                  type="sparkle"
                  position={[pp.pos[0], pp.pos[1] + 2, pp.pos[2]]}
                  active={true}
                  color={AVATARS.find((a) => a.id === pp.avatarId)?.color}
                />
              ) : null;
            })}
        </>
      )}

      {/* ── MINIGAME ─────────────────────────────── */}
      {(phase === 'minigame' || phase === 'minigame_results') && (
        <>
          {playerPositions.map((p) => (
            <Character3D
              key={p.id}
              avatarId={p.avatarId}
              name={p.name}
              position={p.pos}
              score={p.score}
              reaction="idle"
            />
          ))}
          <MiniGameOverlay
            miniGameData={miniGameData}
            miniGameResults={miniGameResults}
            phase={phase}
          />
        </>
      )}

      {/* ── PYRAMID ──────────────────────────────── */}
      {isPyramidPhase && (pyramidIntro || pyramidQuestion) && (
        <Pyramid3D
          players={
            pyramidIntro
              ? pyramidIntro.players.map((p) => ({ id: p.id, name: p.name, avatarId: p.avatarId, position: p.startPosition }))
              : pyramidQuestion
              ? Object.entries(pyramidQuestion.positions).map(([id, pos]) => {
                  const player = room?.players.find((p) => p.id === id);
                  return { id, name: player?.name ?? '?', avatarId: player?.avatarId ?? 'robot', position: pos };
                })
              : []
          }
          pyramidSize={pyramidIntro?.pyramidSize ?? pyramidQuestion?.pyramidSize ?? 5}
          phase={phase === 'pyramid_intro' ? 'intro' : phase === 'pyramid_question' ? 'question' : 'reveal'}
          question={pyramidQuestion?.question}
          answers={pyramidQuestion?.answers}
          correctIndex={pyramidReveal?.correctIndex}
          timeLeft={timeLeft}
          revealPlayers={pyramidReveal?.players.map((p) => ({
            id: p.id,
            correct: p.correct,
            newPosition: p.newPosition,
          }))}
        />
      )}

      {/* ── FINISHED ─────────────────────────────── */}
      {phase === 'finished' && result && (
        <FinishedScene result={result} />
      )}
    </>
  );
}

// ── Sub-components ──────────────────────────────────────────

function LobbyInfo({ room }: { room: RoomState }) {
  const playerUrl = `${window.location.origin}/?mode=player`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(playerUrl)}`;

  return (
    <Html position={[0, 4.5, -2]} center distanceFactor={5} transform>
      <div style={{ textAlign: 'center', userSelect: 'none' }}>
        <div
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '48px',
            fontWeight: '900',
            color: '#FFE033',
            textShadow: '0 0 30px rgba(255,224,51,0.5)',
            letterSpacing: '0.15em',
          }}
        >
          {room.id}
        </div>
        <div style={{ color: '#94a3b8', fontSize: '14px', margin: '8px 0', fontFamily: 'Exo 2, sans-serif' }}>
          Zeskanuj QR lub wejdź na stronę i wpisz kod
        </div>
        <img
          src={qrUrl}
          alt="QR code"
          style={{ width: '120px', height: '120px', borderRadius: '8px', border: '2px solid #FFE033' }}
        />
        <div style={{ color: '#64748b', fontSize: '12px', marginTop: '8px', fontFamily: 'Exo 2, sans-serif' }}>
          {room.players.length} gracz{room.players.length === 1 ? '' : 'y'} w pokoju
        </div>
      </div>
    </Html>
  );
}

function PowerUpOverlay() {
  return (
    <Html position={[0, 3.5, 0]} center distanceFactor={5} transform>
      <div
        style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '32px',
          fontWeight: '900',
          color: '#a855f7',
          textShadow: '0 0 30px rgba(168,85,247,0.6)',
          userSelect: 'none',
          textAlign: 'center',
        }}
      >
        ⚡ ZAGRYWKI
        <div style={{ fontSize: '16px', color: '#94a3b8', fontFamily: 'Exo 2, sans-serif', marginTop: '8px', fontWeight: 'normal' }}>
          Gracze wybierają zagrywki na telefonach...
        </div>
      </div>
    </Html>
  );
}

function MiniGameOverlay({
  miniGameData,
  miniGameResults,
  phase,
}: {
  miniGameData: MiniGameData | null;
  miniGameResults: MiniGameResultsData | null;
  phase: string;
}) {
  return (
    <Html position={[0, 3.5, 0]} center distanceFactor={5} transform>
      <div style={{ textAlign: 'center', userSelect: 'none' }}>
        <div
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '32px',
            fontWeight: '900',
            color: '#00F5FF',
            textShadow: '0 0 30px rgba(0,245,255,0.5)',
          }}
        >
          🎮 MINI-GRA {miniGameData?.gameNumber}
        </div>
        {miniGameData?.game?.title && (
          <div style={{ color: '#e2e8f0', fontSize: '18px', fontFamily: 'Exo 2, sans-serif', marginTop: '8px' }}>
            {miniGameData.game.title}
          </div>
        )}
        {phase === 'minigame' && (
          <div style={{ color: '#94a3b8', fontSize: '14px', fontFamily: 'Exo 2, sans-serif', marginTop: '8px' }}>
            Gracze grają na telefonach...
          </div>
        )}
        {phase === 'minigame_results' && miniGameResults && (
          <div style={{ marginTop: '16px', display: 'flex', gap: '24px', justifyContent: 'center' }}>
            {[...miniGameResults.players]
              .sort((a, b) => b.miniGameScore - a.miniGameScore)
              .map((p, i) => {
                const avatar = AVATARS.find((a) => a.id === p.avatarId) || AVATARS[0];
                return (
                  <div key={p.id} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px' }}>{avatar.emoji}</div>
                    <div style={{ color: '#e2e8f0', fontSize: '13px', fontFamily: 'Exo 2, sans-serif' }}>{p.name}</div>
                    <div
                      style={{
                        color: i === 0 ? '#FFE033' : '#39FF14',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        fontFamily: 'Orbitron, sans-serif',
                      }}
                    >
                      {i === 0 && '🥇 '}
                      {p.miniGameScore} pkt
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </Html>
  );
}

function FinishedScene({
  result,
}: {
  result: GameResult;
}) {
  const sorted = [...result.players].sort((a, b) => b.score - a.score);

  // Podium positions: 1st center (highest), 2nd left, 3rd right
  const podiumPositions: [number, number, number][] = [
    [0, 1.5, 1],     // 1st place
    [-2.5, 0.9, 1],  // 2nd place
    [2.5, 0.5, 1],   // 3rd place
  ];
  const podiumHeights = [1.5, 0.9, 0.5];

  return (
    <>
      {/* Podium blocks */}
      {podiumPositions.map((pos, i) => (
        <mesh key={i} position={[pos[0], pos[1] / 2, pos[2]]} castShadow>
          <boxGeometry args={[1.8, podiumHeights[i], 1.2]} />
          <meshStandardMaterial
            color={i === 0 ? '#FFE033' : i === 1 ? '#C0C0C0' : '#CD7F32'}
            emissive={i === 0 ? '#FFE033' : i === 1 ? '#C0C0C0' : '#CD7F32'}
            emissiveIntensity={i === 0 ? 0.5 : 0.2}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Place labels */}
      {['1', '2', '3'].map((label, i) => (
        <Html key={i} position={[podiumPositions[i][0], 0.1, podiumPositions[i][2] + 0.65]} center distanceFactor={7} transform>
          <span style={{ fontFamily: 'Orbitron', fontSize: '24px', fontWeight: '900', color: '#0a0a0f' }}>
            {label}
          </span>
        </Html>
      ))}

      {/* Characters on podiums */}
      {sorted.slice(0, 3).map((p, i) => {
        const pos = podiumPositions[i];
        return (
          <Character3D
            key={p.id}
            avatarId={p.avatarId}
            name={p.name}
            position={[pos[0], pos[1] + 0.2, pos[2]]}
            score={p.score}
            reaction={i === 0 ? 'celebrate' : 'idle'}
            showScore={true}
          />
        );
      })}

      {/* Remaining players at ground level */}
      {sorted.slice(3).map((p, i) => (
        <Character3D
          key={p.id}
          avatarId={p.avatarId}
          name={p.name}
          position={[-3 + i * 2, 0, 3]}
          score={p.score}
          reaction="idle"
          showScore={true}
        />
      ))}

      {/* Winner confetti */}
      {result.winner && (
        <ParticleEffects
          type="confetti"
          position={[podiumPositions[0][0], podiumPositions[0][1] + 3, podiumPositions[0][2]]}
          active={true}
          count={120}
        />
      )}

      {/* Winner spotlight */}
      <spotLight
        position={[0, 8, 3]}
        target-position={[0, 2, 1]}
        angle={0.3}
        penumbra={0.5}
        intensity={3}
        color="#FFE033"
      />

      {/* Title + Fun fact */}
      <Html position={[0, 5.5, -1]} center distanceFactor={5} transform>
        <div style={{ textAlign: 'center', userSelect: 'none' }}>
          <div
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '36px',
              fontWeight: '900',
              color: '#FFE033',
              textShadow: '0 0 30px rgba(255,224,51,0.6)',
              marginBottom: '12px',
            }}
          >
            {result.winner ? `🏆 ${result.winner.name} WYGRYWA!` : '🤝 REMIS!'}
          </div>
          <div
            style={{
              fontFamily: 'Exo 2, sans-serif',
              fontSize: '14px',
              color: '#94a3b8',
              maxWidth: '400px',
              lineHeight: '1.4',
            }}
          >
            💡 {result.funFact}
          </div>
        </div>
      </Html>
    </>
  );
}
