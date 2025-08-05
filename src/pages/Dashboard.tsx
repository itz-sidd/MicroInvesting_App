import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  PiggyBank, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function Dashboard() {
  // Mock data - will be replaced with real data later
  const stats = {
    totalInvestments: 2847.50,
    roundUpSavings: 186.23,
    portfolioReturn: 12.4,
    goalProgress: 68,
  };

  const recentTransactions = [
    { id: 1, description: 'Coffee Shop Round-up', amount: 2.35, type: 'roundup' },
    { id: 2, description: 'Grocery Store Round-up', amount: 4.67, type: 'roundup' },
    { id: 3, description: 'Monthly Auto-invest', amount: 100.00, type: 'investment' },
    { id: 4, description: 'Gas Station Round-up', amount: 1.89, type: 'roundup' },
  ];

  const portfolioHoldings = [
    { symbol: 'VTI', name: 'Total Stock Market ETF', value: 1234.56, percentage: 43.4 },
    { symbol: 'BND', name: 'Total Bond Market ETF', value: 876.32, percentage: 30.8 },
    { symbol: 'VTIAX', name: 'International Stock ETF', value: 736.62, percentage: 25.8 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h2 className="text-3xl font-bold text-foreground">Welcome back!</h2>
          <p className="text-muted-foreground">Here's what's happening with your investments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalInvestments.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                <ArrowUpRight className="inline h-3 w-3 mr-1" />
                +8.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Round-up Savings</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.roundUpSavings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Return</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+{stats.portfolioReturn}%</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.goalProgress}%</div>
              <div className="w-full bg-secondary rounded-full h-2 mt-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${stats.goalProgress}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest round-ups and investments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'roundup' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {transaction.type === 'roundup' ? <PiggyBank className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.type === 'roundup' ? 'Round-up' : 'Investment'}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm font-medium">+${transaction.amount.toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline">
                View All Transactions
              </Button>
            </CardContent>
          </Card>

          {/* Portfolio Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Holdings</CardTitle>
              <CardDescription>Your current investment allocation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolioHoldings.map((holding) => (
                  <div key={holding.symbol} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">{holding.symbol}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{holding.symbol}</p>
                        <p className="text-xs text-muted-foreground">{holding.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">${holding.value.toFixed(2)}</div>
                      <Badge variant="secondary" className="text-xs">
                        {holding.percentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Adjust Allocation
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to manage your investments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-20 flex-col space-y-2">
                <Plus className="h-6 w-6" />
                <span>Add Funds</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Target className="h-6 w-6" />
                <span>Set Goal</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <TrendingUp className="h-6 w-6" />
                <span>View Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}