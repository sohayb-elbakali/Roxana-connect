'use client';

import { connect, useSelector } from "react-redux";
import Link from "next/link";
import HomeFeed from "./Home/HomeFeed";
import HomeSkeleton from "./Home/HomeSkeleton";

const QuickStatCard = ({ icon, iconBg, label, value, link, linkText }) => (
  <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100/50">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mb-3">{value}</p>
        {link && (
          <Link href={link} className="text-sm text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1.5 hover:gap-2 transition-all hover:cursor-pointer group">
            {linkText}
            <i className="fas fa-arrow-right text-[10px] group-hover:translate-x-0.5 transition-transform"></i>
          </Link>
        )}
      </div>
      <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
        {icon}
      </div>
    </div>
  </div>
);

const QuickActionButton = ({ href, icon, label, description }) => (
  <Link
    href={href}
    className="flex items-center gap-4 p-4 bg-white hover:bg-blue-50/50 rounded-xl border border-gray-100/50 hover:border-blue-200 hover:cursor-pointer transition-all duration-200 hover:shadow-sm group"
  >
    <div className="w-11 h-11 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-gray-900 text-sm mb-0.5">{label}</p>
      <p className="text-xs text-gray-500 truncate">{description}</p>
    </div>
    <i className="fas fa-arrow-right text-gray-400 text-xs group-hover:text-blue-600 group-hover:translate-x-1 transition-all"></i>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      {loading || profile === undefined ? (
        <HomeSkeleton />
      ) : profile === null ? (
        // No Profile - Create Profile CTA
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100/50">
            {/* Header with gradient */}
            <div className="relative bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 px-8 py-16 text-center overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
              <div className="relative z-10">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <i className="fas fa-briefcase text-blue-600 text-4xl"></i>
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  Welcome to Roxana Connect!
                </h1>
                <p className="text-blue-50 text-lg max-w-md mx-auto">
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
                <div className="text-center p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <i className="fas fa-user text-blue-600 text-2xl"></i>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">Build Your Profile</h3>
                  <p className="text-sm text-gray-600">Showcase your skills and experience</p>
                </div>
                <div className="text-center p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <i className="fas fa-briefcase text-green-600 text-2xl"></i>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">Find Internships</h3>
                  <p className="text-sm text-gray-600">Discover opportunities that match you</p>
                </div>
                <div className="text-center p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <i className="fas fa-users text-purple-600 text-2xl"></i>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">Connect & Grow</h3>
                  <p className="text-sm text-gray-600">Network with professionals</p>
                </div>
              </div>

              <div className="text-center">
                <Link
                  href="/create-profile"
                  className="inline-flex items-center gap-3 px-10 py-4 text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:cursor-pointer hover:scale-105 transform"
                >
                  <i className="fas fa-plus"></i>
                  Create Your Profile Now
                </Link>
                <p className="text-sm text-gray-500 mt-5 flex items-center justify-center gap-2">
                  <i className="fas fa-clock"></i>
                  Takes only 3-5 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Has Profile - Main Dashboard
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {getGreeting()}, {firstName}!
                </h1>
                <p className="text-gray-600 mt-2 text-base">Here's what's happening in your network</p>
              </div>
              <Link
                href="/feed"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg hover:cursor-pointer hover:scale-105 transform"
              >
                <i className="fas fa-search"></i>
                Find Internships
              </Link>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
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
            <div className="space-y-5">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6">
                <h3 className="font-bold text-gray-900 mb-5 text-lg">Quick Actions</h3>
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
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200/50 p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <i className="fas fa-lightbulb text-white text-lg"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 text-base">Pro Tip</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
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
