import React from 'react';
import { NEON_MAGENTA } from '../constants';

interface HUDProps {
  score: number;
  lives: number;
  level: number;
}

const HeartIcon: React.FC<{ color: string }> = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill={color}>
        <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
        <path style={{filter: 'url(#glow)'}} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
);


const HUD: React.FC<HUDProps> = ({ score, lives, level }) => {
  return (
    <div className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-4 sm:gap-8 text-lg sm:text-xl font-orbitron">
      <div className="text-cyan-400 whitespace-nowrap">
        LVL: <span className="font-bold">{level}</span>
      </div>
      <div className="text-yellow-400 whitespace-nowrap">
        SCORE: <span className="font-bold">{score}</span>
      </div>
      <div className="flex items-center">
        <span className="text-magenta-500 whitespace-nowrap mr-2">LIVES:</span>
        <div className="flex gap-1 w-24">
            {Array.from({ length: lives }).map((_, i) => (
                <HeartIcon key={i} color={NEON_MAGENTA} />
            ))}
        </div>
      </div>
      {/* {onPause && (
        <button
          onClick={onPause}
          className="p-2 rounded-full bg-black/40 border-2 border-cyan-400 hover:bg-black/60 
                     transition-all duration-300 hover:shadow-[0_0_10px_#0ff] touch-manipulation shrink-0"
          aria-label="Pause game"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#00ffff">
            <rect x="6" y="4" width="4" height="16"/>
            <rect x="14" y="4" width="4" height="16"/>
          </svg>
        </button>
      )} */}
    </div>
  );
};

export default HUD;
