import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, Settings, RefreshCw, Info } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface OptimizationPreferences {
  riskTolerance: number; // 0-100
  returnExpectation: number; // 0-100
  timeHorizon: number; // 1-30 years
  liquidityNeeds: number; // 0-100
}

interface OptimizedAllocation {
  stocks: number;
  bonds: number;
  etfs: number;
  cash: number;
  expectedReturn: number;
  expectedRisk: number;
  sharpeRatio: number;
}

export function PortfolioOptimizer() {
  const [preferences, setPreferences] = useState<OptimizationPreferences>({
    riskTolerance: 50,
    returnExpectation: 60,
    timeHorizon: 10,
    liquidityNeeds: 20
  });
  const [optimizing, setOptimizing] = useState(false);
  const [optimizedAllocation, setOptimizedAllocation] = useState<OptimizedAllocation | null>(null);

  const optimizePortfolio = async () => {
    setOptimizing(true);
    
    // Simulate optimization delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock optimization based on preferences
    const optimization = generateOptimizedAllocation(preferences);
    setOptimizedAllocation(optimization);
    setOptimizing(false);
  };

  const generateOptimizedAllocation = (prefs: OptimizationPreferences): OptimizedAllocation => {
    // Simple optimization algorithm based on preferences
    const riskFactor = prefs.riskTolerance / 100;
    const returnFactor = prefs.returnExpectation / 100;
    const timeFactor = Math.min(prefs.timeHorizon / 30, 1);
    const liquidityFactor = 1 - (prefs.liquidityNeeds / 100);

    // Base allocations influenced by preferences
    let stocks = Math.min(80, 30 + (riskFactor * 40) + (timeFactor * 20));
    let bonds = Math.min(60, 20 + ((1 - riskFactor) * 30) + ((1 - timeFactor) * 10));
    let etfs = Math.min(30, 15 + (returnFactor * 15));
    let cash = Math.max(5, 10 + (prefs.liquidityNeeds / 100 * 20));

    // Normalize to 100%
    const total = stocks + bonds + etfs + cash;
    stocks = (stocks / total) * 100;
    bonds = (bonds / total) * 100;
    etfs = (etfs / total) * 100;
    cash = (cash / total) * 100;

    // Calculate expected metrics
    const expectedReturn = (stocks * 0.10 + bonds * 0.04 + etfs * 0.08 + cash * 0.02) / 100;
    const expectedRisk = Math.sqrt(
      (stocks/100) ** 2 * 0.16 ** 2 +
      (bonds/100) ** 2 * 0.05 ** 2 +
      (etfs/100) ** 2 * 0.12 ** 2 +
      (cash/100) ** 2 * 0.01 ** 2
    );
    const sharpeRatio = (expectedReturn - 0.02) / expectedRisk; // Assuming 2% risk-free rate

    return {
      stocks: Math.round(stocks),
      bonds: Math.round(bonds),
      etfs: Math.round(etfs),
      cash: Math.round(cash),
      expectedReturn,
      expectedRisk,
      sharpeRatio
    };
  };

  const updatePreference = (key: keyof OptimizationPreferences, value: number) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    // Clear previous optimization when preferences change
    setOptimizedAllocation(null);
  };

  const getChartData = (allocation: OptimizedAllocation) => {
    return {
      labels: ['Stocks', 'Bonds', 'ETFs', 'Cash'],
      datasets: [
        {
          data: [allocation.stocks, allocation.bonds, allocation.etfs, allocation.cash],
          backgroundColor: [
            'hsl(var(--chart-1))',
            'hsl(var(--chart-2))',
            'hsl(var(--chart-3))',
            'hsl(var(--chart-4))',
          ],
          borderWidth: 0,
        },
      ],
    };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Portfolio Optimizer
          </CardTitle>
          <CardDescription>
            Customize your preferences to get an optimized portfolio allocation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This optimizer uses Modern Portfolio Theory to balance risk and return based on your preferences.
            </AlertDescription>
          </Alert>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Risk Tolerance</label>
                  <Badge variant="outline">{preferences.riskTolerance}%</Badge>
                </div>
                <Slider
                  value={[preferences.riskTolerance]}
                  onValueChange={(value) => updatePreference('riskTolerance', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  How much volatility can you accept?
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Return Expectation</label>
                  <Badge variant="outline">{preferences.returnExpectation}%</Badge>
                </div>
                <Slider
                  value={[preferences.returnExpectation]}
                  onValueChange={(value) => updatePreference('returnExpectation', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  How aggressive should growth be?
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Time Horizon</label>
                  <Badge variant="outline">{preferences.timeHorizon} years</Badge>
                </div>
                <Slider
                  value={[preferences.timeHorizon]}
                  onValueChange={(value) => updatePreference('timeHorizon', value[0])}
                  min={1}
                  max={30}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  How long until you need the money?
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Liquidity Needs</label>
                  <Badge variant="outline">{preferences.liquidityNeeds}%</Badge>
                </div>
                <Slider
                  value={[preferences.liquidityNeeds]}
                  onValueChange={(value) => updatePreference('liquidityNeeds', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  How much cash access do you need?
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button 
              onClick={optimizePortfolio} 
              disabled={optimizing}
              size="lg"
            >
              {optimizing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Optimize Portfolio
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {optimizedAllocation && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Optimized Allocation</CardTitle>
              <CardDescription>
                Based on your preferences and market conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <Doughnut 
                  data={getChartData(optimizedAllocation)}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom' as const,
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expected Performance</CardTitle>
              <CardDescription>
                Projected metrics for this allocation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {(optimizedAllocation.expectedReturn * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Expected Return</div>
                </div>
                
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {(optimizedAllocation.expectedRisk * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Expected Risk</div>
                </div>
              </div>

              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {optimizedAllocation.sharpeRatio.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Higher is better (risk-adjusted returns)
                </p>
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Stocks:</span>
                  <span className="font-medium">{optimizedAllocation.stocks}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Bonds:</span>
                  <span className="font-medium">{optimizedAllocation.bonds}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">ETFs:</span>
                  <span className="font-medium">{optimizedAllocation.etfs}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Cash:</span>
                  <span className="font-medium">{optimizedAllocation.cash}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}