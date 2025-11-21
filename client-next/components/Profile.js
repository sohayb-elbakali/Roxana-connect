'use client';

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getProfileById, clearViewingProfile, clearProfileError, deleteEducation, deleteExperience } from "../lib/redux/modules/profiles";
import Avatar from "./Avatar";
import BasicInfo from "./ProfileInfo/BasicInfo";
import Education from "./ProfileInfo/Education";
import Experience from "./ProfileInfo/Experience";
import InternshipStats from "./ProfileInfo/InternshipStats";
import InternshipPreferences from "./ProfileInfo/InternshipPreferences";

const Profile = ({ getProfileById, profiles: { profile: currentProfile, viewingProfile, loading, error }, auth, clearViewingProfile, clearProfileError, deleteEducation, deleteExperience }) => {
  let { id } = useParams();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [currentId, setCurrentId] = useState(id);

  // Reset initial load state when navigating to a different profile
  useEffect(() => {
    if (currentId !== id) {
      setIsInitialLoad(true);
      setCurrentId(id);
    }
  }, [id, currentId]);

  useEffect(() => {
    // Clear any previous errors before fetching new profile
    clearProfileError();
    getProfileById(id);
    
    // Cleanup: clear viewing profile when component unmounts
    return () => {
      if (!auth?.user || auth.user._id !== id) {
        clearViewingProfile();
      }
    };
  }, [getProfileById, id, auth?.user, clearViewingProfile, clearProfileError]);

  const isOwnProfile = auth?.user && auth.user._id === id;
  // Use currentProfile if viewing own profile, otherwise use viewingProfile
  const profile = isOwnProfile ? currentProfile : viewingProfile;

  // Once we have profile data or confirmed error, mark as loaded
  useEffect(() => {
    if (!loading && (profile !== undefined || error)) {
      setIsInitialLoad(false);
    }
  }, [loading, profile, error]);

  // Show loading spinner during initial load or while fetching
  if (isInitialLoad || loading) {
    return (
      <div className="pt-20 lg:pl-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Only show ProfileRequired for OWN profile when it doesn't exist
  const shouldShowProfileRequired = isOwnProfile && !isInitialLoad && !loading && (profile === null || (error && error.msg));

  return (
    <div className="pt-20 lg:pl-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {shouldShowProfileRequired ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <i className="fas fa-briefcase text-blue-600 text-3xl"></i>
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">
                  {isOwnProfile ? "Welcome to Roxana Connect!" : "Profile Not Available"}
                </h1>
                <p className="text-blue-100 text-lg">
                  {isOwnProfile 
                    ? "Let's set up your profile to get started"
                    : "This user hasn't created their profile yet"}
                </p>
              </div>

              {/* Content */}
              <div className="px-8 py-10">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {isOwnProfile ? "Create Your Professional Profile" : "Explore Other Profiles"}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    {isOwnProfile 
                      ? "Set up your profile to showcase your skills and connect with opportunities"
                      : "Check out other developers who have created their profiles"}
                  </p>
                </div>

                {isOwnProfile && (
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
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {isOwnProfile ? (
                    <>
                      <Link href="/create-profile"
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <i className="fas fa-user-plus mr-3"></i>
                        Create Your Profile Now
                      </Link>
                      <Link href="/home"
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                      >
                        <i className="fas fa-arrow-left mr-3"></i>
                        Go Back to Home
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/developers"
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <i className="fas fa-users mr-3"></i>
                        View All Developers
                      </Link>
                      <Link href="/home"
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                      >
                        <i className="fas fa-arrow-left mr-3"></i>
                        Go Back to Home
                      </Link>
                    </>
                  )}
                </div>
                {isOwnProfile && (
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    <i className="fas fa-clock mr-1"></i>
                    Takes only 3-5 minutes
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : !isOwnProfile && !profile && (error && error.msg) ? (
          // For other users' profiles that don't exist - just show a simple message
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-user-slash text-3xl text-gray-400"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Profile Not Available
            </h2>
            <p className="text-gray-600 mb-6">
              This user hasn't created their profile yet.
            </p>
            <Link
              href="/developers"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              <i className="fas fa-users mr-2"></i>
              View All Developers
            </Link>
          </div>
        ) : profile ? (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-[#BFDBFE] px-6 py-8 relative">
                {/* Edit Profile Button - Only show for own profile */}
                {isOwnProfile && (
                  <Link
                    href="/edit-profile"
                    className="absolute top-4 right-4 inline-flex items-center px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-sm border border-blue-200"
                  >
                    <i className="fas fa-edit mr-2"></i>
                    Edit Profile
                  </Link>
                )}
                
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                  <Avatar
                    userId={id}
                    userName={profile?.user?.name || "User"}
                    avatar={profile?.avatar}
                    profile={profile}
                    size={128}
                    className="border-4 border-white shadow-lg"
                  />
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
                <Education 
                  profile={profile} 
                  isOwnProfile={isOwnProfile}
                  deleteEducation={isOwnProfile ? deleteEducation : null}
                />
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
                <Experience 
                  profile={profile} 
                  isOwnProfile={isOwnProfile}
                  deleteExperience={isOwnProfile ? deleteExperience : null}
                />
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
        ) : null}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  profiles: state.profiles || { profile: null, loading: true, error: {} },
  auth: state.users || { user: null, isAuthenticated: false },
});

export default connect(mapStateToProps, { getProfileById, clearViewingProfile, clearProfileError, deleteEducation, deleteExperience })(Profile);
