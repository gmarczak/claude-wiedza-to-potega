import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { GameSceneProps } from '../display3d/GameScene';
import type { RoomState, QuestionData, RevealData, GameResult, CategoryVoteData, CategoryResultData, MiniGameResultsData, PyramidIntroData, PyramidQuestionData, PyramidRevealData } from '../types';

// ── Mock canvas 2D context (jsdom has no real canvas) ──────────────────────────
const mockCtx = {
  fillStyle: '',
  font: '',
  textAlign: '',
  textBaseline: '',
  fillRect: vi.fn(),
  fillText: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
  putImageData: vi.fn(),
};
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockCtx) as unknown as typeof HTMLCanvasElement.prototype.getContext;

// ── Mock R3F and Drei ──────────────────────────────────────────────────────────
// jsdom does not support WebGL, so we mock the 3D layer and test the HTML overlays

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="r3f-canvas">{children}</div>,
  useFrame: () => {},
  useThree: () => ({ camera: { position: { lerp: vi.fn() }, lookAt: vi.fn() } }),
}));

vi.mock('@react-three/drei', () => ({
  Html: ({ children }: { children: React.ReactNode }) => <div data-testid="html-overlay">{children}</div>,
}));

// Mock Three.js classes that are used directly
vi.mock('three', () => {
  class Vector3 {
    x: number; y: number; z: number;
    constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; }
    set(x: number, y: number, z: number) { this.x = x; this.y = y; this.z = z; return this; }
    lerp() { return this; }
    copy() { return this; }
  }
  class Color {
    r = 1; g = 1; b = 1;
    constructor() {}
    set() { return this; }
  }
  class CanvasTexture { needsUpdate = false; constructor() {} }
  class MeshStandardMaterial {
    color = new Color();
    emissive = new Color();
    emissiveIntensity = 0.5;
    opacity = 1;
    constructor() {}
  }
  class BoxGeometry { constructor() {} }
  class SphereGeometry { constructor() {} }
  class PlaneGeometry { constructor() {} }
  class Object3D {
    position = new Vector3();
    rotation = { set: () => {}, x: 0, y: 0, z: 0 };
    scale = { setScalar: () => {}, x: 1, y: 1, z: 1 };
    matrix = {};
    updateMatrix() {}
  }
  class GridHelper { material = { opacity: 0.15 }; constructor() {} }
  class EdgesGeometry { constructor() {} }
  class LineBasicMaterial { constructor() {} }
  class CylinderGeometry { constructor() {} }
  class CapsuleGeometry { constructor() {} }
  class ConeGeometry { constructor() {} }
  class TorusGeometry { constructor() {} }
  class OctahedronGeometry { constructor() {} }

  const MathUtils = {
    lerp: (a: number, b: number, t: number) => a + (b - a) * t,
  };

  return {
    Vector3, Color, CanvasTexture, MeshStandardMaterial,
    BoxGeometry, SphereGeometry, PlaneGeometry, Object3D,
    GridHelper, EdgesGeometry, LineBasicMaterial,
    CylinderGeometry, CapsuleGeometry, ConeGeometry, TorusGeometry, OctahedronGeometry,
    MathUtils, DoubleSide: 2,
  };
});

// ── Fixtures ───────────────────────────────────────────────────────────────────

const room: RoomState = {
  id: 'TEST42',
  phase: 'waiting',
  currentQuestionIndex: 0,
  totalRounds: 9,
  players: [
    { id: 'p1', name: 'Ala', avatarId: 'robot', score: 50, hasOverride: true },
    { id: 'p2', name: 'Bob', avatarId: 'alien', score: 30, hasOverride: true },
    { id: 'p3', name: 'Ewa', avatarId: 'wizard', score: 10, hasOverride: false },
  ],
};

const question: QuestionData = {
  questionNumber: 3,
  totalQuestions: 9,
  question: 'Ile nóg ma pająk?',
  answers: ['6', '8', '10', '12'],
  category: 'Biologia',
  difficulty: 'easy',
  timeLimit: 20,
  roundGroup: 0,
  roundInGroup: 2,
};

