import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, TrendingUp, DollarSign } from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { usePortfolio } from '@/hooks/usePortfolio';

interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'investment' | 'roundup';
  timestamp: Date;
  read: boolean;
  icon: React.ReactNode;
}

export function NotificationCenter() {
  const { totalRoundUps, transactions } = useTransactions();
  const { totalValue, investments } = usePortfolio();
  
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const notifs: Notification[] = [];
    
    // Round-up notifications
    if (totalRoundUps > 5) {
      notifs.push({
        id: 'roundup-ready',
        title: 'Round-ups Ready!',
        description: `You have $${totalRoundUps.toFixed(2)} ready to invest`,
        type: 'roundup',
        timestamp: new Date(),
        read: false,
        icon: <DollarSign className="h-4 w-4" />
      });
    }

    // Recent investment notifications
    const recentInvestments = investments.filter(inv => {
      const investmentDate = new Date(inv.created_at);
      const dayAgo = new Date();
      dayAgo.setDate(dayAgo.getDate() - 1);
      return investmentDate > dayAgo;
    });

    recentInvestments.forEach(investment => {
      notifs.push({
        id: `investment-${investment.id}`,
        title: 'Investment Executed',
        description: `Invested $${(investment.total_value || 0).toFixed(2)} in ${investment.symbol}`,
        type: 'success',
        timestamp: new Date(investment.created_at),
        read: false,
        icon: <CheckCircle className="h-4 w-4" />
      });
    });

    // Portfolio performance notifications
    if (totalValue > 100) {
      const gainLoss = totalValue - investments.reduce((sum, inv) => sum + (inv.avg_cost_per_share * inv.shares), 0);
      if (gainLoss > 0) {
        notifs.push({
          id: 'performance-gain',
          title: 'Portfolio Growing!',
          description: `Your portfolio is up $${gainLoss.toFixed(2)}`,
          type: 'investment',
          timestamp: new Date(),
          read: false,
          icon: <TrendingUp className="h-4 w-4" />
        });
      }
    }

    // Welcome notification for new users
    if (notifications.length === 0 && transactions.length === 0) {
      notifs.push({
        id: 'welcome',
        title: 'Welcome to Round-Up Investing!',
        description: 'Add your first transaction to start building your investment portfolio',
        type: 'info',
        timestamp: new Date(),
        read: false,
        icon: <Bell className="h-4 w-4" />
      });
    }

    return notifs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'default';
      case 'investment': return 'secondary';
      case 'roundup': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="px-2 py-1 text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </div>
        <CardDescription>Stay updated on your investments and round-ups</CardDescription>
      </CardHeader>
      <CardContent>
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                  !notification.read ? 'bg-primary/5 border-primary/20' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className={`p-1 rounded-full ${
                  notification.type === 'success' ? 'bg-green-100 text-green-600' :
                  notification.type === 'investment' ? 'bg-blue-100 text-blue-600' :
                  notification.type === 'roundup' ? 'bg-orange-100 text-orange-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {notification.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <Badge variant={getNotificationColor(notification.type)} className="text-xs">
                      {notification.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {notification.timestamp.toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No notifications yet. Your investment updates will appear here.
          </p>
        )}
      </CardContent>
    </Card>
  );
}