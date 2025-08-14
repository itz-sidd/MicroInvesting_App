import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePortfolio } from '@/hooks/usePortfolio';
import { DemoPortfolioButton } from './DemoPortfolioButton';
import { TrendingUp, PieChart, DollarSign, Loader2 } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export function PortfolioOverview() {
  const { portfolios, investments, totalValue, loading } = usePortfolio();

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const mainPortfolio = portfolios.find(p => p.is_active) || portfolios[0];
  
  if (!mainPortfolio) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">No portfolio found</p>
        </CardContent>
      </Card>
    );
  }

  const allocation = mainPortfolio.allocation_strategy;
  
  const chartData = {
    labels: ['Stocks', 'Bonds', 'ETFs'],
    datasets: [
      {
        data: [allocation.stocks, allocation.bonds, allocation.etfs],
        backgroundColor: [
          '#3B82F6', // Blue for Stocks
          '#10B981', // Green for Bonds  
          '#F59E0B', // Orange for ETFs
        ],
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
          color: 'hsl(var(--foreground))',
        },
      },
      tooltip: {
        backgroundColor: 'hsl(var(--popover))',
        titleColor: 'hsl(var(--popover-foreground))',
        bodyColor: 'hsl(var(--popover-foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
      },
    },
  };

  const investmentsByType = investments.reduce((acc, inv) => {
    const type = inv.investment_type;
    acc[type] = (acc[type] || 0) + (inv.total_value || 0);
    return acc;
  }, {} as Record<string, number>);

  // Calculate total current value from investments
  const totalCurrentValue = Object.values(investmentsByType).reduce((sum, value) => sum + value, 0);
  
  // Calculate total invested (cost basis) from investments
  const totalInvested = investments.reduce((sum, inv) => sum + (inv.shares * inv.avg_cost_per_share), 0);
  
  // Calculate gain/loss based on current value vs cost basis
  const gainLoss = totalCurrentValue - totalInvested;
  const gainLossPercentage = totalInvested > 0 ? (gainLoss / totalInvested) * 100 : 0;
  
  // Use the actual calculated total instead of portfolio.total_value
  const displayTotalValue = totalCurrentValue + (mainPortfolio?.cash_balance || 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${displayTotalValue.toFixed(2)}</div>
          <div className="flex items-center gap-2 mt-2">
            <TrendingUp className={`h-4 w-4 ${gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-sm ${gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${gainLoss.toFixed(2)} ({gainLossPercentage.toFixed(2)}%)
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${mainPortfolio.cash_balance.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-2">
            Available for investing
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{investments.length}</div>
          <p className="text-xs text-muted-foreground mt-2">
            Active positions
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Asset Allocation</CardTitle>
          <CardDescription>Current portfolio strategy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Recent Investments</CardTitle>
          <CardDescription>Your latest investment positions</CardDescription>
        </CardHeader>
        <CardContent>
          {investments.length === 0 ? (
            <div className="text-center py-6 space-y-4">
              <p className="text-muted-foreground">
                No investments yet. Get started with demo investments!
              </p>
              <DemoPortfolioButton />
            </div>
          ) : (
            <div className="space-y-3">
              {investments.slice(0, 5).map((investment) => (
                <div
                  key={investment.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{investment.symbol}</Badge>
                    <div>
                      <p className="font-medium">{investment.shares.toFixed(6)} shares</p>
                      <p className="text-sm text-muted-foreground">
                        Avg cost: ${investment.avg_cost_per_share.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${(investment.total_value || 0).toFixed(2)}
                    </p>
                    <Badge variant="outline">
                      {investment.investment_type.toUpperCase()}
                    </Badge>
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