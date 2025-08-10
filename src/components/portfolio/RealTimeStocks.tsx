import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp, TrendingDown, Plus, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

export function RealTimeStocks() {
  const [watchlist, setWatchlist] = useState<StockData[]>([
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 178.25,
      change: 2.15,
      changePercent: 1.22,
      lastUpdated: new Date().toLocaleTimeString()
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 2845.50,
      change: -12.30,
      changePercent: -0.43,
      lastUpdated: new Date().toLocaleTimeString()
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      price: 412.80,
      change: 5.60,
      changePercent: 1.38,
      lastUpdated: new Date().toLocaleTimeString()
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      price: 248.42,
      change: -8.25,
      changePercent: -3.21,
      lastUpdated: new Date().toLocaleTimeString()
    }
  ]);
  const [searchSymbol, setSearchSymbol] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWatchlist(prev => prev.map(stock => {
        const randomChange = (Math.random() - 0.5) * 2; // Random change between -1 and 1
        const newPrice = Math.max(stock.price + randomChange, 0.01);
        const change = newPrice - stock.price;
        const changePercent = (change / stock.price) * 100;
        
        return {
          ...stock,
          price: newPrice,
          change: change,
          changePercent: changePercent,
          lastUpdated: new Date().toLocaleTimeString()
        };
      }));
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const addToWatchlist = () => {
    if (!searchSymbol.trim()) {
      toast({
        title: "Error",
        description: "Please enter a stock symbol",
        variant: "destructive"
      });
      return;
    }

    const symbol = searchSymbol.toUpperCase();
    if (watchlist.some(stock => stock.symbol === symbol)) {
      toast({
        title: "Already in watchlist",
        description: `${symbol} is already in your watchlist`,
        variant: "destructive"
      });
      return;
    }

    const newStock: StockData = {
      symbol,
      name: `${symbol} Corporation`,
      price: Math.random() * 200 + 50, // Random price between 50-250
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5,
      lastUpdated: new Date().toLocaleTimeString()
    };

    setWatchlist(prev => [...prev, newStock]);
    setSearchSymbol('');
    toast({
      title: "Stock added",
      description: `${symbol} has been added to your watchlist`
    });
  };

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setWatchlist(prev => prev.map(stock => ({
        ...stock,
        lastUpdated: new Date().toLocaleTimeString()
      })));
      setIsRefreshing(false);
      toast({
        title: "Data refreshed",
        description: "Stock prices have been updated"
      });
    }, 1000);
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.filter(stock => stock.symbol !== symbol));
    toast({
      title: "Stock removed",
      description: `${symbol} has been removed from your watchlist`
    });
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Real-Time Stock Tracker</CardTitle>
            <CardDescription>Monitor your favorite stocks with live price updates</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Stock Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter stock symbol (e.g., AAPL, GOOGL)"
              value={searchSymbol}
              onChange={(e) => setSearchSymbol(e.target.value)}
              className="pl-10"
              onKeyPress={(e) => e.key === 'Enter' && addToWatchlist()}
            />
          </div>
          <Button onClick={addToWatchlist} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>

        {/* Stock List */}
        <div className="space-y-3">
          {watchlist.map((stock) => (
            <div
              key={stock.symbol}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono">
                      {stock.symbol}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromWatchlist(stock.symbol)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    >
                      ×
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{stock.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Updated: {stock.lastUpdated}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold">
                  ${stock.price.toFixed(2)}
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  stock.change >= 0 ? 'text-success' : 'text-destructive'
                }`}>
                  {stock.change >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>
                    {stock.change >= 0 ? '+' : ''}
                    {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {watchlist.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No stocks in your watchlist</p>
            <p className="text-sm">Add some stocks to start tracking their prices</p>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center pt-4 border-t">
          <p>📈 Prices update automatically every few seconds</p>
          <p>This is a demo implementation - real API integration would provide actual market data</p>
        </div>
      </CardContent>
    </Card>
  );
}