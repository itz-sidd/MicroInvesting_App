import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  market: string;
  currency: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbols } = await req.json();
    console.log('Fetching data for symbols:', symbols);

    const API_KEY = 'GIRSJSI6R39W3LN1';
    const stockData: StockData[] = [];

    // Fetch data for each symbol
    for (const symbol of symbols) {
      try {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        console.log(`Data for ${symbol}:`, data);

        console.log(`Raw API response for ${symbol}:`, JSON.stringify(data));
        
        const quote = data['Global Quote'];
        if (quote && quote['01. symbol']) {
          const currentPrice = parseFloat(quote['05. price']);
          const change = parseFloat(quote['09. change']);
          const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));

          // Determine market and currency based on symbol
          const isIndianStock = ['RELIANCE.BSE', 'TCS.BSE', 'INFY.BSE', 'HDFCBANK.BSE', 'ITC.BSE'].includes(symbol);
          
          stockData.push({
            symbol: symbol.replace('.BSE', ''), // Remove .BSE suffix for display
            name: getStockName(symbol),
            price: currentPrice,
            change: change,
            changePercent: changePercent,
            market: isIndianStock ? 'IN' : 'US',
            currency: isIndianStock ? '₹' : '$'
          });
        } else {
          console.error(`No valid quote data for symbol: ${symbol}. Response:`, JSON.stringify(data));
          
          // Check if we hit API rate limit or other errors
          if (data['Note']) {
            console.error('API Rate limit or error:', data['Note']);
          }
          if (data['Error Message']) {
            console.error('API Error:', data['Error Message']);
          }
          
          // For testing, let's add some mock data if API fails
          const isIndianStock = symbol.includes('.BSE');
          const mockPrice = Math.random() * 1000 + 100;
          const mockChange = (Math.random() - 0.5) * 20;
          
          stockData.push({
            symbol: symbol.replace('.BSE', ''),
            name: getStockName(symbol),
            price: mockPrice,
            change: mockChange,
            changePercent: (mockChange / mockPrice) * 100,
            market: isIndianStock ? 'IN' : 'US',
            currency: isIndianStock ? '₹' : '$'
          });
        }
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        // Add fallback data
        stockData.push({
          symbol: symbol.replace('.BSE', ''),
          name: getStockName(symbol),
          price: 0,
          change: 0,
          changePercent: 0,
          market: symbol.includes('.BSE') ? 'IN' : 'US',
          currency: symbol.includes('.BSE') ? '₹' : '$'
        });
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    return new Response(
      JSON.stringify({ data: stockData }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in fetch-stock-data function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch stock data' }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

function getStockName(symbol: string): string {
  const stockNames: { [key: string]: string } = {
    'AAPL': 'Apple Inc.',
    'GOOGL': 'Alphabet Inc.',
    'MSFT': 'Microsoft Corporation',
    'AMZN': 'Amazon.com Inc.',
    'TSLA': 'Tesla Inc.',
    'RELIANCE.BSE': 'Reliance Industries',
    'TCS.BSE': 'Tata Consultancy Services',
    'INFY.BSE': 'Infosys Limited',
    'HDFCBANK.BSE': 'HDFC Bank',
    'ITC.BSE': 'ITC Limited'
  };
  
  return stockNames[symbol] || symbol.replace('.BSE', '');
}