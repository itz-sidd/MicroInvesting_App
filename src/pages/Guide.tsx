import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Target, 
  Clock, 
  DollarSign, 
  BarChart3, 
  Users,
  CheckCircle,
  TrendingUp,
  Shield,
  PiggyBank
} from 'lucide-react';

export default function Guide() {
  const investmentBasics = [
    {
      icon: Target,
      title: "Set Clear Goals",
      description: "Define what you're investing for - retirement, house down payment, or building wealth.",
      tips: ["Start with emergency fund", "Define timeline", "Set realistic targets"]
    },
    {
      icon: Clock,
      title: "Start Early",
      description: "Time is your greatest asset. The earlier you start, the more compound interest works for you.",
      tips: ["Even $25/month helps", "Consistency beats timing", "Don't wait for 'perfect' time"]
    },
    {
      icon: BarChart3,
      title: "Diversify Your Portfolio",
      description: "Don't put all eggs in one basket. Spread risk across different asset classes.",
      tips: ["Mix stocks and bonds", "Consider international markets", "Include different sectors"]
    }
  ];

  const whenToInvest = [
    {
      title: "After Building Emergency Fund",
      description: "Save 3-6 months of expenses before investing"
    },
    {
      title: "When You Have Stable Income",
      description: "Ensure steady cash flow to invest consistently"
    },
    {
      title: "For Long-term Goals (5+ years)",
      description: "Investing works best over longer time horizons"
    }
  ];

  const whereToInvest = [
    {
      title: "Index Funds & ETFs",
      description: "Low-cost, diversified funds tracking market indices",
      risk: "Low to Medium"
    },
    {
      title: "Individual Stocks",
      description: "Direct ownership in specific companies",
      risk: "Medium to High"
    },
    {
      title: "Bonds",
      description: "Fixed-income securities for stable returns",
      risk: "Low"
    },
    {
      title: "Real Estate (REITs)",
      description: "Property investment through Real Estate Investment Trusts",
      risk: "Medium"
    }
  ];

  const goldenRules = [
    "Never invest money you can't afford to lose",
    "Diversification reduces risk",
    "Time in market beats timing the market",
    "Keep fees low with index funds",
    "Stay calm during market volatility",
    "Invest regularly, not just when markets are up"
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Beginner's Guide to Investing</h1>
          <p className="text-muted-foreground mt-2">
            Learn the fundamentals of smart investing and building long-term wealth
          </p>
        </div>

        {/* Investment Basics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Investment Basics
            </CardTitle>
            <CardDescription>
              Master these fundamental concepts before you start investing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
              {investmentBasics.map((basic, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <basic.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{basic.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{basic.description}</p>
                  <ul className="space-y-1">
                    {basic.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* When to Invest */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              When Should You Start Investing?
            </CardTitle>
            <CardDescription>
              Make sure you're financially ready before investing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {whenToInvest.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <div className="mt-1">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Where to Invest */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Where to Invest Your Money
            </CardTitle>
            <CardDescription>
              Different investment options for different risk levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {whereToInvest.map((option, index) => (
                <div key={index} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{option.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                    </div>
                    <Badge variant={option.risk === 'Low' ? 'secondary' : option.risk === 'Medium' ? 'default' : 'destructive'}>
                      {option.risk} Risk
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How InvestMate Helps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5" />
              How InvestMate Makes Investing Easy
            </CardTitle>
            <CardDescription>
              Our platform simplifies investing for beginners
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <PiggyBank className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Automatic Round-ups</h3>
                <p className="text-sm text-muted-foreground">
                  Invest spare change from everyday purchases without thinking about it
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Diversified Portfolios</h3>
                <p className="text-sm text-muted-foreground">
                  Professional portfolio management with low-cost ETFs
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Low Minimum</h3>
                <p className="text-sm text-muted-foreground">
                  Start investing with just your spare change - no large minimum required
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Golden Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Golden Rules of Investing
            </CardTitle>
            <CardDescription>
              Follow these principles for successful long-term investing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {goldenRules.map((rule, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-foreground">{rule}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}