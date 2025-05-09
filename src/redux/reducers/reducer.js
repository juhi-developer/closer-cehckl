import * as actions from '../actionTypes';

export default function reducer(state = [], action){
  switch (action.type) {
    case actions.LOADER:
      return {
        ...state,
        case: action.type,
        loading: action.loading,
      };
    case actions.CLEAR_DATA:
      return {
        ...state,
        // userData: '',
        case: '',
        message: '',
        loading: null,
      };
    case actions.LOGIN_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        userData: action.payload.user,
        token: action.payload.token.token,
      };
    case actions.LOGOUT_SUCCESS:
       return {
        ...state,
        case: action.type,
        userData: '',
        message: '',
        token: '',
        status_code: '',
      };
    case actions.SIGNUP_SUCCESS:
     
      return {
        ...state,
        case: action.type,
        message: action.message,
        userData: action.payload.user,
        token: action.payload.token.token,
      };
    case actions.VERIFY_OTP_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        userData: action.payload.user,
        token: action.payload.token.token,
      };
    case actions.RESEND_OTP_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        resendOtpData: action.payload,
      };

    case actions.PARTNER_CODE_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        partnerCodeData: action.payload,
        userData: action.payload.user,
      };

    case actions.RESEND_PARTNER_CODE_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        resendPartnerCodeData: action.payload,
      };

    case actions.GET_USER_PROFILE_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        userData: action.payload,
      };
    case actions.BACKUP_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        backup: action.payload,
        userData: action.payload,
      };
    case actions.DEACTIVATE_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        userData: '',
        token: '',
        status_code: '',
        // backup: action.payload,
      };

    case actions.EDIT_PROFILE_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        userData: action.payload,
        // backup: action.payload,
      };

    case actions.ENABLE_BIOMETRIC_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        biometric: action.payload,
        // backup: action.payload,
      };

    case actions.VERIFY_BIOMETRIC_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        biometric: action.payload,
        userData: action.payload.user,
        token: action.payload.token.token,
        // backup: action.payload,
      };

    case actions.ADD_TEMPLATE_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
      };

    case actions.EDIT_TEMPLATE_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
      };

    case actions.DELETE_TEMPLATE_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
      };

    case actions.GET_TEMPLATES_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        templates: action.payload.templates,
      };

    case actions.ADD_TODO_LIST_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
      };

    case actions.EDIT_TODO_LIST_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
      };

    case actions.DELETE_TODO_LIST_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
      };

    case actions.PIN_UNPIN_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
      };

    case actions.ADD_POST_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        post: action.payload,
      };

    case actions.GET_POST_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        post: action.payload,
      };

    // case actions.DELETE_POST_SUCCESS:
    //   return {
    //     ...state,
    //     case: action.type,
    //     message: action.message,
    //     post: action.payload,
    //   };

    case actions.ADD_COMMENT_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        comment: action.payload,
      };

    case actions.DELETE_COMMENT_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        comment: action.payload,
      };

    case actions.ADD_FEELINGS_CHECK_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        feelingsCheck: action.payload,
      };

    case actions.ADD_ANSWER_QA_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        answerQa: action.payload,
      };

    case actions.GET_FEELINGS_CHECK_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        feelingsCheck: action.payload,
      };

    case actions.ADD_REACTION_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        reaction: action.payload,
      };

    case actions.DELETE_REACTION_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        reaction: action.payload,
      };

    case actions.ADD_NOTE_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
      };

    case actions.EDIT_NOTE_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
      };

    case actions.DELETE_NOTE_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
      };

    case actions.GET_ORGANISE_LIST_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        organiseList: action.payload,
      };
    case actions.GET_CHAT_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        chat: action.payload,
      };
    case actions.GET_MEDIA_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        media: action.payload,
      };
    case actions.GET_LINKS_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        links: action.payload,
      };
    case actions.DELETE_CHAT:
      return {
        ...state,
        case: action.type,
        message: action.message,
      };
    case actions.GET_CHAT_SEARCH_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        searchedChat: action.payload,
      };
    case actions.GET_PROFILE_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        profileData: action.payload,
      };
    case actions.ADD_EVENT_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
      };
    case actions.EDIT_EVENT_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
      };
    case actions.DELETE_EVENT_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
      };
    case actions.GET_EVENT_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        events: action.payload,
      };
    case actions.GET_SPECIAL_EVENT_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        specialEvent: action.payload,
      };

    case actions.ADD_STORY_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
      };
    case actions.DELETE_STORY_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
      };
    case actions.ADD_HIGHLIGHT_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
      };
    case actions.REMOVE_HIGHLIGHT_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
      };

    case actions.REMOVE_SINGLE_HIGHLIGHT_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
      };

    case actions.GET_STORIES_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        stories: action.payload,
      };
    case actions.GET_HIGHLIGHTS_SUCCESS:
      return {
        ...state,
        case: action.type,
        message: action.message,
        highlights: action.payload,
      };

    default:
      return {
        ...state,
        case: action.type,
        message: action.message,
        status: action.payload,
      };
  }
};
