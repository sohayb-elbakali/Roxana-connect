import React, { Fragment, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import { connect } from "react-redux";
import Spinner from "./Spinner";
import { Navigate } from "react-router-dom";
import { getCurrentProfile } from "../redux/modules/profiles";

const Private = ({
  component: Component,
  users: { isAuthenticated, loading },
  profiles,
  getCurrentProfile,
}) => {
  const hasFetchedProfile = useRef(false);

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

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : isAuthenticated ? (
        <Fragment>
          <Sidebar />
          <Component />
        </Fragment>
      ) : (
        <Navigate to="/login"></Navigate>
      )}
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  users: state.users,
  profiles: state.profiles,
});

export default connect(mapStateToProps, { getCurrentProfile })(Private);
