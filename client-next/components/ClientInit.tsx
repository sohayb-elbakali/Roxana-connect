'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '@/lib/redux/modules/users';
import { setAuthToken } from '@/lib/utils';

export default function ClientInit() {
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.users?.token);

  useEffect(() => {
    // Set token from Redux state (after rehydration) or localStorage
    const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    
    if (authToken) {
      setAuthToken(authToken);
      // Only load user if we don't have user data yet
      dispatch(loadUser() as any);
    }
  }, [dispatch, token]);

  return null;
}
