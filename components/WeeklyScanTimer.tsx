import React, { useState, useEffect } from 'react';
import { LockIcon } from './icons/LockIcon';

interface WeeklyScanTimerProps {
  productName: string;
  nextScanTimestamp: number | null;
  isScanning: boolean;
  selectedPlan: string | null;
  onGoToSubscription: () => void;
}

const formatTimeLeft = (ms: number): string => {
  if (ms <= 0) return "Pending...";
  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  seconds %= 60;
  minutes %= 60;
  hours %= 24;
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

const WeeklyScanTimer: React.FC<WeeklyScanTimerProps> = ({ 
  productName, 
  nextScanTimestamp, 
  isScanning,
  selectedPlan,
  onGoToSubscription
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (selectedPlan === 'free' || !nextScanTimestamp) {
      setTimeLeft(0);
      return;
    }
    const calculateTimeLeft = () => {
      const now = Date.now();
      setTimeLeft(Math.max(0, nextScanTimestamp - now));
    };
    calculateTimeLeft();
    const intervalId = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(intervalId);
  }, [nextScanTimestamp, selectedPlan]);

  if (selectedPlan === 'free') {
    return (
      <div className="liquid-glass inline-block px-6 py-4">
        <p className="text-gray-400 text-sm mb-3">
          Automated weekly scans are locked on Free tier.
        </p>
        <button
          onClick={onGoToSubscription}
          className="flex items-center mx-auto px-4 py-2 bg-white/10 border border-white/20 text-white hover:bg-white/20 rounded-full text-xs font-medium transition-colors"
        >
          <LockIcon className="w-3 h-3 mr-2" />
          Upgrade to Automate
        </button>
      </div>
    );
  }

  if (isScanning) {
    return (
      <div className="text-sm text-gray-300 animate-pulse">
        Updating analysis for "{productName}"...
      </div>
    );
  }
  
  if (!nextScanTimestamp || (timeLeft <= 0 && !isScanning)) {
     return (
      <div className="text-sm text-white">
        Update pending...
      </div>
    );
  }

  return (
    <div className="text-sm text-gray-500">
      Next Update: <span className="text-white font-mono-numbers ml-2">{formatTimeLeft(timeLeft)}</span>
    </div>
  );
};

export default WeeklyScanTimer;