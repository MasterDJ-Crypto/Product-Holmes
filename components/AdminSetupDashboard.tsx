import React, { useState } from 'react';
import { UserIcon } from './icons/UserIcon';
import { BuildingIcon } from './icons/BuildingIcon';
import { LockIcon } from './icons/LockIcon';
import { CheckIcon } from './icons/CheckIcon';

interface AdminSetupDashboardProps {
  onComplete: () => void;
}

const AdminSetupDashboard: React.FC<AdminSetupDashboardProps> = ({ onComplete }) => {
  const [inviteEmails, setInviteEmails] = useState('');
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  
  const handleSendInvites = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmails.trim()) return;
    
    setInviteStatus('sending');
    
    // MOCK BACKEND CALL: workos.userManagement.sendInvitation({ email, organizationId })
    console.log(`[Mock Backend] Sending invites to: ${inviteEmails}`);
    
    setTimeout(() => {
        setInviteStatus('sent');
        setInviteEmails('');
        setTimeout(() => setInviteStatus('idle'), 3000);
    }, 1500);
  };

  const handleConfigureSSO = () => {
    // MOCK BACKEND CALL: workos.portal.generateLink({ intent: 'sso', organizationId })
    const mockPortalLink = "https://workos.com/docs/sso/guide"; // Simulating redirection to WorkOS Portal
    console.log(`[Mock Backend] Generated Portal Link: ${mockPortalLink}`);
    window.open(mockPortalLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-body)] text-[var(--text-primary)] flex flex-col items-center p-6 pt-20">
      <div className="w-full max-w-4xl animate-fade-in">
        <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-full mb-6">
                <BuildingIcon className="w-8 h-8 text-[var(--brand-color)]" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Workspace Setup</h1>
            <p className="text-[var(--text-secondary)]">Configure authentication strategies for your organization.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CARD A: Team Invites */}
            <div className="liquid-glass p-8 flex flex-col h-full apple-hover">
                <div className="bg-blue-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-6 text-blue-400">
                    <UserIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Team Access</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6">
                    Invite team members via email. They will set their own passwords.
                </p>
                
                <form onSubmit={handleSendInvites} className="mt-auto space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                            Email Addresses (Comma separated)
                        </label>
                        <input
                            type="text"
                            value={inviteEmails}
                            onChange={(e) => setInviteEmails(e.target.value)}
                            placeholder="alice@acme.com, bob@acme.com"
                            className="w-full bg-white/5 border border-[var(--glass-border)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] outline-none apple-input placeholder-gray-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={inviteStatus !== 'idle'}
                        className={`w-full py-3 rounded-full font-semibold shadow-sm transition-all apple-click border border-[var(--glass-border)] flex items-center justify-center
                            ${inviteStatus === 'sent' 
                                ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                                : 'bg-[var(--text-primary)]/10 text-[var(--text-primary)] hover:bg-[var(--text-primary)]/20'}
                        `}
                    >
                        {inviteStatus === 'sending' && 'Sending...'}
                        {inviteStatus === 'sent' && <><CheckIcon className="w-4 h-4 mr-2" /> Sent</>}
                        {inviteStatus === 'idle' && 'Send Invites'}
                    </button>
                </form>
            </div>

            {/* CARD B: Enterprise SSO */}
            <div className="liquid-glass p-8 flex flex-col h-full apple-hover border-[var(--brand-color)]/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[var(--brand-color)]/20 text-[var(--brand-color)] text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                    Recommended
                </div>
                <div className="bg-purple-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-6 text-purple-400">
                    <LockIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Enterprise SSO</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6">
                    Connect your Identity Provider (Okta, Microsoft Entra ID, Google Workspace) for unified access control.
                </p>
                
                <div className="mt-auto">
                    <button
                        onClick={handleConfigureSSO}
                        className="w-full py-3 rounded-full font-semibold shadow-sm transition-all apple-click border border-[var(--brand-color)] bg-[var(--brand-color)] text-white hover:opacity-90 mb-4"
                    >
                        Configure Identity Provider
                    </button>
                    <p className="text-xs text-[var(--text-secondary)] text-center">
                        Redirects to secure Admin Portal
                    </p>
                </div>
            </div>
        </div>

        <div className="mt-12 text-center">
            <button
                onClick={onComplete}
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors underline apple-click"
            >
                Skip setup and go to Dashboard &rarr;
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSetupDashboard;