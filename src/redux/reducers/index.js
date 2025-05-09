import {combineReducers} from 'redux';
import * as actions from '../actionTypes';
import reducer from './reducer';
import momentsReducer from './momentsReducer';

const appReducer = combineReducers({
reducer : reducer,
moments: momentsReducer  

});

const rootReducer = (state, action) => {
  if (action.type == actions.CLEAR_REDUX_STATE) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
