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
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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
    <div className="pt-20 lg:pl-16 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-8">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-10 text-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full -mr-24 -mt-24"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-16 -mb-16"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl animate-pulse">
                <i className="fas fa-briefcase text-blue-600 text-3xl"></i>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome to Roxana Connect!
              </h1>
              <p className="text-blue-100 text-lg">
                Your journey to professional success starts here
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Complete Your Profile to Get Started
              </h2>
              <p className="text-gray-600">
                Unlock all features by creating your professional profile
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <i className="fas fa-user-circle text-white text-xl"></i>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Build Profile</h3>
                <p className="text-xs text-gray-600">Showcase your skills</p>
              </div>

              <div className="text-center p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors duration-200">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <i className="fas fa-briefcase text-white text-xl"></i>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Find Internships</h3>
                <p className="text-xs text-gray-600">Discover opportunities</p>
              </div>

              <div className="text-center p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors duration-200">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <i className="fas fa-network-wired text-white text-xl"></i>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Connect & Grow</h3>
                <p className="text-xs text-gray-600">Network with pros</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-4 mb-6 shadow-sm">
              <div className="flex items-start">
                <i className="fas fa-exclamation-circle text-yellow-600 text-xl flex-shrink-0 mt-0.5"></i>
                <div className="ml-3">
                  <h4 className="font-bold text-gray-900 mb-1">Profile Required</h4>
                  <p className="text-sm text-gray-700">
                    Create your profile to access this feature. Takes only <strong>3-5 minutes</strong>!
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/create-profile"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <i className="fas fa-user-plus mr-2"></i>
                Create Profile Now
              </Link>
              <Link href="/settings"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-bold rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <i className="fas fa-cog mr-2"></i>
                Settings
              </Link>
            </div>

            <p className="text-center text-gray-500 mt-4 text-xs">
              <i className="fas fa-clock mr-1"></i>
              Quick setup • 3-5 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
