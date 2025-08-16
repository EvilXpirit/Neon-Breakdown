import React from 'react';

interface EndScreenProps {
  onRestart: () => void;
  score: number;
  win: boolean;
  message: string;
}

const EndScreen: React.FC<EndScreenProps> = ({ onRestart, score, win, message }) => {
  const titleText = win ? "VICTORY" : "GAME OVER";
  const titleColor = win ? "text-cyan-400 text-shadow-cyan" : "text-red-500 text-shadow-[0_0_10px_#f00]";

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black/70">
      <h2 className={`text-6xl font-press-start mb-4 ${titleColor}`}>{titleText}</h2>
      <p className="text-2xl text-white mb-2">Final Score: <span className="text-yellow-400">{score}</span></p>

      <div className="h-16 flex items-center justify-center">
         <p className="text-lg text-magenta-500 text-shadow-magenta italic">"{message}"</p>
      </div>

      <button
        onClick={onRestart}
        className="mt-8 font-press-start text-xl bg-cyan-500 text-black py-3 px-6 rounded border-2 border-cyan-300 transition-all duration-300
                   hover:bg-cyan-400 hover:shadow-[0_0_20px_#0ff]"
      >
        Play Again
      </button>
    </div>
  );
};

export default EndScreen;
