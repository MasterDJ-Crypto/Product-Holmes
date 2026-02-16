import React, { useMemo } from 'react';
import { Issue, FilterState, SourceType } from '../types';
import IssueCard from './IssueCard';
import ExportControls from './ExportControls';
import FilterControls from './FilterControls';
import TrendAnalysisDisplay from './TrendAnalysisDisplay';
import { CheckIcon } from './icons/CheckIcon'; 
import { FilterIcon } from './icons/FilterIcon';

interface ResultsDisplayProps {
  issues: Issue[];
  productName: string;
  onResolveIssue: (issueId: string) => void;
  selectedPlan: string | null;
  filters: FilterState;
  onFiltersChange: (newFilters: Partial<FilterState>) => void;
  onClearFilters: () => void;
  onGoToSubscription: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  issues, 
  productName, 
  onResolveIssue,
  selectedPlan,
  filters,
  onFiltersChange,
  onClearFilters,
  onGoToSubscription
}) => {

  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const keywordMatch = filters.keyword 
        ? issue.description.toLowerCase().includes(filters.keyword.toLowerCase())
        : true;
      const categoryMatch = filters.category 
        ? issue.category === filters.category
        : true;
      const sourceTypeMatch = filters.sourceType
        ? issue.sources.some(s => s.type === filters.sourceType) || 
          (issue.occurrenceDetails && issue.occurrenceDetails[filters.sourceType as SourceType] && issue.occurrenceDetails[filters.sourceType as SourceType]! > 0)
        : true;
      
      let dateMatch = true;
      if (filters.startDate || filters.endDate) {
        try {
          const issueDate = new Date(issue.lastDetected);
          issueDate.setHours(0,0,0,0); 

          if (filters.startDate) {
            const startDate = new Date(filters.startDate);
            startDate.setHours(0,0,0,0);
            if (issueDate < startDate) dateMatch = false;
          }
          if (filters.endDate && dateMatch) {
            const endDate = new Date(filters.endDate);
            endDate.setHours(0,0,0,0);
            if (issueDate > endDate) dateMatch = false;
          }
        } catch (e) {
          console.warn("Error parsing date:", issue.lastDetected, e);
        }
      }
      return keywordMatch && categoryMatch && sourceTypeMatch && dateMatch;
    });
  }, [issues, filters]);

  const noOriginalIssues = issues.length === 0;
  const noFilteredIssues = filteredIssues.length === 0 && !noOriginalIssues;


  if (noOriginalIssues) {
    return (
      <div className="liquid-glass text-center py-16 px-4 animate-fade-in flex flex-col items-center">
        <div className="bg-green-500/10 p-4 rounded-full w-16 h-16 mb-6 flex items-center justify-center">
           <CheckIcon className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">All Clear</h2>
        <p className="text-gray-400 max-w-lg mx-auto text-sm">
          Analysis complete for "{productName}". No significant negative feedback found in scanned sources.
        </p>
      </div>
    );
  }

  return (
    <section>
      <div className="flex items-end justify-between mb-2">
        <div>
            <h2 className="text-3xl font-semibold text-white tracking-tight animate-fade-in mb-1">
            Intelligence Report
            </h2>
            <p className="text-gray-400 text-sm animate-fade-in">Focus: {productName}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3 animate-fade-in" style={{ animationDelay: '100ms' }}>
         <div className="lg:col-span-2 flex flex-col gap-3">
             <FilterControls 
                filters={filters}
                onFiltersChange={onFiltersChange}
                onClearFilters={onClearFilters}
                allIssues={issues} 
                selectedPlan={selectedPlan}
                onGoToSubscription={onGoToSubscription}
            />
            <ExportControls 
              issues={filteredIssues} 
              productName={productName} 
              selectedPlan={selectedPlan}
              onGoToSubscription={onGoToSubscription}
            />
         </div>
         <div className="lg:col-span-1">
             <TrendAnalysisDisplay
                filteredIssues={filteredIssues}
                selectedPlan={selectedPlan}
                onGoToSubscription={onGoToSubscription}
              />
         </div>
      </div>

      
      {noFilteredIssues ? (
        <div className="liquid-glass text-center py-16 px-4 animate-fade-in">
            <FilterIcon className="w-12 h-12 mx-auto text-gray-600 mb-4" />
            <h2 className="text-lg font-semibold text-white mb-2">No Matches Found</h2>
            <p className="text-gray-400 text-sm">Adjust filters to broaden your search.</p>
        </div>
      ) : (
        <div className="liquid-glass !p-0 animate-fade-in !rounded-lg overflow-hidden" style={{ animationDelay: '200ms' }}>
            <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--surface-base)] flex justify-between items-center">
                <h3 className="font-semibold text-white text-sm">Issues List</h3>
                <span className="text-xs text-gray-500 bg-[var(--input-bg)] px-2 py-1 rounded">
                    {filteredIssues.length} items
                </span>
            </div>
            <div className="data-grid-container !border-0 !rounded-none">
                <table className="data-grid">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Category</th>
                            <th className="text-right">Freq.</th>
                            <th>Date</th>
                            <th>Sources</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredIssues.map((issue, index) => (
                            <IssueCard 
                                key={issue.id} 
                                issue={issue} 
                                onResolve={onResolveIssue}
                                index={index} 
                            />
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-2 bg-[var(--surface-base)] border-t border-[var(--border-subtle)]">
            </div>
        </div>
      )}
    </section>
  );
};

export default ResultsDisplay;