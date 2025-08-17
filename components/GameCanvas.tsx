import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Ball, Paddle, Brick } from '../types';
import { 
  CANVAS_WIDTH, CANVAS_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_Y_OFFSET,
  BALL_RADIUS, BALL_SPEED, BRICK_HEIGHT, BRICK_COLS, BRICK_ROWS,
  BRICK_PADDING, BRICK_OFFSET_LEFT, BRICK_OFFSET_TOP, NEON_CYAN, 
  NEON_MAGENTA, POINTS_PER_BRICK, BRICK_COLORS
} from '../constants';

interface GameCanvasProps {
  levelLayout: Brick[][];
  onGameOver: () => void;
  onLevelComplete: () => void;
  updateScore: React.Dispatch<React.SetStateAction<number>>;
  updateLives: React.Dispatch<React.SetStateAction<number>>;
  lives: number;
  score: number;
  isPaused: boolean;
}

// Helper for playing sounds
const playSound = (src: string) => {
  const audio = new Audio(src);
  audio.play();
};

const GameCanvas: React.FC<GameCanvasProps> = ({
  levelLayout,
  onGameOver,
  onLevelComplete,
  updateScore,
  updateLives,
  lives,
  score,
  isPaused,
}) => {
  const [localPause, setLocalPause] = useState(false); // For 1s pause after losing life

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const paddleRef = useRef<Paddle>({
    x: (CANVAS_WIDTH - PADDLE_WIDTH) / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
  });
  const ballRef = useRef<Ball>({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT - PADDLE_Y_OFFSET - PADDLE_HEIGHT - BALL_RADIUS,
    radius: BALL_RADIUS,
    dx: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    dy: -BALL_SPEED,
  });
  const bricksRef = useRef<Brick[][]>([]);

  const resetBallAndPaddle = useCallback(() => {
    if (paddleRef.current) {
      paddleRef.current.x = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
    }
    if (ballRef.current) {
      ballRef.current = {
        ...ballRef.current,
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT - PADDLE_Y_OFFSET - PADDLE_HEIGHT - BALL_RADIUS,
        dx: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
        dy: -BALL_SPEED,
      };
    }
  }, []);

  const drawNeonRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) => {
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.shadowBlur = 0;
  };

  const drawNeonCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;
  };

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // Draw paddle
    if (paddleRef.current) {
      drawNeonRect(ctx, paddleRef.current.x, CANVAS_HEIGHT - PADDLE_Y_OFFSET, paddleRef.current.width, paddleRef.current.height, NEON_CYAN);
    }
    // Draw ball
    if (ballRef.current) {
      drawNeonCircle(ctx, ballRef.current.x, ballRef.current.y, ballRef.current.radius, NEON_MAGENTA);
    }
    // Draw bricks
    bricksRef.current.forEach(row => {
      row.forEach(brick => {
        if (brick.health > 0) {
          const color = BRICK_COLORS[brick.type] || NEON_CYAN;
          drawNeonRect(ctx, brick.x, brick.y, brick.width, brick.height, color);
          if (brick.type === 2) {
            ctx.fillStyle = `rgba(255, 255, 255, ${brick.health > 1 ? 0.5 : 0.2})`;
            ctx.fillRect(brick.x + 5, brick.y + 5, brick.width - 10, brick.height - 10);
          }
        }
      });
    });
  }, []);

  const update = useCallback(() => {
    if (localPause) return; // Skip updates if we're pausing after life lost

    const ball = ballRef.current;
    const paddle = paddleRef.current;
    if (!ball || !paddle) return;
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision
    if (ball.x + ball.radius > CANVAS_WIDTH || ball.x - ball.radius < 0) {
      ball.dx *= -1;
    }
    if (ball.y - ball.radius < 0) {
      ball.dy *= -1;
    }

    // Paddle collision (board)
    if (
      ball.y + ball.radius > CANVAS_HEIGHT - PADDLE_Y_OFFSET &&
      ball.y - ball.radius < CANVAS_HEIGHT - PADDLE_Y_OFFSET + paddle.height &&
      ball.x > paddle.x &&
      ball.x < paddle.x + paddle.width
    ) {
      ball.dy *= -1;
      // Change angle based on hit position
      let collidePoint = ball.x - (paddle.x + paddle.width / 2);
      collidePoint = collidePoint / (paddle.width / 2);
      let angle = collidePoint * (Math.PI / 3);
      ball.dx = BALL_SPEED * Math.sin(angle);
      ball.dy = -BALL_SPEED * Math.cos(angle);

      // --- SOUND: Ball hits paddle
      playSound('assets/ball.wav');
    }

    // Bottom wall (lose life)
    if (ball.y + ball.radius > CANVAS_HEIGHT) {
      // Pause for 1s after losing life
      setLocalPause(true); // Set local pause state
      setTimeout(() => {
        setLocalPause(false);
        updateLives(prev => prev - 1);
        if (lives - 1 <= 0) {
          onGameOver();
        } else {
          resetBallAndPaddle();
        }
      }, 1000); // 1 second pause
      return; // Stop update during pause
    }

    // Brick collision (glass)
    let hitGlass = false;
    bricksRef.current.forEach(row => {
      row.forEach(brick => {
        if (brick.health > 0) {
          if (
            ball.x > brick.x &&
            ball.x < brick.x + brick.width &&
            ball.y > brick.y &&
            ball.y < brick.y + brick.height
          ) {
            ball.dy *= -1;
            brick.health--;
            if (brick.health <= 0) {
              updateScore(prev => prev + POINTS_PER_BRICK);
            }
            hitGlass = true;
          }
        }
      });
    });
    // --- SOUND: Ball hits glass (brick)
    if (hitGlass) {
      playSound('assets/breaking-glass-83809.mp3');
    }

    if (bricksRef.current.length > 0 && bricksRef.current.flat().every(b => b.health <= 0)) {
      onLevelComplete();
    }
  }, [lives, onGameOver, onLevelComplete, resetBallAndPaddle, updateLives, updateScore, localPause]);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    update();
    draw(ctx);
    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [draw, update]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const brickWidth = (CANVAS_WIDTH - 2 * BRICK_OFFSET_LEFT) / BRICK_COLS - BRICK_PADDING;

    bricksRef.current = levelLayout.map((row, rowIndex) => 
      row.map((brickData, colIndex) => ({
        x: BRICK_OFFSET_LEFT + colIndex * (brickWidth + BRICK_PADDING),
        y: BRICK_OFFSET_TOP + rowIndex * (BRICK_HEIGHT + BRICK_PADDING),
        width: brickWidth,
        height: BRICK_HEIGHT,
        health: brickData.type,
        type: brickData.type,
      }))
    );
    resetBallAndPaddle();
  }, [levelLayout, resetBallAndPaddle]);

  useEffect(() => {
    if (!isPaused && !localPause) {
      animationFrameId.current = requestAnimationFrame(gameLoop);
    }
    const updatePaddlePosition = (clientX: number) => {
      const canvas = canvasRef.current;
      if (!canvas || !paddleRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      let relativeX = (clientX - rect.left) * scaleX;
      paddleRef.current.x = relativeX - paddleRef.current.width / 2;
      if (paddleRef.current.x < 0) paddleRef.current.x = 0;
      if (paddleRef.current.x + paddleRef.current.width > CANVAS_WIDTH) {
        paddleRef.current.x = CANVAS_WIDTH - paddleRef.current.width;
      }
    };
    const handleMouseMove = (e: MouseEvent) => {
      updatePaddlePosition(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Prevent scrolling while playing
      const touch = e.touches[0];
      if (touch) {
        updatePaddlePosition(touch.clientX);
      }
    };
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches;
      if (touch) {
        updatePaddlePosition(touch.clientX);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, [gameLoop, isPaused, localPause]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        width={CANVAS_WIDTH} 
        height={CANVAS_HEIGHT} 
        className="w-full h-full object-contain" 
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};

export default GameCanvas;
