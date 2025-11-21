import { api, setAuthToken, clearAllImageCache } from "../../utils";
import { showAlertMessage } from "./alerts";

const REGISTER_SUCCESS = "users/REGISTER_SUCCESS";
const REGISTER_FAIL = "users/REGISTER_FAIL";
const USER_LOADED = "users/USER_LOADED";
const USER_ERROR = "users/USER_ERROR";
const LOGIN_SUCCESS = "users/LOGIN_SUCCESS";
const LOGIN_FAIL = "users/LOGIN_FAIL";
const LOGOUT = "users/LOGOUT";
const CLEAR_ERROR = "users/CLEAR_ERROR";

export const loadUser = () => async (dispatch) => {
    try {
        const res = await api.get("/users");
        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: USER_ERROR
        })
    }
};

export function register(formData) {
  return async function registerThunk(dispatch) {
    try {
      // call API /users/register
      const res = await api.post("/users/register", formData);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      dispatch(loadUser());
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors;
        errors.forEach((error) => {
          dispatch(showAlertMessage(error.msg, "error"));
        });
      } else {
        dispatch(showAlertMessage("Network error. Please try again.", "error"));
      }
      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };
}

export function login(email, password) {
  return async function loginThunk(dispatch) {
    try {
      const res = await api.post("/users/login", { email, password });
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
      await dispatch(loadUser());
      
      // Also load profile immediately after login
      const { getCurrentProfile } = require('./profiles');
      dispatch(getCurrentProfile());
    } catch (error) {
      let errorMsg = "Invalid email or password. Please try again.";
      
      // Check for rate limiting (HTTP 429)
      if (error.response && error.response.status === 429) {
        errorMsg = "You've entered the wrong password too many times. Please try again after 10 minutes.";
      } else if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors;
        errorMsg = errors[0]?.msg || errorMsg;
      } else if (error.response && error.response.data && error.response.data.msg) {
        errorMsg = error.response.data.msg;
      } else if (!error.response) {
        // Network error (no response from server)
        errorMsg = "Network error. Please check your connection and try again.";
      }
      
      dispatch({
        type: LOGIN_FAIL,
        payload: { msg: errorMsg },
      });
    }
  };
}

export const logout = () => (dispatch) => {
  // Clear all caches and tokens
  setAuthToken(null);
  clearAllImageCache();
  
  if (typeof window !== 'undefined') {
    localStorage.clear(); // Clear all localStorage data
    sessionStorage.clear(); // Clear all sessionStorage data
  }
  
  dispatch({ type: LOGOUT });
};

export const resendVerification = () => async (dispatch) => {
  try {
    const res = await api.post("/users/resend-verification");
    dispatch(showAlertMessage(res.data.message || "Verification email sent!", "success"));
    return { success: true };
  } catch (error) {
    const message = error.response?.data?.message || "Failed to send verification email";
    dispatch(showAlertMessage(message, "error"));
    return { success: false };
  }
};

export const clearError = () => ({
  type: CLEAR_ERROR,
});

const initialState = {
  token: typeof window !== 'undefined' ? localStorage.getItem("token") : null,
  isAuthenticated: null,
  loading: true,
  user: null,
  error: null,
};

export default function reducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      setAuthToken(payload.token);
      return {
        ...state,
        token: payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
      setAuthToken();
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: payload || { msg: "Authentication failed" },
      };
    case USER_ERROR:
    case LOGOUT:
      setAuthToken();
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}
