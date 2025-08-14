import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp, TrendingDown, Plus, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
  market: 'US' | 'IN';
  currency: string;
}

const availableStocks = {
  US: [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'META', name: 'Meta Platforms Inc.' },
    { symbol: 'NFLX', name: 'Netflix Inc.' }
  ],
  IN: [
    { symbol: 'RELIANCE', name: 'Reliance Industries' },
    { symbol: 'TCS', name: 'Tata Consultancy Services' },
    { symbol: 'INFY', name: 'Infosys Limited' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank' },
    { symbol: 'ITC', name: 'ITC Limited' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel' },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank' },
    { symbol: 'LT', name: 'Larsen & Toubro' }
  ]
};

export function RealTimeStocks() {
  const [watchlist, setWatchlist] = useState<StockData[]>([]);
  const [searchSymbol, setSearchSymbol] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAvailableStocks, setShowAvailableStocks] = useState(false);
  const { toast } = useToast();

  // Default stocks to load initially
  const defaultStocks = ['AAPL', 'GOOGL', 'MSFT', 'RELIANCE.BSE', 'TCS.BSE', 'INFY.BSE'];

  // Fetch real stock data
  const fetchStockData = async (symbols: string[]) => {
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-stock-data', {
        body: { symbols }
      });

      if (error) {
        console.error('Error fetching stock data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch stock data. Please try again.",
          variant: "destructive"
        });
        return;
      }

      if (data?.data) {
        const formattedData = data.data.map((stock: any) => ({
          ...stock,
          lastUpdated: new Date().toLocaleTimeString(),
          market: stock.market as 'US' | 'IN',
          currency: stock.market === 'IN' ? 'INR' : 'USD'
        }));
        setWatchlist(formattedData);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch stock data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchStockData(defaultStocks);
  }, []);

  // Periodic updates every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (watchlist.length > 0) {
        const symbols = watchlist.map(stock => 
          stock.market === 'IN' ? `${stock.symbol}.BSE` : stock.symbol
        );
        fetchStockData(symbols);
      }
    }, 120000); // Update every 2 minutes

    return () => clearInterval(interval);
  }, [watchlist]);

  const addToWatchlist = async () => {
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

    // Add .BSE suffix for known Indian stocks
    const isIndianStock = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ITC'].includes(symbol);
    const apiSymbol = isIndianStock ? `${symbol}.BSE` : symbol;
    
    // Get current symbols plus the new one
    const currentSymbols = watchlist.map(stock => 
      stock.market === 'IN' ? `${stock.symbol}.BSE` : stock.symbol
    );
    
    await fetchStockData([...currentSymbols, apiSymbol]);
    setSearchSymbol('');
    
    toast({
      title: "Stock added",
      description: `${symbol} has been added to your watchlist`
    });
  };

  const refreshData = async () => {
    if (watchlist.length === 0) {
      await fetchStockData(defaultStocks);
    } else {
      const symbols = watchlist.map(stock => 
        stock.market === 'IN' ? `${stock.symbol}.BSE` : stock.symbol
      );
      await fetchStockData(symbols);
    }
    
    toast({
      title: "Data refreshed",
      description: "Stock prices have been updated"
    });
  };

  const addStockToWatchlist = async (symbol: string, market: 'US' | 'IN') => {
    if (watchlist.some(stock => stock.symbol === symbol)) {
      toast({
        title: "Already in watchlist",
        description: `${symbol} is already in your watchlist`,
        variant: "destructive"
      });
      return;
    }

    const apiSymbol = market === 'IN' ? `${symbol}.BSE` : symbol;
    const currentSymbols = watchlist.map(stock => 
      stock.market === 'IN' ? `${stock.symbol}.BSE` : stock.symbol
    );
    
    await fetchStockData([...currentSymbols, apiSymbol]);
    
    toast({
      title: "Stock added",
      description: `${symbol} has been added to your watchlist`
    });
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.filter(stock => stock.symbol !== symbol));
    toast({
      title: "Stock removed",
      description: `${symbol} has been removed from your watchlist`
    });
  };

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Real-Time Stock Tracker</CardTitle>
          <CardDescription>Monitor your favorite stocks with live price updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading stock data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

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
            {isRefreshing ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Stock Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter stock symbol (e.g., AAPL, RELIANCE, TCS, GOOGL)"
              value={searchSymbol}
              onChange={(e) => setSearchSymbol(e.target.value)}
              className="pl-10"
              onKeyPress={(e) => e.key === 'Enter' && addToWatchlist()}
            />
          </div>
          <Button onClick={addToWatchlist} className="flex items-center gap-2" disabled={isRefreshing}>
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
                    <Badge 
                      variant={stock.market === 'US' ? 'default' : 'outline'} 
                      className="text-xs"
                    >
                      {stock.market === 'US' ? '🇺🇸 US' : '🇮🇳 IN'}
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
                  {stock.currency === 'USD' ? '$' : '₹'}{stock.price > 0 ? stock.price.toFixed(2) : 'N/A'}
                </div>
                {stock.price > 0 && (
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
                      {stock.currency === 'USD' ? '$' : '₹'}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Available Stocks Section */}
        <div className="border rounded-lg">
          <Button
            variant="ghost"
            onClick={() => setShowAvailableStocks(!showAvailableStocks)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <div>
              <h3 className="font-semibold">Available Stocks</h3>
              <p className="text-sm text-muted-foreground">Popular stocks you can add to your watchlist</p>
            </div>
            {showAvailableStocks ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          
          {showAvailableStocks && (
            <div className="p-4 border-t space-y-4">
              {/* US Stocks */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-1">
                  🇺🇸 US Stocks
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableStocks.US.map((stock) => (
                    <div
                      key={stock.symbol}
                      className="flex items-center justify-between p-2 border rounded hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm font-medium">{stock.symbol}</div>
                        <div className="text-xs text-muted-foreground truncate">{stock.name}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addStockToWatchlist(stock.symbol, 'US')}
                        disabled={watchlist.some(s => s.symbol === stock.symbol) || isRefreshing}
                        className="h-7 w-7 p-0 shrink-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Indian Stocks */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-1">
                  🇮🇳 Indian Stocks
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableStocks.IN.map((stock) => (
                    <div
                      key={stock.symbol}
                      className="flex items-center justify-between p-2 border rounded hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm font-medium">{stock.symbol}</div>
                        <div className="text-xs text-muted-foreground truncate">{stock.name}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addStockToWatchlist(stock.symbol, 'IN')}
                        disabled={watchlist.some(s => s.symbol === stock.symbol) || isRefreshing}
                        className="h-7 w-7 p-0 shrink-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {watchlist.length === 0 && !isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No stocks in your watchlist</p>
            <p className="text-sm">Add some stocks to start tracking their prices</p>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center pt-4 border-t">
          <p>📈 Prices update automatically every 2 minutes</p>
          <p>Real-time data powered by Alpha Vantage API</p>
        </div>
      </CardContent>
    </Card>
  );
}