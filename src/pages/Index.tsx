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
  Users,
  Heart,
  Star,
  Coffee
} from 'lucide-react';
import heroBackground from '@/assets/hero-background.jpg';

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
      icon: Coffee,
      title: 'Your Daily Coffee, Your Future Wealth',
      description: 'That $4.50 latte? We turn the spare change from every purchase into smart investments. It\'s like having a financial advisor in your pocket.'
    },
    {
      icon: Heart,
      title: 'Built by Humans, for Humans',
      description: 'No confusing jargon or intimidating interfaces. We believe investing should feel as natural as checking your texts.'
    },
    {
      icon: Shield,
      title: 'Your Money, Our Promise',
      description: 'Sleep soundly knowing your investments are protected with the same security standards banks use. Because trust isn\'t optional.'
    },
    {
      icon: Star,
      title: 'Start Small, Dream Big',
      description: 'Whether you\'re saving for a vacation or retirement, every journey begins with a single step. We\'ll be with you for the entire ride.'
    }
  ];

  const benefits = [
    'Begin your journey with just the change from your morning coffee',
    'Zero fees means more money working for you, not against you',
    'We handle the complex stuff so you can focus on living your life',
    'Smart algorithms work behind the scenes to optimize your returns',
    'Watch your wealth grow in real-time, one purchase at a time'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-6 border border-white/20">
                <PiggyBank className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Every Purchase,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                A Step Closer
              </span><br />
              to Your Dreams
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              What if we told you that your morning coffee could fund your retirement? 
              That your grocery runs could pay for your dream vacation? Welcome to the future 
              of investing—where every penny counts and every purchase matters.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button 
                size="lg" 
                className="text-lg px-12 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white border-0 shadow-2xl transform hover:scale-105 transition-all duration-300"
                onClick={() => navigate('/auth')}
              >
                Start Your Journey
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-12 py-4 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 shadow-xl"
                onClick={() => navigate('/auth')}
              >
                I'm Already Dreaming
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 border border-white/20">
                <span className="text-white/90">✨ SIPC Protected</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 border border-white/20">
                <span className="text-white/90">🛡️ SEC Registered</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 border border-white/20">
                <span className="text-white/90">🔒 Bank-Level Security</span>
              </div>
            </div>
            
            <div className="mt-16 text-white/70 text-sm">
              <p className="italic">
                "The best investment you can make is in yourself... and your spare change." 
                <br />— Over 50,000 happy dreamers and counting
              </p>
            </div>
          </div>
        </div>
        
        {/* Floating elements for visual appeal */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-yellow-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-6 h-6 bg-orange-500 rounded-full opacity-40 animate-pulse delay-300"></div>
        <div className="absolute bottom-40 left-1/4 w-3 h-3 bg-white rounded-full opacity-50 animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-1/3 w-5 h-5 bg-yellow-300 rounded-full opacity-30 animate-pulse delay-1000"></div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Why People Fall in Love with InvestMate
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We didn't just build an app—we crafted an experience that makes you excited 
            about your financial future. Here's what makes our community so passionate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-card to-card/50 border-2 border-primary/10 hover:border-primary/30">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-br from-primary/20 to-primary/40 rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-center group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                The Difference Is in the Details
              </h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We sweat the small stuff so you don't have to. Every feature, every interaction, 
                every notification is designed with one goal: making your financial future brighter.
              </p>
            </div>
            
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors duration-300">
                  <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-full p-1 flex-shrink-0 mt-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-foreground text-lg leading-relaxed">{benefit}</span>
                </div>
              ))}
            </div>
            
            <Button 
              className="mt-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-lg px-8 py-3 shadow-lg transform hover:scale-105 transition-all duration-300" 
              size="lg"
              onClick={() => navigate('/auth')}
            >
              Start Your Success Story
              <Heart className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center mb-4">
                It's Easier Than Ordering Pizza 🍕
              </CardTitle>
              <p className="text-center text-muted-foreground">
                Seriously, we timed it. Most people set up their account faster than choosing toppings.
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-start gap-6 p-4 rounded-lg bg-background/50">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Connect & Relax</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Link your bank account with our military-grade security. Takes 30 seconds, 
                    lasts a lifetime. We're more protective of your data than you are of your Netflix password.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-6 p-4 rounded-lg bg-background/50">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Live Your Life</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Buy your coffee, grab groceries, treat yourself to dinner. We're silently 
                    working in the background, turning your everyday spending into tomorrow's wealth.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-6 p-4 rounded-lg bg-background/50">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Watch Magic Happen</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Every purchase gets rounded up, and that spare change goes straight into 
                    a diversified portfolio. It's like having a financial fairy godmother.
                  </p>
                </div>
              </div>
              
              <div className="text-center pt-4 border-t border-primary/20">
                <p className="text-sm text-muted-foreground italic">
                  Average setup time: 2 minutes<br />
                  Average "wow, this is actually working" moment: 1 week
                </p>
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
