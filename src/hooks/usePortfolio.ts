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
      setPortfolios(data || []);
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

  const mainPortfolio = portfolios.find(p => p.is_active) || portfolios[0];
  const totalValue = portfolios.reduce((sum, p) => sum + p.total_value, 0);

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
  };
};