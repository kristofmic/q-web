import BaseAPIModel from './BaseAPIModel';

import { createLogger } from '../../server/lib/logger';

const logger = createLogger('RefreshTokenModel');

class RefreshTokenModel extends BaseAPIModel {
  static get errorCodes() {
    return {};
  }

  static get tableName() {
    return 'refresh_tokens';
  }

  // this is only used for validation and not the Database schema
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'userId'],
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        createdAt: { type: 'integer' },
        updatedAt: { type: 'integer' },
      },
    };
  }

  /**
   * Get the token by ID
   *
   * @param {string} id
   * @returns {Promise<RefreshToken>}
   */
  static getRefreshTokenById(id) {
    return this.query().findById(id);
  }

  /**
   * Create's refreshToken
   *
   * @param {string} id
   * @param {string|number} userId
   * @returns {Promise<RefreshToken>}
   */
  static createNewRefreshToken(id, userId) {
    return this.query()
      .insertAndFetch({
        id,
        userId,
      })
      .catch((error) => {
        logger.error(error);

        throw error;
      });
  }

  /**
   * Invalidates a token
   *
   * @param {string} id
   * @returns {Promise<RefreshToken>}
   */
  static invalidateRefreshToken(id) {
    return this.query()
      .deleteById(id)
      .catch((error) => {
        logger.error(error);

        throw error;
      });
  }

  /**
   * Invalidates all of a user's tokens
   *
   * @param {string|number} userId
   * @returns {Promise<RefreshToken>}
   */
  static invalidateUsersRefreshTokens(userId) {
    return this.query()
      .delete()
      .where('user_id', userId)
      .catch((error) => {
        logger.error(error);

        throw error;
      });
  }

  /**
   * Is token valid
   *
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  static async isValid(id) {
    let isValid = false;
    try {
      const token = await this.getRefreshTokenById(id);

      isValid = !!token;
    } catch (error) {
      logger.error(error);

      isValid = false;
    }

    return isValid;
  }

  $parseDatabaseJson(_json) {
    const json = super.$parseDatabaseJson(_json);

    json.userId = parseInt(json.userId, 10);
    json.createdAt = parseInt(json.createdAt, 10);
    json.updatedAt = parseInt(json.updatedAt, 10);

    return json;
  }
}

export default RefreshTokenModel;
