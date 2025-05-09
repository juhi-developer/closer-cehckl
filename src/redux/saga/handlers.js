import {put} from 'redux-saga/effects';
import * as actions from '../actionTypes';
import API from './request';
import {
  addCommentPostFailure,
  addCommentPostRequest,
  addCommentPostSuccess,
  addPostFailure,
  addPostReactionFailure,
  addPostReactionRequest,
  addPostReactionSuccess,
  addPostRequest,
  addPostSuccess,
  deleteCommentPostFailure,
  deleteCommentPostRequest,
  deleteCommentPostSuccess,
  deletePostFailure,
  deletePostRequest,
  deletePostSuccess,
  fetchMomentsFailure,
  fetchMomentsRequest,
  fetchMomentsSuccess,
} from '../actions';
import {postLimit} from '../reducers/momentsReducer';
import {Platform} from 'react-native';

export const getMomentsData = page => async dispatch => {
  dispatch(fetchMomentsRequest());

  console.log('moments api triggered', Platform.OS);

  try {
    // return;
    const type = 'all';
    const response = await API(
      `user/moments?page=${page}&limit=${postLimit}&type=${type}`,
      'GET',
    );
    if (response?.body?.statusCode === 200) {
      dispatch(fetchMomentsSuccess(response.body.data, page));
      return response.body.data;
    } else {
      dispatch(fetchMomentsFailure('Failed to fetch moments'));
      return undefined;
    }
  } catch (error) {
    dispatch(fetchMomentsFailure(error.message));
    return undefined;
  }
};

export const addImagePost = params => async dispatch => {
  dispatch({type: actions.ADD_POST_REQUEST});
  try {
    const resp = await API('user/moments/feed', 'POST', params);
    if (resp.body.statusCode === 200) {
      dispatch({type: actions.ADD_POST_SUCCESS, payload: resp.body.data});
      return resp.body.data; // Resolve promise with data
    } else {
      dispatch({
        type: actions.ADD_POST_FAILURE,
        payload: {error: 'Failed to add post'},
      });
      throw new Error('Failed to add post');
    }
  } catch (error) {
    dispatch({
      type: actions.ADD_POST_FAILURE,
      payload: {error: error.toString()},
    });
    throw error; // Propagate error
  }
};

export const deletePost = postId => async dispatch => {
  dispatch(deletePostRequest());
  try {
    const resp = await API(`user/moments/feed?postId=${postId}`, 'DELETE');
    if (resp.status === 200 && resp.body.statusCode === 200) {
      dispatch(deletePostSuccess(postId));
    } else {
      dispatch(deletePostFailure('Failed to delete post'));
    }
  } catch (error) {
    dispatch(deletePostFailure(error.toString()));
  }
};

export const addReactionToPost = params => async (dispatch, getState) => {
  dispatch({type: actions.ADD_POST_REACTION_REQUEST});
  try {
    const resp = await API('user/moments/reaction', 'POST', params);
    if (resp.status === 200 && resp.body.statusCode === 200) {
      dispatch({
        type: actions.ADD_POST_REACTION_SUCCESS,
        payload: resp.body.data,
      });
    } else {
      dispatch({
        type: actions.ADD_POST_REACTION_FAILURE,
        payload: 'Failed to add reaction',
      });
    }
  } catch (error) {
    dispatch({
      type: actions.ADD_POST_REACTION_FAILURE,
      payload: error.toString(),
    });
  }
};

export const addCommentToPost = (commentData, postId) => async dispatch => {
  dispatch(addCommentPostRequest());
  try {
    const resp = await API('user/moments/comments', 'POST', {
      comment: commentData,
      postId: postId,
    });
    if (resp.status === 200 && resp.body.statusCode === 200) {
      dispatch(addCommentPostSuccess(resp.body.data, postId));
    } else {
      dispatch(
        addCommentPostFailure(resp.body.message || 'Failed to add comment'),
      );
    }
  } catch (error) {
    dispatch(addCommentPostFailure(error.toString()));
  }
};

export const deleteCommentPost = commentId => async dispatch => {
  console.log('comment iddddd', commentId);
  dispatch(deleteCommentPostRequest());
  try {
    const resp = await API(
      `user/moments/comments?commentId=${commentId}`,
      'DELETE',
    );
    if (resp.status === 200 && resp.body.statusCode === 200) {
      console.log('resp.body comment', resp.body.data);
      dispatch(deleteCommentPostSuccess(commentId, resp.body.data.postId));
    } else {
      dispatch(
        deleteCommentPostFailure(
          resp.body.message || 'Failed to delete comment',
        ),
      );
    }
  } catch (error) {
    dispatch(deleteCommentPostFailure(error.toString()));
  }
};

