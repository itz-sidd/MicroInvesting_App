import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTransactions } from '@/hooks/useTransactions';
import { usePortfolio } from '@/hooks/usePortfolio';
import { formatDistanceToNow } from 'date-fns';
import { DollarSign, TrendingUp, Loader2 } from 'lucide-react';

export function TransactionList() {
  const { transactions, loading, investRoundUp, totalRoundUps } = useTransactions();
  const { mainPortfolio, executeRoundUpInvestment } = usePortfolio();

  const handleInvestAllRoundUps = async () => {
    if (!mainPortfolio || totalRoundUps <= 0) return;
    
    await executeRoundUpInvestment(totalRoundUps, mainPortfolio.id);
    
    // Mark all uninvested round-ups as invested
    const uninvestedTransactions = transactions.filter(t => !t.is_round_up_invested && t.round_up_amount > 0);
    for (const transaction of uninvestedTransactions) {
      await investRoundUp(transaction.id);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {totalRoundUps > 0 && (
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Ready to Invest
            </CardTitle>
            <CardDescription>
              You have ${totalRoundUps.toFixed(2)} in round-ups ready to invest
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleInvestAllRoundUps} className="w-full">
              Invest All Round-ups
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Your latest transactions and round-up opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No transactions found. Connect your bank account to start tracking transactions.
            </p>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 10).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-full">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.category} • {formatDistanceToNow(new Date(transaction.date))} ago
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="font-medium">
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      {transaction.round_up_amount > 0 && (
                        <div className="flex items-center gap-2">
                          <Badge variant={transaction.is_round_up_invested ? "default" : "secondary"} className="text-xs">
                            Round-up: ${transaction.round_up_amount.toFixed(2)}
                          </Badge>
                          {!transaction.is_round_up_invested && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => investRoundUp(transaction.id)}
                            >
                              Invest
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}