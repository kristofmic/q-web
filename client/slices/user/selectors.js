export const SLICE_NAME = 'user';

export function getUserId(state) {
  return state[SLICE_NAME].id;
}

export function getEmailAddress(state) {
  return state[SLICE_NAME].emailAddress;
}

export function getUserPicture(state) {
  return state[SLICE_NAME].picture;
}
