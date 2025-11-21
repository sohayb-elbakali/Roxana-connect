'use client';

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { connect } from "react-redux";
import LandingTitle from "./LandingTitle";

const Landing = ({ isAuthenticated }) => {
  const router = useRouter();
  
  // Redirect authenticated users to home
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="w-full max-w-4xl mx-auto text-center px-6 py-12">
        {/* Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl">
              <i className="fas fa-briefcase text-white text-4xl"></i>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
            Roxana <span className="text-blue-600">Connect</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-semibold">
            Track. Collaborate. Succeed.
          </p>
        </div>

        {/* Description */}
        <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Your community-powered internship tracker. Discover opportunities,
          share insights, and manage your applications all in one place with
          friends you trust.
        </p>

        {/* Feature Highlight */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-blue-100 p-6 mb-10 max-w-xl mx-auto">
          <p className="text-sm md:text-base text-gray-700 font-medium">
            <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
            Discover internship opportunities shared by your trusted network
          </p>
        </div>

        <LandingTitle />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
          <Link href="/register"
            className="group px-10 py-4 rounded-xl bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 text-lg flex items-center justify-center gap-3 transform hover:scale-105"
          >
            <i className="fas fa-user-plus group-hover:scale-110 transition-transform"></i> 
            Get Started
          </Link>
          <Link href="/login"
            className="group px-10 py-4 rounded-xl bg-white border-2 border-blue-600 text-blue-600 font-bold shadow-md hover:bg-blue-50 hover:shadow-lg transition-all duration-300 text-lg flex items-center justify-center gap-3 transform hover:scale-105"
          >
            <i className="fas fa-sign-in-alt group-hover:scale-110 transition-transform"></i> 
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.users.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
