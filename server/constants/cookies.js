import conf from 'nconf';

import * as jwt from '../lib/auth/jwt';

export const ACCESS_TOKEN_COOKIE = 'at';
export const REFRESH_TOKEN_COOKIE = 'rt';

export const TOKEN_COOKIE_OPTIONS = {
  ...conf.get('tokenCookieOptions'),
  maxAge: jwt.TOKEN_EXPIRATION.REFRESH_TOKEN * 1000,
};
