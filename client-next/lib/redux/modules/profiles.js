import { api, serverUrl } from "../../utils";
import { showAlertMessage } from "./alerts";

export const GET_PROFILE = "profile/GET_PROFILE";
export const GET_VIEWING_PROFILE = "profile/GET_VIEWING_PROFILE";
export const GET_PROFILES = "profile/GET_PROFILES";
export const UPDATE_PROFILE = "profile/UPDATE_PROFILE";
export const PROFILE_ERROR = "profile/PROFILE_ERROR";
export const CLEAR_PROFILE_ERROR = "profile/CLEAR_PROFILE_ERROR";
export const UPLOAD_PROFILE_IMAGE = "profile/UPLOAD_PROFILE_IMAGE";
export const CLEAR_PROFILE = "profile/CLEAR_PROFILE";
export const CLEAR_VIEWING_PROFILE = "profile/CLEAR_VIEWING_PROFILE";
export const UPDATE_INTERNSHIP_PREFERENCES = "profile/UPDATE_INTERNSHIP_PREFERENCES";

export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await api.get("/profiles/me");
    console.log("Profile fetched successfully:", res.data);
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    // Don't show error if user doesn't have a profile yet (status 400)
    // This is a normal state for new users
    if (err.response && err.response.status === 400) {
      console.log("No profile found for user (400) - this is normal for new users");
      dispatch({
        type: CLEAR_PROFILE,
      });
    } else {
      console.error("Error fetching profile:", err);
      // Don't dispatch PROFILE_ERROR for network issues
      // Just log it and keep the current state
    }
  }
};

// Create or update profile
export const createProfile =
  (formData, navigate, edit = false) =>
  async (dispatch) => {
    try {
      console.log("Sending profile data:", formData);
      const res = await api.post("/profiles", formData);
      console.log("Profile creation response:", res.data);
      
      // Update the current user's profile
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data,
      });
      console.log("Profile updated in Redux state:", res.data);

      dispatch(
        showAlertMessage(
          edit ? "Profile Updated" : "Profile Created",
          "success"
        )
      );

      if (!edit) {
        console.log("Navigating to home page...");
        setTimeout(() => {
          navigate("/home");
        }, 500);
      }
    } catch (err) {
      console.log("Profile creation error:", err);
      console.log("Error response:", err.response);
      console.log("Error message:", err.message);

      // Check if err.response exists before accessing its properties
      if (err.response && err.response.data && err.response.data.errors) {
        const errors = err.response.data.errors;
        errors.forEach((error) =>
          dispatch(showAlertMessage(error.msg, "error"))
        );
      } else if (err.response) {
        // If there's a response but no specific errors, show a generic error
        dispatch(
          showAlertMessage(
            err.response.data?.msg ||
              err.response.statusText ||
              "An error occurred",
            "error"
          )
        );
      } else {
        // Network error or other issue
        console.log("Network error detected - no response object");
        dispatch(showAlertMessage("Network error. Please try again.", "error"));
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: err.response?.statusText || "An error occurred",
          status: err.response?.status || 500,
        },
      });
    }
  };

export const uploadProfileImage = (data) => async (dispatch) => {
  try {
    const res = await api.post(`${serverUrl}/api/profiles/upload`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Image upload response:", res.data);

    dispatch({
      type: UPLOAD_PROFILE_IMAGE,
      payload: res.data,
    });

    // Show success message
    dispatch(
      showAlertMessage("Profile image uploaded successfully!", "success")
    );

    // Refresh the current profile to get updated data
    await dispatch(getCurrentProfile());
    
    // Return the response data for immediate use
    return res.data;
  } catch (err) {
    console.log("Image upload error:", err);

    if (err.response && err.response.data && err.response.data.msg) {
      dispatch(showAlertMessage(err.response.data.msg, "error"));
    } else {
      dispatch(
        showAlertMessage("Failed to upload image. Please try again.", "error")
      );
    }
    throw err;
  }
};

export const getProfiles = () => async (dispatch) => {
  try {
    const res = await api.get("/profiles");
    
    // Preload profile images for all developers
    if (res.data && Array.isArray(res.data)) {
      const { preloadProfileImage } = require('../../utils');
      const cacheManager = require('../../utils/cacheManager').default;
      
      res.data.forEach(profile => {
        if (profile.user?._id) {
          preloadProfileImage(profile.user._id);
          if (profile.avatar) {
            cacheManager.set('profileImages', profile.user._id, profile.avatar, 10 * 60 * 1000);
          }
        }
      });
    }
    
    dispatch({
      type: GET_PROFILES,
      payload: res.data,
    });
  } catch (err) {
    // Silently handle errors for getProfiles - don't dispatch PROFILE_ERROR
    // as it would clear the current user's profile
    console.error("Error fetching profiles:", err);
  }
};

export const getProfileById = (userId) => async (dispatch) => {
  try {
    const res = await api.get(`/profiles/user/${userId}`);
    dispatch({
      type: GET_VIEWING_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    const errorMsg = err.response?.data?.msg || 
                     err.response?.statusText || 
                     "Error loading profile";
    
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: errorMsg,
        status: err.response?.status || 500,
      },
    });
    
    // Don't show alert notification - the UI will handle displaying the error
  }
};

