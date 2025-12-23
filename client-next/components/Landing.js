'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { connect } from "react-redux";

const Landing = ({ isAuthenticated }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-32 -right-32 w-64 h-64 bg-blue-200/40 rounded-full blur-3xl transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}></div>
        <div className={`absolute top-1/2 -left-32 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl transition-opacity duration-1000 delay-200 ${mounted ? 'opacity-100' : 'opacity-0'}`}></div>
        <div className={`absolute -bottom-32 right-1/3 w-56 h-56 bg-blue-200/30 rounded-full blur-3xl transition-opacity duration-1000 delay-400 ${mounted ? 'opacity-100' : 'opacity-0'}`}></div>
      </div>

      {/* Main Content */}
      <div className={`relative z-10 w-full max-w-3xl mx-auto text-center px-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

        {/* Logo & Brand */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl mb-4">
            <i className="fas fa-briefcase text-white text-2xl sm:text-3xl"></i>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-2">
            <span className="text-gray-900">Roxana</span>{" "}
            <span className="text-blue-600">Connect</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 font-medium">
            Track • Collaborate • Succeed
          </p>
        </div>

        {/* Description */}
        <p className={`text-base sm:text-lg text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed transition-opacity duration-700 delay-100 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          Your community-powered internship tracker. Discover opportunities,
          share insights, and manage your career journey.
        </p>

        {/* Features */}
        <div className={`flex flex-wrap justify-center gap-3 mb-8 transition-opacity duration-700 delay-200 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full border border-gray-200 shadow-sm">
            <i className="fas fa-search text-blue-600 text-sm"></i>
            <span className="text-sm font-medium text-gray-700">Discover Jobs</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full border border-gray-200 shadow-sm">
            <i className="fas fa-chart-line text-blue-600 text-sm"></i>
            <span className="text-sm font-medium text-gray-700">Track Progress</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full border border-gray-200 shadow-sm">
            <i className="fas fa-users text-blue-600 text-sm"></i>
            <span className="text-sm font-medium text-gray-700">Collaborate</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row justify-center gap-3 transition-opacity duration-700 delay-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <Link
            href="/register"
            className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-user-plus"></i>
            Get Started Free
          </Link>

          <Link
            href="/login"
            className="px-8 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-sign-in-alt"></i>
            Sign In
          </Link>
        </div>

        {/* Trust Badge */}
        <div className={`mt-8 flex items-center justify-center gap-2 text-gray-400 text-sm transition-opacity duration-700 delay-400 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <i className="fas fa-shield-alt text-green-500"></i>
          <span>Secure & Free Forever</span>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.users.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
