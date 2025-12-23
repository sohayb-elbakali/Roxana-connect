'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "../../lib/utils";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-32 right-1/4 w-64 h-64 bg-blue-200/40 rounded-full blur-3xl transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}></div>
        <div className={`absolute -bottom-32 left-1/4 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl transition-opacity duration-1000 delay-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}></div>
      </div>

      {/* Card */}
      <div className={`relative z-10 w-full max-w-md transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <i className="fas fa-key text-white text-xl"></i>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Forgot your password?
            </h2>
            <p className="text-gray-500 text-sm">
              No worries! Enter your email and we'll send you a reset link
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="mb-5 bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <i className="fas fa-check-circle text-green-500 mt-0.5"></i>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">Email sent!</p>
                  <p className="text-sm text-green-600 mt-0.5">{message}</p>
                  <p className="text-xs text-green-500 mt-1">Check your inbox and spam folder</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <i className="fas fa-exclamation-circle text-red-500 mt-0.5"></i>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Unable to send email</p>
                  <p className="text-sm text-red-600 mt-0.5">{error}</p>
                </div>
                <button onClick={() => setError("")} className="text-red-400 hover:text-red-600">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-envelope text-gray-400 text-sm"></i>
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-sm text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-bold transition-colors text-sm flex items-center justify-center gap-2 ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Sending...
                </>
              ) : (
                <>
                  Send Reset Link
                  <i className="fas fa-paper-plane text-xs"></i>
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link href="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 font-medium gap-2">
              <i className="fas fa-arrow-left text-xs"></i>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
