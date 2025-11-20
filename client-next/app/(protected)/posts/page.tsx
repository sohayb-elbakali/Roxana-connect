import Posts from '@/components/Posts/Posts';
import ProfileRequired from '@/components/ProfileRequired';

export default function PostsPage() {
  return <ProfileRequired component={Posts} />;
}
