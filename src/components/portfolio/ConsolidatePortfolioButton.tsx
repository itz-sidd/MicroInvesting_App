import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const ConsolidatePortfolioButton = () => {
  const [isConsolidating, setIsConsolidating] = useState(false);
  const { consolidateInvestments, investments } = usePortfolio();

  // Check if there are duplicates
  const hasDuplicates = () => {
    const symbolCounts = investments.reduce((acc, inv) => {
      const key = `${inv.portfolio_id}-${inv.symbol}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.values(symbolCounts).some(count => count > 1);
  };

  const handleConsolidate = async () => {
    setIsConsolidating(true);
    try {
      await consolidateInvestments();
    } finally {
      setIsConsolidating(false);
    }
  };

  if (!hasDuplicates()) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Your portfolio has duplicate investments that are inflating your total value. 
          Click below to consolidate them and fix your portfolio calculation.
        </AlertDescription>
      </Alert>
      
      <Button 
        onClick={handleConsolidate}
        disabled={isConsolidating}
        variant="outline"
        className="w-full"
      >
        {isConsolidating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Consolidating...
          </>
        ) : (
          <>
            <AlertCircle className="mr-2 h-4 w-4" />
            Fix Portfolio Value (Consolidate Duplicates)
          </>
        )}
      </Button>
    </div>
  );
};