'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Alert from '@/components/Alert';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Alert />
      <Navbar />
      <Sidebar />
      {children}
    </>
  );
}
