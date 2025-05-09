import * as actions from './actionTypes';

// Action Creators
export const fetchMomentsRequest = page => ({
  type: actions.FETCH_MOMENTS_REQUEST,
  payload: {page},
});

export const fetchMomentsSuccess = (data, page) => ({
  type: actions.FETCH_MOMENTS_SUCCESS,
  payload: {data, page},
});

export const fetchMomentsFailure = error => ({
  type: actions.FETCH_MOMENTS_FAILURE,
  payload: {error},
});

// Action Creators
export const addPostRequest = () => ({
  type: actions.ADD_POST_REQUEST,
});

export const addPostSuccess = post => dispatch => {
  return new Promise(resolve => {
    dispatch({type: actions.ADD_POST_SUCCESS, payload: post});
    resolve();
  });
};
// export const addPostSuccess = post => ({
//   type: actions.ADD_POST_SUCCESS,
//   payload: post
// });

export const addPostFailure = error => ({
  type: actions.ADD_POST_FAILURE,
  payload: error,
});

export const deletePostRequest = () => ({
  type: actions.DELETE_POST_REQUEST,
});

export const deletePostSuccess = postId => ({
  type: actions.DELETE_POST_SUCCESS,
  payload: postId,
});

export const deletePostFailure = error => ({
  type: actions.DELETE_POST_FAILURE,
  payload: error,
});

export const addPostReactionRequest = () => ({
  type: actions.ADD_POST_REACTION_REQUEST,
});

export const addPostReactionSuccess = (reactionData, postId) => ({
  type: actions.ADD_POST_REACTION_SUCCESS,
  payload: {reactionData, postId},
});

export const addPostReactionFailure = error => ({
  type: actions.ADD_POST_REACTION_FAILURE,
  payload: error,
});

// Action Creators
export const addCommentPostRequest = () => ({
  type: actions.ADD_COMMENT_POST_REQUEST,
});

export const addCommentPostSuccess = (comment, postId) => ({
  type: actions.ADD_COMMENT_POST_SUCCESS,
  payload: {comment, postId},
});

export const addCommentPostFailure = error => ({
  type: actions.ADD_COMMENT_POST_FAILURE,
  payload: error,
});

export const deleteCommentPostRequest = () => ({
  type: actions.DELETE_COMMENT_POST_REQUEST,
});

export const deleteCommentPostSuccess = (commentId, postId) => ({
  type: actions.DELETE_COMMENT_POST_SUCCESS,
  payload: {commentId, postId},
});

export const deleteCommentPostFailure = error => ({
  type: actions.DELETE_COMMENT_POST_FAILURE,
  payload: error,
});

export const setUserData = userData => ({
  type: actions.SET_USER_DATA,
  payload: {userData},
});

export const ClearAction = payload => {
  return {type: actions.CLEAR_DATA, payload};
};

export const Logout = payload => {
  return {type: actions.LOGOUT, payload};
};

export const SignIn = payload => {
  return {type: actions.LOGIN, payload};
};

export const SignUp = payload => {
  return {type: actions.SIGNUP, payload};
};

export const VerifyOtp = payload => {
  return {type: actions.VERIFY_OTP, payload};
};

export const ResendOtp = payload => {
  return {type: actions.RESEND_OTP, payload};
};

export const PartnerCode = payload => {
  return {type: actions.PARTNER_CODE, payload};
};

export const ResendPartnerCode = payload => {
  return {type: actions.RESEND_PARTNER_CODE, payload};
};

export const GetUserProfile = payload => {
  return {type: actions.GET_USER_PROFILE, payload};
};

export const Backup = payload => {
  return {type: actions.BACKUP, payload};
};

export const Deactivate = payload => {
  return {type: actions.DEACTIVATE, payload};
};

export const EditProfile = payload => {
  return {type: actions.EDIT_PROFILE, payload};
};

export const EnableBiometric = payload => {
  return {type: actions.ENABLE_BIOMETRIC, payload};
};

export const VerifyBiometric = payload => {
  return {type: actions.VERIFY_BIOMETRIC, payload};
};

