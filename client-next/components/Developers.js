'use client';

import { useEffect } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { getProfiles } from "../lib/redux/modules/profiles";
import Avatar from "./Avatar";

function Developers({ user, getProfiles, profiles: { profiles, loading } }) {
  useEffect(() => {
    // Initial fetch
    getProfiles();

    // Set up interval to refresh every 3 minutes (180000ms)
    const intervalId = setInterval(() => {
      getProfiles();
    }, 180000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [getProfiles]);

  // Calculate new users count (joined within last 7 days)
  const newUsersCount = profiles?.filter(profile => 
    profile?.user?.date && 
    (new Date() - new Date(profile.user.date)) < 7 * 24 * 60 * 60 * 1000
  ).length || 0;

  return (
    <div className="pt-20 lg:pl-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Developers
          </h1>
          <p className="text-gray-600">
            Connect with other developers in the community
            {newUsersCount > 0 && (
              <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {newUsersCount} new {newUsersCount === 1 ? 'member' : 'members'} this week
              </span>
            )}
          </p>
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
                  profile.user._id &&
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
  // Check if user joined within the last 7 days
  const isNewUser = profile?.user?.date && 
    (new Date() - new Date(profile.user.date)) < 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:border-blue-300 hover:shadow-md transition-all duration-200 relative">
      {isNewUser && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          NEW
        </div>
      )}
      <div className="p-6 flex flex-col items-center">
        <Avatar
          userId={profile?.user?._id}
          userName={profile?.user?.name || "Developer"}
          avatar={profile?.avatar}
          profile={profile}
          size={96}
          className="mb-4"
        />
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
