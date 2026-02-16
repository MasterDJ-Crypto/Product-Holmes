
import React from 'react';
import { Issue } from '../types';
import ProductColumn from './ProductColumn';

interface ProductData {
  name: string;
  issues: Issue[];
  onResolve: (issueId: string) => void;
  isLoading?: boolean;
  error?: string | null;
  selectedPlan: string | null; // Added
  onGoToSubscription: () => void; // Added
}

interface ComparisonLayoutProps {
  primaryProduct: ProductData;
  competitorProduct: ProductData;
}

const ComparisonLayout: React.FC<ComparisonLayoutProps> = ({ primaryProduct, competitorProduct }) => {
  return (
    <section className="py-8">
      <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
        <ProductColumn
          productName={primaryProduct.name}
          issues={primaryProduct.issues}
          onResolveIssue={primaryProduct.onResolve}
          isLoading={primaryProduct.isLoading}
          error={primaryProduct.error}
          isPrimary={true}
          selectedPlan={primaryProduct.selectedPlan}
          onGoToSubscription={primaryProduct.onGoToSubscription}
        />
        <ProductColumn
          productName={competitorProduct.name}
          issues={competitorProduct.issues}
          onResolveIssue={competitorProduct.onResolve}
          isLoading={competitorProduct.isLoading}
          error={competitorProduct.error}
          isPrimary={false}
          selectedPlan={competitorProduct.selectedPlan}
          onGoToSubscription={competitorProduct.onGoToSubscription}
        />
      </div>
    </section>
  );
};

export default ComparisonLayout;
