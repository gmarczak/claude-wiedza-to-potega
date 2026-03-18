# Test Coverage Analysis

## Summary

The codebase currently has **0% test coverage** — no test files, no testing frameworks installed, and no test scripts configured. The application is ~3,300 lines of TypeScript split between a Node.js/Express + Socket.io backend and a React 19 frontend.

This document identifies the highest-value areas to add tests, ordered by impact and testability.

---

## Recommended Areas for Testing

### 1. Scoring Utility Functions (Backend) — Highest Priority

**Files:** `server/src/index.ts` (lines 70–84)

These are pure functions with no dependencies — easiest to test and most critical to correctness.

**`getSpeedBonus(answerTime, roundTime)`**
- Returns 0 when `answerTime` is `null`
- Returns values between 0 and 10 (inclusive)
- Returns 10 for an instant answer (`answerTime = 0`)
- Returns 0 when time spent equals or exceeds `roundTime * 1000`
- Correct interpolation at mid-point (e.g., half the round time → ~5 bonus)

**`getBasePoints(difficulty)`**
- Returns 10 for `'easy'`, 20 for `'medium'`, 30 for `'hard'`
- Falls back to 10 for unknown difficulty values

**Why:** These directly determine player scores. A bug here affects every game, but the functions are trivial to unit-test with no mocking required.

---

### 2. Questions & Categories Utility Functions (Backend) — High Priority

**File:** `server/src/questions.ts`

**`shuffleArray(array)`**
- Returns an array with the same elements (no additions or removals)
- Does not mutate the input array
- Produces different orderings over many runs (statistical test)

**`getAvailableCategories(questions)`**
- Returns the unique set of categories present in the question list
- Handles an empty array → returns `[]`
- Deduplicates categories correctly

**`getQuestions(count, difficulty)`**
- Returns exactly `count` questions when the pool is large enough
- Filters by difficulty (`'easy'`, `'medium'`, `'hard'`) when specified
- With `'mixed'` difficulty, returns questions across all difficulties
- Never returns duplicate questions in a single call

**`getMiniGames()`**
- Returns exactly 2 mini-games (as consumed by the game flow)
- Each mini-game has the correct shape (`MiniGameConnect` or `MiniGameSort`)

**Why:** Question selection bugs directly break the game. These functions are also stateless and easy to test.

---

### 3. Game Logic & State Functions (Backend) — High Priority

**File:** `server/src/index.ts`

**`resolveCategoryVote(room)`**
- When both players vote for the same category → that category is selected
- When players vote for different categories → one of the voted categories is selected (random tie-break)
- When a player uses the override (`OVERRIDE:` prefix) → that player's category wins regardless
- Override usage sets `usedOverride = true` and `hasOverride = false` on the player

**`revealAnswer(room)`** (requires mocking `io.to`)
- Correct player gets `getBasePoints(difficulty)` points
- Speed bonus is added on top for fast answers
- `double` power-up doubles points for that player
- A wrong answer contributes 0 points
- Both-correct and both-wrong scenarios produce correct host comment keys

**`endGame(room)`** (requires mocking `io.to`)
- Final score = quiz score + (`pyramidPosition × 20`)
- Pyramid winner overrides score-based winner
- Tie is correctly detected and `winner` is `null`

**`startPyramidIntro(room)` — starting positions**
- Leading player gets up to 2 head-start steps
- When all players are tied, everyone starts at position 0
- With a score range ≤ 20, the close-game comment is sent

**`generateRoomId()`**
- Returns a 6-character string
- Only contains characters from the allowed set (`ABCDEFGHJKLMNPQRSTUVWXYZ23456789`)

**Why:** These functions contain conditional logic that directly affects game fairness and outcomes. Bugs here are hard to catch manually.

---

### 4. MiniGame Component Logic (Frontend) — Medium Priority

**File:** `client/src/components/MiniGameScreen.tsx`

The mini-game component contains the only substantial client-side game logic: pair-matching ("connect pairs") and sorting. Tests should cover:

- Selecting a correct pair increments the score
- Selecting an incorrect pair does not increment the score (and potentially applies a penalty if implemented)
- Completing all pairs calls `onComplete` with the correct score
- Sorting: submitting the correct order scores full points; an incorrect order scores fewer or zero

**Why:** This is the most logic-heavy frontend component. The Socket.io-driven components are harder to test in isolation, but the mini-game logic is self-contained.

---

### 5. Socket.io Event Handlers — Integration Tests (Backend) — Medium Priority

**File:** `server/src/index.ts` (lines 566–698)

These handlers are harder to test in pure unit style but can be covered with integration tests using `socket.io-client` against a real in-memory server:

- `room:create` → room is created, creator receives `room:created` and `room:joined`
- `room:join` with invalid room ID → `error` event is emitted
- `room:join` when game is in progress → `error` event is emitted
- `game:start` with fewer than 2 players → no state change
- `game:answer` duplicate answer from same player → only first answer is recorded
- `disconnect` during an active game → `endGame` is triggered for remaining players
- `game:use-override` when override already used → no effect

**Why:** These represent the API surface of the server. Regressions here break the entire multiplayer experience.

---

### 6. React Component Rendering (Frontend) — Lower Priority

**Files:** `client/src/components/`

Snapshot or basic rendering tests for stateless/display components:

- `LobbyScreen` — renders player names and avatars correctly
- `RevealScreen` — displays correct answer highlight and score deltas
- `FinishedScreen` — shows winner name or tie message
- `CountdownScreen` — displays the countdown number
- `HostComment` — renders the comment text

**Why:** These are lower risk but provide a safety net against accidental UI regressions.

---

## Recommended Tooling

### Backend
- **Test runner:** [Vitest](https://vitest.dev/) or [Jest](https://jestjs.io/) with `ts-jest`
- **Socket.io integration tests:** [`socket.io-client`](https://socket.io/docs/v4/client-api/) against a test server instance
- **Coverage:** built-in Vitest coverage (`@vitest/coverage-v8`) or `jest --coverage`

### Frontend
- **Test runner:** [Vitest](https://vitest.dev/) (already uses Vite — zero extra config)
- **Component tests:** [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)
- **Socket mocking:** Mock the `socket.ts` module to avoid real connections in unit tests

---

## Suggested First Steps

1. Install Vitest on both `server` and `client`
2. Write unit tests for `getSpeedBonus`, `getBasePoints`, `getBasePoints`, `shuffleArray`, and `getAvailableCategories` — these need no mocking and provide immediate value
3. Add integration tests for the top 3–4 Socket.io event handlers
4. Add React Testing Library tests for `MiniGameScreen` game logic
5. Set up a CI workflow (GitHub Actions) that runs `npm test` on both packages for every PR
