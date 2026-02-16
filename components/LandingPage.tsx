import React from 'react';
import Footer from './icons/Footer';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToSignUp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin, onNavigateToSignUp }) => {
  return (
    <div className="min-h-screen bg-[var(--bg-body)] text-[var(--text-primary)] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Abstract Background - Subtle Apple/Windows Blob */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[var(--brand-color)] rounded-full blur-[150px] opacity-20 pointer-events-none animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500 rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
      
      <main className="max-w-4xl w-full flex flex-col items-center text-center space-y-16 animate-fade-in relative z-10 mt-10">
        
        {/* Hero Card */}
        <div className="liquid-glass flex flex-col items-center p-12 w-full max-w-2xl mx-auto apple-hover !rounded-3xl !border-t border-white/20">
            <div className="p-5 bg-gradient-to-br from-[var(--brand-color)] to-blue-600 rounded-2xl mb-8 shadow-lg shadow-blue-500/30">
                <MagnifyingGlassIcon className="w-10 h-10 text-always-white" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-6 text-[var(--text-primary)]">
            Product Holmes
            </h1>
            
            <p className="text-xl text-[var(--text-secondary)] font-normal mb-10 max-w-md leading-relaxed">
            Market intelligence, redefined. <br/> Uncover the signals hidden in the noise.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
                <button
                    onClick={onNavigateToLogin}
                    className="flex-1 bg-[var(--text-primary)] text-[var(--bg-body)] font-semibold py-3.5 px-6 rounded-full shadow-lg hover:shadow-xl transition-all apple-click"
                >
                    Open
                </button>
                <button
                    onClick={onNavigateToSignUp}
                    className="flex-1 bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] font-semibold py-3.5 px-6 rounded-full hover:bg-[var(--text-primary)]/5 transition-colors apple-click"
                >
                    Register
                </button>
            </div>
        </div>

        {/* Status Pill - Progressive Disclosure */}
        <div className="flex items-center space-x-3 px-5 py-2.5 bg-[var(--glass-bg)] rounded-full border border-[var(--glass-border)] shadow-sm backdrop-blur-md animate-list-enter" style={{ animationDelay: '200ms' }}>
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <p className="text-xs font-medium text-[var(--text-secondary)]">
                System Operational &bull; <span className="text-[var(--text-primary)]">v2.4.0</span>
             </p>
        </div>
        
        <div className="text-xs text-[var(--text-secondary)] opacity-60 max-w-md mx-auto">
             For demo access, use <span className="font-mono text-[var(--text-primary)]">productholmes@test.com</span> / <span className="font-mono text-[var(--text-primary)]">1234</span>. 
             Unlock full features with code <span className="font-mono text-[var(--text-primary)]">TRPOR11</span>.
        </div>

      </main>

      <div className="mt-auto py-8 text-center opacity-40 text-[10px] uppercase tracking-widest text-[var(--text-primary)]">
         Designed with Precision
      </div>
    </div>
  );
};

export default LandingPage;