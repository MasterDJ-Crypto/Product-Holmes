import React, { useState } from 'react';
import { Issue } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import SourceLink from './SourceLink';

interface IssueCardProps {
  issue: Issue & { occurrences?: number };
  onResolve: (issueId: string) => void;
  index: number; // Added for staggered animation
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, onResolve, index }) => {
  const [isVanishing, setIsVanishing] = useState(false);

  const getCategoryStyle = (category: string): string => {
    const lower = category.toLowerCase();
    // Using Apple HIG colors (System Red, Blue, Yellow) with subtle backgrounds
    if (lower.includes('bug')) return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (lower.includes('feature')) return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    if (lower.includes('performance')) return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    return 'text-[var(--text-secondary)] bg-[var(--text-primary)]/5 border-[var(--text-primary)]/10';
  };

  const handleResolve = () => {
    setIsVanishing(true);
    setTimeout(() => onResolve(issue.id), 300);
  };

  return (
    <tr 
        className={`group transition-all duration-300 border-b border-[var(--glass-border)] hover:bg-[var(--text-primary)]/5 ${isVanishing ? 'opacity-0 scale-[0.98]' : 'opacity-100'} animate-list-enter`}
        style={{ animationDelay: `${index * 50}ms` }}
    >
      <td className="w-1/3 py-4 px-5">
        <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-2 leading-relaxed tracking-tight" title={issue.description}>{issue.description}</p>
      </td>
      <td className="py-4 px-5">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getCategoryStyle(issue.category)}`}>
            {issue.category}
        </span>
      </td>
      <td className="text-right font-mono-numbers text-[var(--text-secondary)] py-4 px-5 text-sm">
        {issue.totalOccurrences || issue.occurrences || '-'}
      </td>
      <td className="text-[var(--text-secondary)] font-mono-numbers whitespace-nowrap py-4 px-5 text-sm">
        {new Date(issue.lastDetected).toLocaleDateString('en-GB')}
      </td>
      <td className="max-w-xs py-4 px-5">
         <div className="flex flex-wrap gap-2">
            {issue.sources.slice(0, 2).map(source => (
                <a 
                    key={source.id} 
                    href={source.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-block px-2 py-1 bg-[var(--text-primary)]/5 hover:bg-[var(--text-primary)]/10 rounded-md text-xs text-[var(--brand-color)] hover:underline truncate max-w-[150px] transition-colors"
                >
                    {source.title}
                </a>
            ))}
            {issue.sources.length > 2 && (
                <span className="text-xs text-[var(--text-secondary)] py-1 pl-1">+{issue.sources.length - 2}</span>
            )}
         </div>
      </td>
      <td className="text-right py-4 px-5">
        <button
          onClick={handleResolve}
          className="text-[var(--text-secondary)] hover-text-always-white hover:bg-green-500 rounded-full p-2 transition-all duration-200 apple-click shadow-sm"
          title="Mark Resolved"
        >
          <CheckIcon className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};

export default IssueCard;