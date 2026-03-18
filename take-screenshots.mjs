import { chromium } from 'playwright';
import { io as socketIO } from 'socket.io-client';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5173';
const SERVER_URL = 'http://localhost:3001';
const SCREENSHOTS_DIR = './docs/screenshots';

fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

async function screenshot(page, name, delay = 600) {
  await page.waitForTimeout(delay);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${name}.png`), fullPage: true });
  console.log(`  ✓ ${name}.png`);
}

function connect() {
  return new Promise((resolve, reject) => {
    const s = socketIO(SERVER_URL, { transports: ['websocket'] });
    s.on('connect', () => resolve(s));
    s.on('connect_error', reject);
  });
}

function once(socket, event) {
  return new Promise((resolve) => socket.once(event, resolve));
}

// Waits for any of the given events, returns { event, data }
function onceAny(socket, events) {
  return new Promise((resolve) => {
    const cleanup = () => events.forEach(e => socket.off(e, handler));
    const handler = function(data) {
      cleanup();
      // figure out which event fired - store it
    };
    events.forEach(ev => {
      socket.once(ev, (data) => {
        events.filter(e => e !== ev).forEach(e => socket.removeAllListeners(e));
        resolve({ event: ev, data });
      });
    });
  });
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome',
  });
  const ctx = await browser.newContext({ viewport: { width: 420, height: 820 } });
  const page = await ctx.newPage();

  // ════════════════════════════════════════════════════════════
  // 01 - HOME SCREEN
  // ════════════════════════════════════════════════════════════
  console.log('01 - Home screen');
  await page.goto(BASE_URL);
  await page.waitForTimeout(1000);
  await page.fill('input[placeholder="Twoje imię..."]', 'Kasia');
  await page.locator('button:has(span.text-3xl)').nth(2).click();
  await screenshot(page, '01-home');

  // ════════════════════════════════════════════════════════════
  // CREATE ROOM via UI
  // ════════════════════════════════════════════════════════════
  console.log('Creating room...');
  await page.click('button:has-text("Stwórz Pokój")');
  await page.waitForTimeout(300);
  // Set 10s round time
  await page.click('button:has-text("Stwórz Pokój")');
  await page.waitForTimeout(1500);

  const roomCode = await page.locator('.tracking-widest.font-mono').textContent();
  console.log(`  Room: ${roomCode}`);

  // Connect 2 bot sockets
  const s2 = await connect();
  const s3 = await connect();

  // Join bots
  s2.emit('room:join', { roomId: roomCode, playerName: 'Tomek', avatarId: 'robot' });
  await once(s2, 'room:joined');
  s3.emit('room:join', { roomId: roomCode, playerName: 'Ania', avatarId: 'pirate' });
  await once(s3, 'room:joined');
  await page.waitForTimeout(800);

  // ════════════════════════════════════════════════════════════
  // 02 - LOBBY
  // ════════════════════════════════════════════════════════════
  console.log('02 - Lobby');
  await screenshot(page, '02-lobby');

  // ════════════════════════════════════════════════════════════
  // Setup phase tracking
  // ════════════════════════════════════════════════════════════
  let screenshotFlags = {
    categoryVote: false,
    powerUp: false,
    question: false,
    slime: false,
    ice: false,
    platypus: false,
    bomb: false,
    reveal: false,
    minigame: false,
    pyramid: false,
    finished: false,
  };

  // Track current phase from bot's perspective
  let currentPhase = 'waiting';
  let roundNum = 0;
  let phaseResolve = null;

  function waitForPhase(phase) {
    return new Promise(resolve => { phaseResolve = { phase, resolve }; });
  }

  function checkPhase(phase) {
    currentPhase = phase;
    if (phaseResolve && phaseResolve.phase === phase) {
      phaseResolve.resolve();
      phaseResolve = null;
    }
  }

  // Bot 2 auto-responder (also tracks phases)
  s2.on('game:category-vote', (data) => {
    checkPhase('category_vote');
    setTimeout(() => s2.emit('game:category-vote', data.categories[0]), 200);
  });
  s2.on('game:power-up-phase', (data) => {
    checkPhase('power_up');
    setTimeout(() => s2.emit('game:power-up-skip'), 200);
  });
  s2.on('game:question', () => {
    checkPhase('question');
    setTimeout(() => s2.emit('game:answer', 0), 800);
  });
  s2.on('game:reveal', () => checkPhase('reveal'));
  s2.on('game:minigame-start', (data) => {
    checkPhase('minigame');
    setTimeout(() => s2.emit('game:minigame-result', 3), 500);
  });
  s2.on('game:minigame-results', () => checkPhase('minigame_results'));
  s2.on('game:pyramid-intro', () => checkPhase('pyramid_intro'));
  s2.on('game:pyramid-question', () => {
    checkPhase('pyramid_question');
    setTimeout(() => s2.emit('game:pyramid-answer', 0), 500);
  });
  s2.on('game:pyramid-reveal', () => checkPhase('pyramid_reveal'));
  s2.on('game:finished', () => checkPhase('finished'));

  // Bot 3 auto-responder
  s3.on('game:category-vote', (data) => {
    setTimeout(() => s3.emit('game:category-vote', data.categories[1] || data.categories[0]), 300);
  });
  s3.on('game:power-up-phase', () => {
    setTimeout(() => s3.emit('game:power-up-skip'), 300);
  });
  s3.on('game:question', () => {
    setTimeout(() => s3.emit('game:answer', 1), 1000);
  });
  s3.on('game:minigame-start', () => {
    setTimeout(() => s3.emit('game:minigame-result', 2), 600);
  });
  s3.on('game:pyramid-question', () => {
    setTimeout(() => s3.emit('game:pyramid-answer', 1), 600);
  });

  // ════════════════════════════════════════════════════════════
  // START GAME
  // ════════════════════════════════════════════════════════════
  console.log('Starting game...');
  await page.click('button:has-text("Rozpocznij")');

  // Wait for countdown (sped up)
  await page.waitForTimeout(1500);

  // ════════════════════════════════════════════════════════════
  // ROUND 1: Take category vote + power-up + question + reveal screenshots
  // ════════════════════════════════════════════════════════════

  // 03 - CATEGORY VOTE
  console.log('03 - Category vote');
  await page.waitForTimeout(800);
  await screenshot(page, '03-category-vote');

  // Vote via UI
  try {
    // The category vote buttons have specific styling
    const btns = page.locator('.grid button, .space-y-3 button');
    const count = await btns.count();
    for (let i = 0; i < count; i++) {
      const text = await btns.nth(i).textContent();
      if (text && text.length > 2 && !text.includes('Przełam')) {
        await btns.nth(i).click();
        break;
      }
    }
  } catch (e) { console.log('  (vote timeout)'); }

  // Wait for result + power-up transition
  await page.waitForTimeout(1500);

  // 04 - POWER-UP
  console.log('04 - Power-up');
  await screenshot(page, '04-power-up', 500);

  // Select Szlam targeting Tomek (for slime screenshot later)
  try {
    await page.locator('button:has-text("Szlam")').click({ timeout: 1500 });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Tomek")').click({ timeout: 1000 });
  } catch (e) {
    try { await page.locator('button:has-text("Pomiń")').click({ timeout: 1000 }); } catch (e2) {}
  }

  // Wait for question
  await page.waitForTimeout(1500);

  // 05 - QUESTION
  console.log('05 - Question');
  await screenshot(page, '05-question', 800);

  // Answer via UI
  try {
    const ansBtn = page.locator('button:has(span.rounded-full)').first();
    await ansBtn.click({ timeout: 2000 });
  } catch (e) {}

  // Wait for reveal
  await page.waitForTimeout(1500);

  // 06 - REVEAL
  console.log('06 - Reveal');
  await screenshot(page, '06-reveal', 400);

  // ════════════════════════════════════════════════════════════
  // ROUNDS 2-3: Play quickly
  // ════════════════════════════════════════════════════════════
  console.log('Playing rounds 2-3...');
  for (let r = 0; r < 2; r++) {
    await page.waitForTimeout(1500);
    // Category vote
    try {
      const btns = page.locator('.grid button, .space-y-3 button');
      const count = await btns.count();
      for (let i = 0; i < count; i++) {
        const text = await btns.nth(i).textContent();
        if (text && text.length > 2 && !text.includes('Przełam')) {
          await btns.nth(i).click();
          break;
        }
      }
    } catch (e) {}
    await page.waitForTimeout(1200);

    // Power-up skip
    try { await page.locator('button:has-text("Pomiń")').click({ timeout: 1500 }); } catch (e) {}
    await page.waitForTimeout(1000);

    // Answer
    try { await page.locator('button:has(span.rounded-full)').first().click({ timeout: 1500 }); } catch (e) {}
    await page.waitForTimeout(1200);
  }

  // ════════════════════════════════════════════════════════════
  // 07 - MINIGAME
  // ════════════════════════════════════════════════════════════
  console.log('07 - Minigame');
  await page.waitForTimeout(1500);
  await screenshot(page, '07-minigame', 500);

  // Wait for minigame timer (sped up: 30s/10 = 3s)
  await page.waitForTimeout(4000);

  // ════════════════════════════════════════════════════════════
  // ROUNDS 4-6
  // ════════════════════════════════════════════════════════════
  console.log('Playing rounds 4-6...');
  // Wait for minigame results to pass
  await page.waitForTimeout(1500);

  for (let r = 0; r < 3; r++) {
    await page.waitForTimeout(1200);
    try {
      const btns = page.locator('.grid button, .space-y-3 button');
      const count = await btns.count();
      for (let i = 0; i < count; i++) {
        const text = await btns.nth(i).textContent();
        if (text && text.length > 2 && !text.includes('Przełam')) {
          await btns.nth(i).click();
          break;
        }
      }
    } catch (e) {}
    await page.waitForTimeout(1200);
    try { await page.locator('button:has-text("Pomiń")').click({ timeout: 1500 }); } catch (e) {}
    await page.waitForTimeout(1000);
    try { await page.locator('button:has(span.rounded-full)').first().click({ timeout: 1500 }); } catch (e) {}
    await page.waitForTimeout(1200);
  }

  // Second minigame
  console.log('Second minigame...');
  await page.waitForTimeout(5000);

  // ════════════════════════════════════════════════════════════
  // ROUNDS 7-9
  // ════════════════════════════════════════════════════════════
  console.log('Playing rounds 7-9...');
  await page.waitForTimeout(1500);

  for (let r = 0; r < 3; r++) {
    await page.waitForTimeout(1200);
    try {
      const btns = page.locator('.grid button, .space-y-3 button');
      const count = await btns.count();
      for (let i = 0; i < count; i++) {
        const text = await btns.nth(i).textContent();
        if (text && text.length > 2 && !text.includes('Przełam')) {
          await btns.nth(i).click();
          break;
        }
      }
    } catch (e) {}
    await page.waitForTimeout(1200);
    try { await page.locator('button:has-text("Pomiń")').click({ timeout: 1500 }); } catch (e) {}
    await page.waitForTimeout(1000);
    try { await page.locator('button:has(span.rounded-full)').first().click({ timeout: 1500 }); } catch (e) {}
    await page.waitForTimeout(1200);
  }

  // ════════════════════════════════════════════════════════════
  // 08 - PYRAMID
  // ════════════════════════════════════════════════════════════
  console.log('08 - Pyramid');
  await page.waitForTimeout(2000);
  await screenshot(page, '08-pyramid', 800);

  // Answer pyramid questions
  for (let q = 0; q < 5; q++) {
    await page.waitForTimeout(1500);
    try { await page.locator('button:has(span.rounded-full)').first().click({ timeout: 2000 }); } catch (e) {}
    await page.waitForTimeout(1200);
  }

  // ════════════════════════════════════════════════════════════
  // 09 - FINISHED
  // ════════════════════════════════════════════════════════════
  console.log('09 - Finished');
  await page.waitForTimeout(2000);
  await screenshot(page, '09-finished', 800);

  // Cleanup
  s2.disconnect();
  s3.disconnect();
  await browser.close();
  console.log('\nAll screenshots saved!');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
