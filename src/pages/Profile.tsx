import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { AllocationSettings } from '@/components/investment/AllocationSettings';

// Profile page component
export default function Profile() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile & Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account information and investment preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfileForm />
          <AllocationSettings />
        </div>
      </div>
    </DashboardLayout>
  );
}