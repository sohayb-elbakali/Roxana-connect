import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import defaultImg from "../assets/default.png";
import {
  deleteEducation,
  deleteExperience,
  getCurrentProfile,
} from "../redux/modules/profiles";
import { getProfileImage } from "../utils";
import BasicInfo from "./ProfileInfo/BasicInfo";
import Education from "./ProfileInfo/Education";
import Experience from "./ProfileInfo/Experience";

const Home = ({
  getCurrentProfile,
  deleteEducation,
  deleteExperience,
  profiles: { profile },
  users: { user },
}) => {
  const [image, setImage] = useState("");
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    getCurrentProfile();
    if (user) {
      setImage(getProfileImage(user._id));
    }
  }, [getCurrentProfile, user]);

  function onError() {
    if (!errored) {
      setErrored(true);
      setImage(defaultImg);
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 lg:ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {profile === null ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome to Roxana!
                </h2>
                <p className="text-gray-600 mb-6">
                  Please create a profile to get started
                </p>
                <Link
                  to="/create-profile"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Create Profile
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-8">
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                  <img
                    src={image}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                    alt="profile"
                    onError={onError}
                  />
                  <div className="text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                      {profile.user.name}
                    </h1>
                    <p className="text-purple-200 text-base md:text-lg">
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
                          className="text-gray-600 hover:text-purple-600 transition-colors duration-200"
                        >
                          <i className={`fab fa-${media} fa-2x`}></i>
                        </a>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Basic Info and Skills */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Basic Info */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-user text-white"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Basic Information
                  </h3>
                </div>
                <BasicInfo profile={profile} />
              </div>

              {/* Skills */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-code text-white"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium border border-purple-200 hover:from-purple-200 hover:to-pink-200 transition-all duration-200"
                      >
                        <i className="fas fa-check mr-2 text-purple-600"></i>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <div className="text-center py-8 w-full">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-code text-purple-500"></i>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Education */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Education</h3>
                  <Link
                    to="/add-education"
                    className="inline-flex items-center p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-full transition-all duration-200"
                  >
                    <i className="fa fa-plus-circle fa-lg"></i>
                  </Link>
                </div>
                <Education
                  profile={profile}
                  deleteEducation={deleteEducation}
                />
              </div>

              {/* Experience */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Experience
                  </h3>
                  <Link
                    to="/add-experience"
                    className="inline-flex items-center p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-full transition-all duration-200"
                  >
                    <i className="fa fa-plus-circle fa-lg"></i>
                  </Link>
                </div>
                <Experience
                  profile={profile}
                  deleteExperience={deleteExperience}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  profiles: state.profiles,
  users: state.users,
});

export default connect(mapStateToProps, {
  getCurrentProfile,
  deleteEducation,
  deleteExperience,
})(Home);
