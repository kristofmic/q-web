import * as api from './api';

import hookActionFactory from '../../utils/hookActionFactory';

export const GROOT_ACTION = {
  GROOT_REQUEST: 'GROOT_REQUEST',
  GROOT_SUCCESS: 'GROOT_SUCCESS',
  GROOT_ERROR: 'GROOT_ERROR',
};

export function iAmGroot() {
  return (dispatch) => {
    dispatch({
      type: GROOT_ACTION.GROOT_REQUEST,
    });

    return api
      .iAmGroot()
      .then((res) =>
        dispatch({
          type: GROOT_ACTION.GROOT_SUCCESS,
          payload: res.data,
        })
      )
      .catch((err) =>
        dispatch({
          type: GROOT_ACTION.GROOT_ERROR,
          payload: {
            error: err.response.data.error,
          },
        })
      );
  };
}
export const useIAmGroot = hookActionFactory(iAmGroot);
