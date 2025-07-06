import { api } from "../../utils";
import { showAlertMessage } from "./alerts";

export const GET_POSTS = "posts/GET_POSTS";
export const GET_POST = "posts/GET_POST";
export const POST_ERROR = "posts/POST_ERROR";
export const UPDATE_LIKES = "posts/UPDATE_LIKES";
export const DELETE_POST = "posts/DELETE_POST";
export const ADD_POST = "posts/ADD_POST";
export const ADD_COMMENT = "posts/ADD_COMMENT";
export const REMOVE_COMMENT = "posts/REMOVE_COMMENT";

// Get posts
export const getPosts = () => async (dispatch) => {
  try {
    const res = await api.get("/posts");

    dispatch({
      type: GET_POSTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response?.statusText || "Network error",
        status: err.response?.status || 500,
      },
    });
  }
};

// Add like
export const addLike = (id) => async (dispatch) => {
  try {
    const res = await api.put(`/posts/like/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data.likes, unlikes: res.data.unlikes },
    });
  } catch (err) {
    console.error("Error adding like:", err);
    if (err.response && err.response.data && err.response.data.msg) {
      dispatch(showAlertMessage(err.response.data.msg, "error"));
    } else {
      dispatch(showAlertMessage("Error adding like", "error"));
    }
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response?.statusText || "Error adding like",
        status: err.response?.status || 500,
      },
    });
  }
};

// Remove like
export const removeLike = (id) => async (dispatch) => {
  try {
    const res = await api.put(`/posts/unlike/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data.likes, unlikes: res.data.unlikes },
    });
  } catch (err) {
    console.error("Error removing like:", err);
    if (err.response && err.response.data && err.response.data.msg) {
      dispatch(showAlertMessage(err.response.data.msg, "error"));
    } else {
      dispatch(showAlertMessage("Error removing like", "error"));
    }
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response?.statusText || "Error removing like",
        status: err.response?.status || 500,
      },
    });
  }
};

// Delete post
export const deletePost = (id) => async (dispatch) => {
  try {
    await api.delete(`/posts/${id}`);

    dispatch({
      type: DELETE_POST,
      payload: id,
    });

    dispatch(showAlertMessage("Post Removed", "success"));
  } catch (err) {
    console.error("Error deleting post:", err);
    if (err.response && err.response.data && err.response.data.msg) {
      dispatch(showAlertMessage(err.response.data.msg, "error"));
    } else {
      dispatch(showAlertMessage("Error deleting post", "error"));
    }
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response?.statusText || "Error deleting post",
        status: err.response?.status || 500,
      },
    });
  }
};

// Add post
export const addPost = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/posts", formData);

    dispatch({
      type: ADD_POST,
      payload: res.data,
    });

    dispatch(showAlertMessage("Post Created", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response?.statusText || "Network error",
        status: err.response?.status || 500,
      },
    });
  }
};

// Get post
export const getPost = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/posts/${id}`);

    dispatch({
      type: GET_POST,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response?.statusText || "Network error",
        status: err.response?.status || 500,
      },
    });
  }
};

// Add comment
export const addComment = (postId, formData) => async (dispatch) => {
  try {
    const res = await api.post(`/posts/comment/${postId}`, formData);

    dispatch({
      type: ADD_COMMENT,
      payload: res.data,
    });

    dispatch(showAlertMessage("Comment Added", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response?.statusText || "Network error",
        status: err.response?.status || 500,
      },
    });
  }
};

// Delete comment
export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    await api.delete(`/posts/comment/${postId}/${commentId}`);

    dispatch({
      type: REMOVE_COMMENT,
      payload: commentId,
    });

    dispatch(showAlertMessage("Comment Removed", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response?.statusText || "Network error",
        status: err.response?.status || 500,
      },
    });
  }
};

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {},
};

export default function reducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false,
      };
    case GET_POST:
      return {
        ...state,
        post: payload,
        loading: false,
      };
    case ADD_POST:
      return {
        ...state,
        posts: [payload, ...state.posts],
        loading: false,
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== payload),
        loading: false,
      };
    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === payload.id
            ? { ...post, likes: payload.likes, unlikes: payload.unlikes }
            : post
        ),
        loading: false,
      };
    case ADD_COMMENT:
      return {
        ...state,
        post: { ...state.post, comments: payload },
        loading: false,
      };
    case REMOVE_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.filter(
            (comment) => comment._id !== payload
          ),
        },
        loading: false,
      };
    default:
      return state;
  }
}
