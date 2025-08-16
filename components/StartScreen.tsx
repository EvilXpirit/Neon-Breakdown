import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black/50">
      <h2 className="text-5xl font-press-start text-cyan-400 text-shadow-cyan mb-4">NEON BREAKDOWN</h2>
      <p className="text-xl text-magenta-500 mb-8">The future is retro. The breakdown is now.</p>
      <button
        onClick={onStart}
        className="font-press-start text-2xl bg-magenta-500 text-white py-4 px-8 rounded border-2 border-magenta-300 transition-all duration-300
                   hover:bg-magenta-400 hover:shadow-[0_0_20px_#f0f]"
      >
        Start Game
      </button>
    </div>
  );
};

export default StartScreen;
