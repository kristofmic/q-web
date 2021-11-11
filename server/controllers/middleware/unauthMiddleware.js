import * as auth from '../../lib/services/auth';

import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from '../../constants/cookies';
import HTTP_STATUS_CODES from '../../constants/httpStatusCodes';

export default async function unauthMiddleware(req, res, next) {
  const {
    [ACCESS_TOKEN_COOKIE]: accessToken,
    [REFRESH_TOKEN_COOKIE]: refreshToken,
  } = req.cookies;

  const response = await auth.checkToken(accessToken, refreshToken);

  if (response.authenticated) {
    if (response.accessToken) {
      res.cookie(ACCESS_TOKEN_COOKIE, response.accessToken, response.options);
    }

    return res.redirect(HTTP_STATUS_CODES.FOUND, '/');
  }

  next();
}
