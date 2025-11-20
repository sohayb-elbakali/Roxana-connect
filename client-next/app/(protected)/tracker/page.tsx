import { TrackerDashboard } from '@/components/Tracker';
import ProfileRequired from '@/components/ProfileRequired';

export default function TrackerPage() {
  return <ProfileRequired component={TrackerDashboard} />;
}
