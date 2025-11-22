'use client';

import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import Link from 'next/link';

/**
 * ProfileGuard - Shows ProfileRequired for users without profiles
 * Allows access only to: /create-profile, /edit-profile, /settings, /profile/[id] (own profile)
 */
export default function ProfileGuard({ children }) {
  const pathname = usePathname();
  const profile = useSelector((state) => state.profiles.profile);
  const user = useSelector((state) => state.users.user);
  const loading = useSelector((state) => state.profiles.loading);

  // Wait for profile to load OR if profile is undefined (initial state)
  if (loading || profile === undefined) {
    return (
      <div className="pt-20 lg:pl-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <i className="fas fa-user text-blue-600 text-xl"></i>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Your Profile</h3>
          <p className="text-gray-600 text-sm">Please wait while we prepare your workspace...</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // If user has a profile, allow all routes
  if (profile) {
    return <>{children}</>;
  }

  // Allowed routes for users without profiles
  const allowedRoutes = [
    '/create-profile',
    '/edit-profile',
    '/settings',
  ];

  // Allow own profile page
  const isOwnProfilePage = user && pathname === `/profile/${user._id}`;

  // Check if current route is allowed
  const isAllowedRoute = allowedRoutes.some(route => pathname.startsWith(route)) || isOwnProfilePage;

  // If allowed route, show the page
  if (isAllowedRoute) {
    return <>{children}</>;
  }

  // Otherwise, show ProfileRequired component
  return (
    <div className="pt-20 lg:pl-16 min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 text-center">
          {/* Icon */}
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-user-circle text-blue-600 text-5xl"></i>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Profile Required
          </h1>
          
          {/* Description */}
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            Create your profile to unlock all features and start connecting with opportunities
          </p>

          {/* Main CTA Button */}
          <Link href="/create-profile"
            className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 mb-4"
          >
            <i className="fas fa-plus-circle mr-3 text-xl"></i>
            Create Your Profile
          </Link>

          {/* Time indicator */}
          <p className="text-gray-500 text-sm mb-8">
            <i className="fas fa-clock mr-2"></i>
            Takes only 3-5 minutes
          </p>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">What you'll get</span>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-briefcase text-blue-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Find Internships</h3>
              <p className="text-xs text-gray-600">Browse opportunities</p>
            </div>

            <div className="p-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-users text-green-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Network</h3>
              <p className="text-xs text-gray-600">Connect with others</p>
            </div>

            <div className="p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-chart-line text-purple-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Track Progress</h3>
              <p className="text-xs text-gray-600">Monitor applications</p>
            </div>
          </div>

          {/* Secondary link */}
          <Link href="/settings"
            className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
          >
            <i className="fas fa-cog mr-2"></i>
            Go to Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
