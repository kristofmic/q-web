import conf from 'nconf';

import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from '../../constants/cookies';

import * as auth from '../../lib/services/auth';

import { HttpError } from '../../lib/errors';

import HTTP_STATUS_CODES from '../../constants/httpStatusCodes';

const WEB_HOST = conf.get('web:host');

export default function authMiddleware(config = {}) {
  const { redirect = true, to = '/error/unauthorized' } = config;

  return async function authMiddlewareHandler(req, res, next) {
    const {
      [ACCESS_TOKEN_COOKIE]: accessToken,
      [REFRESH_TOKEN_COOKIE]: refreshToken,
    } = req.cookies;

    const response = await auth.checkToken(accessToken, refreshToken);

    if (!response.authenticated) {
      if (redirect) {
        return authRedirectFactory({ to })(req, res);
      }

      return next(
        new HttpError('Unauthorized request', HTTP_STATUS_CODES.UNAUTHORIZED)
      );
    }

    if (response.accessToken) {
      res.cookie(ACCESS_TOKEN_COOKIE, response.accessToken, response.options);
    }

    /* eslint-disable no-param-reassign */
    req.user = response.payload.user;
    req.locals = {
      localData: {
        user: req.user,
      },
    };
    /* eslint-enable no-param-reassign */

    next();
  };
}

export function authRedirectFactory(config = {}) {
  const { to } = config;

  return function authRedirect(req, res) {
    const requestUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const next =
      requestUrl.startsWith(WEB_HOST) &&
      requestUrl !== `${req.protocol}://${req.get('host')}/` &&
      requestUrl;

    return res.redirect(
      HTTP_STATUS_CODES.FOUND,
      `${to}${next ? `?next=${encodeURIComponent(next)}` : ''}`
    );
  };
}
