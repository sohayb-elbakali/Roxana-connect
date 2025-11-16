import { api } from "../../utils";
import { showAlertMessage } from "./alerts";

// Action Types
export const FETCH_TRACKED = "tracking/FETCH_TRACKED";
export const TRACK_INTERNSHIP = "tracking/TRACK_INTERNSHIP";
export const UPDATE_TRACKING_STATUS = "tracking/UPDATE_TRACKING_STATUS";
export const UNTRACK_INTERNSHIP = "tracking/UNTRACK_INTERNSHIP";
export const UPDATE_NOTES = "tracking/UPDATE_NOTES";
export const FETCH_STATS = "tracking/FETCH_STATS";
export const TRACKING_ERROR = "tracking/TRACKING_ERROR";

// Action Creators

// Fetch all tracked internships for current user
export const fetchTrackedInternships = () => async (dispatch) => {
  try {
    const res = await api.get("/tracking");

    dispatch({
      type: FETCH_TRACKED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TRACKING_ERROR,
      payload: {
        msg: err.response?.statusText || "Network error",
        status: err.response?.status || 500,
      },
    });
  }
};

// Track a new internship
export const trackInternship = (internshipId, status = "not_applied") => async (dispatch) => {
  try {
    const res = await api.post("/tracking", { 
      internship: internshipId,
      status 
    });

    dispatch({
      type: TRACK_INTERNSHIP,
      payload: res.data,
    });

    // Update tracking count in internships state
    dispatch({
      type: "internships/UPDATE_TRACKING_COUNT",
      payload: { internshipId, increment: 1 },
    });

    // Refetch insights from server to get accurate counts
    try {
      const insightsRes = await api.get(`/tracking/insights/${internshipId}`);
      dispatch({
        type: "internships/SET_INSIGHTS",
        payload: { internshipId, insights: insightsRes.data },
      });
    } catch (err) {
      console.error('Error fetching insights:', err);
    }

    dispatch(showAlertMessage("Internship added to tracker", "success"));
  } catch (err) {
    if (err.response && err.response.data && err.response.data.msg) {
      dispatch(showAlertMessage(err.response.data.msg, "error"));
    } else {
      dispatch(showAlertMessage("Error tracking internship", "error"));
    }
    dispatch({
      type: TRACKING_ERROR,
      payload: {
        msg: err.response?.statusText || "Network error",
        status: err.response?.status || 500,
      },
    });
  }
};

// Update tracking status
export const updateTrackingStatus = (trackingId, status, applicationDate = null) => async (dispatch, getState) => {
  try {
    const data = { status };
    if (applicationDate) {
      data.applicationDate = applicationDate;
    }

    const res = await api.put(`/tracking/${trackingId}`, data);

    dispatch({
      type: UPDATE_TRACKING_STATUS,
      payload: res.data,
    });

    // Refetch insights for this internship to update the counts
    const internshipId = res.data.internship?._id || res.data.internship;
    if (internshipId) {
      try {
        const insightsRes = await api.get(`/tracking/insights/${internshipId}`);
        dispatch({
          type: "internships/SET_INSIGHTS",
          payload: { internshipId, insights: insightsRes.data },
        });
      } catch (err) {
        console.error('Error fetching insights:', err);
      }
    }

    // Fetch updated stats to keep progress indicator in sync
    dispatch(fetchTrackingStats());

    dispatch(showAlertMessage("Status updated", "success"));
  } catch (err) {
    if (err.response && err.response.data && err.response.data.errors) {
      const errors = err.response.data.errors;
      errors.forEach((error) => {
        dispatch(showAlertMessage(error.msg, "error"));
      });
    } else {
      dispatch(showAlertMessage("Error updating status", "error"));
    }
    dispatch({
      type: TRACKING_ERROR,
      payload: {
        msg: err.response?.statusText || "Network error",
        status: err.response?.status || 500,
      },
    });
  }
};

// Untrack internship
export const untrackInternship = (trackingId) => async (dispatch, getState) => {
  try {
    // Get the internship ID before deleting
    const tracking = getState().tracking.items.find(item => item._id === trackingId);
    const internshipId = tracking?.internship?._id || tracking?.internship;

    await api.delete(`/tracking/${trackingId}`);

    dispatch({
      type: UNTRACK_INTERNSHIP,
      payload: trackingId,
    });

    // Update tracking count in internships state
    if (internshipId) {
      dispatch({
        type: "internships/UPDATE_TRACKING_COUNT",
        payload: { internshipId, increment: -1 },
      });

      // Refetch insights from server to get accurate counts
      try {
        const insightsRes = await api.get(`/tracking/insights/${internshipId}`);
        dispatch({
          type: "internships/SET_INSIGHTS",
          payload: { internshipId, insights: insightsRes.data },
        });
      } catch (err) {
        console.error('Error fetching insights:', err);
      }
    }

    dispatch(showAlertMessage("Internship removed from tracker", "success"));
  } catch (err) {
    if (err.response && err.response.data && err.response.data.msg) {
      dispatch(showAlertMessage(err.response.data.msg, "error"));
    } else {
      dispatch(showAlertMessage("Error removing from tracker", "error"));
    }
    dispatch({
      type: TRACKING_ERROR,
      payload: {
        msg: err.response?.statusText || "Network error",
        status: err.response?.status || 500,
      },
    });
  }
};

// Update private notes
export const updateNotes = (trackingId, notes) => async (dispatch) => {
  try {
    const res = await api.put(`/tracking/${trackingId}/notes`, { privateNotes: notes });

    dispatch({
      type: UPDATE_NOTES,
      payload: res.data,
    });

    dispatch(showAlertMessage("Notes updated", "success"));
  } catch (err) {
    if (err.response && err.response.data && err.response.data.msg) {
      dispatch(showAlertMessage(err.response.data.msg, "error"));
    } else {
      dispatch(showAlertMessage("Error updating notes", "error"));
    }
    dispatch({
      type: TRACKING_ERROR,
      payload: {
        msg: err.response?.statusText || "Network error",
        status: err.response?.status || 500,
      },
    });
  }
};

// Fetch tracking statistics
export const fetchTrackingStats = () => async (dispatch) => {
  try {
    const res = await api.get("/tracking/stats");

    dispatch({
      type: FETCH_STATS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TRACKING_ERROR,
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
  loading: true,
  error: {},
  stats: {
    total: 0,
    not_applied: 0,
    applied: 0,
    interviewing: 0,
    offer_received: 0,
    rejected: 0,
    accepted: 0,
    declined: 0,
  },
};

// Reducer
export default function reducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_TRACKED:
      return {
        ...state,
        items: payload,
        loading: false,
      };
    case TRACK_INTERNSHIP:
      return {
        ...state,
        items: [payload, ...state.items],
        loading: false,
      };
    case UPDATE_TRACKING_STATUS:
      return {
        ...state,
        items: state.items.map((item) =>
          item._id === payload._id ? payload : item
        ),
        loading: false,
      };
    case UNTRACK_INTERNSHIP:
      return {
        ...state,
        items: state.items.filter((item) => item._id !== payload),
        loading: false,
      };
    case UPDATE_NOTES:
      return {
        ...state,
        items: state.items.map((item) =>
          item._id === payload._id ? payload : item
        ),
        loading: false,
      };
    case FETCH_STATS:
      return {
        ...state,
        stats: payload,
        loading: false,
      };
    case TRACKING_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
