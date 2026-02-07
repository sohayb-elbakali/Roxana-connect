'use client';

import { Fragment, useState } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "../lib/redux/modules/users";
import { getCurrentProfile } from "../lib/redux/modules/profiles";
import Avatar from "./Avatar";

const Navbar = ({ users: { isAuthenticated, user }, profiles: { profile }, trackingCount, logout, getCurrentProfile }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Smooth logout handler
  const handleLogout = async () => {
    setIsLoggingOut(true);
    setShowProfileMenu(false);
    setShowMobileMenu(false);

    // Small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 300));

    logout();
    router.push('/');
  };

  const navLinks = [
    { to: "/home", label: "Home", icon: "fa-home" },
    { to: "/feed", label: "Internships", icon: "fa-briefcase" },
    { to: "/tracker", label: "Tracker", icon: "fa-clipboard-list", badge: trackingCount },
    { to: "/posts", label: "Posts", icon: "fa-comments" },
    { to: "/developers", label: "Developers", icon: "fa-users" },
    ...(user?.role === "admin" ? [{ to: "/admin", label: "Admin", icon: "fa-shield-alt" }] : []),
  ];

  const isActive = (path) => pathname.startsWith(path);

  const authLinks = (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center justify-center flex-1 space-x-1">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            href={link.to}
            className={`relative px-3 py-2 rounded-lg font-medium text-sm transition-colors ${isActive(link.to)
              ? "bg-white text-blue-600"
              : "text-white/90 hover:bg-white/10 hover:text-white"
              }`}
          >
            {link.label}
            {link.badge > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {link.badge > 99 ? '99' : link.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Profile Section */}
      <div className="hidden lg:flex items-center space-x-2">
        {(user?.role === 'admin' || (user?.level && user.level >= 2)) && (
          <Link
            href="/internship/create"
            className="px-3 py-1.5 bg-white text-blue-600 rounded-lg font-semibold text-xs hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <i className="fas fa-plus mr-1.5 text-xs"></i>
            Post
          </Link>
        )}

        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-1.5 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Avatar
              userId={user?._id}
              userName={user?.name || "User"}
              avatar={profile?.avatar}
              profile={profile}
              size={28}
              className="border-2 border-white/30"
            />
            <i className={`fas fa-chevron-down text-white text-[10px] transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}></i>
          </button>

          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowProfileMenu(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-200">
                <Link href={`/profile/${user?._id}`}
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  <i className="fas fa-user w-5 text-gray-400"></i>
                  <span className="ml-3">Profile</span>
                </Link>
                <Link href="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  <i className="fas fa-cog w-5 text-gray-400"></i>
                  <span className="ml-3">Settings</span>
                </Link>
                <hr className="my-2 border-gray-100" />
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  {isLoggingOut ? (
                    <>
                      <i className="fas fa-spinner fa-spin w-5"></i>
                      <span className="ml-3">Signing out...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-out-alt w-5"></i>
                      <span className="ml-3">Logout</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg cursor-pointer"
      >
        <i className={`fas ${showMobileMenu ? 'fa-times' : 'fa-bars'} text-xl`}></i>
      </button>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowMobileMenu(false)}
          ></div>
          <div className="fixed top-16 left-0 right-0 bg-white shadow-lg z-50 lg:hidden border-t border-gray-100">
            <div className="py-3 px-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  onClick={() => setShowMobileMenu(false)}
                  className={`relative flex items-center px-4 py-3 rounded-lg font-medium text-sm ${isActive(link.to)
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <i className={`fas ${link.icon} w-5 text-gray-400`}></i>
                  <span className="ml-3">{link.label}</span>
                  {link.badge > 0 && (
                    <span className="ml-auto bg-green-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {link.badge > 99 ? '99+' : link.badge}
                    </span>
                  )}
                </Link>
              ))}
              <hr className="my-2 border-gray-100" />
              {(user?.role === 'admin' || (user?.level && user.level >= 2)) && (
                <Link href="/internship/create"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700"
                >
                  <i className="fas fa-plus w-5"></i>
                  <span className="ml-3">Post Internship</span>
                </Link>
              )}
              <Link href={`/profile/${user?._id}`}
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center px-4 py-3 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-50"
              >
                <i className="fas fa-user w-5 text-gray-400"></i>
                <span className="ml-3">Profile</span>
              </Link>
              <Link href="/settings"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center px-4 py-3 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-50"
              >
                <i className="fas fa-cog w-5 text-gray-400"></i>
                <span className="ml-3">Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center px-4 py-3 rounded-lg font-medium text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {isLoggingOut ? (
                  <>
                    <i className="fas fa-spinner fa-spin w-5"></i>
                    <span className="ml-3">Signing out...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-out-alt w-5"></i>
                    <span className="ml-3">Logout</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );

  const links = (
    <div className="flex items-center space-x-2">
      <Link href="/login"
        className="px-3 py-1.5 text-white font-medium text-xs sm:text-sm hover:bg-white/10 rounded-lg cursor-pointer"
      >
        Login
      </Link>
      <Link href="/register"
        className="px-3 py-1.5 bg-white text-blue-600 rounded-lg font-semibold text-xs sm:text-sm hover:bg-gray-50 cursor-pointer"
      >
        <span className="hidden sm:inline">Get Started</span>
        <span className="sm:hidden">Sign Up</span>
      </Link>
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-blue-600 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link
            className="flex items-center gap-1.5 sm:gap-2 px-1 sm:px-2 py-1"
            href={isAuthenticated ? "/home" : "/"}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-lg flex items-center justify-center">
              <i className="fas fa-briefcase text-blue-600 text-sm sm:text-base"></i>
            </div>
            <span className="text-base sm:text-xl font-bold text-white">
              Roxana<span className="font-normal opacity-80 hidden xs:inline">Connect</span>
            </span>
          </Link>
          <Fragment>{isAuthenticated ? authLinks : links}</Fragment>
        </div>
      </div>
    </nav>
  );
};

const mapStateToProps = (state) => ({
  users: state.users,
  profiles: state.profiles,
  trackingCount: state.tracking?.items?.length || 0,
});

export default connect(mapStateToProps, { logout, getCurrentProfile })(Navbar);
