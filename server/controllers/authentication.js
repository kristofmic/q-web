import _ from 'lodash';

import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  TOKEN_COOKIE_OPTIONS,
} from '../constants/cookies';

import { serverLogger as logger } from '../lib/logger';
import { HttpError, ModelError, UnexpectedServerError } from '../lib/errors';
import * as google from '../lib/auth/google';
import * as jwt from '../lib/auth/jwt';

import UserModel from '../../db/models/UserModel';

import HTTP_STATUS_CODES from '../constants/httpStatusCodes';

const ERROR_CODE = {
  INVALID_LOGIN: 'AUTH:LOGIN:100',
  LOGIN_ERROR: 'AUTH:LOGIN:101',
  LOGIN_GOOGLE_ERROR: 'AUTH:LOGIN:200',
  LOGIN_GOOGLE_UNAUTHORIZED: 'AUTH:LOGIN:201',

  SIGNUP_EMAIL_ERROR: 'AUTH:SIGNUP:100',
  SIGNUP_GOOGLE_ERROR: 'AUTH:SIGNUP:200',
  SIGNUP_GOOGLE_UNAUTHORIZED: 'AUTH:SIGNUP:201',

  UNAUTHORIZED_REFRESH: 'AUTH:REFRESH:100',
};

function getTokens(req) {
  const accessToken = req.cookies.at || req.headers['x-access-token'];
  const refreshToken = req.cookies.rt || req.headers['x-refresh-token'];

  return {
    accessToken,
    refreshToken,
  };
}

export async function authorize(req, res, next) {
  const { accessToken } = getTokens(req);

  try {
    const payload = await jwt.authorizeToken(accessToken);

    res.status(HTTP_STATUS_CODES.OK).json(_.pick(payload, ['user']));
  } catch (error) {
    next(error);
  }
}

export async function loginWithEmail(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await UserModel.checkUserCredentials(email, password);

    if (!user) {
      return next(
        new HttpError(
          "Oops! That email or password doesn't seem to be valid",
          HTTP_STATUS_CODES.BAD_REQUEST,
          ERROR_CODE.INVALID_LOGIN
        )
      );
    }

    const token = await jwt.createToken(user);
    const refreshToken = await jwt.createRefreshToken(token);

    res.cookie(ACCESS_TOKEN_COOKIE, token, TOKEN_COOKIE_OPTIONS);
    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, TOKEN_COOKIE_OPTIONS);
    res.status(HTTP_STATUS_CODES.OK).json({
      user,
    });
  } catch (error) {
    if (error instanceof ModelError) {
      return next(error.toHttpError());
    }

    logger.error(error);

    return next(new UnexpectedServerError(ERROR_CODE.LOGIN_ERROR));
  }
}

export async function loginWithGoogle(req, res, next) {
  const { code } = req.body;
  let authorization;
  let user;

  try {
    authorization = await google.getGoogleAuthorization(code);
  } catch (error) {
    logger.error('Error getting google auth tokens: ', error);
    return next(
      new HttpError(
        'Not authorized by Google',
        HTTP_STATUS_CODES.BAD_REQUEST,
        ERROR_CODE.LOGIN_GOOGLE_UNAUTHORIZED
      )
    );
  }

  try {
    user = await UserModel.upsertUserWithOauthTokens(
      authorization.payload.email,
      authorization.tokens,
      UserModel.oauthProvider.GOOGLE,
      _.pick(authorization.payload, ['givenName', 'familyName', 'picture'])
    );
  } catch (error) {
    if (error instanceof ModelError) {
      return next(error.toHttpError());
    }

    logger.error(error);

    return next(new UnexpectedServerError(ERROR_CODE.LOGIN_GOOGLE_ERROR));
  }

  if (!user) {
    logger.error('No user on login: ', authorization);

    return next(new UnexpectedServerError(ERROR_CODE.LOGIN_GOOGLE_ERROR));
  }

  let token;
  let refreshToken;

  try {
    token = await jwt.createToken(user);
    refreshToken = await jwt.createRefreshToken(token);
  } catch (error) {
    if (error instanceof ModelError) {
      return next(error.toHttpError());
    }

    logger.error(error);

    return next(new UnexpectedServerError(ERROR_CODE.LOGIN_GOOGLE_ERROR));
  }

  res.cookie(ACCESS_TOKEN_COOKIE, token, TOKEN_COOKIE_OPTIONS);
  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, TOKEN_COOKIE_OPTIONS);
  res.status(HTTP_STATUS_CODES.OK).json({
    user,
  });
}

