import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import MiniGameScreen from '../components/MiniGameScreen';
import type { MiniGameData, MiniGameResultsData } from '../types';

// ─── Mocks ───────────────────────────────────────────────────────────────────

// AudioContext is not available in jsdom; silence the entire sounds module
vi.mock('../sounds', () => ({
  SFX: {
    miniGameCorrect: vi.fn(),
    miniGameWrong: vi.fn(),
  },
}));

// ─── Fixtures ────────────────────────────────────────────────────────────────

const connectData: MiniGameData = {
  gameNumber: 1,
  timeLimit: 30,
  game: {
    type: 'connect',
    title: 'Test Połącz',
    pairs: [
      { left: 'Polska', right: 'Warszawa' },
      { left: 'Francja', right: 'Paryż' },
      { left: 'Niemcy', right: 'Berlin' },
    ],
  },
};

const sortData: MiniGameData = {
  gameNumber: 2,
  timeLimit: 30,
  game: {
    type: 'sort',
    title: 'Test Posortuj',
    categories: ['Ssak', 'Ptak'],
    items: [
      { item: 'Pies', category: 'Ssak' },
      { item: 'Orzeł', category: 'Ptak' },
      { item: 'Kot', category: 'Ssak' },
    ],
  },
};

// ─── Results screen ──────────────────────────────────────────────────────────

describe('MiniGameScreen – results view', () => {
  const resultsData: MiniGameResultsData = {
    players: [
      { id: 'p1', name: 'Ala', avatarId: 'robot', score: 50, miniGameScore: 3 },
      { id: 'p2', name: 'Bob', avatarId: 'alien', score: 30, miniGameScore: 1 },
    ],
  };

  it('renders player names and scores', () => {
    render(
      <MiniGameScreen
        data={connectData}
        resultsData={resultsData}
        timeLeft={0}
        playerId="p1"
        onResult={vi.fn()}
      />
    );
    expect(screen.getByText('Ala')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('+15')).toBeInTheDocument(); // 3 × 5
    expect(screen.getByText('+5')).toBeInTheDocument();  // 1 × 5
  });

  it('ranks players by miniGameScore descending', () => {
    render(
      <MiniGameScreen
        data={connectData}
        resultsData={resultsData}
        timeLeft={0}
        playerId="p1"
        onResult={vi.fn()}
      />
    );
    const items = screen.getAllByText(/\d+ trafień/);
    // Ala (3) should appear before Bob (1)
    expect(items[0].textContent).toBe('3 trafień');
    expect(items[1].textContent).toBe('1 trafień');
  });
});

// ─── ConnectGame ─────────────────────────────────────────────────────────────

