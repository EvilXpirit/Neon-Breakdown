import React from 'react';

interface PauseButtonProps {
  onPause: () => void;
}

const PauseButton: React.FC<PauseButtonProps> = ({ onPause }) => {
  return (
    <button
      onClick={onPause}
      className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/40 border-2 border-cyan-400 
                 hover:bg-black/60 transition-all duration-300 hover:shadow-[0_0_10px_#0ff]
                 touch-manipulation"
      aria-label="Pause game"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="#00ffff"
        className="drop-shadow-[0_0_3px_#00ffff]"
      >
        <rect x="6" y="4" width="4" height="16"/>
        <rect x="14" y="4" width="4" height="16"/>
      </svg>
    </button>
  );
};

export default PauseButton;
