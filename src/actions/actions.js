import * as actionTypes from './types';

// USER ACTIONS
export const setUser = user => {
  return {
    type: actionTypes.SET_USER,
    payload: {
      currentUser: user
    }
  };
};

export const clearUser = () => {
  return {
    type: actionTypes.CLEAR_USER
  };
};

// CHANNEL ACTIONS
export const setCurrentChannel = channel => {
  return {
    type: actionTypes.SET_CURRENT_CHANNEL,
    payload: {
      currentChannel: channel
    }
  };
};

export const setPrivateChannel = isPrivate => {
  return {
    type: actionTypes.SET_PRIVATE_CHANNEL,
    payload: {
      isPrivate
    }
  };
};

export const setUserPostsCount = userPostsCount => {
  return {
    type: actionTypes.SET_USER_POSTS_COUNT,
    payload: {
      userPostsCount
    }
  };
};

// COLOR ACTIONS
export const setApplicationColors = (primaryColor, secondaryColor) => {
  return {
    type: actionTypes.SET_APPLICATION_COLORS,
    payload: {
      primaryColor,
      secondaryColor
    }
  };
};
