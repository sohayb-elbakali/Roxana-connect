'use client';

import { connect } from "react-redux";
import Link from "next/link";
import HomeFeed from "./Home/HomeFeed";

const Home = ({
  profiles: { profile, loading },
}) => {

  return (
    <div className="pt-20 lg:pl-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          </div>
        ) : profile === null ? (
          <div className="max-w-4xl mx-auto py-12">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-center">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-rocket text-white text-3xl"></i>
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">
                  Welcome to Roxana Connect!
                </h1>
                <p className="text-blue-100 text-lg">
                  Your journey to professional success starts here
                </p>
              </div>

              {/* Content */}
              <div className="px-8 py-10">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Let's Create Your Profile
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Set up your professional profile to unlock all features
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-user-circle text-blue-600 text-2xl"></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Build Your Profile</h3>
                    <p className="text-sm text-gray-600">Showcase your skills and experience</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-briefcase text-green-600 text-2xl"></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Find Internships</h3>
                    <p className="text-sm text-gray-600">Discover opportunities that match you</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-network-wired text-purple-600 text-2xl"></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Connect & Grow</h3>
                    <p className="text-sm text-gray-600">Network with professionals</p>
                  </div>
                </div>

                <div className="text-center">
                  <Link href="/create-profile"
                    className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <i className="fas fa-user-plus mr-3"></i>
                    Create Your Profile Now
                  </Link>
                  <p className="text-sm text-gray-500 mt-4">
                    <i className="fas fa-clock mr-1"></i>
                    Takes only 3-5 minutes
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <HomeFeed />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  profiles: state.profiles,
});

export default connect(mapStateToProps)(Home);
