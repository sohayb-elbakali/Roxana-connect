import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import defaultImg from "../assets/default.png";
import { getProfiles } from "../redux/modules/profiles";
import { getProfileImage } from "../utils";

function Developers({ user, getProfiles, profiles: { profiles, loading } }) {
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

  return (
    <div className="pt-16 min-h-screen bg-gray-50 lg:ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">
          Developers
        </h1>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
            {profiles
              .filter(
                (profile) =>
                  profile &&
                  profile.user &&
                  user &&
                  profile.user._id !== user._id
              )
              .map((profile) => {
                return (
                  <Link
                    to={`/profile/${profile.user._id}`}
                    key={profile.user._id}
                    className="block"
                  >
                    <Developer profile={profile} />
                  </Link>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

function Developer({ profile }) {
  const [errored, setErrored] = useState(false);
  const [image, setImage] = useState(
    profile && profile.user ? getProfileImage(profile.user._id) : defaultImg
  );

  function onError() {
    if (!errored) {
      setErrored(true);
      setImage(defaultImg);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="aspect-square overflow-hidden">
        <img
          onError={onError}
          src={image}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 truncate">
          {profile && profile.user ? profile.user.name : "Unknown User"}
        </h3>
        <p className="text-purple-600 font-medium text-sm md:text-base truncate">
          {profile ? profile.status : "No Status"}
        </p>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.users.user,
  profiles: state.profiles,
});

export default connect(mapStateToProps, { getProfiles })(Developers);
