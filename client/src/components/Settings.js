import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { deleteAccount } from "../redux/modules/profiles";

function Settings({ deleteAccount }) {
  return (
    <div className="pt-16 min-h-screen bg-gray-50 lg:ml-64">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-cog text-white text-2xl"></i>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Settings
          </h1>
          <p className="text-gray-600">
            Manage your account and profile settings
          </p>
        </div>

        <div className="space-y-4">
          {/* Edit Profile Card */}
          <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-user-edit text-purple-600 text-lg"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Profile Information
                  </h3>
                  <p className="text-sm text-gray-600">
                    Update your profile information and personal details
                  </p>
                </div>
              </div>
              <Link
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-sm hover:shadow-md"
                to="/edit-profile"
              >
                <i className="fas fa-edit mr-2"></i>
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Add Education Card */}
          <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-graduation-cap text-purple-600 text-lg"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Education
                  </h3>
                  <p className="text-sm text-gray-600">
                    Add or manage your educational background
                  </p>
                </div>
              </div>
              <Link
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-sm hover:shadow-md"
                to="/add-education"
              >
                <i className="fas fa-plus mr-2"></i>
                Add Education
              </Link>
            </div>
          </div>

          {/* Add Experience Card */}
          <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-briefcase text-purple-600 text-lg"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Experience
                  </h3>
                  <p className="text-sm text-gray-600">
                    Add or manage your work experience
                  </p>
                </div>
              </div>
              <Link
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-sm hover:shadow-md"
                to="/add-experience"
              >
                <i className="fas fa-plus mr-2"></i>
                Add Experience
              </Link>
            </div>
          </div>

          {/* Delete Account Card */}
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-red-500 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-red-600 text-lg"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Danger Zone
                  </h3>
                  <p className="text-sm text-gray-600">
                    Permanently delete your account and all data
                  </p>
                </div>
              </div>
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete your account? This action cannot be undone."
                    )
                  ) {
                    deleteAccount();
                  }
                }}
              >
                <i className="fas fa-trash mr-2"></i>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(null, { deleteAccount })(Settings);
