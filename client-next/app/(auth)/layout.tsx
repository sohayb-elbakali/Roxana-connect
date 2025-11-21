'use client';

import { useEffect } from 'react';
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

  useEffect(() => {
    // Don't redirect while loading or on verify-email/reset-password pages
    if (loading) return;
    
    const isVerifyOrReset = pathname.startsWith('/verify-email') || pathname.startsWith('/reset-password');
    
    // Only redirect authenticated users from login/register pages
    if (isAuthenticated && !isVerifyOrReset) {
      router.replace('/home');
    }
  }, [isAuthenticated, loading, pathname, router]);

  return <>{children}</>;
}
