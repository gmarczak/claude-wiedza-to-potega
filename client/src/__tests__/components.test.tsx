import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RevealScreen from '../components/RevealScreen';
import LobbyScreen from '../components/LobbyScreen';
import FinishedScreen from '../components/FinishedScreen';
import CategoryVoteScreen from '../components/CategoryVoteScreen';
import type { QuestionData, RevealData, RoomState, GameResult } from '../types';

// Silence Web Audio API
vi.mock('../sounds', () => ({
  SFX: { correct: vi.fn(), wrong: vi.fn(), victory: vi.fn(), defeat: vi.fn() },
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const question: QuestionData = {
  questionNumber: 1, totalQuestions: 9,
  question: 'Jaka jest stolica Polski?',
  answers: ['Kraków', 'Warszawa', 'Gdańsk', 'Wrocław'],
  category: 'Geografia', difficulty: 'easy', timeLimit: 20,
  roundGroup: 0, roundInGroup: 0,
};

const makeReveal = (myAnswer: number, correctIndex: number, pointsEarned: number, speedBonus = false): RevealData => ({
  correctIndex,
  speedBonus,
  players: [
    { id: 'p1', name: 'Ala', avatarId: 'robot', score: pointsEarned, pointsEarned, answer: myAnswer, answerTime: 5000 },
    { id: 'p2', name: 'Bob', avatarId: 'alien', score: 0, pointsEarned: 0, answer: null, answerTime: null },
  ],
});

const room: RoomState = {
  id: 'ABCDEF',
  phase: 'waiting',
  currentQuestionIndex: 0,
  totalRounds: 9,
  players: [
    { id: 'p1', name: 'Ala', avatarId: 'robot', score: 0, hasOverride: true },
    { id: 'p2', name: 'Bob', avatarId: 'alien', score: 0, hasOverride: true },
  ],
};

const gameResult: GameResult = {
  players: [
    { id: 'p1', name: 'Ala', avatarId: 'robot', score: 200 },
    { id: 'p2', name: 'Bob', avatarId: 'alien', score: 150 },
  ],
  winner: { id: 'p1', name: 'Ala' },
  funFact: 'Banan to botanicznie jagoda.',
};

// ─── RevealScreen ─────────────────────────────────────────────────────────────

describe('RevealScreen', () => {
  it('renders the question text', () => {
    render(<RevealScreen question={question} reveal={makeReveal(1, 1, 20)} playerId="p1" />);
    expect(screen.getByText('Jaka jest stolica Polski?')).toBeInTheDocument();
  });

  it('renders all answer options', () => {
    render(<RevealScreen question={question} reveal={makeReveal(1, 1, 20)} playerId="p1" />);
    expect(screen.getByText('Kraków')).toBeInTheDocument();
    expect(screen.getByText('Warszawa')).toBeInTheDocument();
    expect(screen.getByText('Gdańsk')).toBeInTheDocument();
    expect(screen.getByText('Wrocław')).toBeInTheDocument();
  });

  it('shows positive points earned for a correct answer', () => {
    render(<RevealScreen question={question} reveal={makeReveal(1, 1, 20)} playerId="p1" />);
    expect(screen.getByText('+20')).toBeInTheDocument();
  });

  it('shows 0 for a wrong answer', () => {
    render(<RevealScreen question={question} reveal={makeReveal(0, 1, 0)} playerId="p1" />);
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThan(0);
  });

  it('shows the speed bonus badge when speedBonus is true', () => {
    render(<RevealScreen question={question} reveal={makeReveal(1, 1, 20, true)} playerId="p1" />);
    expect(screen.getByText('+bonus!')).toBeInTheDocument();
  });

  it('does not show the speed bonus badge when speedBonus is false', () => {
    render(<RevealScreen question={question} reveal={makeReveal(1, 1, 20, false)} playerId="p1" />);
    expect(screen.queryByText('+bonus!')).not.toBeInTheDocument();
  });

  it('renders player names in the score panel', () => {
    render(<RevealScreen question={question} reveal={makeReveal(1, 1, 20)} playerId="p1" />);
    expect(screen.getByText('Ala')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });
});

// ─── LobbyScreen ─────────────────────────────────────────────────────────────

describe('LobbyScreen', () => {
  const noop = vi.fn();

  it('shows the room code', () => {
    render(<LobbyScreen room={room} playerId="p1" onStartGame={noop} onLeave={noop} />);
    expect(screen.getByText('ABCDEF')).toBeInTheDocument();
  });

  it('renders all player names', () => {
    render(<LobbyScreen room={room} playerId="p1" onStartGame={noop} onLeave={noop} />);
    expect(screen.getByText('Ala')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('shows (Ty) label next to the current player', () => {
    render(<LobbyScreen room={room} playerId="p1" onStartGame={noop} onLeave={noop} />);
    expect(screen.getByText('(Ty)')).toBeInTheDocument();
  });

  it('start button is enabled when 2+ players are present', () => {
    render(<LobbyScreen room={room} playerId="p1" onStartGame={noop} onLeave={noop} />);
    const btn = screen.getByRole('button', { name: /Rozpocznij/i });
    expect(btn).not.toBeDisabled();
  });

  it('start button is disabled when only 1 player is present', () => {
    const singlePlayer: RoomState = { ...room, players: [room.players[0]] };
    render(<LobbyScreen room={singlePlayer} playerId="p1" onStartGame={noop} onLeave={noop} />);
    const btn = screen.getByRole('button', { name: /Czekam/i });
    expect(btn).toBeDisabled();
  });

  it('calls onStartGame when the start button is clicked', () => {
    const onStart = vi.fn();
    render(<LobbyScreen room={room} playerId="p1" onStartGame={onStart} onLeave={noop} />);
    fireEvent.click(screen.getByRole('button', { name: /Rozpocznij/i }));
    expect(onStart).toHaveBeenCalledOnce();
  });

  it('calls onLeave when the leave button is clicked', () => {
    const onLeave = vi.fn();
    render(<LobbyScreen room={room} playerId="p1" onStartGame={noop} onLeave={onLeave} />);
    fireEvent.click(screen.getByRole('button', { name: /Opuść/i }));
    expect(onLeave).toHaveBeenCalledOnce();
  });

  it('non-host sees waiting message instead of start button', () => {
    render(<LobbyScreen room={room} playerId="p2" onStartGame={noop} onLeave={noop} />);
    expect(screen.getByText(/Oczekiwanie na rozpoczęcie/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Rozpocznij/i })).not.toBeInTheDocument();
  });
});

// ─── FinishedScreen ───────────────────────────────────────────────────────────

describe('FinishedScreen', () => {
  const noop = vi.fn();

  it('shows "Zwycięstwo!" for the winning player', () => {
    render(<FinishedScreen result={gameResult} playerId="p1" onPlayAgain={noop} onLeave={noop} />);
    expect(screen.getByText('Zwycięstwo!')).toBeInTheDocument();
  });

  it('shows "Przegrana" for the losing player', () => {
    render(<FinishedScreen result={gameResult} playerId="p2" onPlayAgain={noop} onLeave={noop} />);
    expect(screen.getByText('Przegrana')).toBeInTheDocument();
  });

  it('shows "Remis!" when winner is null', () => {
    const tie: GameResult = { ...gameResult, winner: null };
    render(<FinishedScreen result={tie} playerId="p1" onPlayAgain={noop} onLeave={noop} />);
    expect(screen.getByText('Remis!')).toBeInTheDocument();
  });

  it('renders player names in the ranking', () => {
    render(<FinishedScreen result={gameResult} playerId="p1" onPlayAgain={noop} onLeave={noop} />);
    expect(screen.getByText('Ala')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('renders final scores', () => {
    render(<FinishedScreen result={gameResult} playerId="p1" onPlayAgain={noop} onLeave={noop} />);
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('renders the fun fact', () => {
    render(<FinishedScreen result={gameResult} playerId="p1" onPlayAgain={noop} onLeave={noop} />);
    expect(screen.getByText('Banan to botanicznie jagoda.')).toBeInTheDocument();
  });

  it('calls onPlayAgain when the button is clicked', () => {
    const onPlayAgain = vi.fn();
    render(<FinishedScreen result={gameResult} playerId="p1" onPlayAgain={onPlayAgain} onLeave={noop} />);
    fireEvent.click(screen.getByRole('button', { name: /Zagraj ponownie/i }));
    expect(onPlayAgain).toHaveBeenCalledOnce();
  });
});

// ─── CategoryVoteScreen ───────────────────────────────────────────────────────

const voteData = { categories: ['Nauka', 'Historia', 'Sport', 'Kultura'], timeLimit: 10 };

describe('CategoryVoteScreen', () => {
  it('renders category buttons', () => {
    render(
      <CategoryVoteScreen
        voteData={voteData} resultData={null} hasOverride={false}
        timeLeft={10} onVote={vi.fn()} onOverride={vi.fn()}
      />
    );
    expect(screen.getByText('Nauka')).toBeInTheDocument();
    expect(screen.getByText('Historia')).toBeInTheDocument();
    expect(screen.getByText('Sport')).toBeInTheDocument();
    expect(screen.getByText('Kultura')).toBeInTheDocument();
  });

  it('calls onVote with the chosen category', () => {
    const onVote = vi.fn();
    render(
      <CategoryVoteScreen
        voteData={voteData} resultData={null} hasOverride={false}
        timeLeft={10} onVote={onVote} onOverride={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText('Nauka'));
    expect(onVote).toHaveBeenCalledWith('Nauka');
  });

  it('shows waiting message after voting', () => {
    render(
      <CategoryVoteScreen
        voteData={voteData} resultData={null} hasOverride={false}
        timeLeft={10} onVote={vi.fn()} onOverride={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText('Sport'));
    expect(screen.getByText(/Zagłosowano/i)).toBeInTheDocument();
  });

  it('prevents voting twice', () => {
    const onVote = vi.fn();
    render(
      <CategoryVoteScreen
        voteData={voteData} resultData={null} hasOverride={false}
        timeLeft={10} onVote={onVote} onOverride={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText('Nauka'));
    fireEvent.click(screen.getByText('Historia'));
    expect(onVote).toHaveBeenCalledOnce();
  });

  it('shows the override button when hasOverride is true', () => {
    render(
      <CategoryVoteScreen
        voteData={voteData} resultData={null} hasOverride={true}
        timeLeft={10} onVote={vi.fn()} onOverride={vi.fn()}
      />
    );
    expect(screen.getByText(/Przełamania/i)).toBeInTheDocument();
  });

  it('hides the override button when hasOverride is false', () => {
    render(
      <CategoryVoteScreen
        voteData={voteData} resultData={null} hasOverride={false}
        timeLeft={10} onVote={vi.fn()} onOverride={vi.fn()}
      />
    );
    expect(screen.queryByText(/Przełamania/i)).not.toBeInTheDocument();
  });

  it('calls onOverride when override mode is activated and a category is chosen', () => {
    const onOverride = vi.fn();
    render(
      <CategoryVoteScreen
        voteData={voteData} resultData={null} hasOverride={true}
        timeLeft={10} onVote={vi.fn()} onOverride={onOverride}
      />
    );
    fireEvent.click(screen.getByText(/Przełamania/i));
    fireEvent.click(screen.getByText('Kultura'));
    expect(onOverride).toHaveBeenCalledWith('Kultura');
  });

  it('shows the result screen when resultData is provided', () => {
    const resultData = { selectedCategory: 'Nauka', votes: {}, overrideUsed: false, overrideBy: null };
    render(
      <CategoryVoteScreen
        voteData={null} resultData={resultData} hasOverride={false}
        timeLeft={0} onVote={vi.fn()} onOverride={vi.fn()}
      />
    );
    expect(screen.getByText('Nauka')).toBeInTheDocument();
    expect(screen.getByText('Wybrana kategoria')).toBeInTheDocument();
  });

  it('shows override attribution in result screen', () => {
    const resultData = { selectedCategory: 'Sport', votes: {}, overrideUsed: true, overrideBy: 'Ala' };
    render(
      <CategoryVoteScreen
        voteData={null} resultData={resultData} hasOverride={false}
        timeLeft={0} onVote={vi.fn()} onOverride={vi.fn()}
      />
    );
    expect(screen.getByText(/Ala użył przełamania/i)).toBeInTheDocument();
  });
});