//SIGNIN
export function* signInHandler(payload) {
  console.log('check', payload);
  yield put({type: actions.LOADER, loading: true});
  const resp = yield API('user/auth/login', 'POST', payload.payload);
  if (resp.status == 200) {
    let response = resp.body;
    console.log('datalogin', resp.body);
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.LOGIN_SUCCESS,
        message: resp.body.message,
        payload: resp.body.data,
      });
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.LOGIN_FAILURE, message: resp.body.message});
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({type: actions.LOGIN_FAILURE, message: resp.body.Message});
  } else {
    yield put({type: actions.LOADER, loading: false});
    yield put({type: actions.LOGIN_FAILURE, message: resp.body.Message});
  }
}

export function* logoutHandler(payload) {
  yield put({type: actions.LOADER, loading: true});
  const resp = yield API('user/auth/logout', 'POST', payload.payload);
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('logout', resp.body)
    if (response.statusCode === 200) {
       yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.LOGOUT_SUCCESS,
        message: resp.body.message,
        payload: resp.body,
      });
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.LOGOUT_FAILURE,
        message: resp.body.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.LOGOUT_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// SIGNUP
export function* signUpHandler(payload) {
  console.log('testttt1111');
  const resp = yield API('user/auth/signup1', 'POST', payload.payload);
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('signup detail', response)
    if (response.statusCode == 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.SIGNUP_SUCCESS, payload: resp.body.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.SIGNUP_FAILURE, message: response.message});
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({type: actions.SIGNUP_FAILURE, message: resp.body.Message});
  }
}

// VERIFY OTP
export function* verifyOtpHandler(payload) {
  const resp = yield API('user/auth/verifyOtp1', 'POST', payload.payload);
  yield put({type: actions.LOADER, loading: true});
  console.log('resppppp error', resp);
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('signup detail', response)
    if (response.statusCode == 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.VERIFY_OTP_SUCCESS, payload: resp.body.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.VERIFY_OTP_FAILURE, message: response.message});
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({type: actions.VERIFY_OTP_FAILURE, message: resp.body.Message});
  }
}

// RESEND OTP
export function* resendOtpHandler(payload) {
  const resp = yield API('user/auth/resendOtp', 'POST', payload.payload);
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('signup detail', response)
    if (response.statusCode == 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.RESEND_OTP_SUCCESS, payload: resp.body.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.RESEND_OTP_FAILURE, message: response.message});
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({type: actions.RESEND_OTP_FAILURE, message: resp.body.Message});
  }
}

// PARTNER CODE
export function* partnerCodeHandler(payload) {
  const resp = yield API('user/auth/partnerCode1', 'POST', payload.payload);
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('signup detail', response)
    if (response.statusCode == 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.PARTNER_CODE_SUCCESS, payload: resp.body.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.PARTNER_CODE_FAILURE,
        message: response.message,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({type: actions.PARTNER_CODE_FAILURE, message: resp.body.Message});
  }
}

// RESEND PARTNER CODE
export function* resendPartnerCodeHandler(payload) {
  const resp = yield API(
    'user/auth/resendPartnerCode',
    'POST',
    payload.payload,
  );
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('signup detail', response)
    if (response.statusCode == 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.RESEND_PARTNER_CODE_SUCCESS,
        payload: resp.body.data,
      });
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.RESEND_PARTNER_CODE_FAILURE,
        message: response.message,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.RESEND_PARTNER_CODE_FAILURE,
      message: resp.body.Message,
    });
  }
}

