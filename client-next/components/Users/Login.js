'use client';

import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, clearError } from "../../lib/redux/modules/users";
import { getCurrentProfile } from "../../lib/redux/modules/profiles";

const Login = ({ isAuthenticated, login, clearError, getCurrentProfile, error, profile }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { email, password } = formData;



  // Clear error when component mounts
  React.useEffect(() => {
    setLoginError("");
    clearError(); // Clear Redux error state
  }, [clearError]);

  React.useEffect(() => {
    if (isAuthenticated) {
      // Clear any blocks on successful login
      localStorage.removeItem('loginBlock');
      
      // Fetch user profile to check if they have one
      getCurrentProfile();
    }
  }, [isAuthenticated, getCurrentProfile]);

  // Check if user has a profile and redirect accordingly
  React.useEffect(() => {
    if (isAuthenticated && profile !== undefined) {
      // Always redirect to home - ProfileRequired component will handle showing the message
      router.push("/home");
    }
  }, [isAuthenticated, profile, router]);

  // Show error from Redux and auto-hide after 3 seconds
  React.useEffect(() => {
    if (error && error.msg) {
      setLoginError(error.msg);
      setIsLoading(false);
      
      // Auto-hide error after 3 seconds
      const timer = setTimeout(() => {
        setLoginError("");
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  const onChange = (e) => {
    setLoginError(""); // Clear error when user types
    return setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);
    
    try {
      await login(email, password);
    } catch (err) {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-sm p-8 mt-8">
        {/* Logo/Brand */}
        <Link href="/" className="block text-center mb-8 group">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-105 transition-transform">
            <i className="fas fa-briefcase text-white text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Roxana <span className="text-blue-600">Connect</span>
          </h1>
          <p className="text-gray-600 text-sm">Welcome back!</p>
        </Link>
        {/* Error Alert */}
        {loginError && (
          <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-lg p-4 animate-pulse">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <i className="fas fa-exclamation-circle text-red-600 text-lg"></i>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-semibold text-red-900">
                  Login Failed
                </h3>
                <p className="text-sm text-red-800 mt-1">
                  {loginError}
                </p>
              </div>
            </div>
          </div>
        )}

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all text-gray-900 bg-white"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <Link href="/forgot-password"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <input
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all text-gray-900 bg-white"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={onChange}
              required
            />
          </div>
          <button
            className={`w-full py-3 rounded-lg text-white font-semibold shadow-sm transition-all text-base mt-6 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <div className="mt-6 text-center space-y-3">
          <p className="text-gray-600 text-sm">
            New to Roxana Connect?{" "}
            <Link href="/register"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Create an account
            </Link>
          </p>
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.users.isAuthenticated,
    error: state.users.error,
    profile: state.profiles.profile,
  };
};

export default connect(mapStateToProps, { login, clearError, getCurrentProfile })(Login);
