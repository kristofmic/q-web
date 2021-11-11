export default function reducerFactory(initialState, actionHandlers = {}) {
  return function reducer(state = initialState, action = {}) {
    const { type } = action;
    const handler = actionHandlers[type];

    if (typeof handler === 'function') {
      return handler(state, action);
    }

    return state;
  };
}
