import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { supabase } from '@/integrations/supabase/client';
import { RootState } from '@/store/store';
import { useToast } from '@/hooks/use-toast';

export interface Transaction {
  id: string;
  user_id: string;
  account_id?: string;
  plaid_transaction_id?: string;
  amount: number;
  description: string;
  category?: string;
  date: string;
  round_up_amount: number;
  is_round_up_invested: boolean;
  created_at: string;
}

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateRoundUp = (amount: number): number => {
    const nextDollar = Math.ceil(Math.abs(amount));
    return Number((nextDollar - Math.abs(amount)).toFixed(2));
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'round_up_amount' | 'is_round_up_invested'>) => {
    if (!user) return;

    const roundUpAmount = calculateRoundUp(transaction.amount);
    
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...transaction,
          user_id: user.id,
          round_up_amount: roundUpAmount,
        })
        .select()
        .single();

      if (error) throw error;
      setTransactions(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
    }
  };

  const investRoundUp = async (transactionId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .update({ is_round_up_invested: true })
        .eq('id', transactionId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setTransactions(prev => 
        prev.map(t => 
          t.id === transactionId 
            ? { ...t, is_round_up_invested: true }
            : t
        )
      );

      toast({
        title: "Success",
        description: "Round-up invested successfully",
      });
    } catch (error) {
      console.error('Error investing round-up:', error);
      toast({
        title: "Error",
        description: "Failed to invest round-up",
        variant: "destructive",
      });
    }
  };

  const totalRoundUps = transactions
    .filter(t => !t.is_round_up_invested)
    .reduce((sum, t) => sum + t.round_up_amount, 0);

  return {
    transactions,
    loading,
    addTransaction,
    investRoundUp,
    totalRoundUps,
    fetchTransactions,
  };
};