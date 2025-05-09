import {EventRegister} from 'react-native-event-listeners';
import {
  removeCommentFromPost,
  updateCommentsInPosts,
  updateReactionInArray,
  updateReactionsPostsComments,
} from '../../utils/utils';
import * as actions from '../actionTypes';
import {Platform} from 'react-native';

const initialState = {
  posts: [],
  user: null,
  specialEvents: [],
  loading: false,
  error: null,
  hasMore: true,
  currentPage: 0, // This will keep track of the current page globally
};

export const postLimit = 12; // This will be the number of posts to fetch per page

export default function momentsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_MOMENTS_REQUEST:
      return {...state, footerLoader: true};
    case actions.FETCH_MOMENTS_SUCCESS:
      const {data, page} = action.payload;

      return {
        ...state,
        posts: page === 0 ? data.posts : [...state.posts, ...data.posts],
        user: data.user,
        specialEvents: data.specialEvents,
        footerLoader: false,

        hasMore: data.posts.length === postLimit, // assuming 'limit' is available globally or you adjust accordingly
        currentPage: page + 1,
        //   loading: false
      };
    case actions.FETCH_MOMENTS_FAILURE:
      return {...state, footerLoader: false, error: action.payload.error};

    case actions.ADD_POST_REQUEST:
      return {...state, loading: true, error: null};
    case actions.ADD_POST_SUCCESS:
      EventRegister.emit('addPostSuccess');

      const isPostExists = state.posts.some(
        post => post._id === action.payload.post._id,
      );
      // Adds a new post at the beginning of the posts array

      return {
        ...state,
        // Only add the new post if it doesn't already exist
        posts: isPostExists
          ? [...state.posts]
          : [action.payload.post, ...state.posts],
        loading: false,
        payload: action.payload,
      };

    case actions.ADD_POST_FAILURE:
      return {...state, loading: false, error: action.payload.error};

    case actions.DELETE_POST_REQUEST:
      return {...state, loading: true};
    case actions.DELETE_POST_SUCCESS:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload),
        loading: false,
      };
    case actions.DELETE_POST_FAILURE:
      return {...state, loading: false, error: action.payload};

    /// Add Post Reaction
    case actions.ADD_POST_REACTION_REQUEST:
      return {...state, loading: true};
    case actions.ADD_POST_REACTION_SUCCESS:
      console.log(
        'state.onAddPostReaction',
        Platform.OS,
        'action.payload',
        action.payload,
      );

      return {
        ...state,
        posts: updateReactionsPostsComments(state.posts, action.payload),

        //      posts: updateReactionInArray(state.posts, action.payload),
        loading: false,
      };

    case actions.ADD_POST_REACTION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case actions.ADD_COMMENT_POST_REQUEST:
      return {...state, loading: true};
    case actions.ADD_COMMENT_POST_SUCCESS:
      console.log('action.payload add comment', Platform.OS, action.payload);
      return {
        ...state,
        posts: updateCommentsInPosts(
          state.posts,
          action.payload.comment.comment,
          action.payload.comment.postId,
        ),
        loading: false,
      };
    case actions.ADD_COMMENT_POST_FAILURE:
      return {...state, loading: false, error: action.payload};

    case actions.DELETE_COMMENT_POST_REQUEST:
      return {...state, loading: true};
    case actions.DELETE_COMMENT_POST_SUCCESS:
      console.log(
        'second',
        action.payload.commentId,
        'third',
        action.payload.postId,
      );
      return {
        ...state,
        posts: removeCommentFromPost(
          state.posts,
          action.payload.commentId,
          action.payload.postId,
        ),
        loading: false,
      };
    case actions.DELETE_COMMENT_POST_FAILURE:
      return {...state, loading: false, error: action.payload};

    default:
      return state;
  }
}
