'use client';

import { useEffect } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { getProfiles } from "../lib/redux/modules/profiles";
import ProfileImage from "./ProfileImage";

function Developers({ user, getProfiles, profiles: { profiles, loading } }) {
  useEffect(() => {
    // Only fetch profiles if we don't have them or the list is empty
    if (!profiles || profiles.length === 0) {
      getProfiles();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="pt-20 lg:pl-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Developers
          </h1>
          <p className="text-gray-600">Connect with other developers in the community</p>
        </div>
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading developers...</p>
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
                  <Link href={`/profile/${profile.user._id}`}
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
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:border-blue-300 hover:shadow-md transition-all duration-200">
      <div className="p-6 flex flex-col items-center">
        <div className="mb-4">
          <ProfileImage
            userId={profile?.user?._id}
            userName={profile?.user?.name || "Developer"}
            avatar={profile?.avatar}
            profile={profile}
            size="w-24 h-24"
            textSize="text-2xl"
          />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1 text-center">
          {profile && profile.user ? profile.user.name : "Unknown User"}
        </h3>
        <p className="text-blue-600 font-medium text-sm text-center">
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
