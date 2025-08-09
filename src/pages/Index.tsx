import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  PiggyBank, 
  TrendingUp, 
  Shield, 
  Smartphone,
  ArrowRight,
  CheckCircle,
  BookOpen,
  Target,
  Clock,
  DollarSign,
  BarChart3,
  Users
} from 'lucide-react';

const Index = () => {
  const { isAuthenticated, initialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialized && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, initialized, navigate]);

  const features = [
    {
      icon: PiggyBank,
      title: 'Round-Up Investing',
      description: 'Automatically invest your spare change from everyday purchases'
    },
    {
      icon: TrendingUp,
      title: 'Diversified Portfolios',
      description: 'Professional portfolio management with low-cost ETFs'
    },
    {
      icon: Shield,
      title: 'Secure & Protected',
      description: 'Bank-level security with SIPC protection up to $500K'
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      description: 'Manage your investments anywhere with our intuitive app'
    }
  ];

  const benefits = [
    'Start with as little as $5',
    'No account minimums or trading fees',
    'Automatic rebalancing',
    'Tax-loss harvesting',
    'Real-time portfolio tracking'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <PiggyBank className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Invest Your Spare Change
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Turn everyday purchases into investments. Start building wealth with micro-investing 
            that rounds up your purchases and invests the difference automatically.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-3"
              onClick={() => navigate('/auth')}
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-3"
              onClick={() => navigate('/auth')}
            >
              Sign In
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <Badge variant="secondary">SIPC Protected</Badge>
            <Badge variant="secondary">SEC Registered</Badge>
            <Badge variant="secondary">Bank-Level Security</Badge>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Everything You Need to Start Investing
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform makes investing simple, affordable, and automatic
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <feature.icon className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Why Choose InvestMate?
            </h3>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
            <Button 
              className="mt-8" 
              size="lg"
              onClick={() => navigate('/auth')}
            >
              Start Investing Today
            </Button>
          </div>
          
          <Card className="p-8">
            <CardHeader>
              <CardTitle className="text-xl">See How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Connect Your Bank</h4>
                  <p className="text-sm text-muted-foreground">
                    Securely link your checking account in seconds
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Spend Normally</h4>
                  <p className="text-sm text-muted-foreground">
                    Make purchases with your linked debit card
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Invest Automatically</h4>
                  <p className="text-sm text-muted-foreground">
                    We round up purchases and invest the spare change
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Investment Education Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            <BookOpen className="inline-block mr-3 h-8 w-8 text-primary" />
            Beginner's Guide to Investing
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            New to investing? Don't worry! Here's everything you need to know to start building wealth through smart investing decisions.
          </p>
        </div>

        {/* Investment Fundamentals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="p-6">
            <CardHeader>
              <Target className="h-10 w-10 text-primary mb-3" />
              <CardTitle className="text-xl">What is Investing?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Investing means putting your money into assets that can grow in value over time, like stocks, bonds, and ETFs.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Stocks:</strong> Own shares in companies</li>
                <li>• <strong>Bonds:</strong> Loan money to governments/companies</li>
                <li>• <strong>ETFs:</strong> Diversified funds tracking markets</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <Clock className="h-10 w-10 text-primary mb-3" />
              <CardTitle className="text-xl">When to Invest?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                The best time to start investing is now! Time in the market beats timing the market.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Start as early as possible</li>
                <li>• Invest regularly (dollar-cost averaging)</li>
                <li>• Don't wait for "perfect" timing</li>
                <li>• Think long-term (5+ years)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <DollarSign className="h-10 w-10 text-primary mb-3" />
              <CardTitle className="text-xl">How Much to Invest?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Start small and increase gradually. Even $5/month can grow significantly over time.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Emergency fund first (3-6 months expenses)</li>
                <li>• Start with what you can afford</li>
                <li>• Aim for 10-20% of income</li>
                <li>• Automate your investments</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Investment Strategies */}
        <div className="bg-muted/50 rounded-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            <BarChart3 className="inline-block mr-3 h-7 w-7 text-primary" />
            Investment Strategies for Beginners
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Conservative (Beginner)</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Focus on stability and steady growth
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• 40% Stocks, 60% Bonds</li>
                <li>• Lower risk, steady returns</li>
                <li>• Perfect for new investors</li>
              </ul>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Moderate (Balanced)</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Balance growth with some stability
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• 70% Stocks, 30% Bonds</li>
                <li>• Moderate risk and returns</li>
                <li>• Good long-term strategy</li>
              </ul>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 dark:bg-orange-900/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Aggressive (Growth)</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Maximum growth potential
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• 90% Stocks, 10% Bonds</li>
                <li>• Higher risk, higher returns</li>
                <li>• For experienced investors</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Key Principles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-3" />
              <CardTitle className="text-xl">Golden Rules of Investing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-sm">Diversify Your Portfolio</h5>
                    <p className="text-xs text-muted-foreground">Don't put all eggs in one basket - spread risk across different assets</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-sm">Invest Regularly</h5>
                    <p className="text-xs text-muted-foreground">Dollar-cost averaging reduces risk by investing the same amount regularly</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-sm">Think Long-Term</h5>
                    <p className="text-xs text-muted-foreground">Short-term volatility is normal - focus on long-term growth</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-sm">Keep Costs Low</h5>
                    <p className="text-xs text-muted-foreground">High fees can eat into returns - choose low-cost index funds and ETFs</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6 bg-primary/5">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-primary mb-3" />
              <CardTitle className="text-xl">Why InvestMate is Perfect for Beginners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm">Automatic Investing</h5>
                    <p className="text-xs text-muted-foreground">Round-ups invest for you - no need to remember</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm">Professional Portfolios</h5>
                    <p className="text-xs text-muted-foreground">Expert-designed allocations using low-cost ETFs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm">Start Small</h5>
                    <p className="text-xs text-muted-foreground">Begin with spare change - no large minimums required</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm">Learn as You Grow</h5>
                    <p className="text-xs text-muted-foreground">Track your progress and learn investing fundamentals</p>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-6" onClick={() => navigate('/auth')}>
                Start Your Investment Journey
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Start Building Wealth?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already investing their spare change and building their financial future.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-3"
            onClick={() => navigate('/auth')}
          >
            Get Started - It's Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
