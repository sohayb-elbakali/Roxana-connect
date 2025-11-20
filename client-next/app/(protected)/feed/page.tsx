import { InternshipFeed } from '@/components/Internships';
import ProfileRequired from '@/components/ProfileRequired';

export default function FeedPage() {
  return <ProfileRequired component={InternshipFeed} />;
}
