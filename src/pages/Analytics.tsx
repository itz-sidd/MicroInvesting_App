import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PortfolioAnalytics } from '@/components/analytics/PortfolioAnalytics';

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Track your investment performance and portfolio insights
          </p>
        </div>

        <PortfolioAnalytics />
      </div>
    </DashboardLayout>
  );
}