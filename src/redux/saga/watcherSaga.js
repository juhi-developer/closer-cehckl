import {takeLatest, put} from 'redux-saga/effects';
import * as actions from '../actionTypes';
import {
  signUpHandler,
  signInHandler,
  logoutHandler,
  getUserProfileHandler,
  verifyOtpHandler,
  resendOtpHandler,
  partnerCodeHandler,
  resendPartnerCodeHandler,
  backupHandler,
  deactivateHandler,
  editProfileHandler,
  enableBiometricHandler,
  verifyBiometricHandler,
  addTemplateHandler,
  editTemplateHandler,
  getTemplatesHandler,
  deleteTemplateHandler,
  addTodoListHandler,
  editTodoListHandler,
  deleteTodoListHandler,
  addNoteHandler,
  editNoteHandler,
  deleteNoteHandler,
  getOrganiseListHandler,
  pinUnpinHandler,
  getChatHandler,
  getLinksHandler,
  getMediaHandler,
  getChatSearchHandler,
  deleteChatHandler,
  getProfileHandler,
  addPostHandler,
  getPostHandler,
  addCommentHandler,
  deleteCommentHandler,
  deletePostHandler,
  addReactionHandler,
  deleteReactionHandler,
  addFeelingsCheckHandler,
  getFeelingsCheckHandler,
  addAnswerQaHandler,
  addEventHandler,
  editEventHandler,
  deleteEventHandler,
  getEventHandler,
  getSpecialEventHandler,
  addStoryHandler,
  deleteStoryHandler,
  addHighlightHandler,
  removeHighlightHandler,
  getStoriesHandler,
  getHighlightsHandler,
  createNewHighlightHandler,
  removeSingleHighlightHandler,
} from './handlers';

//SignIn
export function* SignIn() {
  try {
    yield takeLatest(actions.LOGIN, signInHandler);
  } catch (ex) {
    yield put({type: actions.LOGIN_FAILURE, message: ex});
  }
}

//Logout
export function* Logout() {
  try {
    yield takeLatest(actions.LOGOUT, logoutHandler);
  } catch (ex) {
    yield put({type: actions.LOGOUT_FAILURE, message: ex});
  }
}

// Sign Up
export function* SignUp() {
  try {
    yield takeLatest(actions.SIGNUP, signUpHandler);
  } catch (ex) {
    yield put({type: actions.SIGNUP_FAILURE, message: ex});
  }
}

// Verify otp
export function* VerifyOtp() {
  try {
    yield takeLatest(actions.VERIFY_OTP, verifyOtpHandler);
  } catch (ex) {
    yield put({type: actions.VERIFY_OTP_FAILURE, message: ex});
  }
}

// Resend otp
export function* ResendOtp() {
  try {
    yield takeLatest(actions.RESEND_OTP, resendOtpHandler);
  } catch (ex) {
    yield put({type: actions.RESEND_OTP_FAILURE, message: ex});
  }
}

// Partner Code
export function* PartnerCode() {
  try {
    yield takeLatest(actions.PARTNER_CODE, partnerCodeHandler);
  } catch (ex) {
    yield put({type: actions.PARTNER_CODE_FAILURE, message: ex});
  }
}

// Partner Code
export function* ResendPartnerCode() {
  try {
    yield takeLatest(actions.RESEND_PARTNER_CODE, resendPartnerCodeHandler);
  } catch (ex) {
    yield put({type: actions.RESEND_PARTNER_CODE_FAILURE, message: ex});
  }
}

// User Profile
export function* GetUserProfile() {
  try {
    yield takeLatest(actions.GET_USER_PROFILE, getUserProfileHandler);
  } catch (ex) {
    yield put({type: actions.GET_USER_PROFILE_FAILURE, message: ex});
  }
}

// backup
export function* Backup() {
  try {
    yield takeLatest(actions.BACKUP, backupHandler);
  } catch (ex) {
    yield put({type: actions.BACKUP_FAILURE, message: ex});
  }
}

