import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  PiggyBank,
  Smartphone,
  CreditCard,
  Wallet,
  ArrowUpDown,
  AlertCircle,
  HelpCircle,
  Settings,
  Lock,
  Banknote
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

  const businessModel = [
    {
      title: "Monthly Subscription",
      description: "$1-3/month covers all services",
      detail: "Instead of charging per trade, we use a flat monthly fee",
      icon: DollarSign
    },
    {
      title: "Interest on Cash",
      description: "Earn interest on uninvested balances",
      detail: "We share interest earned on your cash holdings with you",
      icon: PiggyBank
    },
    {
      title: "Transparent Pricing",
      description: "No hidden fees or surprises",
      detail: "All costs are clearly disclosed upfront",
      icon: Shield
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

  const howAppWorks = [
    {
      step: "1",
      title: "Create Your Account",
      description: "Sign up securely and complete profile verification",
      icon: Users
    },
    {
      step: "2", 
      title: "Link Your Bank Account",
      description: "Connect your bank account safely using bank-grade encryption",
      icon: CreditCard
    },
    {
      step: "3",
      title: "Set Your Investment Goals",
      description: "Choose risk level and investment preferences",
      icon: Target
    },
    {
      step: "4",
      title: "Start Investing",
      description: "Make one-time investments or set up automatic round-ups",
      icon: TrendingUp
    }
  ];

  const moneyManagement = [
    {
      title: "Adding Money",
      description: "Transfer funds from your linked bank account instantly",
      methods: ["Bank transfer", "Automatic round-ups", "Recurring deposits"],
      icon: Wallet
    },
    {
      title: "Withdrawing Money", 
      description: "Withdraw your funds anytime without penalties",
      methods: ["Instant withdrawals to bank", "No withdrawal fees", "Available 24/7"],
      icon: ArrowUpDown
    },
    {
      title: "Security",
      description: "Your money is protected with industry-standard security",
      methods: ["FDIC insured", "256-bit encryption", "Two-factor authentication"],
      icon: Lock
    }
  ];

  const faqs = [
    {
      question: "Is my money safe?",
      answer: "Yes, we use bank-grade security and your investments are FDIC insured up to $250,000. We never store your bank login credentials."
    },
    {
      question: "How much do I need to start?",
      answer: "You can start investing with as little as $1. Our round-up feature lets you invest spare change from everyday purchases."
    },
    {
      question: "When can I withdraw my money?",
      answer: "You can withdraw your money anytime without penalties. Withdrawals typically take 1-3 business days to reach your bank account."
    },
    {
      question: "What fees do you charge?",
      answer: "We charge a low monthly subscription fee of $1-3 depending on your account type. This covers all trading, rebalancing, and withdrawals. We don't charge per-transaction fees, which saves you money compared to traditional brokers."
    },
    {
      question: "How do you make money with 'no trading fees'?",
      answer: "We use a subscription model instead of per-trade fees. We also earn interest on uninvested cash balances and may receive small payments for order routing (which is disclosed and doesn't affect your execution quality)."
    },
    {
      question: "How are my investments managed?",
      answer: "We use diversified ETF portfolios managed by algorithms and overseen by financial experts. You can choose from conservative to aggressive risk levels."
    },
    {
      question: "Can I lose money?",
      answer: "Yes, all investments carry risk. However, our diversified portfolios help minimize risk, and historically, long-term investing has been profitable."
    }
  ];

  const userExpectations = [
    {
      title: "Realistic Returns",
      description: "Expect 6-10% annual returns over the long term",
      expectation: "Patience is key - investing is for 5+ year goals",
      icon: BarChart3
    },
    {
      title: "Market Volatility",
      description: "Your portfolio value will go up and down",
      expectation: "Short-term fluctuations are normal and expected",
      icon: TrendingUp
    },
    {
      title: "Gradual Growth", 
      description: "Wealth building takes time and consistency",
      expectation: "Small, regular investments compound over time",
      icon: PiggyBank
    }
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

        {/* How the App Works */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              How InvestMate Works
            </CardTitle>
            <CardDescription>
              Get started with investing in 4 simple steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {howAppWorks.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <step.icon className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Business Model Transparency */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              How We Make Money (Transparency)
            </CardTitle>
            <CardDescription>
              Understanding our business model and why we can offer "no trading fees"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {businessModel.map((item, index) => (
                <div key={index} className="space-y-3 p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-foreground">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800 mb-1">The Truth About "Free" Trading</h4>
                  <p className="text-sm text-amber-700">
                    Most "free" trading apps make money through payment for order flow (selling your order data), 
                    uninvested cash interest, or expensive premium features. We believe in transparent, 
                    subscription-based pricing instead.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Money Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5" />
              Managing Your Money
            </CardTitle>
            <CardDescription>
              How to add, invest, and withdraw your funds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {moneyManagement.map((item, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <ul className="space-y-1">
                    {item.methods.map((method, methodIndex) => (
                      <li key={methodIndex} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-muted-foreground">{method}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Setting Expectations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              What to Expect as an Investor
            </CardTitle>
            <CardDescription>
              Realistic expectations for your investment journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {userExpectations.map((item, index) => (
                <div key={index} className="space-y-3 p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs font-medium text-foreground">{item.expectation}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Frequently Asked Questions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>
              Clear answers to common questions about investing with InvestMate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                  {index < faqs.length - 1 && <Separator className="mt-4" />}
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