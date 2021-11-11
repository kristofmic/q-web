export const SLICE_NAME = 'authentication';

export function getLoginState(state) {
  return state[SLICE_NAME].login;
}

export function getLogoutState(state) {
  return state[SLICE_NAME].logout;
}

export function getSignupState(state) {
  return state[SLICE_NAME].signup;
}
