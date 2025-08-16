import { Brick } from '../types';
import { BRICK_ROWS, BRICK_COLS } from '../constants';

// Simple pseudo-random number generator for deterministic levels
const seededRandom = (seed: number) => {
  let s = seed;
  return () => {
    s = Math.sin(s) * 10000;
    return s - Math.floor(s);
  };
};

export const generateLevelLayout = (level: number): Brick[][] => {
  const layout: number[][] = Array.from({ length: BRICK_ROWS }, () => Array(BRICK_COLS).fill(0));
  const rand = seededRandom(level);

  const patternType = (level - 1) % 5; // Cycle through 5 patterns

  switch (patternType) {
    // Pattern 1: Solid rows, introducing tough bricks
    case 0:
      for (let r = 0; r < Math.min(4 + Math.floor(level / 5), BRICK_ROWS); r++) {
        for (let c = 0; c < BRICK_COLS; c++) {
          layout[r][c] = (r < 2 && level > 5) ? 2 : 1;
        }
      }
      break;

    // Pattern 2: Checkerboard
    case 1:
      for (let r = 0; r < Math.min(6 + Math.floor(level / 5), BRICK_ROWS); r++) {
        for (let c = 0; c < BRICK_COLS; c++) {
          if ((r + c) % 2 === 0) {
            layout[r][c] = (level > 6) ? (rand() > 0.7 ? 2 : 1) : 1;
          }
        }
      }
      break;

    // Pattern 3: Pyramid
    case 2:
      for (let r = 0; r < BRICK_ROWS; r++) {
        const bricksInRow = BRICK_COLS - r * 2;
        if (bricksInRow <= 0) break;
        const startCol = r;
        for (let c = startCol; c < startCol + bricksInRow; c++) {
          layout[r][c] = (level > 7 && r < 2) ? 2 : 1;
        }
      }
      break;

    // Pattern 4: Hollow Center
    case 3:
      for (let r = 0; r < BRICK_ROWS; r++) {
        for (let c = 0; c < BRICK_COLS; c++) {
          if (r < 2 || r >= BRICK_ROWS - 4 || c < 2 || c >= BRICK_COLS - 2) {
             if (r < BRICK_ROWS - 4) { // only top part
                layout[r][c] = (level > 8 && rand() > 0.6) ? 2 : 1;
             }
          }
        }
      }
      break;
      
    // Pattern 5: Random with Symmetry
    case 4:
       for (let r = 0; r < BRICK_ROWS - 3; r++) {
        for (let c = 0; c < Math.ceil(BRICK_COLS / 2); c++) {
           if (rand() > 0.4) {
             const brickType = (level > 9 && rand() > 0.5) ? 2 : 1;
             layout[r][c] = brickType;
             layout[r][BRICK_COLS - 1 - c] = brickType; // Mirror
           }
        }
      }
      break;
  }

  return layout.map((row) =>
    row.map((cell) => ({
      health: cell,
      type: cell,
    } as Brick))
  );
};
