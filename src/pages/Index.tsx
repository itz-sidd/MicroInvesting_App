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
  CheckCircle
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
