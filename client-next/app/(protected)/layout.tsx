'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Alert from '@/components/Alert';
import ProfileGuard from '@/components/ProfileGuard';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useSelector((state: any) => state.users?.isAuthenticated);
  const loading = useSelector((state: any) => state.users?.loading);

  useEffect(() => {
    // Redirect to login if not authenticated (after loading completes)
    if (!loading && isAuthenticated === false) {
      router.replace('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading while checking authentication
  if (loading || isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render protected content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <ProfileGuard>
      <Alert />
      <Navbar />
      <Sidebar />
      <div className="page-content pt-16 lg:ml-16 min-h-screen">
        {children}
      </div>
    </ProfileGuard>
  );
}
