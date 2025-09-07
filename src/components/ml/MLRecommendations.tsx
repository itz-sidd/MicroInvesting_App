import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Brain, 
  Target, 
  BarChart3,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRiskAssessment } from '@/hooks/useRiskAssessment';
import { supabase } from '@/integrations/supabase/client';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface MLRecommendation {
  id: string;
  user_id: string;
  recommendation_type: string;
  recommended_allocation: Record<string, number>;
  confidence_score: number;
  expected_return: number;
  expected_risk: number;
  reasoning: Record<string, any>;
  market_conditions: Record<string, any>;
  valid_until: string;
  created_at: string;
}

export function MLRecommendations() {
  const { user } = useAuth();
  const { assessment } = useRiskAssessment();
  const [recommendations, setRecommendations] = useState<MLRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const fetchRecommendations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ml_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .gte('valid_until', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recommendations:', error);
        return;
      }

      setRecommendations((data || []) as MLRecommendation[]);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async () => {
    if (!user || !assessment) return;

    try {
      setGenerating(true);
      
      // Generate mock recommendations based on risk assessment
      const mockRecommendation = generateMockRecommendation(assessment);
      
      const { error } = await supabase
        .from('ml_recommendations')
        .insert(mockRecommendation);

      if (error) {
        console.error('Error saving recommendation:', error);
        return;
      }

      await fetchRecommendations();
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setGenerating(false);
    }
  };

  const generateMockRecommendation = (assessment: any): Omit<MLRecommendation, 'id' | 'created_at'> => {
    let allocation: Record<string, number>;
    let expectedReturn: number;
    let expectedRisk: number;

    // Generate allocation based on risk category
    switch (assessment.risk_category) {
      case 'conservative':
        allocation = {
          'bonds': 60,
          'dividend_stocks': 25,
          'large_cap_stocks': 10,
          'cash': 5
        };
        expectedReturn = 0.05; // 5% expected return
        expectedRisk = 0.08; // 8% volatility
        break;
      case 'aggressive':
        allocation = {
          'growth_stocks': 40,
          'small_cap_stocks': 20,
          'large_cap_stocks': 25,
          'etfs': 10,
          'bonds': 5
        };
        expectedReturn = 0.12; // 12% expected return
        expectedRisk = 0.18; // 18% volatility
        break;
      default: // moderate
        allocation = {
          'large_cap_stocks': 35,
          'bonds': 30,
          'etfs': 20,
          'dividend_stocks': 10,
          'cash': 5
        };
        expectedReturn = 0.08; // 8% expected return
        expectedRisk = 0.12; // 12% volatility
    }

    return {
      user_id: user!.id,
      recommendation_type: 'portfolio_allocation',
      recommended_allocation: allocation,
      confidence_score: 0.85 + Math.random() * 0.1, // 85-95% confidence
      expected_return: expectedReturn,
      expected_risk: expectedRisk,
      reasoning: {
        risk_factors: ['market_volatility', 'inflation_hedge', 'diversification'],
        model_inputs: {
          risk_score: assessment.risk_score,
          risk_category: assessment.risk_category,
          time_horizon: 'long_term'
        },
        explanation: `Based on your ${assessment.risk_category} risk profile, this allocation optimizes for ${
          assessment.risk_category === 'conservative' ? 'capital preservation and steady income' :
          assessment.risk_category === 'aggressive' ? 'maximum growth potential' :
          'balanced growth with moderate risk'
        }.`
      },
      market_conditions: {
        market_sentiment: 'neutral',
        volatility_index: 0.15,
        interest_rates: 0.045,
        inflation_rate: 0.025
      },
      valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Valid for 7 days
    };
  };

  useEffect(() => {
    if (user && assessment) {
      fetchRecommendations();
    }
  }, [user, assessment]);

  if (!assessment) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Please complete your risk assessment first to receive personalized recommendations.
        </AlertDescription>
      </Alert>
    );
  }

  const latestRecommendation = recommendations[0];

  const getChartData = (allocation: Record<string, number>) => {
    const labels = Object.keys(allocation).map(key => 
      key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    );
    const data = Object.values(allocation);
    
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            'hsl(var(--chart-1))',
            'hsl(var(--chart-2))',
            'hsl(var(--chart-3))',
            'hsl(var(--chart-4))',
            'hsl(var(--chart-5))',
          ],
          borderWidth: 0,
        },
      ],
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Portfolio Recommendations</h2>
          <p className="text-muted-foreground">
            Personalized investment allocation based on your risk profile
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchRecommendations}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button
            onClick={generateRecommendations}
            disabled={generating || !assessment}
          >
            <Brain className="h-4 w-4 mr-2" />
            {generating ? 'Generating...' : 'Generate New'}
          </Button>
        </div>
      </div>

      {recommendations.length === 0 ? (
        <Card>
          <CardHeader className="text-center">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>No Recommendations Yet</CardTitle>
            <CardDescription>
              Generate your first AI-powered portfolio recommendation based on your risk assessment.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={generateRecommendations} disabled={generating}>
              <Brain className="h-4 w-4 mr-2" />
              {generating ? 'Generating...' : 'Generate Recommendations'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Latest Recommendation */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Recommended Allocation
                  </CardTitle>
                  <Badge variant="secondary">
                    {Math.round(latestRecommendation.confidence_score * 100)}% Confidence
                  </Badge>
                </div>
                <CardDescription>
                  Optimized for your {assessment.risk_category} risk profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <Doughnut 
                    data={getChartData(latestRecommendation.recommended_allocation)}
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
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Expected Performance
                </CardTitle>
                <CardDescription>
                  Projected returns based on historical data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Expected Annual Return</span>
                      <span className="text-lg font-bold text-green-600">
                        {(latestRecommendation.expected_return * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={latestRecommendation.expected_return * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Expected Volatility</span>
                      <span className="text-lg font-bold text-orange-600">
                        {(latestRecommendation.expected_risk * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={latestRecommendation.expected_risk * 100} className="h-2" />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Valid until {new Date(latestRecommendation.valid_until).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reasoning */}
          <Card>
            <CardHeader>
              <CardTitle>AI Reasoning</CardTitle>
              <CardDescription>
                Why this allocation was recommended for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">
                  {latestRecommendation.reasoning.explanation}
                </p>
                
                <div>
                  <h4 className="font-medium mb-2">Key Factors Considered:</h4>
                  <div className="flex flex-wrap gap-2">
                    {latestRecommendation.reasoning.risk_factors?.map((factor: string) => (
                      <Badge key={factor} variant="outline">
                        {factor.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Market Sentiment</div>
                    <div className="font-medium capitalize">
                      {latestRecommendation.market_conditions.market_sentiment}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Volatility Index</div>
                    <div className="font-medium">
                      {(latestRecommendation.market_conditions.volatility_index * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Interest Rates</div>
                    <div className="font-medium">
                      {(latestRecommendation.market_conditions.interest_rates * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Inflation Rate</div>
                    <div className="font-medium">
                      {(latestRecommendation.market_conditions.inflation_rate * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}