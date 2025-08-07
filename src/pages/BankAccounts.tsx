import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ConnectBankAccount } from '@/components/bank/ConnectBankAccount';

export default function BankAccounts() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bank Accounts</h1>
          <p className="text-muted-foreground mt-2">
            Connect and manage your bank accounts for automatic transaction tracking
          </p>
        </div>

        <ConnectBankAccount />
      </div>
    </DashboardLayout>
  );
}