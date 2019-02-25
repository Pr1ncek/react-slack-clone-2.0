import { combineReducers } from 'redux';
import * as actionTypes from '../actions/types';

const initialUserState = {
  currentUser: null,
  isLoading: true
};

const user_reducer = (state = initialUserState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        currentUser: action.payload.currentUser,
        isLoading: false
      };
    case actionTypes.CLEAR_USER:
      return {
        ...state,
        currentUser: null,
        isLoading: false
      };
    default:
      return state;
  }
};

const initialChannelState = {
  currentChannel: null,
  isPrivate: false,
  userPostsCount: null // ie. { userName1: { messageCount: 25 }, userName2: {messageCount: 10} }
};

const channel_reducer = (state = initialChannelState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload.currentChannel,
        isPrivate: false
      };
    case actionTypes.SET_PRIVATE_CHANNEL:
      return {
        ...state,
        isPrivate: action.payload.isPrivate
      };
    case actionTypes.SET_USER_POSTS_COUNT:
      return { ...state, userPostsCount: action.payload.userPostsCount };
    default:
      return state;
  }
};

const initialColorState = {
  primaryColor: '#4c3c4c',
  secondaryColor: '#eee'
};

const colors_reducer = (state = initialColorState, action) => {
  switch (action.type) {
    case actionTypes.SET_APPLICATION_COLORS:
      return {
        ...state,
        primaryColor: action.payload.primaryColor,
        secondaryColor: action.payload.secondaryColor
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user: user_reducer,
  channel: channel_reducer,
  colors: colors_reducer
});

export default rootReducer;
