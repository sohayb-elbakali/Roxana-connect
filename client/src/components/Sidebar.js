import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { getCurrentProfile } from "../redux/modules/profiles";
import ProfileImage from "./ProfileImage";

function Sidebar({ users: { user, isAuthenticated }, getCurrentProfile }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      getCurrentProfile();
    }
  }, [getCurrentProfile, isAuthenticated]);

  const isActive = (path) => location.pathname === path;

  // Don't render sidebar if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-20 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-md bg-purple-600 text-white shadow-lg"
        >
          <i className={`fas ${isMobileOpen ? "fa-times" : "fa-bars"}`}></i>
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-16 h-full w-64 bg-gradient-to-b from-purple-600 to-pink-600 shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Profile Section */}
          <div className="p-6 border-b border-white/20">
            <Link
              to="/home"
              className="block"
              onClick={() => setIsMobileOpen(false)}
            >
              <div className="mx-auto w-20 h-20 rounded-full border-4 border-white shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden">
                <ProfileImage
                  userId={user?._id}
                  userName={user?.name || "User"}
                  size="w-full h-full"
                  className=""
                  textSize="text-lg"
                />
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link
              to="/home"
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive("/home")
                  ? "bg-white/20 text-white shadow-lg"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <i className="fas fa-home mr-3"></i>
              Home
            </Link>

            <Link
              to="/posts"
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive("/posts")
                  ? "bg-white/20 text-white shadow-lg"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <i className="fas fa-comments mr-3"></i>
              Posts
            </Link>

            <Link
              to="/developers"
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive("/developers")
                  ? "bg-white/20 text-white shadow-lg"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <i className="fas fa-users mr-3"></i>
              Developers
            </Link>

            <Link
              to="/settings"
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive("/settings")
                  ? "bg-white/20 text-white shadow-lg"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <i className="fas fa-cog mr-3"></i>
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  users: state.users,
});

export default connect(mapStateToProps, { getCurrentProfile })(Sidebar);
