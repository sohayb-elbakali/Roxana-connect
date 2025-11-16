import { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../redux/modules/users";
import ProfileImage from "./ProfileImage";

const Navbar = ({ users: { isAuthenticated, user }, trackingCount, logout }) => {
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navLinks = [
    { to: "/home", label: "Home", icon: "fa-home" },
    { to: "/feed", label: "Internships", icon: "fa-briefcase" },
    { to: "/tracker", label: "Tracker", icon: "fa-tasks" },
    { to: "/posts", label: "Posts", icon: "fa-comments" },
    { to: "/developers", label: "Developers", icon: "fa-users" },
    ...(user?.role === "admin" ? [{ to: "/admin", label: "Admin", icon: "fa-user-shield" }] : []),
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  const authLinks = (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center justify-center flex-1 space-x-1">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              isActive(link.to)
                ? "bg-white text-blue-600"
                : "text-white hover:bg-white/10"
            }`}
          >
            {link.label}
            {link.badge > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {link.badge > 99 ? '99+' : link.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Profile Section */}
      <div className="hidden lg:flex items-center space-x-3">
        {/* Only show Post Internship button for admins and Level 2-3 users */}
        {(user?.role === 'admin' || (user?.level && user.level >= 2)) && (
          <Link
            to="/internship/create"
            className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-all duration-200"
          >
            <i className="fas fa-plus mr-2"></i>
            Post Internship
          </Link>
        )}
        
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/30">
              <ProfileImage
                userId={user?._id}
                userName={user?.name || "User"}
                size="w-full h-full"
                textSize="text-xs"
              />
            </div>
            <i className={`fas fa-chevron-down text-white text-xs transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`}></i>
          </button>
          
          {showProfileMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowProfileMenu(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                <Link
                  to={`/profile/${user?._id}`}
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  <i className="fas fa-user w-5 text-gray-400"></i>
                  <span className="ml-3">Profile</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  <i className="fas fa-cog w-5 text-gray-400"></i>
                  <span className="ml-3">Settings</span>
                </Link>
                <hr className="my-2 border-gray-200" />
                <Link
                  onClick={() => {
                    logout();
                    setShowProfileMenu(false);
                  }}
                  to="/"
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <i className="fas fa-sign-out-alt w-5"></i>
                  <span className="ml-3">Logout</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
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
          <div className="fixed top-16 left-0 right-0 bg-white shadow-lg z-50 lg:hidden border-t border-gray-200">
            <div className="py-4 px-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setShowMobileMenu(false)}
                  className={`relative flex items-center px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                    isActive(link.to)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <i className={`fas ${link.icon} w-5 text-gray-400`}></i>
                  <span className="ml-3">{link.label}</span>
                  {link.badge > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {link.badge > 99 ? '99+' : link.badge}
                    </span>
                  )}
                </Link>
              ))}
              <hr className="my-2 border-gray-200" />
              {/* Only show Post Internship button for admins and Level 2-3 users */}
              {(user?.role === 'admin' || (user?.level && user.level >= 2)) && (
                <Link
                  to="/internship/create"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-all duration-200"
                >
                  <i className="fas fa-plus w-5"></i>
                  <span className="ml-3">Post Internship</span>
                </Link>
              )}
              <Link
                to="/settings"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center px-4 py-3 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                <i className="fas fa-cog w-5 text-gray-400"></i>
                <span className="ml-3">Settings</span>
              </Link>
              <Link
                onClick={() => {
                  logout();
                  setShowMobileMenu(false);
                }}
                to="/"
                className="flex items-center px-4 py-3 rounded-lg font-medium text-sm text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <i className="fas fa-sign-out-alt w-5"></i>
                <span className="ml-3">Logout</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );

  const links = (
    <div className="flex items-center space-x-3">
      <Link
        to="/login"
        className="px-4 py-2 text-white font-medium text-sm hover:bg-white/10 rounded-lg transition-all duration-200"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-all duration-200"
      >
        Get Started
      </Link>
    </div>
  );

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#3B82F6] shadow-sm border-b border-blue-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              className="text-xl font-bold text-white hover:text-blue-50 transition-colors duration-200 flex items-center"
              to={isAuthenticated ? "/home" : "/"}
            >
              <img src={`${process.env.PUBLIC_URL}/internlogo.png`} alt="Roxana Logo" className="h-8 w-8 mr-2 rounded-full" />
              Roxana
            </Link>
            <Fragment>{isAuthenticated ? authLinks : links}</Fragment>
          </div>
        </div>
      </nav>
    </>
  );
};

const mapStateToProps = (state) => ({
  users: state.users,
  trackingCount: state.tracking?.items?.length || 0,
});

export default connect(mapStateToProps, { logout })(Navbar);
