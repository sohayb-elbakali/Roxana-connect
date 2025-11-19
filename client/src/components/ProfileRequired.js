import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const ProfileRequired = ({ component: Component, profiles: { profile, loading } }) => {
  const navigate = useNavigate();

  // Show loading spinner while checking profile
  if (loading) {
    return (
      <div className="pt-20 lg:pl-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If profile doesn't exist, show create profile message
  if (profile === null) {
    return (
      <div className="pt-20 lg:pl-16 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-center">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-user-plus text-white text-3xl"></i>
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">
                Welcome to Roxana Connect!
              </h1>
              <p className="text-blue-100 text-lg">
                Let's set up your profile to get started
              </p>
            </div>

            {/* Content */}
            <div className="px-8 py-10">
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-check text-blue-600"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Create Your Professional Profile
                    </h3>
                    <p className="text-gray-600">
                      Showcase your skills, experience, and education to connect with opportunities
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-users text-blue-600"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Connect with Developers
                    </h3>
                    <p className="text-gray-600">
                      Network with other professionals and grow your career
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-briefcase text-blue-600"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Access Internships
                    </h3>
                    <p className="text-gray-600">
                      Browse and apply to internship opportunities that match your skills
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                <div className="flex items-start">
                  <i className="fas fa-info-circle text-yellow-600 mt-1 mr-3"></i>
                  <p className="text-sm text-yellow-800">
                    <strong>Profile Required:</strong> You need to create your profile before accessing this feature. It only takes a few minutes!
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/create-profile"
                  className="flex-1 inline-flex items-center justify-center px-6 py-4 text-base font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <i className="fas fa-user-plus mr-2"></i>
                  Create Profile Now
                </Link>
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center justify-center px-6 py-4 text-base font-semibold rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Profile exists, render the component
  return <Component />;
};

const mapStateToProps = (state) => ({
  profiles: state.profiles,
});

export default connect(mapStateToProps)(ProfileRequired);