export const clearViewingProfile = () => (dispatch) => {
  dispatch({
    type: CLEAR_VIEWING_PROFILE,
  });
};

export const clearProfileError = () => (dispatch) => {
  dispatch({
    type: CLEAR_PROFILE_ERROR,
  });
};

export const addExperience = (formData, navigate) => async (dispatch, getState) => {
  try {
    const res = await api.put("/profiles/experience", formData);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(showAlertMessage("Experience added", "success"));

    const userId = getState().users.user._id;
    navigate(`/profile/${userId}`);
  } catch (err) {
    // Check if err.response exists before accessing its properties
    if (err.response && err.response.data && err.response.data.errors) {
      const errors = err.response.data.errors;
      errors.forEach((error) => dispatch(showAlertMessage(error.msg, "error")));
    } else if (err.response) {
      dispatch(
        showAlertMessage(
          err.response.data?.msg ||
            err.response.statusText ||
            "An error occurred",
          "error"
        )
      );
    } else {
      dispatch(showAlertMessage("Network error. Please try again.", "error"));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response?.statusText || "An error occurred",
        status: err.response?.status || 500,
      },
    });
    
    // Re-throw error so form can handle loading state
    throw err;
  }
};

export const addEducation = (formData, navigate) => async (dispatch, getState) => {
  try {
    const res = await api.put("/profiles/education", formData);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(showAlertMessage("Education added", "success"));

    const userId = getState().users.user._id;
    navigate(`/profile/${userId}`);
  } catch (err) {
    // Check if err.response exists before accessing its properties
    if (err.response && err.response.data && err.response.data.errors) {
      const errors = err.response.data.errors;
      errors.forEach((error) => dispatch(showAlertMessage(error.msg, "error")));
    } else if (err.response) {
      dispatch(
        showAlertMessage(
          err.response.data?.msg ||
            err.response.statusText ||
            "An error occurred",
          "error"
        )
      );
    } else {
      dispatch(showAlertMessage("Network error. Please try again.", "error"));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response?.statusText || "An error occurred",
        status: err.response?.status || 500,
      },
    });
    
    // Re-throw error so form can handle loading state
    throw err;
  }
};

export const updateExperience = (id, formData, navigate) => async (dispatch, getState) => {
  try {
    const res = await api.put(`/profiles/experience/${id}`, formData);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(showAlertMessage("Experience updated", "success"));

    const userId = getState().users.user._id;
    navigate(`/profile/${userId}`);
  } catch (err) {
    if (err.response && err.response.data && err.response.data.errors) {
      const errors = err.response.data.errors;
      errors.forEach((error) => dispatch(showAlertMessage(error.msg, "error")));
    } else if (err.response) {
      dispatch(
        showAlertMessage(
          err.response.data?.msg ||
            err.response.statusText ||
            "An error occurred",
          "error"
        )
      );
    } else {
      dispatch(showAlertMessage("Network error. Please try again.", "error"));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response?.statusText || "An error occurred",
        status: err.response?.status || 500,
      },
    });
    
    // Re-throw error so form can handle loading state
    throw err;
  }
};

