import React, { useState, useEffect, useRef } from 'react';
import { UserIcon } from './icons/UserIcon';
import { LockIcon } from './icons/LockIcon';
import { BuildingIcon } from './icons/BuildingIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { EmailIcon } from './icons/EmailIcon';

interface SignUpScreenProps {
  onSignUpSuccess: () => void;
  onNavigateToLogin: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUpSuccess, onNavigateToLogin }) => {
  const [companyName, setCompanyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [passwordMismatchError, setPasswordMismatchError] = useState<boolean>(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const companyNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    companyNameInputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSigningUp) return;

    setError(null);
    setPasswordMismatchError(false);

    if (password !== confirmPassword) {
      setPasswordMismatchError(true);
      setError('Passwords do not match.');
      return;
    }

    setIsSigningUp(true);
    setTimeout(() => {
      onSignUpSuccess(); 
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-body)] text-[var(--text-primary)] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create Account</h1>
          <p className="text-[var(--text-secondary)]">Join the intelligence network.</p>
        </div>

        <div className="liquid-glass p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Company</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-[var(--text-secondary)]"><BuildingIcon className="w-4 h-4"/></span>
                            <input
                                ref={companyNameInputRef}
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="Organization"
                                required
                                disabled={isSigningUp}
                                className="w-full bg-white/5 border border-[var(--glass-border)] rounded-lg pl-9 pr-4 py-3 text-sm text-[var(--text-primary)] outline-none apple-input placeholder-gray-500"
                            />
                        </div>
                    </div>
                     <div>
                        <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Role</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-[var(--text-secondary)]"><BriefcaseIcon className="w-4 h-4"/></span>
                            <input
                                type="text"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                placeholder="Position"
                                required
                                disabled={isSigningUp}
                                className="w-full bg-white/5 border border-[var(--glass-border)] rounded-lg pl-9 pr-4 py-3 text-sm text-[var(--text-primary)] outline-none apple-input placeholder-gray-500"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Full Name</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-[var(--text-secondary)]"><UserIcon className="w-4 h-4"/></span>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="John Doe"
                            required
                            disabled={isSigningUp}
                            className="w-full bg-white/5 border border-[var(--glass-border)] rounded-lg pl-9 pr-4 py-3 text-sm text-[var(--text-primary)] outline-none apple-input placeholder-gray-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Email</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-[var(--text-secondary)]"><EmailIcon className="w-4 h-4"/></span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                            required
                            disabled={isSigningUp}
                            className="w-full bg-white/5 border border-[var(--glass-border)] rounded-lg pl-9 pr-4 py-3 text-sm text-[var(--text-primary)] outline-none apple-input placeholder-gray-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Password</label>
                         <div className="relative">
                            <span className="absolute left-3 top-3 text-[var(--text-secondary)]"><LockIcon className="w-4 h-4"/></span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••"
                                required
                                disabled={isSigningUp}
                                className="w-full bg-white/5 border border-[var(--glass-border)] rounded-lg pl-9 pr-4 py-3 text-sm text-[var(--text-primary)] outline-none apple-input placeholder-gray-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Confirm</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-[var(--text-secondary)]"><LockIcon className="w-4 h-4"/></span>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••"
                                required
                                disabled={isSigningUp}
                                className={`w-full bg-white/5 border rounded-lg pl-9 pr-4 py-3 text-sm text-[var(--text-primary)] outline-none apple-input placeholder-gray-500 ${passwordMismatchError ? 'border-red-500/50' : 'border-[var(--glass-border)] focus:border-[var(--text-primary)]/30'}`}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs text-center">
                {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isSigningUp}
                className="w-full py-3 rounded-full font-semibold shadow-sm backdrop-blur-md transition-all apple-click border border-[var(--glass-border)] bg-[var(--text-primary)]/10 text-[var(--text-primary)] hover:bg-[var(--text-primary)]/20 mt-4 disabled:opacity-50"
            >
                {isSigningUp ? 'Creating Account...' : 'Register'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-8">
          Already have an account?{' '}
          <button
            onClick={onNavigateToLogin}
            className="text-[var(--text-primary)] hover:underline apple-click scale-[0.9] hover:scale-100"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpScreen;