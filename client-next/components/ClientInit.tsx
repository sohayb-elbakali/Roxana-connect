'use client';

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '@/lib/redux/modules/users';
import { getCurrentProfile } from '@/lib/redux/modules/profiles';
import { fetchTrackedInternships } from '@/lib/redux/modules/tracking';
import { setAuthToken } from '@/lib/utils';

export default function ClientInit() {
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.users?.token);
  const user = useSelector((state: any) => state.users?.user);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only run once on mount
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Set token from Redux state or localStorage
    const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    
    if (authToken) {
      setAuthToken(authToken);
      // Load user, profile, and tracking data if we have a token
      dispatch(loadUser() as any);
      dispatch(getCurrentProfile() as any);
      dispatch(fetchTrackedInternships() as any);
    }
  }, [dispatch, token]);

  return null;
}
