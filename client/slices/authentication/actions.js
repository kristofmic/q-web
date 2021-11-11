import * as api from './api';

import hookActionFactory from '../../utils/hookActionFactory';

import googleAuth from './googleAuth';

export const LOGIN_ACTION = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
};

export const LOGOUT_ACTION = {
  LOGOUT_REQUEST: 'LOGOUT_REQUEST',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
  LOGOUT_ERROR: 'LOGOUT_ERROR',
};

export const SIGNUP_ACTION = {
  SIGNUP_REQUEST: 'SIGNUP_REQUEST',
  SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
  SIGNUP_ERROR: 'SIGNUP_ERROR',
};

export const RESET_STATE = 'RESET_STATE';

export function loginWithEmail(email, password) {
  return (dispatch) => {
    dispatch({
      type: LOGIN_ACTION.LOGIN_REQUEST,
      payload: {
        email,
        password,
      },
    });

    return api
      .loginWithEmail(email, password)
      .then((res) =>
        dispatch({
          type: LOGIN_ACTION.LOGIN_SUCCESS,
          payload: res.data,
        })
      )
      .catch((err) =>
        dispatch({
          type: LOGIN_ACTION.LOGIN_ERROR,
          payload: {
            error: err.response.data.error,
          },
        })
      );
  };
}
export const useLoginWithEmail = hookActionFactory(loginWithEmail);

export function loginWithGoogle() {
  return (dispatch) =>
    googleAuth()
      .grantOfflineAccess()
      .then(({ code }) => api.loginWithGoogle(code))
      .then((res) =>
        dispatch({
          type: LOGIN_ACTION.LOGIN_SUCCESS,
          payload: res.data,
        })
      )
      .catch((err) =>
        dispatch({
          type: LOGIN_ACTION.LOGIN_ERROR,
          payload: {
            error: err.response.data.error,
          },
        })
      );
}
export const useLoginWithGoogle = hookActionFactory(loginWithGoogle);

export function logout() {
  return (dispatch) => {
    dispatch({
      type: LOGOUT_ACTION.LOGOUT_REQUEST,
    });

    return api
      .logout()
      .then(() =>
        dispatch({
          type: LOGOUT_ACTION.LOGOUT_SUCCESS,
        })
      )
      .catch((err) =>
        dispatch({
          type: LOGOUT_ACTION.LOGOUT_ERROR,
          payload: {
            error: err.response.data.error,
          },
        })
      );
  };
}
export const useLogout = hookActionFactory(logout);

export function signupWithEmail(email, password, context) {
  return (dispatch) => {
    dispatch({
      type: SIGNUP_ACTION.SIGNUP_REQUEST,
      payload: {
        email,
        password,
      },
    });

    return api
      .signupWithEmail(email, password, context)
      .then((res) =>
        dispatch({
          type: SIGNUP_ACTION.SIGNUP_SUCCESS,
          payload: res.data,
        })
      )
      .catch((err) =>
        dispatch({
          type: SIGNUP_ACTION.SIGNUP_ERROR,
          payload: {
            error: err.response.data.error,
          },
        })
      );
  };
}
export const useSignupWithEmail = hookActionFactory(signupWithEmail);

export function signupWithGoogle(context) {
  return (dispatch) =>
    googleAuth()
      .grantOfflineAccess()
      .then(({ code }) => api.signupWithGoogle(code, context))
      .then((res) =>
        dispatch({
          type: SIGNUP_ACTION.SIGNUP_SUCCESS,
          payload: res.data,
        })
      )
      .catch((err) =>
        dispatch({
          type: SIGNUP_ACTION.SIGNUP_ERROR,
          payload: {
            error: err.response.data.error,
          },
        })
      );
}
export const useSignupWithGoogle = hookActionFactory(signupWithGoogle);

export function resetState() {
  return {
    type: RESET_STATE,
  };
}
export const useResetState = hookActionFactory(resetState);
