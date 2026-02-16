import React, { useState, useEffect } from 'react';
import { useAuth } from '@workos-inc/authkit-react';
import { UserIcon } from './icons/UserIcon';
import { LockIcon } from './icons/LockIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon'; // Reusing as back arrow

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onNavigateToSignUp?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onNavigateToSignUp }) => {
  const { signIn } = useAuth();
  
  // States: 'selection' (Fork in road) | 'demo_form' (Legacy email/pass)
  const [viewMode, setViewMode] = useState<'selection' | 'demo_form'>('selection');

  // Form State for Demo
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAttemptingLogin, setIsAttemptingLogin] = useState(false);
  const emailInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (viewMode === 'demo_form') {
        emailInputRef.current?.focus();
    }
  }, [viewMode]);

  const handleDemoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isAttemptingLogin) return;
    setError(null);
    setIsAttemptingLogin(true);

    // Hardcoded demo/beta bypass
    if (email === 'productholmes@test.com' && password === '1234') {
        setTimeout(() => {
            onLoginSuccess();
            setIsAttemptingLogin(false);
        }, 750);
    } else {
        setTimeout(() => {
            setError("Invalid Demo Credentials.");
            setIsAttemptingLogin(false);
        }, 500);
    }
  };

  const handleAuthClick = async () => {
      try {
          await signIn();
      } catch (e) {
          console.error(e);
          setError("Authentication service unavailable.");
      }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-body)] flex flex-col items-center justify-center p-6 text-[var(--text-primary)]">
      
      <div className="w-full max-w-md animate-fade-in">
        
        {viewMode === 'selection' ? (
            /* --- SELECTION VIEW --- */
            <div className="space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-[var(--text-secondary)]">Select your access method.</p>
                </div>

                <div className="space-y-4">
                    {/* Option 1: Real Auth */}
                    <button
                        onClick={handleAuthClick}
                        className="w-full liquid-glass group hover:bg-[var(--text-primary)]/5 transition-all duration-300 apple-click text-left p-6 flex items-center justify-between"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="bg-[var(--brand-color)]/20 p-3 rounded-full text-[var(--brand-color)]">
                                <LockIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Standard Access</h3>
                                <p className="text-xs text-[var(--text-secondary)] mt-0.5">Secure SSO & Email Login</p>
                            </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity -rotate-90 text-[var(--text-secondary)]">
                             <ChevronDownIcon className="w-5 h-5" />
                        </div>
                    </button>

                    {/* Option 2: Demo / Beta */}
                    <button
                        onClick={() => setViewMode('demo_form')}
                        className="w-full liquid-glass group hover:bg-[var(--text-primary)]/5 transition-all duration-300 apple-click text-left p-6 flex items-center justify-between"
                    >
                         <div className="flex items-center space-x-4">
                            <div className="bg-purple-500/20 p-3 rounded-full text-purple-400">
                                <UserIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Beta Environment</h3>
                                <p className="text-xs text-[var(--text-secondary)] mt-0.5">Sandbox Credential Access</p>
                            </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity -rotate-90 text-[var(--text-secondary)]">
                             <ChevronDownIcon className="w-5 h-5" />
                        </div>
                    </button>
                </div>
            </div>
        ) : (
            /* --- DEMO FORM VIEW --- */
            <div>
                <button 
                    onClick={() => setViewMode('selection')}
                    className="flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 apple-click"
                >
                    <ChevronDownIcon className="w-4 h-4 rotate-90 mr-1" /> Back to Selection
                </button>

                <h1 className="text-3xl font-bold text-center mb-8 tracking-tight">Analyst Login</h1>

                <div className="liquid-glass p-8 relative overflow-hidden">
                    {/* Beta Badge */}
                    <div className="absolute top-0 right-0 bg-purple-500/20 text-purple-300 text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                        Demo Mode
                    </div>

                    <form onSubmit={handleDemoSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                            Identity
                            </label>
                            <div className="relative group">
                            <input
                                ref={emailInputRef}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/20 border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--text-primary)] outline-none apple-input"
                                placeholder="agent@id"
                                disabled={isAttemptingLogin}
                            />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                            Passcode
                            </label>
                            <div className="relative group">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/20 border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--text-primary)] outline-none apple-input"
                                placeholder="••••"
                                disabled={isAttemptingLogin}
                            />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm text-center animate-fade-in">
                            {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isAttemptingLogin}
                            className="w-full py-3 rounded-full font-semibold shadow-sm backdrop-blur-md transition-all apple-click border border-[var(--glass-border)] bg-[var(--text-primary)]/10 text-[var(--text-primary)] hover:bg-[var(--text-primary)]/20 disabled:opacity-50"
                        >
                            {isAttemptingLogin ? 'Authenticating...' : 'Enter Sandbox'}
                        </button>
                    </form>
                </div>
                
                <p className="text-center text-xs text-[var(--text-secondary)] mt-6 opacity-60">
                    Use <span className="font-mono">productholmes@test.com</span> / <span className="font-mono">1234</span>
                </p>
            </div>
        )}

        <div className="mt-8 text-center border-t border-[var(--glass-border)] pt-6">
            <button
            onClick={onNavigateToSignUp}
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors apple-click scale-[0.9] hover:scale-100"
            >
            Register a New Account
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;