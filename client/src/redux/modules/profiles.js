import { api, serverUrl } from "../../utils";
import { showAlertMessage } from "./alerts";

export const GET_PROFILE = "profile/GET_PROFILE";
export const GET_PROFILES = "profile/GET_PROFILES";
export const UPDATE_PROFILE = "profile/UPDATE_PROFILE";
export const PROFILE_ERROR = "profile/PROFILE_ERROR";
export const UPLOAD_PROFILE_IMAGE = "profile/UPLOAD_PROFILE_IMAGE";
export const CLEAR_PROFILE = "profile/CLEAR_PROFILE";
export const UPDATE_INTERNSHIP_PREFERENCES = "profile/UPDATE_INTERNSHIP_PREFERENCES";

export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await api.get("/profiles/me");
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    // Don't show error if user doesn't have a profile yet (status 400)
    // This is a normal state for new users
    if (err.response && err.response.status === 400) {
      dispatch({
        type: CLEAR_PROFILE,
      });
    } else {
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: err.response?.statusText || "Network error",
          status: err.response?.status || 500,
        },
      });
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
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data,
      });

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
        }, 1000); // Small delay to ensure the alert is shown
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
    dispatch(getCurrentProfile());
  } catch (err) {
    console.log("Image upload error:", err);

    if (err.response && err.response.data && err.response.data.msg) {
      dispatch(showAlertMessage(err.response.data.msg, "error"));
    } else {
      dispatch(
        showAlertMessage("Failed to upload image. Please try again.", "error")
      );
    }
  }
};

export const getProfiles = () => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });

  try {
    console.log("profiles: ");
    const res = await api.get("/profiles");
    console.log("profiles: " + res.data);
    dispatch({
      type: GET_PROFILES,
      payload: res.data,
    });
  } catch (err) {
    // Only show error for server errors, not client errors
    if (err.response && err.response.status >= 500) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: err.response?.statusText || "Network error",
          status: err.response?.status || 500,
        },
      });
    }
  }
};

export const getProfileById = (userId) => async (dispatch) => {
  try {
    const res = await api.get(`/profiles/user/${userId}`);
    dispatch({
      type: GET_PROFILE,
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
    
    // Show user-friendly message for 400 errors (profile not found)
    if (err.response && err.response.status === 400) {
      dispatch(showAlertMessage("Profile not found for this user", "error"));
    }
  }
};

export const addExperience = (formData, navigate) => async (dispatch) => {
  try {
    const res = await api.put("/profiles/experience", formData);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(showAlertMessage("Experience added", "success"));

    navigate("/home");
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
  }
};

export const addEducation = (formData, navigate) => async (dispatch) => {
  try {
    const res = await api.put("/profiles/education", formData);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(showAlertMessage("Education added", "success"));

    navigate("/home");
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
  if (window.confirm("Are you sure? This can NOT be undone!")) {
    try {
      console.log("Deleting account...");
      await api.delete("/profiles");

      dispatch({ type: CLEAR_PROFILE });

      dispatch(showAlertMessage("Your account has been permanently deleted"));

      // Clear the auth token and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/roxana";
    } catch (err) {
      console.log("Delete account error:", err);
      if (err.response) {
        dispatch(
          showAlertMessage(
            err.response.data?.msg ||
              err.response.statusText ||
              "An error occurred while deleting account",
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
  profile: null,
  profiles: [],
  loading: true,
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
        profile: null,
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
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
