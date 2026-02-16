import React from 'react';
import { Issue } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import ExportControls from './ExportControls';
import LoadingSpinner from './LoadingSpinner';

interface ProductColumnProps {
  productName: string;
  issues: Issue[];
  onResolveIssue: (issueId: string) => void;
  isLoading?: boolean;
  error?: string | null;
  isPrimary: boolean; 
  selectedPlan: string | null;
  onGoToSubscription: () => void;
}

const ProductColumn: React.FC<ProductColumnProps> = ({
  productName,
  issues,
  onResolveIssue,
  isLoading,
  error,
  isPrimary,
  selectedPlan,
  onGoToSubscription,
}) => {
  if (isLoading) {
    return (
      <div className="liquid-glass h-full flex flex-col items-center justify-center p-12">
        <LoadingSpinner />
        <p className="mt-4 text-gray-500">Analyzing {productName}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="liquid-glass border-red-500/30 p-8 text-center animate-fade-in">
        <h3 className="text-red-400 font-semibold mb-2">Error</h3>
        <p className="text-gray-400 text-sm">{error}</p>
      </div>
    );
  }
  
  if (issues.length === 0) {
    return (
      <div className="liquid-glass h-full flex flex-col items-center justify-center text-center p-12 animate-fade-in">
         <div className="bg-green-500/20 p-3 rounded-full mb-4">
            <CheckIcon className="w-8 h-8 text-green-500" />
         </div>
        <h3 className="text-xl font-bold text-white mb-2">{productName}</h3>
        <p className="text-gray-400 text-sm">No issues detected.</p>
      </div>
    );
  }

  return (
    <div className="liquid-glass !p-0 h-full flex flex-col animate-fade-in">
      <div className="p-4 border-b border-white/10 bg-white/5 shrink-0">
        <h3 className="text-lg font-bold text-white text-center">{productName}</h3>
        <div className="mt-2 text-center">
            <span className="text-xs text-gray-500 uppercase tracking-wider">{isPrimary ? 'Primary' : 'Competitor'}</span>
        </div>
      </div>
      
      {/* Removed data-grid-container class here to prevent double borders and rounded corner clipping artifacts inside the card */}
      <div className="flex-grow overflow-auto custom-scrollbar-column">
         <table className="data-grid w-full">
            <thead>
                <tr>
                    <th>Issue</th>
                    <th className="text-right">Freq</th>
                    <th className="text-right"></th>
                </tr>
            </thead>
            <tbody>
                {issues.map((issue, index) => (
                   <tr 
                      key={issue.id} 
                      className="group hover:bg-white/5 transition-colors animate-list-enter"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <td className="w-2/3">
                            <p className="text-sm text-white font-medium line-clamp-3 leading-relaxed">{issue.description}</p>
                            <span className="text-xs text-gray-500 mt-1 inline-block">{issue.category}</span>
                        </td>
                        <td className="text-right font-mono-numbers text-gray-400">
                            {issue.totalOccurrences || '-'}
                        </td>
                        <td className="text-right">
                            <button onClick={() => onResolveIssue(issue.id)} className="text-gray-600 hover:text-green-400 apple-click">
                                <CheckIcon className="w-4 h-4" />
                            </button>
                        </td>
                   </tr>
                ))}
            </tbody>
         </table>
      </div>
      
       <div className="p-3 border-t border-white/10 shrink-0">
          <ExportControls 
            issues={issues} 
            productName={productName}
            selectedPlan={selectedPlan}
            onGoToSubscription={onGoToSubscription}
          />
       </div>
    </div>
  );
};

export default ProductColumn;