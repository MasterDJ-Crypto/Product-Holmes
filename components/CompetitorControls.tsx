import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';
import { LockIcon } from './icons/LockIcon';

interface CompetitorControlsProps {
  currentCompetitorName?: string | null;
  onAnalyze: (name: string) => void;
  onClear: () => void;
  isLoading: boolean;
  disabled?: boolean;
  selectedPlan: string | null;
  onGoToSubscription: () => void;
}

const CompetitorControls: React.FC<CompetitorControlsProps> = ({ 
  currentCompetitorName, 
  onAnalyze, 
  onClear, 
  isLoading, 
  disabled = false,
  selectedPlan,
  onGoToSubscription
}) => {
  const [showInput, setShowInput] = useState(false);
  const [competitorInput, setCompetitorInput] = useState('');
  const isMaxTier = selectedPlan === 'max';

  const handleAnalyzeClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (competitorInput.trim() && !isLoading && !disabled && isMaxTier) {
      onAnalyze(competitorInput.trim());
    }
  };

  if (!isMaxTier) {
      return (
          <div className="liquid-glass flex items-center justify-between opacity-60">
              <span className="text-gray-400">Competitor Analysis</span>
              <button onClick={onGoToSubscription} className="flex items-center text-xs bg-white/10 px-3 py-1 rounded-full text-white apple-click">
                  <LockIcon className="w-3 h-3 mr-2" /> Upgrade to Max
              </button>
          </div>
      )
  }

  return (
    <div className="liquid-glass p-6 apple-hover">
      <h3 className="text-lg font-semibold text-white mb-4">Competitor Matrix</h3>
      
      {!currentCompetitorName && !showInput && (
          <button 
            onClick={() => setShowInput(true)}
            disabled={disabled}
            className="w-full py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center apple-click"
          >
              <MagnifyingGlassIcon className="w-4 h-4 mr-2" /> Add Competitor
          </button>
      )}

      {(showInput || currentCompetitorName) && (
          <div className="space-y-4">
               {currentCompetitorName && !showInput && (
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/5 p-4 rounded-lg gap-4">
                       <div>
                           <span className="text-xs text-gray-500 uppercase">Analyzing Against</span>
                           <p className="text-white font-medium text-lg">{currentCompetitorName}</p>
                       </div>
                       <div className="flex space-x-3">
                           <button 
                             onClick={() => setShowInput(true)} 
                             className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-colors apple-click"
                            >
                               Update
                            </button>
                           <button 
                             onClick={onClear} 
                             className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-sm transition-colors apple-click"
                            >
                               Exit Comparison
                           </button>
                       </div>
                   </div>
               )}

               {showInput && (
                    <form onSubmit={handleAnalyzeClick} className="flex flex-col sm:flex-row gap-2">
                        <input 
                            type="text" 
                            value={competitorInput}
                            onChange={(e) => setCompetitorInput(e.target.value)}
                            placeholder="Competitor Name..."
                            className="flex-grow bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none apple-input"
                        />
                        <div className="flex gap-2">
                            <button type="submit" disabled={isLoading} className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-200 apple-click text-sm flex-1 sm:flex-none justify-center">
                                {isLoading ? 'Running...' : 'Run Analysis'}
                            </button>
                            <button type="button" onClick={() => setShowInput(false)} className="text-gray-500 hover:text-white px-3 apple-click text-sm">
                                Cancel
                            </button>
                        </div>
                    </form>
               )}
          </div>
      )}
    </div>
  );
};

export default CompetitorControls;