const reveal: RevealData = {
  correctIndex: 1,
  speedBonus: true,
  players: [
    { id: 'p1', name: 'Ala', avatarId: 'robot', score: 70, pointsEarned: 20, answer: 1, answerTime: 3000 },
    { id: 'p2', name: 'Bob', avatarId: 'alien', score: 30, pointsEarned: 0, answer: 0, answerTime: 5000 },
    { id: 'p3', name: 'Ewa', avatarId: 'wizard', score: 20, pointsEarned: 10, answer: 1, answerTime: 8000 },
  ],
};

const gameResult: GameResult = {
  players: [
    { id: 'p1', name: 'Ala', avatarId: 'robot', score: 200 },
    { id: 'p2', name: 'Bob', avatarId: 'alien', score: 150 },
    { id: 'p3', name: 'Ewa', avatarId: 'wizard', score: 80 },
  ],
  winner: { id: 'p1', name: 'Ala' },
  funFact: 'Ośmiornica ma trzy serca.',
};

const defaultProps: GameSceneProps = {
  phase: 'lobby',
  room: null,
  countdown: 3,
  question: null,
  timeLeft: 0,
  reveal: null,
  result: null,
  categoryVote: null,
  categoryResult: null,
  miniGameData: null,
  miniGameResults: null,
  pyramidIntro: null,
  pyramidQuestion: null,
  pyramidReveal: null,
  answeredIds: new Set(),
};

// ── Lazy import after mocks are set up ─────────────────────────────────────────

let GameScene: typeof import('../display3d/GameScene').default;

beforeEach(async () => {
  const mod = await import('../display3d/GameScene');
  GameScene = mod.default;
});

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('GameScene — R3F Canvas setup', () => {
  it('renders the R3F canvas container', () => {
    render(<GameScene {...defaultProps} />);
    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();
  });
});

describe('GameScene — Lobby phase', () => {
  it('shows room code in the lobby', () => {
    render(<GameScene {...defaultProps} phase="lobby" room={room} />);
    expect(screen.getByText('TEST42')).toBeInTheDocument();
  });

  it('shows player count', () => {
    render(<GameScene {...defaultProps} phase="lobby" room={room} />);
    expect(screen.getByText(/3 gracz/)).toBeInTheDocument();
  });

  it('shows QR code instruction text', () => {
    render(<GameScene {...defaultProps} phase="lobby" room={room} />);
    expect(screen.getByText(/Zeskanuj QR/i)).toBeInTheDocument();
  });

  it('renders QR code image', () => {
    render(<GameScene {...defaultProps} phase="lobby" room={room} />);
    const img = screen.getByAltText('QR code');
    expect(img).toBeInTheDocument();
    expect((img as HTMLImageElement).src).toContain('qrserver.com');
  });

  it('shows first player name (no delay)', () => {
    render(<GameScene {...defaultProps} phase="lobby" room={room} />);
    // First player has delay=0, so renders immediately
    expect(screen.getByText('Ala')).toBeInTheDocument();
  });
});

