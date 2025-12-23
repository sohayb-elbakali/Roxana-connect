'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, authCheckComplete } from '@/lib/redux/modules/users';
import { getCurrentProfile } from '@/lib/redux/modules/profiles';
import { fetchTrackedInternships } from '@/lib/redux/modules/tracking';
import { setAuthToken } from '@/lib/utils';
import LoadingFavicon from "./LoadingFavicon";

const ClientInit = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.users.token);
  const isAuthenticated = useSelector((state: any) => state.users.isAuthenticated);
  const hasInitialized = useRef(false);
  const isInitializing = useRef(false);

  const initializeAuth = useCallback(async () => {
    // Prevent multiple concurrent initializations
    if (isInitializing.current) return;
    isInitializing.current = true;

    try {
      // Set token from Redux state or localStorage
      const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

      if (authToken) {
        setAuthToken(authToken);
        // Load user data first, then load profile and tracking in parallel
        await dispatch(loadUser() as any);

        // Load profile and tracking data in parallel for faster loading
        await Promise.all([
          dispatch(getCurrentProfile() as any),
          dispatch(fetchTrackedInternships() as any)
        ]);
      } else {
        // If no token, signal that auth check is complete
        dispatch(authCheckComplete() as any);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      dispatch(authCheckComplete() as any);
    } finally {
      isInitializing.current = false;
    }
  }, [dispatch, token]);

  useEffect(() => {
    // Only run once on mount
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    initializeAuth();
  }, [initializeAuth]);

  return <LoadingFavicon />;
};

export default ClientInit;
