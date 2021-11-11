import set from 'lodash/fp/set';
import update from 'lodash/fp/update';

import reducerFactory from '../../utils/reducerFactory';

import {
  LOGIN_ACTION,
  LOGOUT_ACTION,
  RESET_STATE,
  SIGNUP_ACTION,
} from './actions';

import { API_STATUS } from '../../api';

const initialState = {
  login: {
    /**
     * data: Object,
     * error: Error,
     * status: API_STATUS,
     */
  },
  logout: {
    /**
     * error: Error,
     * status: API_STATUS,
     */
  },
  signup: {
    /**
     * data: Object,
     * error: Error,
     * status: API_STATUS,
     */
  },
};

const handlers = {
  [RESET_STATE]() {
    return initialState;
  },

  [LOGIN_ACTION.LOGIN_REQUEST](state, action) {
    const nextLogin = {
      data: action.payload,
      error: undefined,
      status: API_STATUS.LOADING,
    };

    return set(['login'], nextLogin, state);
  },

  [LOGIN_ACTION.LOGIN_SUCCESS](state, action) {
    let nextState = set(['login', 'status'], API_STATUS.SUCCESS, state);
    nextState = update(
      ['login', 'data'],
      (prevData) => ({
        ...prevData,
        ...action.payload,
      }),
      nextState
    );
    return nextState;
  },

  [LOGIN_ACTION.LOGIN_ERROR](state, action) {
    const { error } = action.payload;

    return update(
      ['login'],
      (prevLogin) => ({
        ...prevLogin,
        error,
        status: API_STATUS.ERROR,
      }),
      state
    );
  },

  [LOGOUT_ACTION.LOGOUT_REQUEST](state) {
    const nextLogout = {
      error: undefined,
      status: API_STATUS.LOADING,
    };

    return set(['logout'], nextLogout, state);
  },

  [LOGOUT_ACTION.LOGOUT_SUCCESS](state) {
    return set(['logout', 'status'], API_STATUS.SUCCESS, state);
  },

  [LOGOUT_ACTION.LOGOUT_ERROR](state, action) {
    const { error } = action.payload;

    return update(
      ['logout'],
      (prevLogout) => ({
        ...prevLogout,
        error,
        status: API_STATUS.ERROR,
      }),
      state
    );
  },

  [SIGNUP_ACTION.SIGNUP_REQUEST](state, action) {
    const nextSignup = {
      data: action.payload,
      error: undefined,
      status: API_STATUS.LOADING,
    };

    return set(['signup'], nextSignup, state);
  },

  [SIGNUP_ACTION.SIGNUP_SUCCESS](state, action) {
    let nextState = set(['signup', 'status'], API_STATUS.SUCCESS, state);
    nextState = update(
      ['signup', 'data'],
      (prevData) => ({
        ...prevData,
        ...action.payload,
      }),
      nextState
    );
    return nextState;
  },

  [SIGNUP_ACTION.SIGNUP_ERROR](state, action) {
    const { error } = action.payload;

    return update(
      ['signup'],
      (prevSignup) => ({
        ...prevSignup,
        error,
        status: API_STATUS.ERROR,
      }),
      state
    );
  },
};

const authenticationReducer = reducerFactory(initialState, handlers);
export default authenticationReducer;
