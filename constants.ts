
// Game Dimensions
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

// Paddle
export const PADDLE_WIDTH = 120;
export const PADDLE_HEIGHT = 20;
export const PADDLE_Y_OFFSET = 30;

// Ball
export const BALL_RADIUS = 10;
export const BALL_SPEED = 700; // pixels per second

// Bricks
export const BRICK_ROWS = 8;
export const BRICK_COLS = 10;
export const BRICK_HEIGHT = 25;
export const BRICK_PADDING = 10;
export const BRICK_OFFSET_TOP = 50;
export const BRICK_OFFSET_LEFT = 30;

// Game Rules
export const INITIAL_LIVES = 3;
export const POINTS_PER_BRICK = 100;

// Colors
export const NEON_CYAN = '#00ffff';
export const NEON_MAGENTA = '#ff00ff';
export const NEON_YELLOW = '#ffff00';
export const NEON_GREEN = '#39ff14';
export const BACKGROUND_COLOR = '#0a0a2a';

export const BRICK_COLORS: { [key: number]: string } = {
  1: NEON_CYAN,
  2: NEON_MAGENTA,
  3: NEON_YELLOW,
};
