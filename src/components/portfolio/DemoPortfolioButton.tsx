import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useToast } from '@/hooks/use-toast';
import { Loader2, TrendingUp } from 'lucide-react';

export function DemoPortfolioButton() {
  const [isCreating, setIsCreating] = useState(false);
  const { addInvestment, mainPortfolio } = usePortfolio();
  const { toast } = useToast();

  const createDemoPortfolio = async () => {
    if (!mainPortfolio) {
      toast({
        title: "Error",
        description: "Please wait for portfolio to load",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const demoInvestments = [
        {
          portfolio_id: mainPortfolio.id,
          symbol: 'VTI',
          shares: 2.5,
          avg_cost_per_share: 240.50,
          current_price: 245.20,
          total_value: 613.0,
          investment_type: 'etf' as const,
        },
        {
          portfolio_id: mainPortfolio.id,
          symbol: 'BND',
          shares: 5.0,
          avg_cost_per_share: 78.30,
          current_price: 79.15,
          total_value: 395.75,
          investment_type: 'etf' as const,
        },
        {
          portfolio_id: mainPortfolio.id,
          symbol: 'SPY',
          shares: 0.8,
          avg_cost_per_share: 425.00,
          current_price: 432.10,
          total_value: 345.68,
          investment_type: 'etf' as const,
        },
      ];

      for (const investment of demoInvestments) {
        await addInvestment(investment);
      }

      toast({
        title: "Demo Portfolio Created!",
        description: "Added sample investments to showcase the platform",
      });
    } catch (error) {
      console.error('Error creating demo portfolio:', error);
      toast({
        title: "Error",
        description: "Failed to create demo portfolio",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Button 
      onClick={createDemoPortfolio} 
      disabled={isCreating}
      variant="outline"
      className="w-full"
    >
      {isCreating ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <TrendingUp className="mr-2 h-4 w-4" />
      )}
      {isCreating ? 'Creating Demo...' : 'Add Demo Investments'}
    </Button>
  );
}