'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Alert from '@/components/Alert';
import ProfileGuard from '@/components/ProfileGuard';

// Premium loading component with consistent design
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <div className="text-center">
      <div className="relative">
        {/* Animated logo */}
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
          </svg>
        </div>
        {/* Spinner ring */}
        <div className="absolute inset-0 -m-2">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
      <p className="text-gray-600 font-medium">Loading your dashboard...</p>
    </div>
  </div>
);

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useSelector((state: any) => state.users?.isAuthenticated);
  const loading = useSelector((state: any) => state.users?.loading);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated (after loading completes)
    if (!loading && isAuthenticated === false && !isRedirecting) {
      setIsRedirecting(true);
      router.replace('/login');
    }
  }, [isAuthenticated, loading, router, isRedirecting]);

  // Show loading while checking authentication
  if (loading || isAuthenticated === null) {
    return <LoadingScreen />;
  }

  // Don't render protected content if not authenticated or redirecting
  if (!isAuthenticated || isRedirecting) {
    return <LoadingScreen />;
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
