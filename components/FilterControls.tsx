import React, { useMemo } from 'react';
import { FilterState, SourceType, Issue } from '../types';
import { SOURCE_TYPE_DISPLAY_NAMES } from '../constants';
import { FilterIcon } from './icons/FilterIcon';
import { TrashIcon } from './icons/TrashIcon'; 
import { LockIcon } from './icons/LockIcon';

interface FilterControlsProps {
  filters: FilterState;
  onFiltersChange: (newFilters: Partial<FilterState>) => void;
  onClearFilters: () => void;
  allIssues: Issue[];
  selectedPlan: string | null;
  onGoToSubscription: () => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  allIssues,
  selectedPlan,
  onGoToSubscription,
}) => {
  const isMaxTier = selectedPlan === 'max';

  const availableCategories = useMemo(() => {
    const categories = new Set(allIssues.map(issue => issue.category));
    return Array.from(categories).sort();
  }, [allIssues]);

  const availableSourceTypes = useMemo(() => {
    const sourceTypes = new Set<SourceType>();
    allIssues.forEach(issue => {
      issue.sources.forEach(source => sourceTypes.add(source.type));
      if (issue.occurrenceDetails) {
         Object.keys(issue.occurrenceDetails).forEach(st => sourceTypes.add(st as SourceType));
      }
    });
    return Array.from(sourceTypes).sort((a,b) => (SOURCE_TYPE_DISPLAY_NAMES[a] || a).localeCompare(SOURCE_TYPE_DISPLAY_NAMES[b] || b));
  }, [allIssues]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFiltersChange({ [name]: value === '' ? null : value });
  };

  const UpgradePrompt = () => (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-2xl">
      <LockIcon className="w-8 h-8 text-white mb-3 opacity-80" />
      <p className="text-white font-medium text-sm mb-3">Advanced Filters Locked</p>
      <button
        onClick={onGoToSubscription}
        className="px-4 py-2 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors text-xs apple-click"
      >
        Upgrade to Max
      </button>
    </div>
  );

  return (
    <div className="liquid-glass !p-6 mb-6 apple-hover">
      {!isMaxTier && <UpgradePrompt />}
      <fieldset disabled={!isMaxTier} className={!isMaxTier ? 'opacity-20' : ''}>
        <div className="flex items-center mb-6">
          <FilterIcon className="w-5 h-5 mr-3 text-white" />
          <h3 className="text-lg font-semibold text-white">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Keyword</label>
            <input
              type="text"
              name="keyword"
              value={filters.keyword}
              onChange={handleInputChange}
              placeholder="Search..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none apple-input placeholder-gray-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</label>
            <select
              name="category"
              value={filters.category || ''}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none apple-input appearance-none"
            >
              <option value="">All Categories</option>
              {availableCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Source</label>
            <select
              name="sourceType"
              value={filters.sourceType || ''}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none apple-input appearance-none"
            >
              <option value="">All Sources</option>
              {availableSourceTypes.map(st => (
                <option key={st} value={st}>{SOURCE_TYPE_DISPLAY_NAMES[st] || st}</option>
              ))}
            </select>
          </div>

          <div>
             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">After</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate || ''}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none apple-input scheme-dark"
            />
          </div>

          <div>
             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Before</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate || ''}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none apple-input scheme-dark"
            />
          </div>
          
          <div className="flex items-end">
            <button
              type="button"
              onClick={onClearFilters}
              className="w-full flex items-center justify-center px-4 py-2 bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg text-sm h-[38px] apple-click"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Reset
            </button>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default FilterControls;