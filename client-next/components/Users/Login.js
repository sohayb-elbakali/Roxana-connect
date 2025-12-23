'use client';

import PropTypes from "prop-types";
import React, { useState, useCallback, useEffect } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, clearError } from "../../lib/redux/modules/users";
import { fetchTrackedInternships } from "../../lib/redux/modules/tracking";

const Login = ({ isAuthenticated, login, clearError, fetchTrackedInternships, error }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { email, password } = formData;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLoginError("");
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (isAuthenticated && !isRedirecting) {
      setIsRedirecting(true);
      localStorage.removeItem('loginBlock');
      fetchTrackedInternships();
      router.push("/home");
    }
  }, [isAuthenticated, fetchTrackedInternships, router, isRedirecting]);

  useEffect(() => {
    if (error && error.msg) {
      setLoginError(error.msg);
      setIsLoading(false);
      const timer = setTimeout(() => setLoginError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const onChange = useCallback((e) => {
    setLoginError("");
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || isRedirecting) return;

    setLoginError("");
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result?.success) setIsRedirecting(true);
    } catch (err) {
      setIsLoading(false);
    }
  };

  if (isRedirecting || (isAuthenticated && isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <i className="fas fa-briefcase text-white text-2xl"></i>
          </div>
          <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Welcome back!</h2>
          <p className="text-gray-500 text-sm">Preparing your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-32 -right-32 w-64 h-64 bg-blue-200/40 rounded-full blur-3xl transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}></div>
        <div className={`absolute -bottom-32 -left-32 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl transition-opacity duration-1000 delay-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}></div>
      </div>

      {/* Login Card */}
      <div className={`relative z-10 w-full max-w-md transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl p-8">
          {/* Logo */}
          <Link href="/" className="block text-center mb-8">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <i className="fas fa-briefcase text-white text-xl"></i>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-500 text-sm">Sign in to your account</p>
          </Link>

          {/* Error Alert */}
          {loginError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <i className="fas fa-exclamation-circle text-red-500 mt-0.5"></i>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Login failed</p>
                  <p className="text-sm text-red-600 mt-0.5">{loginError}</p>
                </div>
                <button onClick={() => setLoginError("")} className="text-red-400 hover:text-red-600">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={onSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-envelope text-gray-400 text-sm"></i>
                </div>
                <input
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-sm text-gray-900 placeholder-gray-400"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={onChange}
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-gray-400 text-sm"></i>
                </div>
                <input
                  className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-sm text-gray-900 placeholder-gray-400"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={onChange}
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit */}
            <button
              className={`w-full py-3 rounded-xl text-white font-bold transition-colors text-sm flex items-center justify-center gap-2 ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Signing in...
                </>
              ) : (
                <>Sign In</>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-600 hover:text-blue-700 font-bold">
                Create one
              </Link>
            </p>
            <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 font-medium gap-2">
              <i className="fas fa-arrow-left text-xs"></i>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
  fetchTrackedInternships: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  error: PropTypes.object,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.users.isAuthenticated,
  error: state.users.error,
});

export default connect(mapStateToProps, { login, clearError, fetchTrackedInternships })(Login);