export async function logout(req, res) {
  const { refreshToken } = getTokens(req);

  // always want to clear cookies and send back immediately
  res.clearCookie(
    ACCESS_TOKEN_COOKIE,
    _.omit(TOKEN_COOKIE_OPTIONS, ['maxAge'])
  );
  res.clearCookie(
    REFRESH_TOKEN_COOKIE,
    _.omit(TOKEN_COOKIE_OPTIONS, ['maxAge'])
  );
  res.status(HTTP_STATUS_CODES.OK).json();

  try {
    await jwt.revokeToken(refreshToken);
  } catch (error) {
    logger.error('Error revoking token', error);
  }
}

export async function refresh(req, res, next) {
  const { accessToken, refreshToken } = getTokens(req);

  try {
    const newAccessToken = await jwt.refreshAccessToken(
      accessToken,
      refreshToken
    );

    res.cookie(ACCESS_TOKEN_COOKIE, newAccessToken, TOKEN_COOKIE_OPTIONS);

    const response = {
      accessToken: newAccessToken,
      payload: jwt.decodeToken(newAccessToken),
      options: TOKEN_COOKIE_OPTIONS,
    };

    return res.status(HTTP_STATUS_CODES.OK).json(response);
  } catch (error) {
    next(
      new HttpError(
        error.message || 'Unauthorized',
        error.statusCode || HTTP_STATUS_CODES.UNAUTHORIZED,
        error.code || ERROR_CODE.UNAUTHORIZED_REFRESH
      )
    );
  }
}

export async function signupWithEmail(req, res, next) {
  const { email, password } = req.body;

  try {
    const newUser = await UserModel.createNewUserWithPassword(email, password);

    const token = await jwt.createToken(newUser);
    const refreshToken = await jwt.createRefreshToken(token);

    res.cookie(ACCESS_TOKEN_COOKIE, token, TOKEN_COOKIE_OPTIONS);
    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, TOKEN_COOKIE_OPTIONS);
    res.status(HTTP_STATUS_CODES.OK).json({
      user: newUser,
    });
  } catch (error) {
    if (error instanceof ModelError) {
      return next(error.toHttpError());
    }

    logger.error(error);

    return next(new UnexpectedServerError(ERROR_CODE.SIGNUP_EMAIL_ERROR));
  }
}

export async function signupWithGoogle(req, res, next) {
  const { code } = req.body;
  let authorization;
  let newUser;

  try {
    authorization = await google.getGoogleAuthorization(code);
  } catch (error) {
    logger.error('Error getting google auth tokens: ', error);
    return next(
      new HttpError(
        'Not authorized by Google',
        HTTP_STATUS_CODES.BAD_REQUEST,
        ERROR_CODE.SIGNUP_GOOGLE_UNAUTHORIZED
      )
    );
  }

  try {
    newUser = await UserModel.upsertUserWithOauthTokens(
      authorization.payload.email,
      authorization.tokens,
      UserModel.oauthProvider.GOOGLE,
      _.pick(authorization.payload, ['givenName', 'familyName', 'picture'])
    );
  } catch (error) {
    if (error instanceof ModelError) {
      return next(error.toHttpError());
    }

    logger.error(error);

    return next(new UnexpectedServerError(ERROR_CODE.SIGNUP_GOOGLE_ERROR));
  }

  if (!newUser) {
    logger.error('No new user on sign up: ', authorization);

    return next(new UnexpectedServerError(ERROR_CODE.SIGNUP_GOOGLE_ERROR));
  }

  let token;
  let refreshToken;

  try {
    token = await jwt.createToken(newUser);
    refreshToken = await jwt.createRefreshToken(token);
  } catch (error) {
    if (error instanceof ModelError) {
      return next(error.toHttpError());
    }

    logger.error(error);

    return next(new UnexpectedServerError(ERROR_CODE.SIGNUP_GOOGLE_ERROR));
  }

  res.cookie(ACCESS_TOKEN_COOKIE, token, TOKEN_COOKIE_OPTIONS);
  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, TOKEN_COOKIE_OPTIONS);
  res.status(HTTP_STATUS_CODES.OK).json({
    user: newUser,
  });
}

export function refreshCsrfToken(req, res) {
  res.status(HTTP_STATUS_CODES.OK).json({
    csrfToken: req.csrfToken(),
  });
}
