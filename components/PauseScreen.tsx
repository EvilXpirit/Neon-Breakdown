import React from 'react';

interface PauseScreenProps {
  onResume: () => void;
  onRestart: () => void;
}

const PauseScreen: React.FC<PauseScreenProps> = ({ onResume, onRestart }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black/70 backdrop-blur-sm">
      <h2 className="text-4xl font-press-start text-cyan-400 text-shadow-cyan mb-8">PAUSED</h2>
      
      <div className="flex flex-col gap-4">
        <button
          onClick={onResume}
          className="font-press-start text-xl bg-cyan-500 text-black py-3 px-6 rounded border-2 border-cyan-300 transition-all duration-300
                     hover:bg-cyan-400 hover:shadow-[0_0_20px_#0ff]"
        >
          Resume
        </button>
        
        <button
          onClick={onRestart}
          className="font-press-start text-xl bg-magenta-500 text-white py-3 px-6 rounded border-2 border-magenta-300 transition-all duration-300
                     hover:bg-magenta-400 hover:shadow-[0_0_20px_#f0f]"
        >
          Restart
        </button>
      </div>
      
      <p className="mt-8 text-lg text-magenta-500 text-shadow-magenta">
        Press ESC to resume
      </p>
    </div>
  );
};

export default PauseScreen;
