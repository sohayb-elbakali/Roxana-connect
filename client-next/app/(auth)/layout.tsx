'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useSelector((state: any) => state.users?.isAuthenticated);
  const loading = useSelector((state: any) => state.users?.loading);
  const [isChecking, setIsChecking] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Mark checking as complete when loading finishes
    if (!loading) {
      setIsChecking(false);
    }
  }, [loading]);

  useEffect(() => {
    // Don't redirect while loading or on verify-email/reset-password pages
    if (loading || isRedirecting) return;

    const isVerifyOrReset = pathname.startsWith('/verify-email') || pathname.startsWith('/reset-password');

    // Only redirect authenticated users from login/register pages
    if (isAuthenticated && !isVerifyOrReset) {
      setIsRedirecting(true);
      router.replace('/home');
    }
  }, [isAuthenticated, loading, pathname, router, isRedirecting]);

  // Show nothing during initial check (PersistGate handles loading)
  // This prevents any flash of content before auth state is known
  if (isChecking && loading) {
    return null;
  }

  // If we're redirecting, show a brief transition
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
