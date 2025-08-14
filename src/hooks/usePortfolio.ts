import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { supabase } from '@/integrations/supabase/client';
import { RootState } from '@/store/store';
import { useToast } from '@/hooks/use-toast';

export interface Portfolio {
  id: string;
  user_id: string;
  name: string;
  total_value: number;
  cash_balance: number;
  allocation_strategy: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Investment {
  id: string;
  user_id: string;
  portfolio_id: string;
  symbol: string;
  shares: number;
  avg_cost_per_share: number;
  current_price?: number;
  total_value?: number;
  investment_type: string;
  created_at: string;
  updated_at: string;
}

export const usePortfolio = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchPortfolios();
      fetchInvestments();
    }
  }, [user]);

  const fetchPortfolios = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      if (!data || data.length === 0) {
        // Auto-create a default portfolio if none exists
        const { data: created, error: createError } = await supabase
          .from('portfolios')
          .insert({
            user_id: user.id,
            name: 'Main Portfolio',
            is_active: true,
          })
          .select()
          .single();

        if (createError) throw createError;
        setPortfolios(created ? [created] : []);
      } else {
        setPortfolios(data);
      }
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      toast({
        title: "Error",
        description: "Failed to load portfolios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchInvestments = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setInvestments(data || []);
    } catch (error) {
      console.error('Error fetching investments:', error);
    }
  };

  const addInvestment = async (investment: Omit<Investment, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      // Check for existing investment in the same portfolio with the same symbol
      const { data: existing } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id)
        .eq('portfolio_id', investment.portfolio_id)
        .eq('symbol', investment.symbol);

      if (existing && existing.length > 0) {
        // Update existing investment instead of creating duplicate
        const existingInvestment = existing[0];
        const newShares = existingInvestment.shares + investment.shares;
        const newAvgCost = ((existingInvestment.shares * existingInvestment.avg_cost_per_share) + 
                           (investment.shares * investment.avg_cost_per_share)) / newShares;
        
        const { data, error } = await supabase
          .from('investments')
          .update({
            shares: newShares,
            avg_cost_per_share: newAvgCost,
            total_value: newShares * (investment.current_price || investment.avg_cost_per_share),
          })
          .eq('id', existingInvestment.id)
          .select()
          .single();

        if (error) throw error;
        setInvestments(prev => prev.map(inv => inv.id === data.id ? data : inv));
        
        toast({
          title: "Success",
          description: "Investment updated successfully",
        });
        
        return data;
      } else {
        // Create new investment
        const { data, error } = await supabase
          .from('investments')
          .insert({
            ...investment,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) throw error;
        setInvestments(prev => [...prev, data]);
        
        toast({
          title: "Success",
          description: "Investment added successfully",
        });
        
        return data;
      }
    } catch (error) {
      console.error('Error adding investment:', error);
      toast({
        title: "Error",
        description: "Failed to add investment",
        variant: "destructive",
      });
    }
  };

  const executeRoundUpInvestment = async (amount: number, portfolioId: string) => {
    if (!user || amount <= 0) return;

    const portfolio = portfolios.find(p => p.id === portfolioId);
    if (!portfolio) return;

    const allocation = portfolio.allocation_strategy;
    const stockAmount = (amount * allocation.stocks) / 100;
    const bondAmount = (amount * allocation.bonds) / 100;
    const etfAmount = (amount * allocation.etfs) / 100;

    try {
      // Simulate investment execution (in real app, this would call an investment API)
      const investments = [];
      
      if (stockAmount > 0) {
        investments.push({
          portfolio_id: portfolioId,
          symbol: 'VTI', // Total Stock Market ETF
          shares: Number((stockAmount / 100).toFixed(6)), // Assuming $100 per share
          avg_cost_per_share: 100,
          current_price: 100,
          total_value: stockAmount,
          investment_type: 'etf' as const,
        });
      }

      if (bondAmount > 0) {
        investments.push({
          portfolio_id: portfolioId,
          symbol: 'BND', // Total Bond Market ETF
          shares: Number((bondAmount / 80).toFixed(6)), // Assuming $80 per share
          avg_cost_per_share: 80,
          current_price: 80,
          total_value: bondAmount,
          investment_type: 'etf' as const,
        });
      }

      if (etfAmount > 0) {
        investments.push({
          portfolio_id: portfolioId,
          symbol: 'SPY', // S&P 500 ETF
          shares: Number((etfAmount / 400).toFixed(6)), // Assuming $400 per share
          avg_cost_per_share: 400,
          current_price: 400,
          total_value: etfAmount,
          investment_type: 'etf' as const,
        });
      }

      for (const investment of investments) {
        await addInvestment(investment);
      }

      // Update portfolio total value
      await supabase
        .from('portfolios')
        .update({ total_value: portfolio.total_value + amount })
        .eq('id', portfolioId)
        .eq('user_id', user.id);

      fetchPortfolios();
      
      toast({
        title: "Success",
        description: `Invested $${amount.toFixed(2)} according to your allocation strategy`,
      });

    } catch (error) {
      console.error('Error executing round-up investment:', error);
      toast({
        title: "Error",
        description: "Failed to execute investment",
        variant: "destructive",
      });
    }
  };

  const consolidateInvestments = async () => {
    if (!user) return;

    try {
      // Group investments by symbol and portfolio
      const groupedInvestments = investments.reduce((acc, inv) => {
        const key = `${inv.portfolio_id}-${inv.symbol}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(inv);
        return acc;
      }, {} as Record<string, Investment[]>);

      // Process each group
      for (const [key, invGroup] of Object.entries(groupedInvestments)) {
        if (invGroup.length > 1) {
          // Calculate consolidated values
          const totalShares = invGroup.reduce((sum, inv) => sum + inv.shares, 0);
          const totalCost = invGroup.reduce((sum, inv) => sum + (inv.shares * inv.avg_cost_per_share), 0);
          const avgCost = totalCost / totalShares;
          const currentPrice = invGroup[0].current_price || invGroup[0].avg_cost_per_share;
          
          // Keep the oldest investment and update it
          const keepInvestment = invGroup.sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )[0];
          
          // Update the kept investment
          await supabase
            .from('investments')
            .update({
              shares: totalShares,
              avg_cost_per_share: avgCost,
              total_value: totalShares * currentPrice,
            })
            .eq('id', keepInvestment.id);

          // Delete the duplicate investments
          const duplicateIds = invGroup.filter(inv => inv.id !== keepInvestment.id).map(inv => inv.id);
          if (duplicateIds.length > 0) {
            await supabase
              .from('investments')
              .delete()
              .in('id', duplicateIds);
          }
        }
      }

      // Refresh data
      await fetchInvestments();
      await recalculatePortfolioValues();
      
      toast({
        title: "Success",
        description: "Portfolio consolidated successfully",
      });
    } catch (error) {
      console.error('Error consolidating investments:', error);
      toast({
        title: "Error",
        description: "Failed to consolidate portfolio",
        variant: "destructive",
      });
    }
  };

  const recalculatePortfolioValues = async () => {
    if (!user) return;

    for (const portfolio of portfolios) {
      const portfolioInvestments = investments.filter(inv => inv.portfolio_id === portfolio.id);
      const calculatedValue = portfolioInvestments.reduce((sum, inv) => {
        return sum + (inv.total_value || (inv.shares * (inv.current_price || inv.avg_cost_per_share)));
      }, 0);

      await supabase
        .from('portfolios')
        .update({ total_value: calculatedValue })
        .eq('id', portfolio.id)
        .eq('user_id', user.id);
    }

    await fetchPortfolios();
  };

  const mainPortfolio = portfolios.find(p => p.is_active) || portfolios[0];
  
  // Calculate total value from actual investments rather than database field
  const totalValue = investments.reduce((sum, inv) => {
    return sum + (inv.total_value || (inv.shares * (inv.current_price || inv.avg_cost_per_share)));
  }, 0);

  return {
    portfolios,
    investments,
    mainPortfolio,
    totalValue,
    loading,
    fetchPortfolios,
    fetchInvestments,
    addInvestment,
    executeRoundUpInvestment,
    consolidateInvestments,
    recalculatePortfolioValues,
  };
};