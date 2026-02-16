import React from 'react';
import { AppView } from '../App';
import { PlusIcon } from './icons/PlusIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { SunIcon, MoonIcon } from './icons/ThemeIcons';

interface HeaderProps {
  onGoHome: () => void;
  currentView: AppView;
  selectedPlan: string | null;
  onGoToSubscription: () => void;
  onLogout: () => void;
  onToggleProductMenu: () => void;
  onAddNewInstance: () => void;
  activeProductName: string;
  isProductMenuOpen: boolean;
  toggleTheme: () => void;
  currentTheme: 'dark' | 'light';
}

const Header: React.FC<HeaderProps> = ({ 
  onGoHome, 
  currentView, 
  selectedPlan, 
  onGoToSubscription, 
  onLogout,
  onToggleProductMenu,
  onAddNewInstance,
  activeProductName,
  isProductMenuOpen,
  toggleTheme,
  currentTheme
}) => {
  const getPlanDisplayName = (planKey: string | null): string => {
    if (!planKey) return '';
    return planKey.charAt(0).toUpperCase() + planKey.slice(1);
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        {/* Apple HIG: Blurry background for context, preserving content hierarchy */}
      <div className="absolute inset-0 bg-[var(--glass-bg)] backdrop-blur-xl border-b border-[var(--glass-border)]"></div>
      
      <div className="container mx-auto px-4 h-14 flex items-center justify-between relative z-10">
        {/* Left Section: Branding & Navigation */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleProductMenu}
            className="flex items-center space-x-2 text-[var(--text-primary)] hover:bg-[var(--text-primary)]/5 px-3 py-1.5 rounded-lg transition-colors apple-click"
          >
            <span className="font-semibold tracking-tight text-sm">Product Holmes</span>
            <ChevronDownIcon 
              className={`w-3 h-3 text-[var(--text-secondary)] transition-transform duration-300 ${isProductMenuOpen ? 'rotate-180' : ''}`} 
            />
          </button>
          
          {currentView === 'app' && (
             <div className="hidden md:flex items-center pl-4 border-l border-[var(--glass-border)] space-x-3">
                <span className="text-sm text-[var(--text-secondary)] font-normal truncate max-w-[200px]">{activeProductName}</span>
                <button
                    onClick={onGoHome}
                    className="text-xs bg-[var(--text-primary)]/5 hover:bg-[var(--text-primary)]/10 text-[var(--text-primary)] px-3 py-1 rounded-full transition-colors font-medium"
                >
                    New
                </button>
             </div>
          )}
        </div>

        {/* Right Section: Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--text-primary)]/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors apple-click"
            title={currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {currentTheme === 'dark' ? (
                <SunIcon className="w-5 h-5" />
            ) : (
                <MoonIcon className="w-5 h-5" />
            )}
          </button>

          {currentView === 'app' && (
             <button
                onClick={onAddNewInstance}
                className="p-2 rounded-full hover:bg-[var(--text-primary)]/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] apple-click"
                aria-label="Add New"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
          )}
          
          {currentView === 'app' && (
            <div className="flex items-center space-x-3 ml-2 pl-2 border-l border-[var(--glass-border)]">
                <button
                    onClick={onGoToSubscription}
                    className="text-sm font-medium text-[var(--brand-color)] hover:bg-[var(--brand-color)]/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                    {selectedPlan ? `${getPlanDisplayName(selectedPlan)}` : 'Plans'}
                </button>
                
                {/* User Profile - Apple ID style avatar */}
                <button
                    onClick={onLogout}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-900 text-[var(--text-primary)] text-xs font-bold flex items-center justify-center border border-[var(--glass-border)] hover:opacity-90 apple-click shadow-sm"
                    title="Sign Out"
                >
                    PH
                </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;