'use client';

import { useEffect } from 'react';
import Home from '@/components/Home';

export default function HomePage() {
  useEffect(() => {
    // Scroll to top when the page loads
    window.scrollTo(0, 0);
  }, []);

  return <Home />;
}
