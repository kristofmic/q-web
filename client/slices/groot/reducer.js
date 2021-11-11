import set from 'lodash/fp/set';
import update from 'lodash/fp/update';

import reducerFactory from '../../utils/reducerFactory';

import { GROOT_ACTION } from './actions';

import { API_STATUS } from '../../api';

const initialState = {
  /**
   * data: Object,
   * error: Error,
   * status: API_STATUS,
   */
};

const handlers = {
  [GROOT_ACTION.GROOT_REQUEST]() {
    return {
      data: undefined,
      error: undefined,
      status: API_STATUS.LOADING,
    };
  },

  [GROOT_ACTION.GROOT_SUCCESS](state, action) {
    let nextState = set(['status'], API_STATUS.SUCCESS, state);
    nextState = update(
      ['data'],
      (prevData) => ({
        ...prevData,
        ...action.payload,
      }),
      nextState
    );
    return nextState;
  },

  [GROOT_ACTION.GROOT_ERROR](state, action) {
    const { error } = action.payload;

    return {
      ...state,
      error,
      status: API_STATUS.ERROR,
    };
  },
};

export default reducerFactory(initialState, handlers);