export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = await api.delete(`/profiles/experience/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(showAlertMessage("Experience removed", "success"));
  } catch (err) {
    if (err.response) {
      dispatch(
        showAlertMessage(
          err.response.data?.msg ||
            err.response.statusText ||
            "An error occurred",
          "error"
        )
      );
    } else {
      dispatch(showAlertMessage("Network error. Please try again.", "error"));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response?.statusText || "An error occurred",
        status: err.response?.status || 500,
      },
    });
  }
};

export const updateEducation = (id, formData, navigate) => async (dispatch, getState) => {
  try {
    const res = await api.put(`/profiles/education/${id}`, formData);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(showAlertMessage("Education updated", "success"));

    const userId = getState().users.user._id;
    navigate(`/profile/${userId}`);
  } catch (err) {
    if (err.response && err.response.data && err.response.data.errors) {
      const errors = err.response.data.errors;
      errors.forEach((error) => dispatch(showAlertMessage(error.msg, "error")));
    } else if (err.response) {
      dispatch(
        showAlertMessage(
          err.response.data?.msg ||
            err.response.statusText ||
            "An error occurred",
          "error"
        )
      );
    } else {
      dispatch(showAlertMessage("Network error. Please try again.", "error"));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response?.statusText || "An error occurred",
        status: err.response?.status || 500,
      },
    });
    
    // Re-throw error so form can handle loading state
    throw err;
  }
};

export const deleteEducation = (id) => async (dispatch) => {
  try {
    console.log(`Education ID to delete is ${id}`);
    const res = await api.delete(`/profiles/education/${id}`);
    console.log(`res.data is ${res.data}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(showAlertMessage("Education removed", "success"));
  } catch (err) {
    if (err.response) {
      dispatch(
        showAlertMessage(
          err.response.data?.msg ||
            err.response.statusText ||
            "An error occurred",
          "error"
        )
      );
    } else {
      dispatch(showAlertMessage("Network error. Please try again.", "error"));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response?.statusText || "An error occurred",
        status: err.response?.status || 500,
      },
    });
  }
};

// Delete account & profile
export const deleteAccount = () => async (dispatch) => {
  try {
    console.log("Deleting account...");
    const response = await api.delete("/profiles");
    console.log("Delete response:", response);

    dispatch({ type: CLEAR_PROFILE });

    dispatch(showAlertMessage("Your account has been permanently deleted", "success"));

    // Clear the auth token and redirect to login after a short delay
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/";
      }, 1500);
    }
  } catch (err) {
    console.error("Delete account error:", err);
    console.error("Error response:", err.response);
    console.error("Error message:", err.message);
    
    if (err.response) {
      const errorMsg = err.response.data?.msg ||
                      err.response.data?.message ||
                      err.response.statusText ||
                      "An error occurred while deleting account";
      dispatch(showAlertMessage(errorMsg, "error"));
    } else if (err.request) {
      dispatch(showAlertMessage("No response from server. Please check your connection.", "error"));
    } else {
      dispatch(showAlertMessage("Network error. Please try again.", "error"));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response?.statusText || err.message || "An error occurred",
        status: err.response?.status || 500,
      },
    });
  }
};

// Update internship preferences
export const updateInternshipPreferences = (targetCompanies, targetRoles) => async (dispatch) => {
  try {
    const res = await api.put("/profiles/internship-preferences", {
      targetCompanies,
      targetRoles,
    });

    dispatch({
      type: UPDATE_INTERNSHIP_PREFERENCES,
      payload: res.data,
    });

    dispatch(showAlertMessage("Internship preferences updated", "success"));
  } catch (err) {
    if (err.response && err.response.data && err.response.data.msg) {
      dispatch(showAlertMessage(err.response.data.msg, "error"));
    } else {
      dispatch(showAlertMessage("Error updating preferences", "error"));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response?.statusText || "An error occurred",
        status: err.response?.status || 500,
      },
    });
  }
};

const initialState = {
  profile: null, // Current user's profile
  viewingProfile: null, // Profile being viewed (other users)
  profiles: [],
  loading: false,
  error: {},
  image: null,
};

export default function reducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
    case UPDATE_INTERNSHIP_PREFERENCES:
      return {
        ...state,
        profile: payload,
        loading: false,
      };

    case GET_VIEWING_PROFILE:
      return {
        ...state,
        viewingProfile: payload,
        loading: false,
      };

    case GET_PROFILES:
      return {
        ...state,
        profiles: payload,
        loading: false,
      };

    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        // Don't clear profile on error, only on explicit CLEAR_PROFILE
      };
    case CLEAR_PROFILE_ERROR:
      return {
        ...state,
        error: {},
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        loading: false,
        error: {},
      };
    case CLEAR_VIEWING_PROFILE:
      return {
        ...state,
        viewingProfile: null,
        loading: false,
      };
    case UPLOAD_PROFILE_IMAGE:
      return {
        ...state,
        image: payload,
      };
    default:
      return state;
  }
}
