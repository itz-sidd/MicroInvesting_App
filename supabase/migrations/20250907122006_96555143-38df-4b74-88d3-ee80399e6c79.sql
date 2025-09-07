-- Extend profiles table with ML-specific fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS investment_experience text DEFAULT 'beginner',
ADD COLUMN IF NOT EXISTS investment_timeline text DEFAULT '5-10_years',
ADD COLUMN IF NOT EXISTS income_range text DEFAULT '50k-100k',
ADD COLUMN IF NOT EXISTS investment_goals jsonb DEFAULT '[]'::jsonb;

-- Create user risk assessments table
CREATE TABLE IF NOT EXISTS public.user_risk_assessments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  question_responses jsonb NOT NULL DEFAULT '{}'::jsonb,
  risk_score numeric NOT NULL DEFAULT 0,
  risk_category text NOT NULL DEFAULT 'moderate',
  completed_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on user_risk_assessments
ALTER TABLE public.user_risk_assessments ENABLE ROW LEVEL SECURITY;

-- Create policies for user_risk_assessments
CREATE POLICY "Users can view their own risk assessments" 
ON public.user_risk_assessments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own risk assessments" 
ON public.user_risk_assessments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own risk assessments" 
ON public.user_risk_assessments 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create ML recommendations table
CREATE TABLE IF NOT EXISTS public.ml_recommendations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  recommendation_type text NOT NULL DEFAULT 'portfolio_allocation',
  recommended_allocation jsonb NOT NULL DEFAULT '{}'::jsonb,
  confidence_score numeric NOT NULL DEFAULT 0,
  expected_return numeric DEFAULT 0,
  expected_risk numeric DEFAULT 0,
  reasoning jsonb DEFAULT '{}'::jsonb,
  market_conditions jsonb DEFAULT '{}'::jsonb,
  valid_until timestamp with time zone DEFAULT (now() + interval '7 days'),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on ml_recommendations
ALTER TABLE public.ml_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies for ml_recommendations
CREATE POLICY "Users can view their own ML recommendations" 
ON public.ml_recommendations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ML recommendations" 
ON public.ml_recommendations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ML recommendations" 
ON public.ml_recommendations 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create market data cache table
CREATE TABLE IF NOT EXISTS public.market_data_cache (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol text NOT NULL,
  data_type text NOT NULL, -- 'historical_prices', 'volatility', 'correlation'
  time_period text NOT NULL, -- '1M', '3M', '6M', '1Y', '2Y'
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  last_updated timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '1 hour'),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_market_data_cache_symbol_type_period 
ON public.market_data_cache (symbol, data_type, time_period);

-- Create index for cleanup of expired data
CREATE INDEX IF NOT EXISTS idx_market_data_cache_expires_at 
ON public.market_data_cache (expires_at);

-- Create portfolio performance history table
CREATE TABLE IF NOT EXISTS public.portfolio_performance_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  portfolio_id uuid NOT NULL,
  date date NOT NULL,
  total_value numeric NOT NULL DEFAULT 0,
  daily_return numeric DEFAULT 0,
  cumulative_return numeric DEFAULT 0,
  benchmark_return numeric DEFAULT 0, -- S&P 500 or relevant benchmark
  allocation_snapshot jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on portfolio_performance_history
ALTER TABLE public.portfolio_performance_history ENABLE ROW LEVEL SECURITY;

-- Create policies for portfolio_performance_history
CREATE POLICY "Users can view their own portfolio performance history" 
ON public.portfolio_performance_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own portfolio performance history" 
ON public.portfolio_performance_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create index for efficient time series queries
CREATE INDEX IF NOT EXISTS idx_portfolio_performance_user_portfolio_date 
ON public.portfolio_performance_history (user_id, portfolio_id, date DESC);

-- Create triggers for updated_at columns
CREATE TRIGGER update_user_risk_assessments_updated_at
BEFORE UPDATE ON public.user_risk_assessments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ml_recommendations_updated_at
BEFORE UPDATE ON public.ml_recommendations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();