import _ from 'lodash';
import conf from 'nconf';

import * as jwt from '../auth/jwt';
import { serverLogger as logger } from '../logger';

const TOKEN_COOKIE_OPTIONS = {
  ...conf.get('tokenCookieOptions'),
  maxAge: jwt.TOKEN_EXPIRATION.REFRESH_TOKEN * 1000,
};

async function authorizeAccessToken(accessToken) {
  try {
    const payload = await jwt.authorizeToken(accessToken);

    return {
      expired: false,
      data: payload,
    };
  } catch (error) {
    logger.error('Error authorizing main page load: ', error);

    return {
      expired: true,
    };
  }
}

async function refreshAccessToken(accessToken, refreshToken) {
  try {
    const newAccessToken = await jwt.refreshAccessToken(
      accessToken,
      refreshToken
    );

    return {
      accessToken: newAccessToken,
      payload: jwt.decodeToken(newAccessToken),
      options: TOKEN_COOKIE_OPTIONS,
    };
  } catch (error) {
    logger.error(
      'Error fetching refreshing authorization on main page load: ',
      error
    );
  }
}

export async function checkToken(accessToken, refreshToken) {
  let tokenData;
  let expiredToken = false;

  if (!accessToken && !refreshToken) {
    return {
      authenticated: false,
    };
  }

  if (accessToken) {
    const response = await authorizeAccessToken(accessToken);
    tokenData = response.data;
    expiredToken = response.expired;
  }

  if (expiredToken && refreshToken) {
    const response = await refreshAccessToken(accessToken, refreshToken);

    if (response) {
      return {
        ...response, // includes accessToken, options, and payload
        authenticated: true,
      };
    }
  }

  if (!tokenData) {
    return {
      authenticated: false,
    };
  }

  return {
    payload: {
      ..._.pick(tokenData, ['user']),
    },
    authenticated: true,
  };
}
