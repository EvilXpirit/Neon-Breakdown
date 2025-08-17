import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Brick } from './types';
import { INITIAL_LIVES } from './constants';
import StartScreen from './components/StartScreen';
import EndScreen from './components/EndScreen';
import GameCanvas from './components/GameCanvas';
import PauseScreen from './components/PauseScreen';
import PauseButton from './components/common/PauseButton';
import HUD from './components/HUD';
import { generateLevelLayout } from './services/levelGenerator';

const WIN_MESSAGES = [
  "System Mastered!",
  "You are a Neon Legend!",
  "Reality reconfigured to your will.",
  "Cycle complete. Victory achieved.",
];

const LOSE_MESSAGES = [
  "System Failure.",
  "Reality has corrupted.",
  "Better luck next cycle.",
  "Connection terminated.",
];

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [score, setScore] = useState(0);
  const [levelLayout, setLevelLayout] = useState<Brick[][]>([]);
  const [endGameMessage, setEndGameMessage] = useState('');

  const loadLevel = useCallback((currentLevel: number) => {
    const layout = generateLevelLayout(currentLevel);
    setLevelLayout(layout);
  }, []);

  const togglePause = useCallback(() => {
    setGameState(prevState => 
      prevState === GameState.PLAYING ? GameState.PAUSED : 
      prevState === GameState.PAUSED ? GameState.PLAYING : 
      prevState
    );
  }, []);

  useEffect(() => {
    if (gameState === GameState.START) {
      loadLevel(level);
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        togglePause();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, level, loadLevel, togglePause]);

  const startGame = () => {
    if (levelLayout.length > 0) {
      setGameState(GameState.PLAYING);
    }
  };

  const nextLevel = () => {
    const newLevel = level + 1;
    setLevel(newLevel);
    setGameState(GameState.LOADING_LEVEL);
    const layout = generateLevelLayout(newLevel);
    setLevelLayout(layout);
    setGameState(GameState.PLAYING);
  };
  
  const handleGameOver = useCallback(() => {
    setEndGameMessage(LOSE_MESSAGES[Math.floor(Math.random() * LOSE_MESSAGES.length)]);
    setGameState(GameState.GAME_OVER);
  }, []);

  const handleWin = useCallback(() => {
    // This is a placeholder for a win condition, e.g., after a certain level
    setEndGameMessage(WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]);
    setGameState(GameState.WIN);
  }, []);

  const restartGame = () => {
    setScore(0);
    setLives(INITIAL_LIVES);
    setLevel(1);
    loadLevel(1);
    setEndGameMessage('');
    setGameState(GameState.START);
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.START:
      case GameState.LOADING_LEVEL:
        return <StartScreen onStart={startGame} />;
      
      case GameState.PLAYING:
      case GameState.PAUSED:
        return (
          <>
            {levelLayout.length > 0 && (
              <>
                <GameCanvas
                  levelLayout={levelLayout}
                  onGameOver={handleGameOver}
                  onLevelComplete={nextLevel}
                  updateScore={setScore}
                  updateLives={setLives}
                  lives={lives}
                  score={score}
                  isPaused={gameState === GameState.PAUSED}
                />
                {gameState === GameState.PLAYING && (
                  <PauseButton onPause={togglePause} />
                )}
              </>
            )}
            {gameState === GameState.PAUSED && (
              <PauseScreen 
                onResume={togglePause}
                onRestart={restartGame}
              />
            )}
          </>
        );
      
      case GameState.GAME_OVER:
      case GameState.WIN:
        return <EndScreen onRestart={restartGame} score={score} win={gameState === GameState.WIN} message={endGameMessage} />;
      
      default:
        return <StartScreen onStart={startGame} />;
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center bg-black bg-cover bg-center p-2 sm:p-4"
      style={{ backgroundImage: `url('assets/retro-bg.png')` }}
    >
      <div className="w-full max-w-[95vh] bg-black/60 backdrop-blur-sm border-2 border-cyan-400 box-shadow-cyan p-2 sm:p-4 rounded-lg">
        <header className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-2 sm:mb-4 border-b-2 border-magenta-500 pb-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-cyan-400 drop-shadow-[0_0_8px_cyan]">NEON BREAKDOWN</h1>
          {gameState === GameState.PLAYING && <HUD score={score} lives={lives} level={level} />}
        </header>
        <main className="relative aspect-[4/3] w-full bg-black/50 rounded overflow-hidden">
          {renderContent()}
        </main>
      </div>
       <footer className="text-center mt-4 text-xs text-magenta-500">
        Retro-futuristic fun
      </footer>
    </div>
  );
};

export default App;
