import React, { useState, useEffect } from 'react';
import { useAuth } from '@workos-inc/authkit-react';
import { UserIcon } from './icons/UserIcon';
import { LockIcon } from './icons/LockIcon';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onNavigateToSignUp?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onNavigateToSignUp }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAttemptingLogin, setIsAttemptingLogin] = useState(false);
  const emailInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        return;
    }

    // Default: WorkOS AuthKit
    try {
        await signIn();
        // Redirect happens automatically
    } catch (err) {
        console.error(err);
        setError('Authentication failed. Please try again.');
        setIsAttemptingLogin(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-body)] flex flex-col items-center justify-center p-6 text-[var(--text-primary)]">
      
      <div className="w-full max-w-md animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-8 tracking-tight">Analyst Login</h1>

        <div className="liquid-glass p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                {isAttemptingLogin ? 'Authenticating...' : 'Enter System'}
            </button>
            </form>
        </div>

        <div className="mt-8 text-center">
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