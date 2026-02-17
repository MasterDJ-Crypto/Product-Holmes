import React from 'react';
import Footer from './icons/Footer';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { LockIcon } from './icons/LockIcon';
import { CheckIcon } from './icons/CheckIcon';
import { DocumentMagnifyingGlassIcon } from './icons/DocumentMagnifyingGlassIcon';

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToSignUp: () => void; // Mapped to Create Workspace in App.tsx
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin, onNavigateToSignUp }) => {
  return (
    <div className="min-h-screen bg-[var(--bg-body)] text-[var(--text-primary)] flex flex-col items-center p-6 relative overflow-x-hidden">
      
      {/* Abstract Background - Subtle Apple/Windows Blob (Fixed position to scroll over) */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[var(--brand-color)] rounded-full blur-[150px] opacity-20 pointer-events-none animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500 rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
      
      {/* --- SECTION 1: THE HERO (PRESERVED EXACTLY) --- */}
      <main className="max-w-4xl w-full flex flex-col items-center text-center space-y-16 animate-fade-in relative z-10 mt-10 mb-32">
        
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
                    Log In
                </button>
                <button
                    onClick={onNavigateToSignUp}
                    className="flex-1 bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] font-semibold py-3.5 px-6 rounded-full hover:bg-[var(--text-primary)]/5 transition-colors apple-click"
                >
                    Create Workspace
                </button>
            </div>
        </div>

        {/* Status Pill */}
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

      {/* --- SECTION 2: THE PROBLEM (B2B PAIN POINT) --- */}
      <section className="w-full max-w-5xl mx-auto mb-32 relative z-10 animate-fade-in" style={{ animationDelay: '300ms' }}>
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Your customers are talking. <br/> <span className="text-[var(--text-secondary)]">Are you listening?</span></h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                Feedback is scattered across Reddit threads, YouTube comments, Tweets, and support tickets. 
                Manual aggregation is impossible. Product Holmes centralizes the chaos.
            </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
            <div className="liquid-glass p-8 flex flex-col apple-hover">
                <div className="bg-red-500/10 w-10 h-10 rounded-full flex items-center justify-center mb-4 text-red-400">
                    <ChartBarIcon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Identify Churn Risks</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                    Detect "deal-breaker" bugs and negative sentiment spikes before they impact your ARR.
                </p>
            </div>
            <div className="liquid-glass p-8 flex flex-col apple-hover">
                <div className="bg-blue-500/10 w-10 h-10 rounded-full flex items-center justify-center mb-4 text-blue-400">
                    <DocumentMagnifyingGlassIcon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Roadmap Validation</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                    Stop guessing features. Let aggregated user requests drive your next sprint prioritization.
                </p>
            </div>
            <div className="liquid-glass p-8 flex flex-col apple-hover">
                <div className="bg-purple-500/10 w-10 h-10 rounded-full flex items-center justify-center mb-4 text-purple-400">
                    <MagnifyingGlassIcon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Competitor Intel</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                    Analyze competitor products as easily as your own. Find their weak spots and capitalize.
                </p>
            </div>
        </div>
      </section>

      {/* --- SECTION 3: THE SOLUTION (PRODUCT CAPABILITIES) --- */}
      <section className="w-full max-w-6xl mx-auto mb-32 relative z-10 px-4">
          <div className="liquid-glass !p-0 overflow-hidden flex flex-col md:flex-row">
              <div className="p-12 md:w-1/2 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[var(--glass-border)]">
                  <h2 className="text-3xl font-bold mb-6">Unified Intelligence Engine</h2>
                  <div className="space-y-4">
                      <div className="flex items-start">
                          <CheckIcon className="w-5 h-5 text-[var(--brand-color)] mt-0.5 mr-3 shrink-0" />
                          <div>
                              <h4 className="font-semibold text-sm">Gemini AI Processing</h4>
                              <p className="text-xs text-[var(--text-secondary)] mt-1">Our models parse thousands of unstructured comments to extract semantic meaning, not just keywords.</p>
                          </div>
                      </div>
                      <div className="flex items-start">
                          <CheckIcon className="w-5 h-5 text-[var(--brand-color)] mt-0.5 mr-3 shrink-0" />
                          <div>
                              <h4 className="font-semibold text-sm">Multi-Source Ingestion</h4>
                              <p className="text-xs text-[var(--text-secondary)] mt-1">Simultaneous scanning of YouTube Transcripts, Reddit, Twitter, Trustpilot, and Google Articles.</p>
                          </div>
                      </div>
                      <div className="flex items-start">
                          <CheckIcon className="w-5 h-5 text-[var(--brand-color)] mt-0.5 mr-3 shrink-0" />
                          <div>
                              <h4 className="font-semibold text-sm">Quantifiable Metrics</h4>
                              <p className="text-xs text-[var(--text-secondary)] mt-1">Turn "people are complaining" into "Issue #402: 156 occurrences across 3 platforms".</p>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="md:w-1/2 bg-[var(--text-primary)]/5 p-12 flex items-center justify-center relative overflow-hidden">
                   {/* Abstract UI Representation */}
                   <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand-color)]/20 to-transparent opacity-30"></div>
                   <div className="w-full space-y-3 relative z-10 opacity-90 scale-90 md:scale-100">
                        <div className="h-24 bg-[var(--bg-body)] rounded-lg border border-[var(--glass-border)] shadow-lg p-4 flex gap-4 items-center">
                            <div className="w-12 h-12 rounded-full bg-red-500/20"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-2 w-3/4 bg-[var(--text-primary)]/20 rounded"></div>
                                <div className="h-2 w-1/2 bg-[var(--text-primary)]/10 rounded"></div>
                            </div>
                        </div>
                        <div className="h-24 bg-[var(--bg-body)] rounded-lg border border-[var(--glass-border)] shadow-lg p-4 flex gap-4 items-center opacity-75 translate-x-4">
                            <div className="w-12 h-12 rounded-full bg-blue-500/20"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-2 w-2/3 bg-[var(--text-primary)]/20 rounded"></div>
                                <div className="h-2 w-1/2 bg-[var(--text-primary)]/10 rounded"></div>
                            </div>
                        </div>
                        <div className="h-24 bg-[var(--bg-body)] rounded-lg border border-[var(--glass-border)] shadow-lg p-4 flex gap-4 items-center opacity-50 translate-x-8">
                            <div className="w-12 h-12 rounded-full bg-green-500/20"></div>
                             <div className="flex-1 space-y-2">
                                <div className="h-2 w-1/2 bg-[var(--text-primary)]/20 rounded"></div>
                                <div className="h-2 w-1/3 bg-[var(--text-primary)]/10 rounded"></div>
                            </div>
                        </div>
                   </div>
              </div>
          </div>
      </section>

      {/* --- SECTION 4: ENTERPRISE SECURITY --- */}
      <section className="w-full max-w-4xl mx-auto mb-20 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-full mb-6 border border-white/10">
                <LockIcon className="w-6 h-6 text-[var(--brand-color)]" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Built for the Enterprise</h2>
          <p className="text-[var(--text-secondary)] mb-10 max-w-xl mx-auto">
              Secure by design. We strictly adhere to B2B multi-tenant best practices to ensure your data isolation.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-medium text-[var(--text-secondary)]">
              <div className="p-4 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg">SOC2 Compliant Architecture</div>
              <div className="p-4 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg">SAML / OIDC SSO</div>
              <div className="p-4 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg">Data Encryption at Rest</div>
              <div className="p-4 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg">Role-Based Access</div>
          </div>
      </section>

      {/* --- SECTION 5: FINAL CTA --- */}
      <div className="relative z-10 mb-20 text-center">
          <button
            onClick={onNavigateToSignUp}
            className="px-8 py-4 bg-[var(--text-primary)] text-[var(--bg-body)] font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-200 apple-click"
        >
            Start Enterprise Trial
        </button>
      </div>

      <div className="mt-auto py-8 text-center opacity-40 text-[10px] uppercase tracking-widest text-[var(--text-primary)]">
         Designed with Precision
      </div>
    </div>
  );
};

export default LandingPage;