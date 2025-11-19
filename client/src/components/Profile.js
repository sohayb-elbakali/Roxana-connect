import { useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { getProfileById } from "../redux/modules/profiles";
import ProfileImage from "./ProfileImage";
import BasicInfo from "./ProfileInfo/BasicInfo";
import Education from "./ProfileInfo/Education";
import Experience from "./ProfileInfo/Experience";
import InternshipStats from "./ProfileInfo/InternshipStats";
import InternshipPreferences from "./ProfileInfo/InternshipPreferences";

const Profile = ({ getProfileById, profiles: { profile, loading, error }, auth }) => {
  let { id } = useParams();

  useEffect(() => {
    getProfileById(id);
  }, [getProfileById, id]);

  const isOwnProfile = auth?.user && auth.user._id === id;

  return (
    <div className="pt-20 lg:pl-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading profile...</p>
          </div>
        ) : error && error.msg ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-user-slash text-3xl text-red-600"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Profile Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              {error.msg === "There is no profile for the given user"
                ? "This user hasn't created a profile yet."
                : error.msg}
            </p>
            <a
              href="/developers"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              <i className="fas fa-users mr-2"></i>
              View All Developers
            </a>
          </div>
        ) : profile ? (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-[#BFDBFE] px-6 py-8">
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
                    <ProfileImage
                      userId={id}
                      userName={profile?.user?.name || "User"}
                      avatar={profile?.avatar}
                      profile={profile}
                      size="w-full h-full"
                      textSize="text-xl md:text-2xl"
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {profile.user.name}
                    </h1>
                    <p className="text-gray-700 text-base md:text-lg">
                      {profile.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              {profile.social && (
                <div className="px-6 py-4 bg-gray-50 border-t">
                  <div className="flex justify-center space-x-4">
                    {Object.keys(profile.social)
                      .filter((media) => profile.social[media] !== "")
                      .map((media) => (
                        <a
                          key={media}
                          rel="noreferrer"
                          target="_blank"
                          href={profile.social[media]}
                          className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        >
                          <i className={`fab fa-${media} fa-2x`}></i>
                        </a>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Basic Info and Skills */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-user text-blue-600"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Basic Information
                  </h3>
                </div>
                <BasicInfo profile={profile} />
              </div>

              {/* Skills */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-code text-blue-600"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-blue-50 text-blue-700 rounded-md text-sm font-medium border border-blue-200 hover:bg-blue-100 transition-all duration-200"
                      >
                        <i className="fas fa-check mr-2 text-blue-600"></i>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <div className="text-center py-8 w-full">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-code text-blue-600"></i>
                      </div>
                      <p className="text-gray-500 text-sm">
                        No skills added yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Education and Experience */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Education */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-graduation-cap text-blue-600"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Education</h3>
                </div>
                <Education profile={profile} isOwnProfile={isOwnProfile} />
              </div>

              {/* Experience */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-briefcase text-blue-600"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Experience
                  </h3>
                </div>
                <Experience profile={profile} isOwnProfile={isOwnProfile} />
              </div>
            </div>

            {/* Internship Statistics - Only for own profile */}
            {isOwnProfile && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-chart-line text-blue-600"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    My Internship Activity
                  </h3>
                </div>
                <InternshipStats userId={id} isOwnProfile={isOwnProfile} />
              </div>
            )}

            {/* Internship Preferences - Only for own profile */}
            {isOwnProfile && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-bullseye text-blue-600"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Target Companies & Roles
                  </h3>
                </div>
                <InternshipPreferences profile={profile} />
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-exclamation-circle text-3xl text-red-600"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Something Went Wrong
            </h2>
            <p className="text-gray-600 mb-6">
              Unable to load the profile. Please try again later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  profiles: state.profiles || { profile: null, loading: true, error: {} },
  auth: state.users || { user: null, isAuthenticated: false },
});

export default connect(mapStateToProps, { getProfileById })(Profile);