// get user profile
export function* getUserProfileHandler(payload) {
  const resp = yield API('user/profile', 'GET');
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;

    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.GET_USER_PROFILE_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.GET_USER_PROFILE_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.GET_USER_PROFILE_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// BACKUP
export function* backupHandler(payload) {
  const resp = yield API('user/auth/backup', 'POST');
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.BACKUP_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.BACKUP_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.BACKUP_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// DEACTIVATE
export function* deactivateHandler(payload) {
  const resp = yield API('user/auth/deactivate1', 'POST');
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.DEACTIVATE_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.DEACTIVATE_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.DEACTIVATE_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// Edit profile
export function* editProfileHandler(payload) {
  const resp = yield API('user/profile', 'PUT', payload.payload);
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.EDIT_PROFILE_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.EDIT_PROFILE_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.EDIT_PROFILE_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// enable biometric
export function* enableBiometricHandler(payload) {
  const resp = yield API('user/auth/enableBiometric', 'POST', payload.payload);
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.ENABLE_BIOMETRIC_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.ENABLE_BIOMETRIC_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.ENABLE_BIOMETRIC_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// verify biometric
export function* verifyBiometricHandler(payload) {
  const resp = yield API('user/auth/verifyBiometric', 'POST', payload.payload);
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.VERIFY_BIOMETRIC_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.VERIFY_BIOMETRIC_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.VERIFY_BIOMETRIC_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// add template
export function* addTemplateHandler(payload) {
  const resp = yield API('user/templates1', 'POST', payload.payload);
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.ADD_TEMPLATE_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.ADD_TEMPLATE_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.ADD_TEMPLATE_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// EDIT template
export function* editTemplateHandler(payload) {
  const resp = yield API('user/templates1', 'PUT', payload.payload);
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.EDIT_TEMPLATE_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.EDIT_TEMPLATE_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.EDIT_TEMPLATE_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// DELETE template
export function* deleteTemplateHandler(payload) {
  const resp = yield API(
    `user/templates?templateId=${payload.payload.id}`,
    'DELETE',
  );
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.DELETE_TEMPLATE_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.DELETE_TEMPLATE_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.DELETE_TEMPLATE_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// GET template
export function* getTemplatesHandler(payload) {
  const resp = yield API('user/templates', 'GET', payload.payload);
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.GET_TEMPLATES_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.GET_TEMPLATES_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.GET_TEMPLATES_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// add tODO
export function* addTodoListHandler(payload) {
  const resp = yield API('user/ToDoList', 'POST', payload.payload);
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.ADD_TODO_LIST_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.ADD_TODO_LIST_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.ADD_TODO_LIST_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// EDIT tODO
export function* editTodoListHandler(payload) {
  const resp = yield API('user/ToDoList', 'PUT', payload.payload);
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.EDIT_TODO_LIST_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.EDIT_TODO_LIST_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.EDIT_TODO_LIST_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// DELETE todo
export function* deleteTodoListHandler(payload) {
  console.log(`user/ToDoList?listId=${payload.payload.id}`);
  const resp = yield API(
    `user/ToDoList?listId=${payload.payload.id}`,
    'DELETE',
  );
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.DELETE_TODO_LIST_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.DELETE_TODO_LIST_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.DELETE_TODO_LIST_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// EDIT pin unpin
export function* pinUnpinHandler(payload) {
  const resp = yield API('user/pin', 'PUT', payload.payload);
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.PIN_UNPIN_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.PIN_UNPIN_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.PIN_UNPIN_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// add post
export function* addPostHandler(payload) {
  const resp = yield API('user/moments/feed', 'POST', payload.payload);
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    console.log('dvbsdjvbskdnvkjc', JSON.stringify(response.data));
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.ADD_POST_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.ADD_POST_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.ADD_POST_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// GET POST
export function* getPostHandler(payload) {
  console.log(
    `moments/feed?page=${payload.payload.page}&limit=${payload.payload.limit}&type=${payload.payload.type}`,
  );

  const resp = yield API(
    `user/moments/feed?page=${payload.payload.page}&limit=${payload.payload.limit}&type=${payload.payload.type}`,
    'GET',
  );
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.GET_POST_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.GET_POST_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.GET_POST_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// GET FEELINGS CHECK
export function* getFeelingsCheckHandler() {
  const resp = yield API(`user/moments/feelingsCheck`, 'GET');
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.GET_FEELINGS_CHECK_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.GET_FEELINGS_CHECK_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.GET_FEELINGS_CHECK_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// add FEELINGS CHECK
export function* addFeelingsCheckHandler(payload) {
  const resp = yield API(
    'user/moments/feelingsCheckV2',
    'PUT',
    payload.payload,
  );
  yield put({type: actions.LOADER, loading: true});
  if (resp.status === 200) {
    let response = resp.body;

    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.ADD_FEELINGS_CHECK_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.ADD_FEELINGS_CHECK_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.ADD_FEELINGS_CHECK_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// add ANSWER QA
export function* addAnswerQaHandler(payload) {
  const resp = yield API('user/moments/QnA', 'POST', payload.payload);
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.ADD_ANSWER_QA_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.ADD_ANSWER_QA_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.ADD_ANSWER_QA_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// add REACTION
export function* addReactionHandler(payload) {
  const resp = yield API('user/moments/reaction', 'POST', payload.payload);
  yield put({type: actions.LOADER, loading: true});
  console.log('reactin handler response', resp);
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.ADD_REACTION_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.ADD_REACTION_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.ADD_REACTION_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// DELETE REACTION
export function* deleteReactionHandler(payload) {
  const resp = yield API(
    `user/moments/reaction?postId=${payload.payload.id}`,
    'DELETE',
  );
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.DELETE_REACTION_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.DELETE_REACTION_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.DELETE_REACTION_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// DELETE NOTE
export function* deletePostHandler(payload) {
  const resp = yield API(
    `user/moments/feed?postId=${payload.payload.id}`,
    'DELETE',
  );
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    console.log('profile logs -- 1', resp.body);
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.DELETE_POST_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.DELETE_POST_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.DELETE_POST_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// add COMMENT
export function* addCommentHandler(payload) {
  const resp = yield API('user/moments/comments', 'POST', payload.payload);
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    console.log('profile logs add comment -- ', response);
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.ADD_COMMENT_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.ADD_COMMENT_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.ADD_COMMENT_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// DELETE NOTE
export function* deleteCommentHandler(payload) {
  const resp = yield API(
    `user/moments/comments?commentId=${payload.payload.id}`,
    'DELETE',
  );
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.DELETE_COMMENT_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.DELETE_COMMENT_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.DELETE_COMMENT_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// add note
export function* addNoteHandler(payload) {
  const resp = yield API('user/notes', 'POST', payload.payload);
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.ADD_NOTE_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.ADD_NOTE_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.ADD_NOTE_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// EDIT NOTE
export function* editNoteHandler(payload) {
  const resp = yield API('user/notes', 'PUT', payload.payload);
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.EDIT_NOTE_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.EDIT_NOTE_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.EDIT_NOTE_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// DELETE NOTE
export function* deleteNoteHandler(payload) {
  const resp = yield API(`user/notes?noteId=${payload.payload.id}`, 'DELETE');
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.DELETE_NOTE_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.DELETE_NOTE_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.DELETE_NOTE_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// GET organise list
export function* getOrganiseListHandler(payload) {
  const resp = yield API(
    `user/newOrganizeList?date=${payload.payload.date}&type=${payload.payload.type}limit=20`,
    'GET',
  );
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.GET_ORGANISE_LIST_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.GET_ORGANISE_LIST_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.GET_ORGANISE_LIST_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// GET chat
export function* getChatHandler(payload) {
  console.log(
    `user/home/chat?page=${payload.payload.page}&limit=${payload.payload.limit}`,
  );

  const resp = yield API(
    `user/home/chat?page=${payload.payload.page}&limit=${payload.payload.limit}`,
    'GET',
  );
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.GET_CHAT_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.GET_CHAT_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.GET_CHAT_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// GET media
export function* getMediaHandler(payload) {
  const resp = yield API(`user/home/media?type=${payload.payload.type}`, 'GET');
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.GET_MEDIA_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.GET_MEDIA_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.GET_MEDIA_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// GET links
export function* getLinksHandler(payload) {
  const resp = yield API(`user/home/links`, 'GET');
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.GET_LINKS_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.GET_LINKS_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.GET_LINKS_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// DELETE CHAT
export function* deleteChatHandler(payload) {
  const resp = yield API(
    `user/home/chat?chatId=${payload.payload.id}`,
    'DELETE',
  );
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.DELETE_CHAT_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.DELETE_CHAT_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.DELETE_CHAT_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// GET chat searched
export function* getChatSearchHandler(payload) {
  const resp = yield API(
    `user/home/chat?search=${payload.payload.search}&page=${payload.payload.page}&limit=${payload.payload.limit}`,
    'GET',
  );
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.GET_CHAT_SEARCH_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.GET_CHAT_SEARCH_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.GET_CHAT_SEARCH_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// get user profile
export function* getProfileHandler(payload) {
  const resp = yield API('user/profile', 'GET');
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.GET_PROFILE_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.GET_PROFILE_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.GET_PROFILE_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// add EVENT
export function* addEventHandler(payload) {
  console.log('WHY CRASH---AND---PAYLOADDR', payload);
  const resp = yield API('user/moments/events', 'POST', payload.payload);
  // yield put({type: actions.LOADER, loading: true});
  console.log('WHY CRASH---ANDR', resp);
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    console.log('WHY CRASH---ANDR--inside');
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.ADD_EVENT_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.ADD_EVENT_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.ADD_EVENT_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// EDIT EVENT
export function* editEventHandler(payload) {
  const resp = yield API('user/moments/events', 'PUT', payload.payload);
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.EDIT_EVENT_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.EDIT_EVENT_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.EDIT_EVENT_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// DELETE CHAT
export function* deleteEventHandler(payload) {
  const resp = yield API(
    `user/moments/events?eventId=${payload.payload.id}`,
    'DELETE',
  );
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.DELETE_EVENT_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.DELETE_EVENT_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.DELETE_EVENT_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// get EVENT
export function* getEventHandler(payload) {
  const resp = yield API(
    `user/moments/events?month=${payload.payload.month}&year=${payload.payload.year}`,
    'GET',
  );
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.GET_EVENT_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.GET_EVENT_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.GET_EVENT_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// get EVENT
export function* getSpecialEventHandler(payload) {
  const resp = yield API(`user/specialEvents`, 'GET');
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    console.log('SPECIALLLLL------------------- -- ', response);
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.GET_SPECIAL_EVENT_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.GET_SPECIAL_EVENT_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.GET_SPECIAL_EVENT_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// add STORY
export function* addStoryHandler(payload) {
  const resp = yield API('user/moments/stories', 'POST', payload.payload);
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.ADD_STORY_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.ADD_STORY_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.ADD_STORY_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// DELETE STORY
export function* deleteStoryHandler(payload) {
  const resp = yield API(
    `user/moments/stories?storyId=${payload.payload.id}`,
    'DELETE',
  );
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.DELETE_STORY_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.DELETE_STORY_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.DELETE_STORY_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// add Highlight
export function* addHighlightHandler(payload) {
  console.log(payload.payload, 'highlightPayload');
  const resp = yield API('user/moments/highlights', 'POST', payload.payload);
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.ADD_HIGHLIGHT_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.ADD_HIGHLIGHT_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.ADD_HIGHLIGHT_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// DELETE Highlight
export function* removeHighlightHandler(payload) {
  const resp = yield API(
    `user/moments/highlights?highlightId=${payload.payload.id}`,
    'DELETE',
  );
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.REMOVE_HIGHLIGHT_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.REMOVE_HIGHLIGHT_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.REMOVE_HIGHLIGHT_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// DELETE single highlight
export function* removeSingleHighlightHandler(payload) {
  const resp = yield API(
    `user/moments/highlight?highlightId=${payload.payload.highlightId}&storyId=${payload.payload.storyId}`,
    'DELETE',
  );
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.REMOVE_SINGLE_HIGHLIGHT_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.REMOVE_SINGLE_HIGHLIGHT_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.REMOVE_SINGLE_HIGHLIGHT_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// get EVENT
export function* getStoriesHandler(payload) {
  const resp = yield API(`user/moments/stories`, 'GET');
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    // console.log('profile logs -- ', response)
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.GET_STORIES_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.GET_STORIES_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.GET_STORIES_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

// get EVENT
export function* getHighlightsHandler(payload) {
  const resp = yield API(`user/moments/highlights`, 'GET');
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;

    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({type: actions.GET_HIGHLIGHTS_SUCCESS, payload: response.data});
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.GET_HIGHLIGHTS_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.GET_HIGHLIGHTS_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}

export function* createNewHighlightHandler(payload) {
  const resp = yield API(`user/moments/highlight`, 'POST', payload.payload);
  yield put({type: actions.LOADER, loading: true});
  if (resp.status == 200) {
    let response = resp.body;
    if (response.statusCode === 200) {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.CREATE_NEW_HIGHLIGHTS_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({type: actions.LOADER, loading: false});
      yield put({
        type: actions.CREATE_NEW_HIGHLIGHTS_FAILURE,
        message: response.message,
        payload: resp.body,
      });
    }
  } else if (resp.body.status == 400) {
    yield put({type: actions.LOADER, loading: false});
    yield put({
      type: actions.CREATE_NEW_HIGHLIGHTS_FAILURE,
      message: resp.body.Message,
      payload: resp.body,
    });
  }
}
