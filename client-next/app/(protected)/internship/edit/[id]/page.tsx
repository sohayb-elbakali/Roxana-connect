import { InternshipForm } from '@/components/Internships';
import ProfileRequired from '@/components/ProfileRequired';

export default function EditInternshipPage() {
  return <ProfileRequired component={InternshipForm} />;
}
