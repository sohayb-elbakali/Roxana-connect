import { api, setAuthToken, clearAllImageCache } from "../../utils";
import { showAlertMessage } from "./alerts";

const REGISTER_SUCCESS = "users/REGISTER_SUCCESS";
const REGISTER_FAIL = "users/REGISTER_FAIL";
const USER_LOADED = "users/USER_LOADED";
const USER_ERROR = "users/USER_ERROR";
const LOGIN_SUCCESS = "users/LOGIN_SUCCESS";
const LOGIN_FAIL = "users/LOGIN_FAIL";
const LOGOUT = "users/LOGOUT";

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
        type: LOGIN_FAIL,
      });
    }
  };
}

export const logout = () => (dispatch) => {
  // Clear all caches and tokens
  setAuthToken(null);
  clearAllImageCache();
  localStorage.clear(); // Clear all localStorage data
  sessionStorage.clear(); // Clear all sessionStorage data
  
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

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
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
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
      setAuthToken();
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
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

    default:
      return state;
  }
}
