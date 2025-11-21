import { api, preloadProfileImage } from "../../utils";
import { showAlertMessage } from "./alerts";
import cacheManager from "../../utils/cacheManager";

// Action Types
export const FETCH_INTERNSHIPS = "internships/FETCH_INTERNSHIPS";
export const FETCH_INTERNSHIP = "internships/FETCH_INTERNSHIP";
export const CREATE_INTERNSHIP = "internships/CREATE_INTERNSHIP";
export const UPDATE_INTERNSHIP = "internships/UPDATE_INTERNSHIP";
export const DELETE_INTERNSHIP = "internships/DELETE_INTERNSHIP";
export const SET_FILTERS = "internships/SET_FILTERS";
export const CLEAR_FILTERS = "internships/CLEAR_FILTERS";
export const ADD_COMMENT = "internships/ADD_COMMENT";
export const DELETE_COMMENT = "internships/DELETE_COMMENT";
export const REACT_TO_COMMENT = "internships/REACT_TO_COMMENT";
export const LIKE_COMMENT = "internships/LIKE_COMMENT";
export const UNLIKE_COMMENT = "internships/UNLIKE_COMMENT";
export const LIKE_INTERNSHIP = "internships/LIKE_INTERNSHIP";
export const FETCH_TRACKING_USERS = "internships/FETCH_TRACKING_USERS";
export const UPDATE_INSIGHTS = "internships/UPDATE_INSIGHTS";
export const SET_INSIGHTS = "internships/SET_INSIGHTS";
export const INTERNSHIP_ERROR = "internships/INTERNSHIP_ERROR";

// Action Creators

// Fetch all internships with optional filters
export const fetchInternships = (filters = {}) => async (dispatch) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.company) params.append("company", filters.company);
    if (filters.location) params.append("location", filters.location);
    if (filters.deadlineFrom) params.append("deadlineFrom", filters.deadlineFrom);
    if (filters.deadlineTo) params.append("deadlineTo", filters.deadlineTo);
    if (filters.tags) params.append("tags", filters.tags);
    if (filters.search) params.append("search", filters.search);
    if (filters.sort) params.append("sort", filters.sort);
    if (filters.active !== undefined) params.append("active", String(filters.active));

    const res = await api.get(`/internships?${params.toString()}`);

    // Preload profile images for all internship posters and commenters
    if (res.data && Array.isArray(res.data)) {
      res.data.forEach(internship => {
        // Preload poster image
        if (internship.postedBy?._id) {
          preloadProfileImage(internship.postedBy._id);
          if (internship.postedBy.avatar) {
            cacheManager.set('profileImages', internship.postedBy._id, internship.postedBy.avatar, 10 * 60 * 1000);
          }
        }
        
        // Preload comment author images
        if (internship.comments && Array.isArray(internship.comments)) {
          internship.comments.forEach(comment => {
            if (comment.user?._id) {
              preloadProfileImage(comment.user._id);
              if (comment.user.avatar) {
                cacheManager.set('profileImages', comment.user._id, comment.user.avatar, 10 * 60 * 1000);
              }
            }
          });
        }
      });
    }

    dispatch({
      type: FETCH_INTERNSHIPS,
      payload: res.data,
    });
  } catch (err) {
    console.error("Fetch internships error:", err.response?.data || err.message);
    const errorMsg = err.response?.data?.errors?.[0]?.msg || 
                     err.response?.data?.msg || 
                     err.response?.statusText || 
                     "Network error";
    
    dispatch({
      type: INTERNSHIP_ERROR,
      payload: {
        msg: errorMsg,
        status: err.response?.status || 500,
      },
    });
  }
};

