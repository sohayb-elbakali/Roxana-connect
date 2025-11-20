'use client';

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../lib/utils";

function ResetPassword() {
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post(`/users/reset-password/${token}`, { password });
      setMessage(res.data.msg || "Password reset successful!");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.msg ||
        err.response?.data?.errors?.[0]?.msg ||
        "Failed to reset password. The link may be invalid or expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-lock text-blue-600 text-2xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Reset Password
            </h2>
            <p className="text-gray-600">
              Enter your new password below
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 animate-pulse">
              <div className="flex items-start">
                <i className="fas fa-check-circle text-green-600 mt-0.5 mr-3"></i>
                <div>
                  <p className="text-sm text-green-800 font-medium">{message}</p>
                  <p className="text-xs text-green-700 mt-1">
                    Redirecting to login...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <i className="fas fa-exclamation-circle text-red-600 mt-0.5 mr-3"></i>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-gray-400"></i>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Enter new password"
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 6 characters
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-gray-400"></i>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm new password"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || message}
              className={`w-full flex items-center justify-center px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg ${
                loading || message
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Resetting...
                </>
              ) : message ? (
                <>
                  <i className="fas fa-check mr-2"></i>
                  Success!
                </>
              ) : (
                <>
                  <i className="fas fa-key mr-2"></i>
                  Reset Password
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link href="/login"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
