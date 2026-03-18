import { chromium } from 'playwright';
import { io as socketIO } from 'socket.io-client';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5173';
const SERVER_URL = 'http://localhost:3001';
const SCREENSHOTS_DIR = './docs/screenshots';

fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

async function screenshot(page, name, delay = 500) {
  await page.waitForTimeout(delay);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${name}.png`), fullPage: true, timeout: 10000 });
  console.log(`  ✓ ${name}.png`);
}

function connect() {
  return new Promise((resolve, reject) => {
    const s = socketIO(SERVER_URL, { transports: ['websocket'] });
    s.on('connect', () => resolve(s));
    s.on('connect_error', reject);
  });
}

// Create an event-based phase tracker using a bot socket
function createPhaseTracker(socket) {
  const waiters = [];
  const buffer = []; // buffered events that had no waiter

  function notify(phase, data) {
    // Resolve only the FIRST matching waiter (FIFO)
    const idx = waiters.findIndex(w => w.phase === phase);
    if (idx >= 0) {
      const waiter = waiters[idx];
      waiters.splice(idx, 1);
      waiter.resolve(data);
    } else {
      // No waiter yet — buffer the event
      buffer.push({ phase, data });
    }
  }

  socket.on('game:category-vote', (data) => notify('category-vote', data));
  socket.on('game:category-result', (data) => notify('category-result', data));
  socket.on('game:power-up-phase', (data) => notify('power-up', data));
  socket.on('game:question', (data) => notify('question', data));
  socket.on('game:reveal', (data) => notify('reveal', data));
  socket.on('game:minigame-start', (data) => notify('minigame', data));
  socket.on('game:minigame-results', (data) => notify('minigame-results', data));
  socket.on('game:pyramid-intro', (data) => notify('pyramid-intro', data));
  socket.on('game:pyramid-question', (data) => notify('pyramid-question', data));
  socket.on('game:pyramid-reveal', (data) => notify('pyramid-reveal', data));
  socket.on('game:finished', (data) => notify('finished', data));
  socket.on('game:countdown', (data) => notify('countdown', data));

  return {
    waitFor(phase, timeout = 60000) {
      // Check buffer first
      const bufIdx = buffer.findIndex(b => b.phase === phase);
      if (bufIdx >= 0) {
        const buffered = buffer[bufIdx];
        buffer.splice(bufIdx, 1);
        return Promise.resolve(buffered.data);
      }
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          const idx = waiters.findIndex(w => w.phase === phase);
          if (idx >= 0) waiters.splice(idx, 1);
          reject(new Error(`Timeout waiting for phase: ${phase}`));
        }, timeout);
        waiters.push({
          phase,
          resolve: (data) => { clearTimeout(timer); resolve(data); }
        });
      });
    }
  };
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  const ctx = await browser.newContext({ viewport: { width: 420, height: 820 } });
  await ctx.route('**/fonts.googleapis.com/**', route => {
    route.fulfill({ status: 200, contentType: 'text/css', body: '/* fonts disabled */' });
  });
  await ctx.route('**/fonts.gstatic.com/**', route => route.abort());
  const page = await ctx.newPage();

  // ════════════════════════════════════════════════════════════
  // 01 - HOME SCREEN
  // ════════════════════════════════════════════════════════════
  console.log('01 - Home screen');
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1500);
  await page.fill('input[placeholder="Twoje imię..."]', 'Kasia');
  await page.locator('button:has(span.text-3xl)').nth(2).click();
  await screenshot(page, '01-home');

  // ════════════════════════════════════════════════════════════
  // CREATE ROOM
  // ════════════════════════════════════════════════════════════
  console.log('Creating room...');
  await page.click('button:has-text("Stwórz Pokój")');
  await page.waitForTimeout(500);
  await page.click('button:has-text("Stwórz Pokój")');
  await page.waitForTimeout(2000);

  const roomCode = await page.locator('.tracking-widest.font-mono').textContent();
  console.log(`  Room: ${roomCode}`);

  // Connect bot sockets
  const spy = await connect(); // phase detection spy
  const s2 = await connect();
  const s3 = await connect();

  s2.emit('room:join', { roomId: roomCode, playerName: 'Tomek', avatarId: 'robot' });
  await new Promise(r => s2.once('room:joined', r));
  s3.emit('room:join', { roomId: roomCode, playerName: 'Ania', avatarId: 'pirate' });
  await new Promise(r => s3.once('room:joined', r));
  spy.emit('room:join', { roomId: roomCode, playerName: 'Marek', avatarId: 'ninja' });
  await new Promise(r => spy.once('room:joined', r));
  await page.waitForTimeout(800);

  // ════════════════════════════════════════════════════════════
  // 02 - LOBBY
  // ════════════════════════════════════════════════════════════
  console.log('02 - Lobby');
  await screenshot(page, '02-lobby');

  // Set up phase tracker on spy socket FIRST (before auto-responders)
  const tracker = createPhaseTracker(spy);

  // Bot auto-responders — use longer delays so tracker catches events first
  function setupBot(bot, answerIdx) {
    bot.on('game:category-vote', (data) => {
      setTimeout(() => bot.emit('game:category-vote', data.categories[0]), 500);
    });
    bot.on('game:power-up-phase', () => {
      setTimeout(() => bot.emit('game:power-up-skip'), 500);
    });
    bot.on('game:question', () => {
      setTimeout(() => bot.emit('game:answer', answerIdx), 2000);
    });
    bot.on('game:minigame-start', () => {
      setTimeout(() => bot.emit('game:minigame-result', 3), 2000);
    });
    bot.on('game:pyramid-question', () => {
      setTimeout(() => bot.emit('game:pyramid-answer', answerIdx), 1500);
    });
  }
  setupBot(s2, 0);
  setupBot(s3, 1);

  // Spy auto-responds with even longer delays
  spy.on('game:category-vote', (data) => {
    setTimeout(() => spy.emit('game:category-vote', data.categories[0]), 600);
  });
  spy.on('game:power-up-phase', () => {
    setTimeout(() => spy.emit('game:power-up-skip'), 600);
  });
  spy.on('game:question', () => {
    setTimeout(() => spy.emit('game:answer', 1), 2000);
  });
  spy.on('game:minigame-start', () => {
    setTimeout(() => spy.emit('game:minigame-result', 2), 2000);
  });
  spy.on('game:pyramid-question', () => {
    setTimeout(() => spy.emit('game:pyramid-answer', 1), 1500);
  });

  // ════════════════════════════════════════════════════════════
  // Helper: play a round from the UI
  // ════════════════════════════════════════════════════════════
  let roundNum = 0;

  async function playRound(opts = {}) {
    roundNum++;
    const { takeCategoryVote, takePowerUp, takeQuestion, takeReveal } = opts;
    console.log(`  Round ${roundNum}...`);

    // 1) Category vote
    await tracker.waitFor('category-vote');
    await page.waitForTimeout(600); // let UI render
    if (takeCategoryVote) {
      console.log('03 - Category vote');
      await screenshot(page, '03-category-vote');
    }
    // Vote via UI
    try {
      const btns = page.locator('.grid button');
      await btns.first().click({ timeout: 3000 });
    } catch (e) {}

    // Wait for category result to show, then power-up
    await tracker.waitFor('power-up');
    await page.waitForTimeout(600);
    if (takePowerUp) {
      console.log('04 - Power-up');
      await screenshot(page, '04-power-up');
    }
    // Skip power-up via UI
    try {
      await page.locator('button:has-text("Pomiń zagrywkę")').click({ timeout: 3000 });
    } catch (e) {
      try { await page.locator('button:has-text("Pomiń")').click({ timeout: 1000 }); } catch (e2) {}
    }

    // 3) Question
    await tracker.waitFor('question');
    await page.waitForTimeout(600);
    if (takeQuestion) {
      console.log('05 - Question');
      await screenshot(page, '05-question');
    }
    // Answer via UI
    try {
      await page.locator('button:has(span.rounded-full)').first().click({ timeout: 5000 });
    } catch (e) {}

    // 4) Reveal
    await tracker.waitFor('reveal');
    await page.waitForTimeout(600);
    if (takeReveal) {
      console.log('06 - Reveal');
      await screenshot(page, '06-reveal');
    }

    // Wait for reveal to pass (server auto-advances)
    await page.waitForTimeout(2000);
  }

  // ════════════════════════════════════════════════════════════
  // START GAME
  // ════════════════════════════════════════════════════════════
  console.log('Starting game...');
  await page.click('button:has-text("Rozpocznij")');

  // ROUND 1 — screenshots
  await playRound({ takeCategoryVote: true, takePowerUp: true, takeQuestion: true, takeReveal: true });

  // ROUNDS 2-3 — pre-register minigame waiters before starting rounds
  const minigame1Promise = tracker.waitFor('minigame', 180000);
  const minigame1ResultsPromise = tracker.waitFor('minigame-results', 180000);
  await playRound();
  await playRound();

  // ════════════════════════════════════════════════════════════
  // 07 - MINIGAME
  // ════════════════════════════════════════════════════════════
  console.log('07 - Minigame');
  await minigame1Promise;
  await page.waitForTimeout(800);
  await screenshot(page, '07-minigame');
  // Wait for minigame to end
  await minigame1ResultsPromise;
  await page.waitForTimeout(2000);

  // ROUNDS 4-6 — pre-register second minigame (long timeout for 3 rounds)
  const minigame2Promise = tracker.waitFor('minigame', 180000);
  const minigame2ResultsPromise = tracker.waitFor('minigame-results', 180000);
  await playRound();
  await playRound();
  await playRound();

  // Second minigame
  console.log('  Second minigame...');
  await minigame2Promise;
  await minigame2ResultsPromise;
  await page.waitForTimeout(2000);

  // ROUNDS 7-9 — pre-register pyramid waiter
  const pyramidPromise = tracker.waitFor('pyramid-intro', 180000);
  await playRound();
  await playRound();
  await playRound();

  // ════════════════════════════════════════════════════════════
  // 08 - PYRAMID
  // ════════════════════════════════════════════════════════════
  console.log('08 - Pyramid');
  await pyramidPromise;
  await page.waitForTimeout(1500);
  await screenshot(page, '08-pyramid');

  // Pre-register finished waiter before answering pyramid
  const finishedPromise = tracker.waitFor('finished', 120000);

  // Answer pyramid questions
  for (let q = 0; q < 7; q++) {
    try {
      await tracker.waitFor('pyramid-question', 15000);
      await page.waitForTimeout(800);
      await page.locator('button:has(span.rounded-full)').first().click({ timeout: 5000 });
      await tracker.waitFor('pyramid-reveal', 15000);
      await page.waitForTimeout(1000);
    } catch (e) { break; }
  }

  // ════════════════════════════════════════════════════════════
  // 09 - FINISHED
  // ════════════════════════════════════════════════════════════
  console.log('09 - Finished');
  await finishedPromise;
  await page.waitForTimeout(1000);
  await screenshot(page, '09-finished');

  // Cleanup
  spy.disconnect();
  s2.disconnect();
  s3.disconnect();
  await browser.close();
  console.log('\nAll screenshots saved!');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