// Fetch single internship by ID
export const fetchInternship = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/internships/${id}`);

    // Preload profile images for internship poster and commenters
    if (res.data) {
      // Preload poster image
      if (res.data.postedBy?._id) {
        preloadProfileImage(res.data.postedBy._id);
        if (res.data.postedBy.avatar) {
          cacheManager.set('profileImages', res.data.postedBy._id, res.data.postedBy.avatar, 10 * 60 * 1000);
        }
      }
      
      // Preload comment author images
      if (res.data.comments && Array.isArray(res.data.comments)) {
        res.data.comments.forEach(comment => {
          if (comment.user?._id) {
            preloadProfileImage(comment.user._id);
            if (comment.user.avatar) {
              cacheManager.set('profileImages', comment.user._id, comment.user.avatar, 10 * 60 * 1000);
            }
          }
        });
      }
    }

    dispatch({
      type: FETCH_INTERNSHIP,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: INTERNSHIP_ERROR,
      payload: {
        msg: err.response?.statusText || "Network error",
        status: err.response?.status || 500,
      },
    });
  }
};

// Create new internship
export const createInternship = (formData) => async (dispatch, getState) => {
  try {
    const res = await api.post("/internships", formData);

    // Immediately cache the user's profile image for the new internship
    const state = getState();
    const currentProfile = state.profiles?.profile;
    if (res.data.postedBy?._id && currentProfile?.avatar) {
      cacheManager.set('profileImages', res.data.postedBy._id, currentProfile.avatar, 10 * 60 * 1000);
    }

    dispatch({
      type: CREATE_INTERNSHIP,
      payload: res.data,
    });

    dispatch(showAlertMessage("Internship opportunity created successfully", "success"));
    return res.data; // Return data for success handling
  } catch (err) {
    if (err.response && err.response.data && err.response.data.errors) {
      const errors = err.response.data.errors;
      errors.forEach((error) => {
        dispatch(showAlertMessage(error.msg, "error"));
      });
    } else {
      dispatch(showAlertMessage("Error creating internship", "error"));
    }
    dispatch({
      type: INTERNSHIP_ERROR,
      payload: {
        msg: err.response?.statusText || "Network error",
        status: err.response?.status || 500,
      },
    });
    throw err; // Re-throw error so the component can catch it
  }
};

// Update internship
export const updateInternship = (id, formData) => async (dispatch) => {
  try {
    const res = await api.put(`/internships/${id}`, formData);

    dispatch({
      type: UPDATE_INTERNSHIP,
      payload: res.data,
    });

    dispatch(showAlertMessage("Internship updated successfully", "success"));
    return res.data; // Return data for success handling
  } catch (err) {
    if (err.response && err.response.data && err.response.data.errors) {
      const errors = err.response.data.errors;
      errors.forEach((error) => {
        dispatch(showAlertMessage(error.msg, "error"));
      });
    } else {
      dispatch(showAlertMessage("Error updating internship", "error"));
    }
    dispatch({
      type: INTERNSHIP_ERROR,
      payload: {
        msg: err.response?.statusText || "Network error",
        status: err.response?.status || 500,
      },
    });
    throw err; // Re-throw error so the component can catch it
  }
};

// Delete internship
export const deleteInternship = (id) => async (dispatch) => {
  try {
    await api.delete(`/internships/${id}`);

    dispatch({
      type: DELETE_INTERNSHIP,
      payload: id,
    });

    dispatch(showAlertMessage("Internship removed", "success"));
  } catch (err) {
    if (err.response && err.response.data && err.response.data.msg) {
      dispatch(showAlertMessage(err.response.data.msg, "error"));
    } else {
      dispatch(showAlertMessage("Error deleting internship", "error"));
    }
    dispatch({
      type: INTERNSHIP_ERROR,
      payload: {
        msg: err.response?.statusText || "Network error",
        status: err.response?.status || 500,
      },
    });
  }
};

// Set filters
export const setFilters = (filters) => (dispatch) => {
  dispatch({
    type: SET_FILTERS,
    payload: filters,
  });
};

// Clear all filters
export const clearFilters = () => (dispatch) => {
  dispatch({
    type: CLEAR_FILTERS,
  });
};

// Add comment to internship
export const addInternshipComment = (internshipId, formData) => async (dispatch, getState) => {
  try {
    const res = await api.post(`/internships/${internshipId}/comment`, formData);

    // Immediately cache the user's profile image for the new comment
    const state = getState();
    const currentProfile = state.profiles?.profile;
    const user = state.users?.user;
    if (user?._id && currentProfile?.avatar) {
      cacheManager.set('profileImages', user._id, currentProfile.avatar, 10 * 60 * 1000);
    }

    dispatch({
      type: ADD_COMMENT,
      payload: res.data,
    });

    dispatch(showAlertMessage("Comment added", "success"));
  } catch (err) {
    if (err.response && err.response.data && err.response.data.errors) {
      const errors = err.response.data.errors;
      errors.forEach((error) => {
        dispatch(showAlertMessage(error.msg, "error"));
      });
    } else {
      dispatch(showAlertMessage("Error adding comment", "error"));
    }
    dispatch({
      type: INTERNSHIP_ERROR,
      payload: {
        msg: err.response?.statusText || "Network error",
        status: err.response?.status || 500,
      },
    });
  }
};

// Delete comment from internship
export const deleteInternshipComment = (internshipId, commentId) => async (dispatch) => {
  try {
    await api.delete(`/internships/${internshipId}/comment/${commentId}`);

    dispatch({
      type: DELETE_COMMENT,
      payload: commentId,
    });

    dispatch(showAlertMessage("Comment removed", "success"));
  } catch (err) {
    if (err.response && err.response.data && err.response.data.msg) {
      dispatch(showAlertMessage(err.response.data.msg, "error"));
    } else {
      dispatch(showAlertMessage("Error deleting comment", "error"));
    }
    dispatch({
      type: INTERNSHIP_ERROR,
      payload: {
        msg: err.response?.statusText || "Network error",
        status: err.response?.status || 500,
      },
    });
  }
};

// React to a comment
export const reactToComment = (internshipId, commentId, reactionType) => async (dispatch) => {
  try {
    const res = await api.put(`/internships/${internshipId}/comment/${commentId}/react`, {
      reactionType,
    });

    dispatch({
      type: REACT_TO_COMMENT,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.data && err.response.data.msg) {
      dispatch(showAlertMessage(err.response.data.msg, "error"));
    } else {
      dispatch(showAlertMessage("Error reacting to comment", "error"));
    }
    dispatch({
      type: INTERNSHIP_ERROR,
      payload: {
        msg: err.response?.statusText || "Network error",
        status: err.response?.status || 500,
      },
    });
  }
};

// Like a comment
export const likeComment = (internshipId, commentId) => async (dispatch) => {
  try {
    const res = await api.put(`/internships/${internshipId}/comment/${commentId}/like`);

    dispatch({
      type: LIKE_COMMENT,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.data && err.response.data.msg) {
      dispatch(showAlertMessage(err.response.data.msg, "error"));
    } else {
      dispatch(showAlertMessage("Error liking comment", "error"));
    }
    dispatch({
      type: INTERNSHIP_ERROR,
      payload: {
        msg: err.response?.statusText || "Network error",
        status: err.response?.status || 500,
      },
    });
  }
};

// Unlike a comment
export const unlikeComment = (internshipId, commentId) => async (dispatch) => {
  try {
    const res = await api.put(`/internships/${internshipId}/comment/${commentId}/unlike`);

    dispatch({
      type: UNLIKE_COMMENT,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.data && err.response.data.msg) {
      dispatch(showAlertMessage(err.response.data.msg, "error"));
    } else {
      dispatch(showAlertMessage("Error unliking comment", "error"));
    }
    dispatch({
      type: INTERNSHIP_ERROR,
      payload: {
        msg: err.response?.statusText || "Network error",
        status: err.response?.status || 500,
      },
    });
  }
};

// Like/unlike internship (interested feature)
export const likeInternship = (internshipId) => async (dispatch) => {
  try {
    const res = await api.put(`/internships/${internshipId}/like`);

    dispatch({
      type: LIKE_INTERNSHIP,
      payload: { internshipId, likes: res.data },
    });
  } catch (err) {
    if (err.response && err.response.data && err.response.data.msg) {
      dispatch(showAlertMessage(err.response.data.msg, "error"));
    } else {
      dispatch(showAlertMessage("Error updating interest", "error"));
    }
    dispatch({
      type: INTERNSHIP_ERROR,
      payload: {
        msg: err.response?.statusText || "Network error",
        status: err.response?.status || 500,
      },
    });
  }
};

// Fetch tracking users for an internship
export const fetchTrackingUsers = (internshipId) => async (dispatch) => {
  try {
    const res = await api.get(`/internships/${internshipId}/tracking-users`);

    dispatch({
      type: FETCH_TRACKING_USERS,
      payload: { internshipId, users: res.data },
    });
  } catch (err) {
    dispatch({
      type: INTERNSHIP_ERROR,
      payload: {
        msg: err.response?.statusText || "Network error",
        status: err.response?.status || 500,
      },
    });
  }
};

// Initial State
const initialState = {
  items: [],
  current: null,
  trackingUsers: [],
  insights: {}, // Store insights by internship ID
  loading: true,
  error: {},
  filters: {
    company: "",
    location: "",
    deadlineFrom: "",
    deadlineTo: "",
    tags: "",
    search: "",
    sort: "deadline",
    active: true,
  },
};

// Reducer
export default function reducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_INTERNSHIPS:
      return {
        ...state,
        items: payload,
        loading: false,
      };
    case FETCH_INTERNSHIP:
      return {
        ...state,
        current: payload,
        loading: false,
      };
    case CREATE_INTERNSHIP:
      return {
        ...state,
        items: [payload, ...state.items],
        loading: false,
      };
    case UPDATE_INTERNSHIP:
      return {
        ...state,
        items: state.items.map((item) =>
          item._id === payload._id ? payload : item
        ),
        current: state.current?._id === payload._id ? payload : state.current,
        loading: false,
      };
    case DELETE_INTERNSHIP:
      return {
        ...state,
        items: state.items.filter((item) => item._id !== payload),
        current: state.current?._id === payload ? null : state.current,
        loading: false,
      };
    case SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...payload },
      };
    case CLEAR_FILTERS:
      return {
        ...state,
        filters: {
          company: "",
          location: "",
          deadlineFrom: "",
          deadlineTo: "",
          tags: "",
          search: "",
          sort: "deadline",
          active: true,
        },
      };
    case ADD_COMMENT:
      return {
        ...state,
        current: { ...state.current, comments: payload },
        loading: false,
      };
    case DELETE_COMMENT:
      return {
        ...state,
        current: {
          ...state.current,
          comments: state.current.comments.filter(
            (comment) => comment._id !== payload
          ),
        },
        loading: false,
      };
    case REACT_TO_COMMENT:
      return {
        ...state,
        current: { ...state.current, comments: payload },
        loading: false,
      };
    case LIKE_COMMENT:
      return {
        ...state,
        current: { ...state.current, comments: payload },
        loading: false,
      };
    case UNLIKE_COMMENT:
      return {
        ...state,
        current: { ...state.current, comments: payload },
        loading: false,
      };
    case LIKE_INTERNSHIP:
      return {
        ...state,
        items: state.items.map((item) =>
          item._id === payload.internshipId
            ? { ...item, likes: payload.likes }
            : item
        ),
        current:
          state.current?._id === payload.internshipId
            ? { ...state.current, likes: payload.likes }
            : state.current,
        loading: false,
      };
    case FETCH_TRACKING_USERS:
      return {
        ...state,
        trackingUsers: payload.users,
        loading: false,
      };
    case "internships/UPDATE_TRACKING_COUNT":
      return {
        ...state,
        items: state.items.map((item) =>
          item._id === payload.internshipId
            ? {
                ...item,
                trackingCount: Math.max(
                  0,
                  (item.trackingCount || 0) + payload.increment
                ),
              }
            : item
        ),
        current:
          state.current?._id === payload.internshipId
            ? {
                ...state.current,
                trackingCount: Math.max(
                  0,
                  (state.current.trackingCount || 0) + payload.increment
                ),
              }
            : state.current,
      };
    case UPDATE_INSIGHTS:
      const currentInsights = state.insights[payload.internshipId] || { saved: 0 };
      const updatedInsights = {
        ...currentInsights,
        saved: Math.max(0, currentInsights.saved + (payload.saved || 0))
      };
      return {
        ...state,
        insights: {
          ...state.insights,
          [payload.internshipId]: updatedInsights
        }
      };
    case SET_INSIGHTS:
      return {
        ...state,
        insights: {
          ...state.insights,
          [payload.internshipId]: payload.insights
        }
      };
    case INTERNSHIP_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
