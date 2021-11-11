import bcrypt from 'bcrypt';
import _ from 'lodash';
import { transaction } from 'objection';
import { v4 as uuidv4 } from 'uuid';

import BaseAPIModel from './BaseAPIModel';

import { ModelError } from '../../server/lib/errors';
import { createLogger } from '../../server/lib/logger';
import { isValidEmail } from '../../server/lib/utils/emailValidation';

import HTTP_STATUS_CODES from '../../server/constants/httpStatusCodes';

const SALT_ROUNDS = 10;

const logger = createLogger('UserModel');

class UserModel extends BaseAPIModel {
  static get errorCode() {
    return {
      // validation errors
      INVALID_EMAIL_ADDRESS: 'UM:VAL:100',
      IVNALID_PASSWORD: 'UM:VAL:101',
      IVNALID_TOKENS: 'UM:VAL:102',

      // constraint errors
      DUPLICATE_EMAIL: 'UM:CONST:100',

      // other errors
      NO_EMAIL_ACCOUNT: 'UM:OTH:100',
      INCORRECT_PASSWORD: 'UM:OTH:101',
    };
  }

  static get oauthProvider() {
    return {
      GOOGLE: 'GOOGLE',
    };
  }

  static get tableName() {
    return 'users';
  }

  // this is only used for validation and not the Database schema
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'emailAddress'],
      properties: {
        id: { type: 'string' },
        emailAddress: { type: 'string' },
        givenName: { type: 'string' },
        familyName: { type: 'string' },
        picture: { type: 'string' },
        passwordHash: { type: 'string' },
        oauthAccessToken: { type: 'string' },
        oauthRefreshToken: { type: 'string' },
        oauthProvider: {
          type: 'string',
          enum: Object.values(this.oauthProvider),
        },
        createdAt: { type: 'integer' },
        updatedAt: { type: 'integer' },
      },
    };
  }

  static getUserName(user = {}) {
    return user.givenName
      ? `${user.givenName} ${(user.familyName || '').slice(0, 1)}`
      : (user.emailAddress || '').split('@')[0] || 'Anonymous';
  }

  /**
   * Checks to see if the passwordHash matches the user's password
   *
   * @param {string} password
   * @param {string} passwordHash
   * @returns {Promise<string>}
   */
  static checkPassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
  }

  /**
   * Hash a user's password
   *
   * @param {string} password
   * @returns {Promise<string>}
   */
  static hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS).catch((err) => {
      logger.error(err);
      throw new Error('Error hashing password');
    });
  }

  /**
   * Get's a user by their ID
   *
   * @param {string} id
   * @param {object} [transaction]
   * @returns {Promise<User>}
   */
  static getUserById(id, trx) {
    return this.query(trx).findById(id);
  }

  /**
   * Get's a user by their email address
   *
   * @param {string} emailAddress
   * @param {object} transaction
   * @returns {Promise<User>}
   */
  static getUserByEmailAddress(emailAddress, trx) {
    return this.query(trx).where('email_address', emailAddress).first();
  }

  /**
   * Create's user
   *
   * @param {string} emailAddress
   * @param {string} password
   * @returns {Promise<User>}
   */
  static createNewUserWithPassword(emailAddress, password) {
    if (!password || password.length < 6) {
      throw new ModelError(
        'At least 6 characters, please.',
        UserModel,
        UserModel.errorCode.IVNALID_PASSWORD,
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }

    return transaction(this.knex(), async (trx) => {
      const passwordHash = await this.hashPassword(password);
      const userId = uuidv4();

      const [user] = await Promise.all([
        this.query(trx).insertAndFetch({
          id: userId,
          emailAddress,
          passwordHash,
        }),
      ]);

      return user;
    }).catch((error) => {
      if (error.constraint === 'users_email_address_unique') {
        throw new ModelError(
          'An account with that email exists. Sign in.',
          UserModel,
          UserModel.errorCode.DUPLICATE_EMAIL,
          HTTP_STATUS_CODES.BAD_REQUEST
        );
      }

      throw error;
    });
  }

  /**
   * Create's user
   *
   * @param {string} emailAddress
   * @param {object} tokens
   * @param {string} tokens.accessToken
   * @param {string} tokens.refreshToken
   * @param {UserModel.oauthProviders} provider
   * @param {object} userInfo additional user info we may have such as givenName or picture
   * @returns {Promise<User>}
   */
  static async upsertUserWithOauthTokens(
    emailAddress,
    tokens,
    provider,
    userInfo
  ) {
    if (!tokens || !tokens.accessToken || !tokens.refreshToken) {
      throw new ModelError(
        'Invalid OAuth2 credentials',
        UserModel,
        UserModel.errorCode.IVNALID_TOKENS,
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }

    try {
      const newUser = await transaction(this.knex(), async (trx) => {
        const userId = uuidv4();

        const [user] = await Promise.all([
          this.query(trx).insertAndFetch({
            id: userId,
            emailAddress,
            oauthAccessToken: tokens.accessToken,
            oauthRefreshToken: tokens.refreshToken,
            oauthProvider: provider,
            ...userInfo,
          }),
        ]);

        return user;
      });

      return newUser;
    } catch (error) {
      if (!error || error.constraint !== 'users_email_address_unique') {
        logger.error(error);
        throw error;
      }
    }

    return this.query()
      .patch({
        oauthAccessToken: tokens.accessToken,
        oauthRefreshToken: tokens.refreshToken,
        oauthProvider: provider,
        ...userInfo,
      })
      .where('email_address', emailAddress)
      .returning('*')
      .first();
  }

  /**
   * Checks if the credentials for the user are correct
   *
   * @param {string} emailAddress
   * @param {string} password
   * @returns {Promise<User>}
   */
  static async checkUserCredentials(emailAddress, password) {
    const user = await this.getUserByEmailAddress(emailAddress);

    if (!user) {
      throw new ModelError(
        'No account exists with that email. Would you like to create an account?',
        UserModel,
        UserModel.errorCode.NO_EMAIL_ACCOUNT,
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }

    const isValidPassword = await this.checkPassword(
      password,
      user.passwordHash
    );

    if (!isValidPassword) {
      throw new ModelError(
        "Oops! That email or password doesn't seem to be valid",
        UserModel,
        UserModel.errorCode.INCORRECT_PASSWORD,
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }

    return user;
  }

  $formatJson(_json) {
    const json = _.omit(super.$parseDatabaseJson(_json), [
      'oauthProvider',
      'oauthAccessToken',
      'oauthRefreshToken',
      'passwordHash',
    ]);

    return json;
  }

  $parseDatabaseJson(json) {
    const _json = super.$parseDatabaseJson(json);

    _json.username = UserModel.getUserName(_json);

    return _json;
  }

  $afterValidate(json, opt) {
    super.$afterValidate(json, opt);

    if (!json.emailAddress) {
      return;
    }

    if (!isValidEmail(json.emailAddress)) {
      throw new ModelError(
        "Oops! That email doesn't seem to be valid.",
        UserModel,
        UserModel.errorCode.INVALID_EMAIL_ADDRESS,
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }
  }
}

export default UserModel;
