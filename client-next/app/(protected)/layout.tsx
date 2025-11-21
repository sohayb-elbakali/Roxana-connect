'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Alert from '@/components/Alert';
import ProfileGuard from '@/components/ProfileGuard';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProfileGuard>
      <Alert />
      <Navbar />
      <Sidebar />
      <div className="page-content">
        {children}
      </div>
    </ProfileGuard>
  );
}
