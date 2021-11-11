import React from 'react';
import { useDispatch } from 'react-redux';

function reduxActionCreator(actionCreator, dispatch) {
  return function reduxActionHandler(...args) {
    const action = actionCreator(...args);

    // for handling thunks
    if (typeof action === 'function') {
      return action(dispatch);
    }

    return dispatch(action);
  };
}

export default function hookReduxActionFactory(actionCreator) {
  return function useReduxAction() {
    const dispatch = useDispatch();
    const actionHandler = React.useMemo(
      () => reduxActionCreator(actionCreator, dispatch),
      [actionCreator, dispatch]
    );

    return actionHandler;
  };
}
