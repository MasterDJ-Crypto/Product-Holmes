import React, { useState, useEffect } from 'react';
import { LockIcon } from './icons/LockIcon'; 
import { UserIcon } from './icons/UserIcon';
import { StarIcon } from './icons/StarIcon'; 

interface PaymentPageProps {
  selectedPlan: string | null;
  onPaymentSuccess: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ selectedPlan, onPaymentSuccess }) => {
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('');
  const [specialCode, setSpecialCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const cardholderNameInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    cardholderNameInputRef.current?.focus();
  }, []);

  const getPlanDisplayName = (planKey: string | null): string => {
    if (!planKey) return 'N/A';
    if (planKey.toLowerCase() === 'free') return 'Free Tier';
    if (planKey.toLowerCase() === 'pro') return 'Pro Tier ($149/mo)';
    if (planKey.toLowerCase() === 'max') return 'Max Tier ($299/mo)';
    return planKey;
  };

  const handleSpecialCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpecialCode(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);

    if (specialCode.trim().toUpperCase() === 'TRPOR11') {
      setTimeout(() => {
        onPaymentSuccess();
      }, 300);
      return;
    }

    setTimeout(() => {
      onPaymentSuccess();
      setIsProcessing(false);
    }, 1500);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const parts = [];
    for (let i = 0; i < cleaned.length; i += 4) {
      parts.push(cleaned.substring(i, i + 4));
    }
    return parts.join('-').substring(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 3) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned.substring(0,5);
  };

  const isSpecialCodeActive = specialCode.trim().toUpperCase() === 'TRPOR11';

  return (
    <div className="min-h-screen bg-[var(--bg-body)] text-[var(--text-primary)] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Checkout</h1>
          <p className="text-[var(--text-secondary)]">
             Completing subscription for <span className="text-[var(--text-primary)] font-medium">{getPlanDisplayName(selectedPlan)}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="liquid-glass p-8 space-y-6">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Cardholder</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-[var(--text-secondary)]"><UserIcon className="w-4 h-4"/></span>
              <input
                ref={cardholderNameInputRef}
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="Name on Card"
                required={!isSpecialCodeActive}
                disabled={isProcessing || isSpecialCodeActive}
                className="w-full bg-white/5 border border-[var(--glass-border)] rounded-lg pl-9 pr-4 py-3 text-sm text-[var(--text-primary)] outline-none apple-input placeholder-gray-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Card Number</label>
             <div className="relative">
               <span className="absolute left-3 top-3 text-[var(--text-secondary)]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 21z" />
                </svg>
              </span>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="XXXX-XXXX-XXXX-XXXX"
                required={!isSpecialCodeActive}
                disabled={isProcessing || isSpecialCodeActive}
                maxLength={19}
                className="w-full bg-white/5 border border-[var(--glass-border)] rounded-lg pl-9 pr-4 py-3 text-sm text-[var(--text-primary)] outline-none apple-input placeholder-gray-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Expiry</label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                placeholder="MM/YY"
                required={!isSpecialCodeActive}
                disabled={isProcessing || isSpecialCodeActive}
                maxLength={5}
                className="w-full bg-white/5 border border-[var(--glass-border)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] outline-none apple-input placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0,4))}
                placeholder="123"
                required={!isSpecialCodeActive}
                disabled={isProcessing || isSpecialCodeActive}
                maxLength={4}
                className="w-full bg-white/5 border border-[var(--glass-border)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] outline-none apple-input placeholder-gray-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Company</label>
                <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Organization"
                required={!isSpecialCodeActive}
                disabled={isProcessing || isSpecialCodeActive}
                className="w-full bg-white/5 border border-[var(--glass-border)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] outline-none apple-input placeholder-gray-500"
                />
            </div>
             <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Country</label>
                <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="United States"
                disabled={isProcessing || isSpecialCodeActive}
                required={!isSpecialCodeActive}
                className="w-full bg-white/5 border border-[var(--glass-border)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] outline-none apple-input placeholder-gray-500"
                />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Promo Code (Optional)</label>
            <input
              type="text"
              value={specialCode}
              onChange={handleSpecialCodeChange}
              placeholder="Code"
              disabled={isProcessing}
              className="w-full bg-white/5 border border-[var(--glass-border)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] outline-none apple-input placeholder-gray-500"
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3 rounded-full font-semibold shadow-sm backdrop-blur-md transition-all apple-click border border-[var(--glass-border)] bg-[var(--text-primary)]/10 text-[var(--text-primary)] hover:bg-[var(--text-primary)]/20 flex items-center justify-center mt-6 disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Confirm Payment'}
          </button>
        </form>
         <p className="text-center text-xs text-[var(--text-secondary)] mt-6">
          Secure Encrypted Transaction. No real money is charged in this demo.
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;