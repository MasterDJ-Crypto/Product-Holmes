import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="relative w-10 h-10">
         {/* Clean, high-performance SVG Spinner */}
         <svg className="animate-spin w-full h-full text-[var(--brand-color)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
         </svg>
      </div>
      <p className="mt-6 text-sm text-[var(--text-secondary)] font-medium tracking-wide animate-pulse">
        Processing Intelligence...
      </p>
    </div>
  );
};

export default LoadingSpinner;