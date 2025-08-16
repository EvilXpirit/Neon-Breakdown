
export enum GameState {
  START,
  PLAYING,
  PAUSED,
  LEVEL_COMPLETE,
  GAME_OVER,
  WIN,
  LOADING_LEVEL,
}

export interface Ball {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
}

export interface Paddle {
  x: number;
  width: number;
  height: number;
}

export interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
  type: number;
}
