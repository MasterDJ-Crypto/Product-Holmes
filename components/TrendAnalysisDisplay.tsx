import React, { useMemo } from 'react';
import { Issue } from '../types';
import { Pie, Bar } from 'react-chartjs-2';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { LockIcon } from './icons/LockIcon';

interface TrendAnalysisDisplayProps {
  filteredIssues: Issue[];
  selectedPlan: string | null;
  onGoToSubscription: () => void;
}

const TrendAnalysisDisplay: React.FC<TrendAnalysisDisplayProps> = ({
  filteredIssues,
  selectedPlan,
  onGoToSubscription,
}) => {
  const isMaxTier = selectedPlan === 'max';

  const categoryData = useMemo(() => {
    if (!filteredIssues.length) return null;
    const counts: { [key: string]: number } = {};
    filteredIssues.forEach(issue => {
      counts[issue.category] = (counts[issue.category] || 0) + 1;
    });
    const labels = Object.keys(counts);
    const data = Object.values(counts);
    return {
      labels,
      datasets: [{
        label: 'Issues by Category',
        data,
        backgroundColor: [
          '#3B82F6', // Blue 500
          '#8B5CF6', // Violet 500
          '#EC4899', // Pink 500
          '#10B981', // Emerald 500
          '#F59E0B', // Amber 500
          '#EF4444', // Red 500
          '#6366F1', // Indigo 500
        ],
        borderColor: 'transparent',
        borderWidth: 0,
        hoverOffset: 4,
      }],
    };
  }, [filteredIssues]);

  const issuesOverTimeData = useMemo(() => {
    if (!filteredIssues.length) return null;
    const countsByMonth: { [key: string]: number } = {};
    const monthYearFormat = new Intl.DateTimeFormat('en-US', { year: '2-digit', month: 'short' });

    filteredIssues.forEach(issue => {
      try {
        const date = new Date(issue.lastDetected);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        countsByMonth[monthKey] = (countsByMonth[monthKey] || 0) + 1;
      } catch (e) {
        console.warn(`Invalid date: ${issue.lastDetected}`);
      }
    });

    const sortedMonthKeys = Object.keys(countsByMonth).sort();
    const recentSortedMonthKeys = sortedMonthKeys.slice(-12);

    const labels = recentSortedMonthKeys.map(key => {
        const [year, month] = key.split('-');
        return monthYearFormat.format(new Date(parseInt(year), parseInt(month) -1, 1));
    });
    const data = recentSortedMonthKeys.map(key => countsByMonth[key]);

    if (labels.length < 2 && data.every(d => d ===0)) return null; 

    return {
      labels,
      datasets: [{
        label: 'Frequency',
        data,
        backgroundColor: '#0A84FF', // Brand Blue
        borderRadius: 4,
        hoverBackgroundColor: '#007AFF',
      }],
    };
  }, [filteredIssues]);

  const chartOptions = (titleText: string) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const, // Moved to bottom to prevent horizontal clipping
        align: 'start' as const,
        labels: { 
            color: '#9CA3AF', 
            font: { family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', size: 10 },
            boxWidth: 8,
            usePointStyle: true,
            padding: 10
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(30, 30, 30, 0.9)',
        titleColor: '#FFF',
        bodyColor: '#FFF',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        cornerRadius: 8,
      }
    },
    scales: { 
      y: {
        beginAtZero: true,
        ticks: { 
            color: '#9CA3AF', 
            font: { size: 10 } 
        },
        grid: { 
            color: 'rgba(128, 128, 128, 0.1)', 
            drawBorder: false 
        }
      },
      x: {
        ticks: { 
            color: '#9CA3AF',
            font: { size: 10 }
        },
        grid: { display: false }
      }
    },
    layout: {
      padding: {
        bottom: 5,
        left: 5,
        right: 5
      }
    }
  });


  const UpgradePrompt = () => (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-2xl">
      <LockIcon className="w-8 h-8 text-white mb-3 opacity-80" />
      <p className="text-white font-medium text-sm mb-3">Trends Locked</p>
      <button
        onClick={onGoToSubscription}
        className="px-4 py-2 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors text-xs apple-click"
      >
        Upgrade to Max
      </button>
    </div>
  );
  
  if (!filteredIssues.length && isMaxTier) {
    return null;
  }

  return (
    <div className="liquid-glass h-full relative flex flex-col !p-4">
       {!isMaxTier && <UpgradePrompt />}
       <div className={`flex-grow flex flex-col ${!isMaxTier ? 'opacity-20' : ''}`}>
         <div className="flex items-center mb-2 shrink-0">
            <ChartBarIcon className="w-5 h-5 mr-3 text-white" />
            <h3 className="text-lg font-semibold text-white">Trends</h3>
        </div>

        <div className="flex-grow flex flex-col gap-4 min-h-0 overflow-y-auto custom-scrollbar pr-2">
          {categoryData && (
            <div className="h-[250px] w-full shrink-0 relative">
              <Pie data={categoryData} options={{...chartOptions('Distribution'), maintainAspectRatio: false }} />
            </div>
          )}
          {issuesOverTimeData && (
            <div className="h-[200px] w-full shrink-0 relative">
              <Bar data={issuesOverTimeData} options={{...chartOptions('Timeline'), maintainAspectRatio: false }} />
            </div>
          )}
        </div>
        {!categoryData && !issuesOverTimeData && isMaxTier && (
            <p className="text-center text-gray-500 text-sm py-4">Insufficient data for charts.</p>
        )}
       </div>
    </div>
  );
};

export default TrendAnalysisDisplay;