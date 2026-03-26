// Configuration for each avatar's 3D appearance
// Each avatar gets a unique body shape modifier and accessory

export interface AvatarConfig {
  id: string;
  emoji: string;
  color: string;
  bodyScale: [number, number, number]; // x, y, z scale for body
  headScale: number; // uniform head scale
  accessory?: 'hat' | 'horns' | 'antenna' | 'crown' | 'halo' | 'bandana';
  accessoryColor?: string;
  emissiveIntensity: number; // glow strength
}

export const AVATAR_CONFIGS: Record<string, AvatarConfig> = {
  hotdog: {
    id: 'hotdog',
    emoji: '🌭',
    color: '#ef4444',
    bodyScale: [0.9, 1.2, 0.9],
    headScale: 1,
    emissiveIntensity: 0.3,
  },
  robot: {
    id: 'robot',
    emoji: '🤖',
    color: '#3b82f6',
    bodyScale: [1.1, 1, 1.1],
    headScale: 1.1,
    accessory: 'antenna',
    accessoryColor: '#60a5fa',
    emissiveIntensity: 0.5,
  },
  wizard: {
    id: 'wizard',
    emoji: '🧙',
    color: '#8b5cf6',
    bodyScale: [1, 1.1, 1],
    headScale: 1,
    accessory: 'hat',
    accessoryColor: '#a78bfa',
    emissiveIntensity: 0.4,
  },
  alien: {
    id: 'alien',
    emoji: '👽',
    color: '#22c55e',
    bodyScale: [0.85, 1.15, 0.85],
    headScale: 1.3,
    emissiveIntensity: 0.6,
  },
  pirate: {
    id: 'pirate',
    emoji: '🏴‍☠️',
    color: '#f59e0b',
    bodyScale: [1.1, 1, 1.1],
    headScale: 1,
    accessory: 'bandana',
    accessoryColor: '#dc2626',
    emissiveIntensity: 0.3,
  },
  ninja: {
    id: 'ninja',
    emoji: '🥷',
    color: '#6366f1',
    bodyScale: [0.9, 1.1, 0.9],
    headScale: 0.95,
    accessory: 'bandana',
    accessoryColor: '#312e81',
    emissiveIntensity: 0.2,
  },
  vampire: {
    id: 'vampire',
    emoji: '🧛',
    color: '#dc2626',
    bodyScale: [1, 1.1, 1],
    headScale: 1,
    accessory: 'horns',
    accessoryColor: '#7f1d1d',
    emissiveIntensity: 0.4,
  },
  astronaut: {
    id: 'astronaut',
    emoji: '👨‍🚀',
    color: '#0ea5e9',
    bodyScale: [1.15, 1, 1.15],
    headScale: 1.2,
    accessory: 'halo',
    accessoryColor: '#38bdf8',
    emissiveIntensity: 0.5,
  },
  dragon: {
    id: 'dragon',
    emoji: '🐉',
    color: '#16a34a',
    bodyScale: [1.2, 1, 1.2],
    headScale: 1.1,
    accessory: 'horns',
    accessoryColor: '#15803d',
    emissiveIntensity: 0.4,
  },
  detective: {
    id: 'detective',
    emoji: '🕵️',
    color: '#78716c',
    bodyScale: [1, 1.05, 1],
    headScale: 1,
    accessory: 'hat',
    accessoryColor: '#44403c',
    emissiveIntensity: 0.2,
  },
  unicorn: {
    id: 'unicorn',
    emoji: '🦄',
    color: '#e879f9',
    bodyScale: [1, 1.1, 1],
    headScale: 1.1,
    accessory: 'crown',
    accessoryColor: '#f0abfc',
    emissiveIntensity: 0.6,
  },
  ghost: {
    id: 'ghost',
    emoji: '👻',
    color: '#94a3b8',
    bodyScale: [1, 1.2, 1],
    headScale: 1.15,
    emissiveIntensity: 0.5,
  },
};
