import Post from '@/components/Posts/Post';
import ProfileRequired from '@/components/ProfileRequired';

export default function PostPage() {
  return <ProfileRequired component={Post} />;
}
