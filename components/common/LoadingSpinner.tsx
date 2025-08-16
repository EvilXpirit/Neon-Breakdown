
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="w-16 h-16 border-4 border-magenta-500 border-t-transparent rounded-full animate-spin"
         style={{ boxShadow: '0 0 10px #f0f' }}>
    </div>
  );
};

export default LoadingSpinner;
