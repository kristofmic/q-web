export const SLICE_NAME = 'groot';

export function getError(state) {
  return state[SLICE_NAME].error;
}

export function getStatus(state) {
  return state[SLICE_NAME].status;
}

export function getMessage(state) {
  return state[SLICE_NAME].data?.message;
}

export function getSlice(state) {
  return state[SLICE_NAME];
}
