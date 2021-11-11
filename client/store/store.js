import { createStore as createReduxStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import pick from 'lodash/pick';

import { reducers, slices } from '../slices';
import localData from '../utils/localData';

let store;

export function createStore(initialState) {
  const _initialState = initialState || localData() || {};

  store = createReduxStore(
    reducers,
    pick(_initialState, slices),
    applyMiddleware(thunk)
  );

  return store;
}

export function __dangerouslyGetStore__() {
  return store;
}
