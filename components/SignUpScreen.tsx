import React, { useEffect } from 'react';
import { useAuth } from '@workos-inc/authkit-react';
import { LockIcon } from './icons/LockIcon';

interface SignUpScreenProps {
  onSignUpSuccess: () => void;
  onNavigateToLogin: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onNavigateToLogin }) => {
  const { signUp } = useAuth();

  useEffect(() => {
    // Immediately trigger WorkOS Sign Up flow on mount
    const triggerSignUp = async () => {
      try {
        await signUp();
      } catch (e) {
        console.error("Sign up redirect failed", e);
      }
    };
    triggerSignUp();
  }, [signUp]);

  return (
    <div className="min-h-screen bg-[var(--bg-body)] text-[var(--text-primary)] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in text-center">
        
        <div className="liquid-glass p-12 flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-[var(--brand-color)] blur-xl opacity-20 rounded-full animate-pulse"></div>
            <LockIcon className="w-12 h-12 text-[var(--brand-color)] relative z-10" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-xl font-semibold tracking-tight">Securing Connection</h1>
            <p className="text-[var(--text-secondary)] text-sm">
              Redirecting to authentication provider...
            </p>
          </div>

          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-4">
             <div className="h-full bg-[var(--brand-color)] animate-[shimmer_1.5s_infinite] w-1/2 rounded-full"></div>
          </div>
        </div>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-8">
          Already have an account?{' '}
          <button
            onClick={onNavigateToLogin}
            className="text-[var(--text-primary)] hover:underline apple-click"
          >
            Log In
          </button>
        </p>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </div>
  );
};

export default SignUpScreen;