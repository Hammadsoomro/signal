import { DashboardLayout } from '@/components/DashboardLayout';
import { Placeholder } from '@/components/Placeholder';

export default function Wallet() {
  return (
    <DashboardLayout title="Wallet Management">
      <Placeholder title="Wallet Management" description="Manage your wallet balance for SMS and number purchases" />
    </DashboardLayout>
  );
}
