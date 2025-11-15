import { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getCurrentProfile } from "../redux/modules/profiles";
import HomeFeed from "./Home/HomeFeed";

const Home = ({
  getCurrentProfile,
  profiles: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  return (
    <div className="pt-20 lg:pl-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          </div>
        ) : profile === null ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome to Roxana!
                </h2>
                <p className="text-gray-600 mb-6">
                  Please create a profile to get started
                </p>
                <Link
                  to="/create-profile"
                  className="inline-flex items-center px-6 py-3 text-base font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-sm"
                >
                  Create Profile
                </Link>
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

export default connect(mapStateToProps, {
  getCurrentProfile,
})(Home);
