import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';

interface SearchBarProps {
  onAnalyze: (productName: string) => void;
  isLoading: boolean;
  initialProductName?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onAnalyze, isLoading, initialProductName = '' }) => {
  const [productName, setProductName] = useState<string>(initialProductName);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setProductName(initialProductName);
  }, [initialProductName]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (productName.trim() && !isLoading) {
      onAnalyze(productName.trim());
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-6 relative z-10">
      {/* Apple Intelligence / Co-pilot Glow Effect */}
      <div 
        className={`absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 blur-xl transition-opacity duration-700 ${isFocused || isLoading ? 'opacity-40' : ''}`}
      ></div>
      
      <div className={`liquid-glass !p-1 !rounded-2xl transition-all duration-300 ${isFocused ? 'scale-[1.01]' : ''}`}>
          <form onSubmit={handleSubmit} className="relative flex items-center bg-[var(--glass-bg)] rounded-xl overflow-hidden">
            
            <div className={`pl-5 transition-colors duration-300 ${isFocused ? 'text-[var(--brand-color)]' : 'text-gray-400'}`}>
                 <MagnifyingGlassIcon className="w-6 h-6" />
            </div>
            
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ask Holmes to investigate a product..."
              disabled={isLoading}
              className="w-full bg-transparent text-lg text-[var(--text-primary)] placeholder-gray-400 px-4 py-5 outline-none font-normal tracking-tight"
            />
            
            <div className="pr-2">
                <button
                type="submit"
                disabled={isLoading || !productName.trim()}
                className={`
                    px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 apple-click
                    ${isLoading || !productName.trim() 
                        ? 'bg-gray-200/20 text-gray-400 cursor-not-allowed' 
                        : 'bg-[var(--brand-color)] text-always-white shadow-lg shadow-blue-500/30'
                    }
                `}
                >
                {isLoading ? (
                    <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Thinking
                    </span>
                ) : 'Analyze'}
                </button>
            </div>
          </form>
      </div>
      
      {/* Microcopy - Deference */}
      <p className="text-center text-xs text-[var(--text-secondary)] mt-4 font-medium opacity-70">
          Uses Human-Centered AI. Information is generated for research purposes.
      </p>
    </div>
  );
};

export default SearchBar;