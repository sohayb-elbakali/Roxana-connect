'use client';

import { useRouter as useNextRouter, useParams as useNextParams } from 'next/navigation';

// Wrapper to make migration easier - provides similar API to react-router-dom
export function useNavigate() {
  const router = useNextRouter();
  
  return (path: string) => {
    router.push(path);
  };
}

export function useParams() {
  return useNextParams();
}

export function useRouter() {
  return useNextRouter();
}
