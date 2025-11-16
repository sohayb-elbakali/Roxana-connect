import React from "react";
import { Link, Navigate } from "react-router-dom";
import { connect } from "react-redux";
import LandingTitle from "./LandingTitle";

const Landing = ({ isAuthenticated }) => {
  // Redirect authenticated users to home
  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="w-full max-w-4xl mx-auto text-center px-6 py-12">
        {/* Title */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Roxana
          </h1>
          <p className="text-2xl md:text-3xl text-blue-600 font-bold tracking-wide">
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
          <Link
            to="/register"
            className="group px-10 py-4 rounded-xl bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 text-lg flex items-center justify-center gap-3 transform hover:scale-105"
          >
            <i className="fas fa-user-plus group-hover:scale-110 transition-transform"></i> 
            Get Started
          </Link>
          <Link
            to="/login"
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
