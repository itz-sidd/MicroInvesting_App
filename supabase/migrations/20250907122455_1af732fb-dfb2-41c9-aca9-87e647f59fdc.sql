-- Enable RLS on market_data_cache table (this should be public read-only data)
ALTER TABLE public.market_data_cache ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read market data
CREATE POLICY "All authenticated users can view market data" 
ON public.market_data_cache 
FOR SELECT 
USING (true);

-- Create policy to allow system/admin functions to insert/update market data
-- For now, we'll allow authenticated users to insert (this can be restricted later to service roles)
CREATE POLICY "Authenticated users can insert market data" 
ON public.market_data_cache 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update market data" 
ON public.market_data_cache 
FOR UPDATE 
USING (true);