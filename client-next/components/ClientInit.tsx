'use client';

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, authCheckComplete } from '@/lib/redux/modules/users';
import { getCurrentProfile } from '@/lib/redux/modules/profiles';
import { fetchTrackedInternships } from '@/lib/redux/modules/tracking';
import { setAuthToken } from '@/lib/utils';
import LoadingFavicon from "./LoadingFavicon";

const ClientInit = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.users.token);
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
    } else {
      // If no token, we still need to signal that auth check is complete
      // This prevents infinite loading state
      dispatch(authCheckComplete() as any);
    }
  }, [dispatch, token]);

  return <LoadingFavicon />;
};

export default ClientInit;
