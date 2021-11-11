import { combineReducers } from 'redux';

import * as authentication from './authentication';
import * as config from './config';
import * as groot from './groot';
import * as user from './user';

const sliceConfigs = [authentication, config, groot, user];

export const slices = sliceConfigs.map((slice) => slice.selectors.SLICE_NAME);

export const reducers = combineReducers(
  sliceConfigs.reduce((acc, slice) => {
    acc[slice.selectors.SLICE_NAME] = slice.reducer;
    return acc;
  }, {})
);
