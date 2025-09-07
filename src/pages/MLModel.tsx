import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Zap, TrendingUp, Target, Clock, BarChart3 } from 'lucide-react';
import { RiskAssessmentWizard } from '@/components/ml/RiskAssessmentWizard';
import { MLRecommendations } from '@/components/ml/MLRecommendations';
import { PortfolioOptimizer } from '@/components/ml/PortfolioOptimizer';
import { VoiceChatbot } from '@/components/ml/VoiceChatbot';
import { useRiskAssessment } from '@/hooks/useRiskAssessment';
import { useAuth } from '@/hooks/useAuth';

export default function MLModel() {
  const { assessment, loading } = useRiskAssessment();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  console.log('MLModel - assessment:', assessment, 'loading:', loading);
  console.log('MLModel - user:', user, 'isAuthenticated:', isAuthenticated);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI-Powered Investment Model</h1>
          <p className="text-muted-foreground mt-2">
            Advanced machine learning for smarter investment decisions
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assessment">Risk Assessment</TabsTrigger>
            <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
            <TabsTrigger value="optimizer">Portfolio Optimizer</TabsTrigger>
            <TabsTrigger value="chatbot">AI Advisor Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Status Banner */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">AI Investment Model</CardTitle>
                <CardDescription className="text-lg">
                  {assessment 
                    ? 'Your personalized AI recommendations are ready'
                    : 'Complete your risk assessment to get personalized recommendations'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  {assessment ? (
                    <Badge variant="default" className="text-sm px-4 py-2">
                      ✅ Risk Profile: {assessment.risk_category}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-sm px-4 py-2">
                      📊 Assessment Required
                    </Badge>
                  )}
                  
                  <div className="flex justify-center">
                    <Button 
                      onClick={() => setActiveTab(assessment ? 'recommendations' : 'assessment')}
                    >
                      {assessment ? 'View Recommendations' : 'Start Risk Assessment'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Features */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Target className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Risk Assessment</CardTitle>
                      <CardDescription>
                        {assessment ? '✅ Completed' : '⏳ Ready to start'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Intelligent questionnaire analyzes your risk tolerance and investment preferences for personalized recommendations.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Portfolio Optimization</CardTitle>
                      <CardDescription>
                        {assessment ? '🚀 Available' : '🔒 Requires assessment'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Modern Portfolio Theory combined with machine learning to optimize your asset allocation for maximum risk-adjusted returns.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Real-time Analytics</CardTitle>
                      <CardDescription>
                        {assessment ? '📈 Active' : '⏸️ Pending setup'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Continuous market analysis and portfolio rebalancing recommendations based on current conditions and your goals.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <Brain className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        AI Advisor Chat 
                        <Badge variant="default" className="text-xs">NEW</Badge>
                      </CardTitle>
                      <CardDescription>
                        🎙️ Voice-enabled financial advisor
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Talk naturally with your AI financial advisor to get personalized insights about your portfolio, risk assessment, and investment strategies.
                  </p>
                  <Button 
                    size="sm" 
                    className="mt-3 w-full"
                    onClick={() => setActiveTab('chatbot')}
                  >
                    Try AI Chat
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  How Our AI Works
                </CardTitle>
                <CardDescription>
                  Three-layer approach combining proven financial theory with modern AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <h4 className="font-semibold">Collaborative Filtering</h4>
                    <p className="text-sm text-muted-foreground">
                      Learns from similar users' successful portfolios and investment patterns
                    </p>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <h4 className="font-semibold">Portfolio Optimization</h4>
                    <p className="text-sm text-muted-foreground">
                      Applies Modern Portfolio Theory to maximize risk-adjusted returns
                    </p>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-red-600 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h4 className="font-semibold">Market Forecasting</h4>
                    <p className="text-sm text-muted-foreground">
                      Time series analysis predicts short-term market movements
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessment" className="space-y-6">
            <RiskAssessmentWizard onComplete={() => setActiveTab('recommendations')} />
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <MLRecommendations />
          </TabsContent>

          <TabsContent value="optimizer" className="space-y-6">
            <PortfolioOptimizer />
          </TabsContent>

          <TabsContent value="chatbot" className="space-y-6">
            <VoiceChatbot 
              userContext={{
                riskCategory: assessment?.risk_category,
                riskScore: assessment?.risk_score,
                portfolio: null // You can pass portfolio data here if available
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}