// DEACTIVATE
export function* Deactivate() {
  try {
    yield takeLatest(actions.DEACTIVATE, deactivateHandler);
  } catch (ex) {
    yield put({type: actions.DEACTIVATE_FAILURE, message: ex});
  }
}

// EDIT PRFOILE
export function* EditProfile() {
  try {
    yield takeLatest(actions.EDIT_PROFILE, editProfileHandler);
  } catch (ex) {
    yield put({type: actions.EDIT_PROFILE_FAILURE, message: ex});
  }
}

// ENABLE BIOMETRIC
export function* EnableBiometric() {
  try {
    yield takeLatest(actions.ENABLE_BIOMETRIC, enableBiometricHandler);
  } catch (ex) {
    yield put({type: actions.ENABLE_BIOMETRIC_FAILURE, message: ex});
  }
}

// VERIFY BIOMETRIC
export function* VerifyBiometric() {
  try {
    yield takeLatest(actions.VERIFY_BIOMETRIC, verifyBiometricHandler);
  } catch (ex) {
    yield put({type: actions.VERIFY_BIOMETRIC_FAILURE, message: ex});
  }
}

// ADD template
export function* AddTemplate() {
  try {
    yield takeLatest(actions.ADD_TEMPLATE, addTemplateHandler);
  } catch (ex) {
    yield put({type: actions.ADD_TEMPLATE_FAILURE, message: ex});
  }
}

// Edit Template
export function* EditTemplate() {
  try {
    yield takeLatest(actions.EDIT_TEMPLATE, editTemplateHandler);
  } catch (ex) {
    yield put({type: actions.EDIT_TEMPLATE_FAILURE, message: ex});
  }
}

// Delete Template
export function* DeleteTemplate() {
  try {
    yield takeLatest(actions.DELETE_TEMPLATE, deleteTemplateHandler);
  } catch (ex) {
    yield put({type: actions.DELETE_TEMPLATE_FAILURE, message: ex});
  }
}

// Get Templates
export function* GetTemplates() {
  try {
    yield takeLatest(actions.GET_TEMPLATES, getTemplatesHandler);
  } catch (ex) {
    yield put({type: actions.GET_TEMPLATES_FAILURE, message: ex});
  }
}

// ADD todo
export function* AddTodoList() {
  try {
    yield takeLatest(actions.ADD_TODO_LIST, addTodoListHandler);
  } catch (ex) {
    yield put({type: actions.ADD_TODO_LIST_FAILURE, message: ex});
  }
}

// Edit Todo
export function* EditTodoList() {
  try {
    yield takeLatest(actions.EDIT_TODO_LIST, editTodoListHandler);
  } catch (ex) {
    yield put({type: actions.EDIT_TODO_LIST_FAILURE, message: ex});
  }
}

// Delete Todo
export function* DeleteTodoList() {
  try {
    yield takeLatest(actions.DELETE_TODO_LIST, deleteTodoListHandler);
  } catch (ex) {
    yield put({type: actions.DELETE_TODO_LIST_FAILURE, message: ex});
  }
}

// Pin unpin
export function* PinUnpin() {
  try {
    yield takeLatest(actions.PIN_UNPIN, pinUnpinHandler);
  } catch (ex) {
    yield put({type: actions.PIN_UNPIN_FAILURE, message: ex});
  }
}

// ADD POST
export function* AddPost() {
  try {
    yield takeLatest(actions.ADD_POST, addPostHandler);
  } catch (ex) {
    yield put({type: actions.ADD_POST_FAILURE, message: ex});
  }
}

// Get POST
export function* GetPost() {
  try {
    yield takeLatest(actions.GET_POST, getPostHandler);
  } catch (ex) {
    yield put({type: actions.GET_POST_FAILURE, message: ex});
  }
}

// Delete Todo
export function* DeletePost() {
  try {
    yield takeLatest(actions.DELETE_POST, deletePostHandler);
  } catch (ex) {
    yield put({type: actions.DELETE_POST_FAILURE, message: ex});
  }
}

