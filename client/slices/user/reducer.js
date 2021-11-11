import reducerFactory from '../../utils/reducerFactory';

/**
 * id: { type: 'string' },
 * emailAddress: { type: 'string' },
 * givenName: { type: 'string' },
 * familyName: { type: 'string' },
 * picture: { type: 'string' },
 */
const initialState = {};

const handlers = {};

const userReducer = reducerFactory(initialState, handlers);
export default userReducer;
