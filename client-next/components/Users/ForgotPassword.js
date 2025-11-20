'use client';

import React, { useState } from "react";
import Link from "next/link";
import { api } from "../../lib/utils";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await api.post("/users/forgot-password", { email });
      setMessage(res.data.msg || "Password reset link has been sent to your email!");
      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.msg ||
        err.response?.data?.errors?.[0]?.msg ||
        "Failed to send reset email. Please try again."
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
              <i className="fas fa-key text-blue-600 text-2xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Forgot Password?
            </h2>
            <p className="text-gray-600">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <i className="fas fa-check-circle text-green-600 mt-0.5 mr-3"></i>
                <div>
                  <p className="text-sm text-green-800 font-medium">{message}</p>
                  <p className="text-xs text-green-700 mt-1">
                    Check your inbox and spam folder
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
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-envelope text-gray-400"></i>
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Sending...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2"></i>
                  Send Reset Link
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

export default ForgotPassword;