describe('GameScene — Countdown phase', () => {
  it('shows countdown number 3', () => {
    render(<GameScene {...defaultProps} phase="countdown" room={room} countdown={3} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('shows countdown number 1', () => {
    render(<GameScene {...defaultProps} phase="countdown" room={room} countdown={1} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows START! when countdown reaches 0', () => {
    render(<GameScene {...defaultProps} phase="countdown" room={room} countdown={0} />);
    expect(screen.getByText('START!')).toBeInTheDocument();
  });
});

describe('GameScene — Question phase', () => {
  it('shows the question text', () => {
    render(
      <GameScene {...defaultProps} phase="question" room={room} question={question} timeLeft={15} />
    );
    expect(screen.getByText('Ile nóg ma pająk?')).toBeInTheDocument();
  });

  it('shows answer options text', () => {
    render(
      <GameScene {...defaultProps} phase="question" room={room} question={question} timeLeft={15} />
    );
    // Answer text renders inside Html mock overlays
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('shows answer labels A, B, C, D', () => {
    render(
      <GameScene {...defaultProps} phase="question" room={room} question={question} timeLeft={15} />
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
  });

  it('shows question category', () => {
    render(
      <GameScene {...defaultProps} phase="question" room={room} question={question} timeLeft={15} />
    );
    expect(screen.getByText('Biologia')).toBeInTheDocument();
  });

  it('shows question number fraction', () => {
    render(
      <GameScene {...defaultProps} phase="question" room={room} question={question} timeLeft={15} />
    );
    expect(screen.getByText('3/9')).toBeInTheDocument();
  });

  it('shows time remaining', () => {
    render(
      <GameScene {...defaultProps} phase="question" room={room} question={question} timeLeft={12} />
    );
    expect(screen.getByText('12s')).toBeInTheDocument();
  });

  it('shows RANKING scoreboard header', () => {
    render(
      <GameScene {...defaultProps} phase="question" room={room} question={question} timeLeft={15} />
    );
    expect(screen.getByText('RANKING')).toBeInTheDocument();
  });
});

describe('GameScene — Reveal phase', () => {
  it('shows correct answer checkmark', () => {
    render(
      <GameScene {...defaultProps} phase="reveal" room={room} question={question} reveal={reveal} />
    );
    // The correct answer (index 1 = "8") should have a checkmark
    expect(screen.getByText('✅')).toBeInTheDocument();
  });

  it('shows player names in reveal (character + scoreboard)', () => {
    render(
      <GameScene {...defaultProps} phase="reveal" room={room} question={question} reveal={reveal} />
    );
    // Name appears in both Character3D label and ScoreBoard3D
    const alaElements = screen.getAllByText('Ala');
    expect(alaElements.length).toBeGreaterThanOrEqual(1);
  });
});

describe('GameScene — Category Vote phase', () => {
  const categoryVote: CategoryVoteData = {
    categories: ['Nauka', 'Historia', 'Sport'],
    timeLimit: 10,
  };

  it('shows WYBIERZ KATEGORIĘ heading', () => {
    render(
      <GameScene {...defaultProps} phase="category_vote" room={room} categoryVote={categoryVote} timeLeft={8} />
    );
    expect(screen.getByText('WYBIERZ KATEGORIĘ')).toBeInTheDocument();
  });

  it('shows all 3 category cards', () => {
    render(
      <GameScene {...defaultProps} phase="category_vote" room={room} categoryVote={categoryVote} timeLeft={8} />
    );
    expect(screen.getByText('Nauka')).toBeInTheDocument();
    expect(screen.getByText('Historia')).toBeInTheDocument();
    expect(screen.getByText('Sport')).toBeInTheDocument();
  });

  it('shows the timer during voting', () => {
    render(
      <GameScene {...defaultProps} phase="category_vote" room={room} categoryVote={categoryVote} timeLeft={5} />
    );
    expect(screen.getByText('5s')).toBeInTheDocument();
  });

  it('shows WYBRANA KATEGORIA heading in result phase', () => {
    const result: CategoryResultData = {
      selectedCategory: 'Nauka',
      votes: {},
      overrideUsed: false,
      overrideBy: null,
    };
    render(
      <GameScene
        {...defaultProps}
        phase="category_result"
        room={room}
        categoryVote={categoryVote}
        categoryResult={result}
        timeLeft={0}
      />
    );
    expect(screen.getByText('WYBRANA KATEGORIA')).toBeInTheDocument();
  });

  it('shows WYBRANO mark on selected category', () => {
    const result: CategoryResultData = {
      selectedCategory: 'Historia',
      votes: {},
      overrideUsed: false,
      overrideBy: null,
    };
    render(
      <GameScene
        {...defaultProps}
        phase="category_result"
        room={room}
        categoryVote={categoryVote}
        categoryResult={result}
      />
    );
    expect(screen.getByText('✓ WYBRANO')).toBeInTheDocument();
  });
});

describe('GameScene — Power Up phase', () => {
  it('shows power-up waiting text', () => {
    render(<GameScene {...defaultProps} phase="power_up" room={room} />);
    expect(screen.getByText(/ZAGRYWKI/)).toBeInTheDocument();
    expect(screen.getByText(/Gracze wybierają zagrywki/)).toBeInTheDocument();
  });
});

describe('GameScene — Mini-game phase', () => {
  it('shows mini-game title', () => {
    const miniGameData = {
      gameNumber: 1,
      game: { type: 'connect' as const, title: 'Połącz pary', pairs: [] },
      timeLimit: 30,
    };
    render(<GameScene {...defaultProps} phase="minigame" room={room} miniGameData={miniGameData} />);
    expect(screen.getByText(/MINI-GRA 1/)).toBeInTheDocument();
    expect(screen.getByText('Połącz pary')).toBeInTheDocument();
  });

  it('shows mini-game results with player scores', () => {
    const miniGameResults: MiniGameResultsData = {
      players: [
        { id: 'p1', name: 'Ala', avatarId: 'robot', score: 120, miniGameScore: 45 },
        { id: 'p2', name: 'Bob', avatarId: 'alien', score: 80, miniGameScore: 30 },
      ],
    };
    render(
      <GameScene
        {...defaultProps}
        phase="minigame_results"
        room={room}
        miniGameData={{ gameNumber: 1, game: { type: 'connect', title: 'Test', pairs: [] }, timeLimit: 30 }}
        miniGameResults={miniGameResults}
      />
    );
    // Mini-game overlay shows scores (winner has 🥇 prefix)
    expect(screen.getByText(/45 pkt/)).toBeInTheDocument();
    // 30 pkt appears in both character label and overlay
    const thirtyElements = screen.getAllByText('30 pkt');
    expect(thirtyElements.length).toBeGreaterThanOrEqual(1);
  });
});

describe('GameScene — Pyramid phase', () => {
  const pyramidIntro: PyramidIntroData = {
    players: [
      { id: 'p1', name: 'Ala', avatarId: 'robot', score: 200, startPosition: 2 },
      { id: 'p2', name: 'Bob', avatarId: 'alien', score: 150, startPosition: 1 },
    ],
    pyramidSize: 5,
  };

  it('shows PIRAMIDA WIEDZY title', () => {
    render(<GameScene {...defaultProps} phase="pyramid_intro" room={room} pyramidIntro={pyramidIntro} />);
    expect(screen.getByText(/PIRAMIDA WIEDZY/)).toBeInTheDocument();
  });

  it('shows player names in pyramid legend', () => {
    render(<GameScene {...defaultProps} phase="pyramid_intro" room={room} pyramidIntro={pyramidIntro} />);
    // Player names appear in the legend sidebar
    const alaElements = screen.getAllByText('Ala');
    expect(alaElements.length).toBeGreaterThan(0);
  });

  it('shows player positions', () => {
    render(<GameScene {...defaultProps} phase="pyramid_intro" room={room} pyramidIntro={pyramidIntro} />);
    expect(screen.getByText('2/5')).toBeInTheDocument();
    expect(screen.getByText('1/5')).toBeInTheDocument();
  });

  it('shows pyramid question text during pyramid_question phase', () => {
    const pyramidQuestion: PyramidQuestionData = {
      question: 'Kto napisał "Pan Tadeusz"?',
      answers: ['Sienkiewicz', 'Mickiewicz', 'Słowacki', 'Prus'],
      category: 'Literatura',
      timeLimit: 10,
      positions: { p1: 2, p2: 1 },
      pyramidSize: 5,
    };
    render(
      <GameScene {...defaultProps} phase="pyramid_question" room={room} pyramidQuestion={pyramidQuestion} timeLeft={7} />
    );
    expect(screen.getByText('Kto napisał "Pan Tadeusz"?')).toBeInTheDocument();
    expect(screen.getByText('7s')).toBeInTheDocument();
  });
});

describe('GameScene — Finished phase', () => {
  it('shows the winner name', () => {
    render(<GameScene {...defaultProps} phase="finished" result={gameResult} />);
    expect(screen.getByText(/Ala WYGRYWA/)).toBeInTheDocument();
  });

  it('shows REMIS when no winner', () => {
    const tieResult: GameResult = { ...gameResult, winner: null };
    render(<GameScene {...defaultProps} phase="finished" result={tieResult} />);
    expect(screen.getByText(/REMIS/)).toBeInTheDocument();
  });

  it('shows the fun fact', () => {
    render(<GameScene {...defaultProps} phase="finished" result={gameResult} />);
    expect(screen.getByText(/Ośmiornica ma trzy serca/)).toBeInTheDocument();
  });

  it('shows all player names on podium', () => {
    render(<GameScene {...defaultProps} phase="finished" result={gameResult} />);
    expect(screen.getByText('Ala')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Ewa')).toBeInTheDocument();
  });

  it('shows player scores on podium', () => {
    render(<GameScene {...defaultProps} phase="finished" result={gameResult} />);
    expect(screen.getByText('200 pkt')).toBeInTheDocument();
    expect(screen.getByText('150 pkt')).toBeInTheDocument();
    expect(screen.getByText('80 pkt')).toBeInTheDocument();
  });

  it('renders podium place numbers', () => {
    render(<GameScene {...defaultProps} phase="finished" result={gameResult} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