// ADD REACTION
export function* AddReaction() {
  try {
    yield takeLatest(actions.ADD_REACTION, addReactionHandler);
  } catch (ex) {
    yield put({type: actions.ADD_POST_FAILURE, message: ex});
  }
}

// ADD ANSWER QA
export function* AddAnswerQa() {
  try {
    yield takeLatest(actions.ADD_ANSWER_QA, addAnswerQaHandler);
  } catch (ex) {
    yield put({type: actions.ADD_ANSWER_QA_FAILURE, message: ex});
  }
}

// ADD REACTION
export function* AddFeelingsCheck() {
  try {
    yield takeLatest(actions.ADD_FEELINGS_CHECK, addFeelingsCheckHandler);
  } catch (ex) {
    yield put({type: actions.ADD_FEELINGS_CHECK_FAILURE, message: ex});
  }
}

// Get FEELINGS CHECK
export function* GetFeelingsCheck() {
  try {
    yield takeLatest(actions.GET_FEELINGS_CHECK, getFeelingsCheckHandler);
  } catch (ex) {
    yield put({type: actions.GET_FEELINGS_CHECK_FAILURE, message: ex});
  }
}

// Delete Todo
export function* DeleteReaction() {
  try {
    yield takeLatest(actions.DELETE_REACTION, deleteReactionHandler);
  } catch (ex) {
    yield put({type: actions.DELETE_REACTION_FAILURE, message: ex});
  }
}

// ADD COMMENT
export function* AddComment() {
  try {
    yield takeLatest(actions.ADD_COMMENT, addCommentHandler);
  } catch (ex) {
    yield put({type: actions.ADD_COMMENT_FAILURE, message: ex});
  }
}

// Delete Todo
export function* DeleteComment() {
  try {
    yield takeLatest(actions.DELETE_COMMENT, deleteCommentHandler);
  } catch (ex) {
    yield put({type: actions.DELETE_COMMENT_FAILURE, message: ex});
  }
}

// ADD note
export function* AddNote() {
  try {
    yield takeLatest(actions.ADD_NOTE, addNoteHandler);
  } catch (ex) {
    yield put({type: actions.ADD_TODO_LIST_FAILURE, message: ex});
  }
}

// Edit Todo
export function* EditNote() {
  try {
    yield takeLatest(actions.EDIT_NOTE, editNoteHandler);
  } catch (ex) {
    yield put({type: actions.EDIT_NOTE_FAILURE, message: ex});
  }
}

// Delete Todo
export function* DeleteNote() {
  try {
    yield takeLatest(actions.DELETE_NOTE, deleteNoteHandler);
  } catch (ex) {
    yield put({type: actions.DELETE_NOTE_FAILURE, message: ex});
  }
}

// Get organise
export function* GetOrganiseList() {
  try {
    yield takeLatest(actions.GET_ORGANISE_LIST, getOrganiseListHandler);
  } catch (ex) {
    yield put({type: actions.GET_ORGANISE_LIST_FAILURE, message: ex});
  }
}

// Get chat
export function* GetChat() {
  try {
    yield takeLatest(actions.GET_CHAT, getChatHandler);
  } catch (ex) {
    yield put({type: actions.GET_CHAT_FAILURE, message: ex});
  }
}

// Get Media
export function* GetMedia() {
  try {
    yield takeLatest(actions.GET_MEDIA, getMediaHandler);
  } catch (ex) {
    yield put({type: actions.GET_MEDIA_FAILURE, message: ex});
  }
}

// Get Links
export function* GetLinks() {
  try {
    yield takeLatest(actions.GET_LINKS, getLinksHandler);
  } catch (ex) {
    yield put({type: actions.GET_LINKS_FAILURE, message: ex});
  }
}

// deLETE CHAT
export function* DeleteChat() {
  try {
    yield takeLatest(actions.DELETE_CHAT, deleteChatHandler);
  } catch (ex) {
    yield put({type: actions.DELETE_CHAT_FAILURE, message: ex});
  }
}

