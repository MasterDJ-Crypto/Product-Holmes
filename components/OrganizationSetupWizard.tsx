import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@workos-inc/authkit-react';
import { BuildingIcon } from './icons/BuildingIcon';
import { EmailIcon } from './icons/EmailIcon';

interface OrganizationSetupWizardProps {
  onNavigateToLogin: () => void;
}

const OrganizationSetupWizard: React.FC<OrganizationSetupWizardProps> = ({ onNavigateToLogin }) => {
  const { signUp } = useAuth();
  const [orgName, setOrgName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const orgNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    orgNameRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // MOCK BACKEND CALL: workos.organizations.create({ name: orgName })
    // MOCK BACKEND CALL: workos.userManagement.createUser({ email: adminEmail, role: 'admin' })
    console.log(`[Mock Backend] Creating Organization: ${orgName}`);
    console.log(`[Mock Backend] Provisioning Admin: ${adminEmail}`);

    // Flag this user as a "New Admin" so App.tsx routes them to the Admin Setup Wizard
    localStorage.setItem('productHolmes_isNewAdmin', 'true');

    // Simulate network delay then trigger WorkOS SignUp flow
    // In a real app, you might pass the organization_id to the signUp context
    setTimeout(async () => {
        try {
            await signUp(); 
        } catch (e) {
            console.error(e);
            setIsProcessing(false);
        }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-body)] text-[var(--text-primary)] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create Workspace</h1>
          <p className="text-[var(--text-secondary)]">Establish your organization's secure environment.</p>
        </div>

        <div className="liquid-glass p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Organization Name</label>
                <div className="relative">
                    <span className="absolute left-3 top-3 text-[var(--text-secondary)]"><BuildingIcon className="w-4 h-4"/></span>
                    <input
                        ref={orgNameRef}
                        type="text"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        placeholder="Acme Corp"
                        required
                        disabled={isProcessing}
                        className="w-full bg-white/5 border border-[var(--glass-border)] rounded-lg pl-9 pr-4 py-3 text-sm text-[var(--text-primary)] outline-none apple-input placeholder-gray-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Admin Email</label>
                <div className="relative">
                    <span className="absolute left-3 top-3 text-[var(--text-secondary)]"><EmailIcon className="w-4 h-4"/></span>
                    <input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="admin@acmecorp.com"
                        required
                        disabled={isProcessing}
                        className="w-full bg-white/5 border border-[var(--glass-border)] rounded-lg pl-9 pr-4 py-3 text-sm text-[var(--text-primary)] outline-none apple-input placeholder-gray-500"
                    />
                </div>
                <p className="text-[10px] text-[var(--text-secondary)] mt-2">
                    This email will be assigned the Organization Owner role.
                </p>
            </div>

            <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 rounded-full font-semibold shadow-sm backdrop-blur-md transition-all apple-click border border-[var(--glass-border)] bg-[var(--text-primary)]/10 text-[var(--text-primary)] hover:bg-[var(--text-primary)]/20 mt-4 disabled:opacity-50"
            >
                {isProcessing ? 'Provisioning Workspace...' : 'Create & Authenticate'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-8">
          Joining an existing team?{' '}
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

export default OrganizationSetupWizard;