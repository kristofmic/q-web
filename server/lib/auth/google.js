import { google } from 'googleapis';

import * as jwt from './jwt';

import GOOGLE_AUTH from '../../../conf/secrets/decrypted/googleAuth.json';

/**
 * Factor for new google OAuth2 client
 *
 * @returns {GoogleOauth2Client}
 */
function newClient() {
  return new google.auth.OAuth2(
    GOOGLE_AUTH.web.client_id,
    GOOGLE_AUTH.web.client_secret,
    'postmessage'
  );
}

/**
 * Get a Google OAuth2 client either with an access token + refresh token combination
 *
 * @param {string} accessToken
 * @param {string} refreshToken
 * @param {function} onRefresh
 * @returns {Promise<GoogleOauth2Client>}
 */
export async function createGoogleAuthClient(
  accessToken,
  refreshToken,
  onRefresh
) {
  const tokens = {
    access_token: accessToken,
    refresh_token: refreshToken,
  };
  const client = newClient();

  client.setCredentials(tokens);

  client.on('tokens', (nextTokens) => {
    onRefresh({
      accessToken: nextTokens.access_token,
      refreshToken: nextTokens.refresh_token,
    });
  });
}

/**
 * Get Google OAuth2 client authorization (i.e., tokens, payload information)
 *
 * @param {string} authCode
 * @returns {Promise<{tokens,payload}>}
 */
export async function getGoogleAuthorization(authCode) {
  const client = newClient();

  const { tokens } = await client.getToken(authCode);

  const payload = jwt.decodeToken(tokens.id_token);

  return {
    tokens: {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    },
    payload: {
      email: payload.email,
      picture: payload.picture,
      givenName: payload.given_name,
      familyName: payload.family_name,
    },
  };
}
