'use client';

import { connect } from "react-redux";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileImage from "./ProfileImage";

function Sidebar({ users: { user, isAuthenticated }, profiles: { profile }, trackingCount }) {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  // Don't render sidebar if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Icon-only Sidebar - Desktop */}
      <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-16 bg-white border-r border-gray-200 shadow-sm z-30">
        <div className="flex flex-col h-full py-4">
          {/* Profile Section */}
          <Link href={`/profile/${user?._id}`}
            className="flex items-center justify-center mb-4 group"
            title="Profile"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-blue-500 transition-all duration-200">
              <ProfileImage
                userId={user?._id}
                userName={user?.name || "User"}
                avatar={profile?.avatar}
                profile={profile}
                size="w-full h-full"
                textSize="text-xs"
              />
            </div>
          </Link>

          <div className="w-10 h-px bg-gray-200 mx-auto mb-4"></div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2">
            <Link href="/home"
              title="Home"
              className={`flex items-center justify-center w-full h-12 rounded-lg transition-all duration-200 ${
                isActive("/home")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
              }`}
            >
              <i className="fas fa-home text-lg"></i>
            </Link>

            <Link href="/feed"
              title="Internships"
              className={`flex items-center justify-center w-full h-12 rounded-lg transition-all duration-200 ${
                isActive("/feed")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
              }`}
            >
              <i className="fas fa-briefcase text-lg"></i>
            </Link>

            <Link href="/tracker"
              title="Tracker"
              className={`relative flex items-center justify-center w-full h-12 rounded-lg transition-all duration-200 ${
                isActive("/tracker")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
              }`}
            >
              <i className="fas fa-tasks text-lg"></i>
              {trackingCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {trackingCount > 9 ? '9+' : trackingCount}
                </span>
              )}
            </Link>

            <Link href="/posts"
              title="Posts"
              className={`flex items-center justify-center w-full h-12 rounded-lg transition-all duration-200 ${
                isActive("/posts")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
              }`}
            >
              <i className="fas fa-comments text-lg"></i>
            </Link>

            <Link href="/developers"
              title="Developers"
              className={`flex items-center justify-center w-full h-12 rounded-lg transition-all duration-200 ${
                isActive("/developers")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
              }`}
            >
              <i className="fas fa-users text-lg"></i>
            </Link>

            {user?.role === "admin" && (
              <Link href="/admin"
                title="Admin Dashboard"
                className={`flex items-center justify-center w-full h-12 rounded-lg transition-all duration-200 ${
                  isActive("/admin")
                    ? "bg-red-50 text-red-600"
                    : "text-gray-600 hover:bg-red-100 hover:text-red-600"
                }`}
              >
                <i className="fas fa-user-shield text-lg"></i>
              </Link>
            )}
          </nav>

          {/* Quick Action Button at Bottom - Only for admins and Level 2-3 users */}
          {(user?.role === 'admin' || (user?.level && user.level >= 2)) && (
            <Link href="/internship/create"
              title="Post Internship"
              className="flex items-center justify-center w-full h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
            >
              <i className="fas fa-plus text-lg"></i>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  users: state.users,
  profiles: state.profiles,
  trackingCount: state.tracking?.items?.length || 0,
});

export default connect(mapStateToProps)(Sidebar);
