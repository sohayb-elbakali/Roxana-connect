'use client';

import { connect, useSelector } from "react-redux";
import Link from "next/link";
import HomeFeed from "./Home/HomeFeed";
import HomeSkeleton from "./Home/HomeSkeleton";

const QuickStatCard = ({ icon, iconBg, label, value, link, linkText }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {link && (
          <Link href={link} className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 inline-flex items-center gap-1">
            {linkText}
            <i className="fas fa-chevron-right text-[10px]"></i>
          </Link>
        )}
      </div>
      <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
    </div>
  </div>
);

const QuickActionButton = ({ href, icon, label, description }) => (
  <Link
    href={href}
    className="flex items-center gap-4 p-4 bg-white hover:bg-gray-50 rounded-xl border border-gray-100"
  >
    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-gray-900 text-sm">{label}</p>
      <p className="text-xs text-gray-500 truncate">{description}</p>
    </div>
    <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
  </Link>
);

const Home = ({
  profiles: { profile, loading },
  users: { user }
}) => {
  const tracking = useSelector((state) => state.tracking);
  const trackedCount = tracking?.items?.length || 0;

  const firstName = user?.name?.split(' ')[0] || 'there';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {loading || profile === undefined ? (
        <HomeSkeleton />
      ) : profile === null ? (
        // No Profile - Create Profile CTA
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            {/* Header with gradient */}
            <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-center">
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <i className="fas fa-briefcase text-blue-600 text-3xl"></i>
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">
                  Welcome to Roxana Connect!
                </h1>
                <p className="text-blue-100 text-lg max-w-md mx-auto">
                  Your journey to professional success starts here
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Let's Create Your Profile
                </h2>
                <p className="text-gray-600 text-lg">
                  Set up your professional profile to unlock all features
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-user text-blue-600 text-2xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Build Your Profile</h3>
                  <p className="text-sm text-gray-600">Showcase your skills and experience</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-briefcase text-green-600 text-2xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Find Internships</h3>
                  <p className="text-sm text-gray-600">Discover opportunities that match you</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-users text-purple-600 text-2xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Connect & Grow</h3>
                  <p className="text-sm text-gray-600">Network with professionals</p>
                </div>
              </div>

              <div className="text-center">
                <Link
                  href="/create-profile"
                  className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <i className="fas fa-plus"></i>
                  Create Your Profile Now
                </Link>
                <p className="text-sm text-gray-500 mt-4">
                  <i className="fas fa-clock mr-1"></i>
                  Takes only 3-5 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Has Profile - Main Dashboard
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Welcome Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {getGreeting()}, {firstName}!
                </h1>
                <p className="text-gray-500 mt-1">Here's what's happening in your network</p>
              </div>
              <Link
                href="/feed"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
              >
                <i className="fas fa-search"></i>
                Find Internships
              </Link>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <QuickStatCard
              icon={<i className="fas fa-clipboard-list text-blue-600 text-xl"></i>}
              iconBg="bg-blue-50"
              label="Applications"
              value={trackedCount}
              link="/tracker"
              linkText="View tracker"
            />
            <QuickStatCard
              icon={<i className="fas fa-briefcase text-green-600 text-xl"></i>}
              iconBg="bg-green-50"
              label="Opportunities"
              value="Browse"
              link="/feed"
              linkText="Explore jobs"
            />
            <QuickStatCard
              icon={<i className="fas fa-users text-purple-600 text-xl"></i>}
              iconBg="bg-purple-50"
              label="Developers"
              value="Connect"
              link="/developers"
              linkText="View profiles"
            />
            <QuickStatCard
              icon={<i className="fas fa-user text-orange-600 text-xl"></i>}
              iconBg="bg-orange-50"
              label="Profile"
              value="100%"
              link={`/profile/${user?._id}`}
              linkText="View profile"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Feed Column */}
            <div className="lg:col-span-2">
              <HomeFeed />
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <QuickActionButton
                    href="/posts"
                    icon={<i className="fas fa-pen text-blue-600"></i>}
                    label="Create Post"
                    description="Share with community"
                  />
                  <QuickActionButton
                    href="/internship/create"
                    icon={<i className="fas fa-plus text-blue-600"></i>}
                    label="Share Opportunity"
                    description="Help others find jobs"
                  />
                  <QuickActionButton
                    href="/edit-profile"
                    icon={<i className="fas fa-cog text-blue-600"></i>}
                    label="Update Profile"
                    description="Keep info current"
                  />
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-lightbulb text-blue-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Pro Tip</h4>
                    <p className="text-sm text-gray-600">
                      Keep your profile updated and track your applications to stay organized in your job search!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  profiles: state.profiles,
  users: state.users,
});

export default connect(mapStateToProps)(Home);