// Get CHAR SEARCH
export function* GetChatSearch() {
  try {
    yield takeLatest(actions.GET_CHAT_SEARCH, getChatSearchHandler);
  } catch (ex) {
    yield put({type: actions.GET_CHAT_SEARCH_FAILURE, message: ex});
  }
}

// Get Profile
export function* GetProfile() {
  try {
    yield takeLatest(actions.GET_PROFILE, getProfileHandler);
  } catch (ex) {
    yield put({type: actions.GET_PROFILE_FAILURE, message: ex});
  }
}

// Add event
export function* AddEvent() {
  try {
    yield takeLatest(actions.ADD_EVENT, addEventHandler);
  } catch (ex) {
    yield put({type: actions.ADD_EVENT_FAILURE, message: ex});
  }
}

// Edit event
export function* EditEvent() {
  try {
    yield takeLatest(actions.EDIT_EVENT, editEventHandler);
  } catch (ex) {
    yield put({type: actions.EDIT_EVENT_FAILURE, message: ex});
  }
}

// delete event
export function* DeleteEvent() {
  try {
    yield takeLatest(actions.DELETE_EVENT, deleteEventHandler);
  } catch (ex) {
    yield put({type: actions.DELETE_EVENT_FAILURE, message: ex});
  }
}

// Get EVENTS
export function* GetEvent() {
  try {
    yield takeLatest(actions.GET_EVENT, getEventHandler);
  } catch (ex) {
    yield put({type: actions.GET_EVENT_FAILURE, message: ex});
  }
}

// Get SPECIAL EVENT
export function* GetSpecialEvent() {
  try {
    yield takeLatest(actions.GET_SPECIAL_EVENT, getSpecialEventHandler);
  } catch (ex) {
    yield put({type: actions.GET_SPECIAL_EVENT_FAILURE, message: ex});
  }
}

// add story
export function* AddStory() {
  try {
    yield takeLatest(actions.ADD_STORY, addStoryHandler);
  } catch (ex) {
    yield put({type: actions.ADD_STORY_FAILURE, message: ex});
  }
}

// delete story
export function* DeleteStory() {
  try {
    yield takeLatest(actions.DELETE_STORY, deleteStoryHandler);
  } catch (ex) {
    yield put({type: actions.DELETE_STORY_FAILURE, message: ex});
  }
}

// add highlight
export function* AddHighlight() {
  try {
    yield takeLatest(actions.ADD_HIGHLIGHT, addHighlightHandler);
  } catch (ex) {
    yield put({type: actions.ADD_HIGHLIGHT_FAILURE, message: ex});
  }
}

// remove highlight
export function* RemoveHighlight() {
  try {
    yield takeLatest(actions.REMOVE_HIGHLIGHT, removeHighlightHandler);
  } catch (ex) {
    yield put({type: actions.REMOVE_HIGHLIGHT_FAILURE, message: ex});
  }
}

// remove highlight
export function* RemoveSingleHighlight() {
  try {
    yield takeLatest(
      actions.REMOVE_SINGLE_HIGHLIGHT,
      removeSingleHighlightHandler,
    );
  } catch (ex) {
    yield put({type: actions.REMOVE_SINGLE_HIGHLIGHT_FAILURE, message: ex});
  }
}

// Get SPECIAL EVENT
export function* GetStories() {
  try {
    yield takeLatest(actions.GET_STORIES, getStoriesHandler);
  } catch (ex) {
    yield put({type: actions.GET_STORIES_FAILURE, message: ex});
  }
}

// Get SPECIAL EVENT
export function* GetHighlights() {
  try {
    yield takeLatest(actions.GET_HIGHLIGHTS, getHighlightsHandler);
  } catch (ex) {
    yield put({type: actions.GET_HIGHLIGHTS_FAILURE, message: ex});
  }
}

// Get NEW HI*GHLIGHT TYPE
export function* createNewHighlightType() {
  try {
    yield takeLatest(actions.CREATE_NEW_HIGHLIGHTS, createNewHighlightHandler);
  } catch (ex) {
    yield put({type: actions.GET_HIGHLIGHTS_FAILURE, message: ex});
  }
}
