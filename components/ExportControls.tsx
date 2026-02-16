import React from 'react';
import * as XLSX from 'xlsx';
import { Issue, Source, SourceType } from '../types';
import { CsvIcon } from './icons/CsvIcon';
import { ExcelIcon } from './icons/ExcelIcon';
import { SOURCE_TYPE_DISPLAY_NAMES } from '../constants';
import { LockIcon } from './icons/LockIcon';

interface ExportControlsProps {
  issues: Issue[];
  productName: string;
  selectedPlan: string | null;
  onGoToSubscription: () => void;
}

const MAX_SOURCES_COLUMNS = 3;

const escapeCsvCell = (cellData: any): string => {
  if (cellData === null || cellData === undefined) return '';
  const stringData = String(cellData);
  if (stringData.includes(',') || stringData.includes('"') || stringData.includes('\n')) {
    return `"${stringData.replace(/"/g, '""')}"`;
  }
  return stringData;
};

const ExportControls: React.FC<ExportControlsProps> = ({ 
  issues, 
  productName,
  selectedPlan,
  onGoToSubscription
}) => {
  const getSafeFilename = (name: string) => name.replace(/[^a-z0-9_.-]/gi, '_').toLowerCase();
  const isFreeTier = selectedPlan === 'free';

  const handleExportCSV = () => {
    if (isFreeTier) return;
    const sourceTypesOrder: SourceType[] = [
      SourceType.Tweets,
      SourceType.RedditPosts,
      SourceType.TrustpilotPosts,
      SourceType.YouTube,
      SourceType.GoogleArticles,
    ];

    const headers = [
      'ID', 'Description', 'Category', 'Last Detected', 'Total Occurrences',
      ...sourceTypesOrder.map(st => `${SOURCE_TYPE_DISPLAY_NAMES[st]} Occurrences`),
    ];
    for (let i = 1; i <= MAX_SOURCES_COLUMNS; i++) {
      headers.push(`Source ${i} Type`, `Source ${i} Title`, `Source ${i} URL`);
    }

    const rows = issues.map(issue => {
      const rowBase = [
        escapeCsvCell(issue.id),
        escapeCsvCell(issue.description),
        escapeCsvCell(issue.category),
        escapeCsvCell(new Date(issue.lastDetected).toLocaleDateString('en-CA')),
        escapeCsvCell(issue.totalOccurrences),
      ];
      
      const occurrenceDetailCells = sourceTypesOrder.map(st => 
        escapeCsvCell(issue.occurrenceDetails?.[st] || 0)
      );

      const sourceCells: string[] = [];
      for (let i = 0; i < MAX_SOURCES_COLUMNS; i++) {
        const source = issue.sources[i];
        sourceCells.push(
          escapeCsvCell(source ? SOURCE_TYPE_DISPLAY_NAMES[source.type as SourceType] || source.type : ''),
          escapeCsvCell(source ? source.title : ''),
          escapeCsvCell(source ? source.url : '')
        );
      }
      return [...rowBase, ...occurrenceDetailCells, ...sourceCells].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${getSafeFilename(productName)}_issues.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleExportXLSX = () => {
    if (isFreeTier) return;
     const sourceTypesOrder: SourceType[] = [
      SourceType.Tweets,
      SourceType.RedditPosts,
      SourceType.TrustpilotPosts,
      SourceType.YouTube,
      SourceType.GoogleArticles,
    ];

    const dataForExcel = issues.map(issue => {
      const row: {[key: string]: any} = {
        'ID': issue.id,
        'Description': issue.description,
        'Category': issue.category,
        'Last Detected': new Date(issue.lastDetected),
        'Total Occurrences': issue.totalOccurrences,
      };

      sourceTypesOrder.forEach(st => {
        row[`${SOURCE_TYPE_DISPLAY_NAMES[st]} Occurrences`] = issue.occurrenceDetails?.[st] || 0;
      });

      issue.sources.slice(0, MAX_SOURCES_COLUMNS).forEach((source, i) => {
        row[`Source ${i + 1} Type`] = SOURCE_TYPE_DISPLAY_NAMES[source.type as SourceType] || source.type;
        row[`Source ${i + 1} Title`] = source.title;
        row[`Source ${i + 1} URL`] = source.url;
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Issues');
    XLSX.writeFile(workbook, `${getSafeFilename(productName)}_issues.xlsx`);
  };

  const UpgradePrompt = () => (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
      <LockIcon className="w-6 h-6 text-white mb-2 opacity-80" />
      <button
        onClick={onGoToSubscription}
        className="px-3 py-1.5 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors text-xs apple-click"
      >
        Upgrade Plan
      </button>
    </div>
  );

  return (
    <div className="liquid-glass !p-4 mb-6 relative apple-hover">
      {isFreeTier && <UpgradePrompt />}
      <fieldset disabled={isFreeTier} className={isFreeTier ? 'opacity-20' : ''}>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={handleExportCSV}
            disabled={isFreeTier}
            className="flex items-center justify-center px-4 py-2 border border-white/20 hover:bg-white/5 text-white font-medium rounded-lg transition-all w-full sm:w-auto text-sm apple-click"
          >
            <CsvIcon className="w-4 h-4 mr-2 opacity-80" />
            Export CSV
          </button>
          <button
            onClick={handleExportXLSX}
            disabled={isFreeTier}
            className="flex items-center justify-center px-4 py-2 border border-white/20 hover:bg-white/5 text-white font-medium rounded-lg transition-all w-full sm:w-auto text-sm apple-click"
          >
            <ExcelIcon className="w-4 h-4 mr-2 opacity-80" />
            Export XLSX
          </button>
        </div>
      </fieldset>
    </div>
  );
};

export default ExportControls;