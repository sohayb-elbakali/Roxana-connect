'use client';

import { useEffect } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { getProfiles } from "../lib/redux/modules/profiles";
import Avatar from "./Avatar";

function Developers({ user, getProfiles, profiles: { profiles, loading } }) {
  useEffect(() => {
    getProfiles();

    const intervalId = setInterval(() => {
      getProfiles();
    }, 180000);

    return () => clearInterval(intervalId);
  }, [getProfiles]);

  const newUsersCount = profiles?.filter(profile =>
    profile?.user?.date &&
    (new Date() - new Date(profile.user.date)) < 7 * 24 * 60 * 60 * 1000
  ).length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <i className="fas fa-users text-blue-600"></i>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Developers</h1>
              </div>
              <p className="text-sm text-gray-500 ml-13">
                Connect with {profiles?.length || 0} developers
                {newUsersCount > 0 && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    {newUsersCount} new this week
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-10 h-10 border-3 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading developers...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && (!profiles || profiles.length === 0) && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-users text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No developers yet</h3>
            <p className="text-gray-500">Be the first to create a profile!</p>
          </div>
        )}

        {/* Developers Grid */}
        {!loading && profiles && profiles.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {profiles
              .filter(
                (profile) =>
                  profile &&
                  profile.user &&
                  profile.user._id &&
                  user &&
                  profile.user._id !== user._id
              )
              .map((profile) => (
                <Link href={`/profile/${profile.user._id}`} key={profile.user._id}>
                  <DeveloperCard profile={profile} />
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DeveloperCard({ profile }) {
  const isNewUser = profile?.user?.date &&
    (new Date() - new Date(profile.user.date)) < 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 text-center hover:border-blue-200 transition-colors cursor-pointer relative">
      {isNewUser && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
          NEW
        </div>
      )}
      <Avatar
        userId={profile?.user?._id}
        userName={profile?.user?.name || "Developer"}
        avatar={profile?.avatar}
        profile={profile}
        size={72}
        className="mx-auto mb-3"
      />
      <h3 className="text-sm font-semibold text-gray-900 mb-0.5 truncate">
        {profile?.user?.name || "Unknown User"}
      </h3>
      <p className="text-xs text-blue-600 font-medium truncate">
        {profile?.status || "Developer"}
      </p>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.users.user,
  profiles: state.profiles,
});

export default connect(mapStateToProps, { getProfiles })(Developers);
