'use client';

import React, { Fragment, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { connect } from "react-redux";
import Spinner from "./Spinner";
import { getCurrentProfile } from "../lib/redux/modules/profiles";

const Private = ({
  component: Component,
  users: { isAuthenticated, loading },
  profiles,
  getCurrentProfile,
}) => {
  const router = useRouter();
  const hasFetchedProfile = useRef(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Fetch profile once when user is authenticated and profile hasn't been loaded
  useEffect(() => {
    if (isAuthenticated && !hasFetchedProfile.current && profiles.profile === null && !profiles.loading) {
      getCurrentProfile();
      hasFetchedProfile.current = true;
    }
    // Mark as fetched if profile already exists (from previous navigation or login)
    if (profiles.profile !== null) {
      hasFetchedProfile.current = true;
    }
  }, [isAuthenticated, getCurrentProfile, profiles.profile, profiles.loading]);

  if (loading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Fragment>
      <Sidebar />
      <Component />
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  users: state.users,
  profiles: state.profiles,
});

export default connect(mapStateToProps, { getCurrentProfile })(Private);
