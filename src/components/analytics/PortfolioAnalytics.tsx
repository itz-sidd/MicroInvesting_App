import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useTransactions } from '@/hooks/useTransactions';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';

export function PortfolioAnalytics() {
  const { portfolios, totalValue, investments } = usePortfolio();
  const { transactions, totalRoundUps } = useTransactions();

  const totalInvested = investments.reduce((sum, inv) => sum + (inv.total_value || 0), 0);
  const totalGainLoss = totalValue - totalInvested;
  const gainLossPercentage = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  const monthlyStats = transactions.reduce((acc, transaction) => {
    const month = new Date(transaction.date).getMonth();
    const year = new Date(transaction.date).getFullYear();
    const key = `${year}-${month}`;
    
    if (!acc[key]) {
      acc[key] = { spent: 0, roundUps: 0, invested: 0 };
    }
    
    acc[key].spent += Math.abs(transaction.amount);
    acc[key].roundUps += transaction.round_up_amount;
    if (transaction.is_round_up_invested) {
      acc[key].invested += transaction.round_up_amount;
    }
    
    return acc;
  }, {} as Record<string, { spent: number; roundUps: number; invested: number }>);

  const currentMonth = Object.values(monthlyStats)[Object.values(monthlyStats).length - 1] || 
    { spent: 0, roundUps: 0, invested: 0 };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Portfolio Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Total investments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {gainLossPercentage >= 0 ? 
                <TrendingUp className="h-4 w-4 text-green-500" /> : 
                <TrendingDown className="h-4 w-4 text-red-500" />
              }
              Gain/Loss
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${gainLossPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {gainLossPercentage >= 0 ? '+' : ''}${totalGainLoss.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {gainLossPercentage >= 0 ? '+' : ''}{gainLossPercentage.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Round-ups Ready
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRoundUps.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Available to invest
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentMonth.invested.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Invested from ${currentMonth.roundUps.toFixed(2)} round-ups
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Investment Breakdown</CardTitle>
          <CardDescription>Your portfolio allocation by investment type</CardDescription>
        </CardHeader>
        <CardContent>
          {investments.length > 0 ? (
            <div className="space-y-3">
              {investments.reduce((acc, investment) => {
                const existing = acc.find(item => item.symbol === investment.symbol);
                if (existing) {
                  existing.value += investment.total_value || 0;
                  existing.shares += investment.shares;
                } else {
                  acc.push({
                    symbol: investment.symbol,
                    value: investment.total_value || 0,
                    shares: investment.shares,
                    type: investment.investment_type
                  });
                }
                return acc;
              }, [] as any[]).map((item) => (
                <div key={item.symbol} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{item.symbol}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.shares.toFixed(6)} shares • {item.type.toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${item.value.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No investments yet. Start by adding some transactions and investing your round-ups!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}