export const AddTemplate = payload => {
  return {type: actions.ADD_TEMPLATE, payload};
};

export const EditTemplate = payload => {
  return {type: actions.EDIT_TEMPLATE, payload};
};

export const DeleteTemplate = payload => {
  return {type: actions.DELETE_TEMPLATE, payload};
};

export const GetTemplates = payload => {
  return {type: actions.GET_TEMPLATES, payload};
};

export const AddTodoList = payload => {
  return {type: actions.ADD_TODO_LIST, payload};
};

export const EditTodoList = payload => {
  return {type: actions.EDIT_TODO_LIST, payload};
};

export const DeleteTodoList = payload => {
  return {type: actions.DELETE_TODO_LIST, payload};
};

export const PinUnpin = payload => {
  return {type: actions.PIN_UNPIN, payload};
};

export const AddPost = payload => {
  return {type: actions.ADD_POST, payload};
};

export const GetPost = payload => {
  return {type: actions.GET_POST, payload};
};

// export const DeletePost = payload => {
//   return {type: actions.DELETE_POST, payload};
// };

export const GetFeelingsCheck = payload => {
  return {type: actions.GET_FEELINGS_CHECK, payload};
};

export const AddFeelingsCheck = payload => {
  return {type: actions.ADD_FEELINGS_CHECK, payload};
};

export const AddAnswerQa = payload => {
  return {type: actions.ADD_ANSWER_QA, payload};
};

export const AddReaction = payload => {
  return {type: actions.ADD_REACTION, payload};
};

export const DeleteReaction = payload => {
  return {type: actions.DELETE_REACTION, payload};
};

export const AddComment = payload => {
  return {type: actions.ADD_COMMENT, payload};
};

export const DeleteComment = payload => {
  return {type: actions.DELETE_COMMENT, payload};
};

export const AddNote = payload => {
  return {type: actions.ADD_NOTE, payload};
};

export const EditNote = payload => {
  return {type: actions.EDIT_NOTE, payload};
};

export const DeleteNote = payload => {
  return {type: actions.DELETE_NOTE, payload};
};

export const GetOrganiseList = payload => {
  return {type: actions.GET_ORGANISE_LIST, payload};
};

export const GetChat = payload => {
  return {type: actions.GET_CHAT, payload};
};

export const GetMedia = payload => {
  return {type: actions.GET_MEDIA, payload};
};

export const GetLinks = payload => {
  return {type: actions.GET_LINKS, payload};
};

export const DeleteChat = payload => {
  return {type: actions.DELETE_CHAT, payload};
};

export const GetChatSearch = payload => {
  return {type: actions.GET_CHAT_SEARCH, payload};
};

export const GetProfile = payload => {
  return {type: actions.GET_PROFILE, payload};
};

export const AddEvent = payload => {
  return {type: actions.ADD_EVENT, payload};
};

export const EditEvent = payload => {
  return {type: actions.EDIT_EVENT, payload};
};

export const DeleteEvent = payload => {
  return {type: actions.DELETE_EVENT, payload};
};

export const GetEvents = payload => {
  return {type: actions.GET_EVENT, payload};
};

export const GetSpecialEvent = payload => {
  return {type: actions.GET_SPECIAL_EVENT, payload};
};

export const AddStory = payload => {
  return {type: actions.ADD_STORY, payload};
};

export const DeleteStory = payload => {
  return {type: actions.DELETE_STORY, payload};
};

export const AddHighlight = payload => {
  return {type: actions.ADD_HIGHLIGHT, payload};
};

export const RemoveHighlight = payload => {
  return {type: actions.REMOVE_HIGHLIGHT, payload};
};

export const RemoveSingleHighlight = payload => {
  return {type: actions.REMOVE_SINGLE_HIGHLIGHT, payload};
};

export const GetStories = payload => {
  return {type: actions.GET_STORIES, payload};
};

export const GetHighlights = payload => {
  return {type: actions.GET_HIGHLIGHTS, payload};
};

export const createNewHighlight = payload => {
  return {type: actions.CREATE_NEW_HIGHLIGHTS, payload};
};
