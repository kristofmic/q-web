import _ from 'lodash';
import conf from 'nconf';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

import { HttpError } from '../errors';
import { createLogger } from '../logger';
import { RefreshTokenModel } from '../../../db/models';

import HTTP_STATUS_CODES from '../../constants/httpStatusCodes';

const logger = createLogger('jwt');
const tokenConfig = conf.get('token');

let TOKEN_PRIVATE_KEY;
let TOKEN_PUBLIC_KEY;

if (tokenConfig.algorithm === 'RS256') {
  TOKEN_PRIVATE_KEY = fs
    .readFileSync(
      path.join(
        __dirname,
        '..',
        '..',
        '..',
        'conf',
        'secrets',
        'decrypted',
        'tokenKey.private.pem'
      )
    )
    .toString();
  TOKEN_PUBLIC_KEY = fs
    .readFileSync(
      path.join(
        __dirname,
        '..',
        '..',
        '..',
        'conf',
        'secrets',
        'decrypted',
        'tokenKey.public.pem'
      )
    )
    .toString();
} else if (tokenConfig.algorithm === 'HS256') {
  TOKEN_PRIVATE_KEY = tokenConfig.key;
  TOKEN_PUBLIC_KEY = tokenConfig.key;
}

if (!TOKEN_PRIVATE_KEY && !TOKEN_PUBLIC_KEY) {
  throw new Error(
    `Public or private token key not defined - public: ${TOKEN_PUBLIC_KEY} | private: ${!!TOKEN_PRIVATE_KEY}`
  );
}

export const TOKEN_EXPIRATION = {
  // in seconds
  ACCESS_TOKEN: 600,
  REFRESH_TOKEN: 2592000,
};

export async function authorizeRequest(req, res, next) {
  const { at: token } = req.cookies;
  let payload;

  try {
    payload = await authorizeToken(token);
  } catch (error) {
    return next(error);
  }

  if (!payload || !payload.user) {
    logger.error('No payload found in jwt verification');

    return next(
      new HttpError(
        'Unauthorized',
        HTTP_STATUS_CODES.UNAUTHORIZED,
        'AUTH:JWT:402'
      )
    );
  }

  req.user = payload.user; // eslint-disable-line no-param-reassign

  next();
}

export function authorizeToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      TOKEN_PUBLIC_KEY,
      { algorithm: tokenConfig.algorithm },
      (err, payload) => {
        if (err) {
          logger.error('Error verifying token: ', err);

          return reject(
            new HttpError(
              'Unauthorized',
              HTTP_STATUS_CODES.UNAUTHORIZED,
              'AUTH:JWT:401'
            )
          );
        }

        return resolve(payload);
      }
    );
  });
}

export function createToken(user) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        user: _.pick(user, [
          'id',
          'emailAddress',
          'givenName',
          'familyName',
          'picture',
          'username',
        ]),
      },
      TOKEN_PRIVATE_KEY,
      {
        algorithm: tokenConfig.algorithm,
        expiresIn: TOKEN_EXPIRATION.ACCESS_TOKEN,
        issuer: 'SupertMtg',
        subject: user.emailAddress,
        audience: ['api'],
        jwtid: uuidv4(),
      },
      (err, token) => {
        if (err) {
          logger.error('Error creating token: ', err);

          return reject(err);
        }

        resolve(token);
      }
    );
  });
}

export async function createRefreshToken(accessToken) {
  const decodedAccessToken = await authorizeToken(accessToken);

  const newRefreshToken = await new Promise((resolve, reject) => {
    jwt.sign(
      {},
      TOKEN_PRIVATE_KEY,
      {
        algorithm: tokenConfig.algorithm,
        expiresIn: TOKEN_EXPIRATION.REFRESH_TOKEN,
        issuer: 'SupertMtg',
        subject: String(decodedAccessToken.user.id),
        audience: ['api'],
        jwtid: uuidv4(),
      },
      (err, refreshToken) => {
        if (err) {
          logger.error('Error creating refresh token: ', err);

          return reject(err);
        }

        resolve(refreshToken);
      }
    );
  });

  const decodedRefreshToken = jwt.decode(newRefreshToken);

  await RefreshTokenModel.createNewRefreshToken(
    decodedRefreshToken.jti,
    decodedAccessToken.user.id
  );

  return newRefreshToken;
}

export async function refreshAccessToken(accessToken, refreshToken) {
  let decodedRefreshToken;
  let decodedToken;

  try {
    decodedRefreshToken = await authorizeToken(refreshToken);
    decodedToken = jwt.decode(accessToken);
  } catch (error) {
    await revokeToken(refreshToken);
    throw error;
  }

  if (String(decodedToken.user.id) !== decodedRefreshToken.sub) {
    logger.error(
      'Error decoding token during refresh - sub mismatch',
      decodedToken,
      decodedRefreshToken
    );

    throw new Error('Error decoding token during refresh - sub mismatch');
  }

  const isValid = await RefreshTokenModel.isValid(decodedRefreshToken.jti);

  if (!isValid) {
    logger.error('Refresh token no longer valid: ', decodedRefreshToken.jti);

    throw new Error('Refresh token no longer valid');
  }

  const newToken = await createToken(decodedToken.user);

  return newToken;
}

export async function revokeToken(refreshToken) {
  const decodedRefreshToken = jwt.decode(refreshToken) || {};
  const refreshTokenId = decodedRefreshToken.jti;

  await RefreshTokenModel.invalidateRefreshToken(refreshTokenId);
}

export const decodeToken = jwt.decode;
