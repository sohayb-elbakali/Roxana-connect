import { Fragment } from "react";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../redux/modules/users";

const Navbar = ({ users: { isAuthenticated }, logout }) => {
  const location = useLocation();

  const navLinks = [
    { to: "/home", label: "Home" },
    { to: "/developers", label: "Developers" },
    { to: "/posts", label: "Posts" },
    { to: "/settings", label: "Settings" },
  ];

  const authLinks = (
    <div className="flex items-center space-x-2 sm:space-x-6">
      {navLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className={`font-medium px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-white/10 hover:text-pink-200 text-white ${
            location.pathname.startsWith(link.to)
              ? "bg-white/10 text-pink-200"
              : ""
          }`}
        >
          {link.label}
        </Link>
      ))}
      <Link
        onClick={logout}
        to="/"
        className="text-white hover:text-pink-200 transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-white/10"
      >
        Logout
      </Link>
    </div>
  );

  const links = (
    <div className="flex items-center space-x-2 sm:space-x-6">
      <Link
        to="/login"
        className="text-white hover:text-pink-200 transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-white/10"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow hover:from-purple-700 hover:to-pink-700 transition-all text-base ml-2"
      >
        Get Started
      </Link>
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              className="text-2xl font-bold text-white hover:text-pink-200 transition-colors duration-200"
              to="/"
            >
              Roxana
            </Link>
          </div>
          <Fragment>{isAuthenticated ? authLinks : links}</Fragment>
        </div>
      </div>
    </nav>
  );
};

const mapStateToProps = (state) => ({
  users: state.users,
});

export default connect(mapStateToProps, { logout })(Navbar);
