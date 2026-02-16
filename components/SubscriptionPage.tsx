import React from 'react';
import { CheckIcon } from './icons/CheckIcon';

interface SubscriptionPageProps {
  currentPlan: string | null;
  onSelectPlan: (planName: string) => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ currentPlan, onSelectPlan }) => {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'Forever',
      features: ['10 Google Articles', '10 YouTube Videos', 'Manual Search Only'],
      buttonText: 'Start Free',
      highlight: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$149',
      period: '/ month',
      features: ['50 Articles & Videos', 'Twitter Analysis', 'Weekly Automation', 'Export Data'],
      buttonText: 'Upgrade Pro',
      highlight: true
    },
    {
      id: 'max',
      name: 'Max',
      price: '$299',
      period: '/ month',
      features: ['Unlimited Scope', 'Reddit & Trustpilot', 'Competitor Analysis', 'API Access', 'Trend Reports'],
      buttonText: 'Go Max',
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-body)] text-white flex flex-col items-center p-8 pt-24">
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="text-4xl font-semibold tracking-tight mb-4">Choose your clearance.</h1>
        <p className="text-gray-400">Unlock deeper intelligence tiers with advanced processing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full animate-fade-in">
        {plans.map((plan, index) => (
          <div 
            key={plan.id}
            className={`liquid-glass flex flex-col apple-hover ${plan.highlight ? 'border-[var(--brand-color)] ring-1 ring-[var(--brand-color)]/50' : ''} ${currentPlan === plan.id ? 'bg-[var(--surface-base)]' : ''}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="mb-6 p-2">
                <h3 className="text-lg font-semibold text-gray-300">{plan.name}</h3>
                <div className="flex items-baseline mt-2">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-sm text-gray-500 ml-2">{plan.period}</span>
                </div>
            </div>

            <div className="flex-grow border-t border-[var(--border-subtle)] pt-6 mb-8">
                <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                            <CheckIcon className="w-5 h-5 text-[var(--brand-color)] mr-3 shrink-0" />
                            <span className="text-sm text-gray-300">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <button
                onClick={() => onSelectPlan(plan.id)}
                disabled={currentPlan === plan.id}
                className={`w-full py-2.5 rounded-md font-semibold text-sm transition-all apple-click ${
                    currentPlan === plan.id 
                    ? 'bg-transparent border border-[var(--border-strong)] text-gray-400 cursor-default' 
                    : plan.highlight 
                        ? 'bg-[var(--brand-color)] text-always-white hover:opacity-90'
                        : 'bg-white text-black hover:bg-gray-200'
                }`}
            >
                {currentPlan === plan.id ? 'Active Plan' : plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPage;