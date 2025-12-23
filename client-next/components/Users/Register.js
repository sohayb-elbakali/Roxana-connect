'use client';

import PropTypes from "prop-types";
import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { showAlertMessage } from "../../lib/redux/modules/alerts";
import { register } from "../../lib/redux/modules/users";

const Register = ({ isAuthenticated, register, showAlertMessage }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { name, email, password, password2 } = formData;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated && !isRedirecting) {
      setIsLoading(false);
      setIsRedirecting(true);
      router.push('/home');
    }
  }, [isAuthenticated, router, isRedirecting]);

  const onChange = useCallback((e) => {
    setRegisterError("");
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { strength: 0, label: "", color: "" };
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    if (strength <= 2) return { strength: 1, label: "Weak", color: "bg-red-500" };
    if (strength <= 3) return { strength: 2, label: "Fair", color: "bg-yellow-500" };
    if (strength <= 4) return { strength: 3, label: "Good", color: "bg-blue-500" };
    return { strength: 4, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (e) => {
    e.preventDefault();
    setRegisterError("");

    if (password !== password2) {
      setRegisterError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await register({ name, email, password });
      setIsRedirecting(true);
    } catch (err) {
      setIsLoading(false);
      if (err?.response?.data?.errors) {
        const emailError = err.response.data.errors.find(e => e.msg.includes("already exists"));
        if (emailError) {
          setRegisterError("This email is already registered. Please use a different email or try logging in.");
        } else {
          setRegisterError(err.response.data.errors[0]?.msg || "Registration failed");
        }
      } else {
        setRegisterError("Registration failed. Please try again.");
      }
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
          <h2 className="text-lg font-bold text-gray-900 mb-1">Creating your account...</h2>
          <p className="text-gray-500 text-sm">Setting up your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-32 -left-32 w-64 h-64 bg-blue-200/40 rounded-full blur-3xl transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}></div>
        <div className={`absolute -bottom-32 -right-32 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl transition-opacity duration-1000 delay-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}></div>
      </div>

      {/* Register Card */}
      <div className={`relative z-10 w-full max-w-md transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl p-8">
          {/* Logo */}
          <Link href="/" className="block text-center mb-6">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <i className="fas fa-briefcase text-white text-xl"></i>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Create your account</h1>
            <p className="text-gray-500 text-sm">Join the Roxana Connect community</p>
          </Link>

          {/* Error Alert */}
          {registerError && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <i className="fas fa-exclamation-circle text-red-500 mt-0.5"></i>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Registration failed</p>
                  <p className="text-sm text-red-600 mt-0.5">{registerError}</p>
                </div>
                <button onClick={() => setRegisterError("")} className="text-red-400 hover:text-red-600">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={onSubmit}>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-user text-gray-400 text-sm"></i>
                </div>
                <input
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-sm text-gray-900 placeholder-gray-400"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={onChange}
                  required
                  disabled={isLoading}
                  autoComplete="name"
                />
              </div>
            </div>

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
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={onChange}
                  required
                  minLength={6}
                  disabled={isLoading}
                  autoComplete="new-password"
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
              {/* Password Strength */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full ${level <= passwordStrength.strength ? passwordStrength.color : 'bg-gray-200'
                          }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${passwordStrength.strength <= 1 ? 'text-red-600' :
                      passwordStrength.strength === 2 ? 'text-yellow-600' :
                        passwordStrength.strength === 3 ? 'text-blue-600' : 'text-green-600'
                    }`}>
                    {passwordStrength.label} password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-shield-alt text-gray-400 text-sm"></i>
                </div>
                <input
                  className={`w-full pl-11 pr-11 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-sm text-gray-900 placeholder-gray-400 ${password2 && password !== password2
                      ? 'border-red-300'
                      : password2 && password === password2
                        ? 'border-green-300'
                        : 'border-gray-200'
                    }`}
                  type={showConfirmPassword ? "text" : "password"}
                  name="password2"
                  placeholder="Re-enter your password"
                  value={password2}
                  onChange={onChange}
                  required
                  minLength={6}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                </button>
              </div>
              {password2 && password !== password2 && (
                <p className="mt-1 text-xs text-red-600 font-medium">Passwords don't match</p>
              )}
              {password2 && password === password2 && (
                <p className="mt-1 text-xs text-green-600 font-medium flex items-center gap-1">
                  <i className="fas fa-check text-[10px]"></i>
                  Passwords match
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              className={`w-full py-3 rounded-xl text-white font-bold transition-colors text-sm flex items-center justify-center gap-2 mt-6 ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Creating account...
                </>
              ) : (
                <>Create Account</>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-bold">
                Sign in
              </Link>
            </p>
            <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 font-medium gap-2">
              <i className="fas fa-arrow-left text-xs"></i>
              Back to Home
            </Link>
          </div>
        </div>

        {/* Terms */}
        <p className="text-center text-gray-400 text-xs mt-4 px-4">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

Register.propTypes = {
  register: PropTypes.func.isRequired,
  showAlertMessage: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.users.isAuthenticated,
});

export default connect(mapStateToProps, { showAlertMessage, register })(Register);
