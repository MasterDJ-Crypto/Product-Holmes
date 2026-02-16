import React, { useState, useEffect } from 'react';
import { UserIcon } from './icons/UserIcon';
import { LockIcon } from './icons/LockIcon';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onNavigateToSignUp?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onNavigateToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAttemptingLogin, setIsAttemptingLogin] = useState(false);
  const emailInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isAttemptingLogin) return;
    setError(null);
    setIsAttemptingLogin(true);
    setTimeout(() => {
      if (email === 'productholmes@test.com' && password === '1234') {
        onLoginSuccess();
      } else {
        setError('Invalid credentials.');
        setPassword('');
      }
      setIsAttemptingLogin(false);
    }, 750);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      
      <div className="w-full max-w-md animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-8 tracking-tight text-white">Analyst Login</h1>

        <div className="liquid-glass p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Identity
                </label>
                <div className="relative group">
                <input
                    ref={emailInputRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white outline-none apple-input"
                    placeholder="agent@id"
                    disabled={isAttemptingLogin}
                />
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Passcode
                </label>
                <div className="relative group">
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white outline-none apple-input"
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
                className="w-full bg-white text-black font-semibold py-3 rounded-lg apple-click"
            >
                {isAttemptingLogin ? 'Authenticating...' : 'Enter System'}
            </button>
            </form>
        </div>

        <div className="mt-8 text-center">
            <button
            onClick={onNavigateToSignUp}
            className="text-sm text-gray-500 hover:text-white transition-colors apple-click scale-[0.9] hover:scale-100"
            >
            Register New Agent
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;