describe('ConnectGame', () => {
  it('renders all left and right items', () => {
    render(
      <MiniGameScreen
        data={connectData}
        resultsData={null}
        timeLeft={30}
        playerId="p1"
        onResult={vi.fn()}
      />
    );
    expect(screen.getByText('Polska')).toBeInTheDocument();
    expect(screen.getByText('Francja')).toBeInTheDocument();
    expect(screen.getByText('Niemcy')).toBeInTheDocument();
    expect(screen.getByText('Warszawa')).toBeInTheDocument();
    expect(screen.getByText('Paryż')).toBeInTheDocument();
    expect(screen.getByText('Berlin')).toBeInTheDocument();
  });

  it('increments score on a correct pair selection', () => {
    render(
      <MiniGameScreen
        data={connectData}
        resultsData={null}
        timeLeft={30}
        playerId="p1"
        onResult={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText('Polska'));
    fireEvent.click(screen.getByText('Warszawa'));
    // Score counter should show 1/3
    expect(screen.getByText('1/3')).toBeInTheDocument();
  });

  it('does not increment score on an incorrect pair', () => {
    render(
      <MiniGameScreen
        data={connectData}
        resultsData={null}
        timeLeft={30}
        playerId="p1"
        onResult={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText('Polska'));
    fireEvent.click(screen.getByText('Berlin')); // wrong pair
    expect(screen.getByText('0/3')).toBeInTheDocument();
  });

  it('calls onResult with full score when all pairs matched', () => {
    const onResult = vi.fn();
    render(
      <MiniGameScreen
        data={connectData}
        resultsData={null}
        timeLeft={30}
        playerId="p1"
        onResult={onResult}
      />
    );
    fireEvent.click(screen.getByText('Polska'));
    fireEvent.click(screen.getByText('Warszawa'));
    fireEvent.click(screen.getByText('Francja'));
    fireEvent.click(screen.getByText('Paryż'));
    fireEvent.click(screen.getByText('Niemcy'));
    fireEvent.click(screen.getByText('Berlin'));
    expect(onResult).toHaveBeenCalledWith(3);
  });

  it('calls onResult with current score when time runs out', () => {
    const onResult = vi.fn();
    const { rerender } = render(
      <MiniGameScreen
        data={connectData}
        resultsData={null}
        timeLeft={5}
        playerId="p1"
        onResult={onResult}
      />
    );
    // Match one pair first
    fireEvent.click(screen.getByText('Polska'));
    fireEvent.click(screen.getByText('Warszawa'));
    // Time expires
    rerender(
      <MiniGameScreen
        data={connectData}
        resultsData={null}
        timeLeft={0}
        playerId="p1"
        onResult={onResult}
      />
    );
    expect(onResult).toHaveBeenCalledWith(1);
  });
});

// ─── SortGame ────────────────────────────────────────────────────────────────

describe('SortGame', () => {
  it('renders the game title and category buttons', () => {
    render(
      <MiniGameScreen
        data={sortData}
        resultsData={null}
        timeLeft={30}
        playerId="p1"
        onResult={vi.fn()}
      />
    );
    expect(screen.getByText('Test Posortuj')).toBeInTheDocument();
    expect(screen.getByText('Ssak')).toBeInTheDocument();
    expect(screen.getByText('Ptak')).toBeInTheDocument();
  });

  it('increments score when the correct category is chosen', () => {
    render(
      <MiniGameScreen
        data={sortData}
        resultsData={null}
        timeLeft={30}
        playerId="p1"
        onResult={vi.fn()}
      />
    );
    // Find current item and determine its correct category
    const currentItem = screen.getByText(/Pies|Orzeł|Kot/);
    const itemText = currentItem.textContent!;
    const correctCat = itemText === 'Orzeł' ? 'Ptak' : 'Ssak';
    // The score counter is the first /\d+\/3/ match (green); progress index is second
    const scoreBefore = parseInt(screen.getAllByText(/\d+\/3/)[0].textContent!);
    fireEvent.click(screen.getAllByText(correctCat)[0]);
    const scoreAfter = parseInt(screen.getAllByText(/\d+\/3/)[0].textContent!);
    expect(scoreAfter).toBe(scoreBefore + 1);
  });

  it('does not increment score on a wrong category', () => {
    render(
      <MiniGameScreen
        data={sortData}
        resultsData={null}
        timeLeft={30}
        playerId="p1"
        onResult={vi.fn()}
      />
    );
    const currentItem = screen.getByText(/Pies|Orzeł|Kot/);
    const itemText = currentItem.textContent!;
    const wrongCat = itemText === 'Orzeł' ? 'Ssak' : 'Ptak';
    fireEvent.click(screen.getAllByText(wrongCat)[0]);
    // Score counter (first match) should still be 0
    expect(screen.getAllByText(/\d+\/3/)[0].textContent).toBe('0/3');
  });

  it('calls onResult with current score when time expires', () => {
    const onResult = vi.fn();
    const { rerender } = render(
      <MiniGameScreen
        data={sortData}
        resultsData={null}
        timeLeft={5}
        playerId="p1"
        onResult={onResult}
      />
    );
    rerender(
      <MiniGameScreen
        data={sortData}
        resultsData={null}
        timeLeft={0}
        playerId="p1"
        onResult={onResult}
      />
    );
    expect(onResult).toHaveBeenCalledWith(0);
  });

  it('shows completion message when all items are sorted', () => {
    render(
      <MiniGameScreen
        data={sortData}
        resultsData={null}
        timeLeft={30}
        playerId="p1"
        onResult={vi.fn()}
      />
    );
    // Sort all 3 items regardless of shuffle order
    for (let i = 0; i < 3; i++) {
      const currentItem = screen.queryByText(/Pies|Orzeł|Kot/);
      if (!currentItem) break;
      const itemText = currentItem.textContent!;
      const correctCat = itemText === 'Orzeł' ? 'Ptak' : 'Ssak';
      fireEvent.click(screen.getAllByText(correctCat)[0]);
    }
    expect(screen.getByText('Gotowe!')).toBeInTheDocument();
  });
});
