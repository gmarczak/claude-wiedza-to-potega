// Fast server for taking screenshots - reduced timers
import { createApp } from './app';

// Monkey-patch setTimeout and setInterval to speed up game timers
const origSetTimeout = global.setTimeout;
const origSetInterval = global.setInterval;

// Speed multiplier: 10x faster
const SPEED = 3;

global.setTimeout = ((fn: any, delay: any, ...args: any[]) => {
  return origSetTimeout(fn, Math.max(50, (delay || 0) / SPEED), ...args);
}) as any;

global.setInterval = ((fn: any, delay: any, ...args: any[]) => {
  return origSetInterval(fn, Math.max(50, (delay || 0) / SPEED), ...args);
}) as any;

const ALLOWED_ORIGINS = ['http://localhost:5173'];
const { httpServer } = createApp(ALLOWED_ORIGINS);

const PORT = 3001;
httpServer.listen(PORT, () => console.log(`Fast server running on port ${PORT} (${SPEED}x speed)`));
