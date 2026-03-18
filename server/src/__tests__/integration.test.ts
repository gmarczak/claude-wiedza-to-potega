import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { io as ioClient, Socket } from 'socket.io-client';
import type { AddressInfo } from 'net';
import { createApp } from '../app';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function connectClient(url: string): Promise<Socket> {
  return new Promise((resolve) => {
    const socket = ioClient(url, { autoConnect: true });
    socket.on('connect', () => resolve(socket));
  });
}

function once<T>(socket: Socket, event: string): Promise<T> {
  return new Promise((resolve) => socket.once(event, resolve));
}

// ─── Test suite ───────────────────────────────────────────────────────────────

describe('Socket.io integration', () => {
  let serverUrl: string;
  let stopServer: () => Promise<void>;

  beforeEach(async () => {
    const { httpServer } = createApp();
    await new Promise<void>((resolve) => httpServer.listen(0, resolve));
    const port = (httpServer.address() as AddressInfo).port;
    serverUrl = `http://localhost:${port}`;
    stopServer = () => new Promise((resolve) => httpServer.close(() => resolve()));
  });

  afterEach(async () => {
    await stopServer();
  });

  // ── room:create ─────────────────────────────────────────────────────────────

  describe('room:create', () => {
    it('emits room:created with a 6-char room ID', async () => {
      const socket = await connectClient(serverUrl);
      const createdId = once<string>(socket, 'room:created');
      socket.emit('room:create', { playerName: 'Alice', avatarId: 'robot', settings: { roundTime: 20, difficulty: 'mixed' } });
      const roomId = await createdId;
      expect(roomId).toMatch(/^[A-Z0-9]{6}$/);
      socket.disconnect();
    });

    it('emits room:joined with the room state', async () => {
      const socket = await connectClient(serverUrl);
      const joined = once<any>(socket, 'room:joined');
      socket.emit('room:create', { playerName: 'Alice', avatarId: 'robot', settings: { roundTime: 20, difficulty: 'mixed' } });
      const state = await joined;
      expect(state.phase).toBe('waiting');
      expect(state.players).toHaveLength(1);
      expect(state.players[0].name).toBe('Alice');
      socket.disconnect();
    });
  });

  // ── room:join ───────────────────────────────────────────────────────────────

  describe('room:join', () => {
    it('allows a second player to join', async () => {
      const host = await connectClient(serverUrl);
      const createdId = once<string>(host, 'room:created');
      host.emit('room:create', { playerName: 'Alice', avatarId: 'robot', settings: { roundTime: 20, difficulty: 'mixed' } });
      const roomId = await createdId;

      const guest = await connectClient(serverUrl);
      const guestJoined = once<any>(guest, 'room:joined');
      guest.emit('room:join', { roomId, playerName: 'Bob', avatarId: 'alien' });
      const state = await guestJoined;

      expect(state.players).toHaveLength(2);
      host.disconnect();
      guest.disconnect();
    });

    it('emits error for a non-existent room', async () => {
      const socket = await connectClient(serverUrl);
      const err = once<string>(socket, 'error');
      socket.emit('room:join', { roomId: 'XXXXXX', playerName: 'Bob', avatarId: 'alien' });
      const msg = await err;
      expect(msg).toMatch(/nie istnieje/i);
      socket.disconnect();
    });

    it('emits error when joining a game in progress', async () => {
      // Host creates room
      const host = await connectClient(serverUrl);
      const createdId = once<string>(host, 'room:created');
      host.emit('room:create', { playerName: 'Alice', avatarId: 'robot', settings: { roundTime: 20, difficulty: 'mixed' } });
      const roomId = await createdId;

      // Second player joins to make game startable
      const p2 = await connectClient(serverUrl);
      const p2Joined = once<any>(p2, 'room:joined');
      p2.emit('room:join', { roomId, playerName: 'Bob', avatarId: 'alien' });
      await p2Joined;

      // Start the game
      host.emit('game:start');
      // Wait briefly for the phase to change
      await new Promise((r) => setTimeout(r, 100));

      // Third player tries to join
      const p3 = await connectClient(serverUrl);
      const err = once<string>(p3, 'error');
      p3.emit('room:join', { roomId, playerName: 'Carol', avatarId: 'ninja' });
      const msg = await err;
      expect(msg).toMatch(/trwa/i);

      host.disconnect(); p2.disconnect(); p3.disconnect();
    });
  });

  // ── game:start ──────────────────────────────────────────────────────────────

  describe('game:start', () => {
    it('does nothing when only one player is present', async () => {
      const socket = await connectClient(serverUrl);
      const createdId = once<string>(socket, 'room:created');
      socket.emit('room:create', { playerName: 'Alice', avatarId: 'robot', settings: { roundTime: 20, difficulty: 'mixed' } });
      await createdId;

      let countdownFired = false;
      socket.on('game:countdown', () => { countdownFired = true; });
      socket.emit('game:start');
      await new Promise((r) => setTimeout(r, 200));

      expect(countdownFired).toBe(false);
      socket.disconnect();
    });
  });

  // ── disconnect mid-game ──────────────────────────────────────────────────────

  describe('disconnect', () => {
    it('triggers game:finished for the remaining player when one disconnects mid-game', async () => {
      const host = await connectClient(serverUrl);
      const createdId = once<string>(host, 'room:created');
      host.emit('room:create', { playerName: 'Alice', avatarId: 'robot', settings: { roundTime: 20, difficulty: 'mixed' } });
      const roomId = await createdId;

      const guest = await connectClient(serverUrl);
      const guestJoined = once<any>(guest, 'room:joined');
      guest.emit('room:join', { roomId, playerName: 'Bob', avatarId: 'alien' });
      await guestJoined;

      host.emit('game:start');
      // Wait for game to start (countdown)
      await once<any>(host, 'game:countdown');

      // Guest disconnects mid-game — host should get game:finished
      const finished = once<any>(host, 'game:finished');
      guest.disconnect();
      const result = await finished;

      expect(result).toHaveProperty('players');
      expect(result).toHaveProperty('winner');
      host.disconnect();
    });
  });
});
