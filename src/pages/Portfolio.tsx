import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PortfolioOverview } from '@/components/portfolio/PortfolioOverview';

export default function Portfolio() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Portfolio</h1>
          <p className="text-muted-foreground mt-2">
            Track your investments and portfolio performance
          </p>
        </div>

        <PortfolioOverview />
      </div>
    </DashboardLayout>
  );
}