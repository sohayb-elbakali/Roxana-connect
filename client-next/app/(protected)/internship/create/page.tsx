import { InternshipForm } from '@/components/Internships';
import ProfileRequired from '@/components/ProfileRequired';

export default function CreateInternshipPage() {
  return <ProfileRequired component={InternshipForm} />;
}
