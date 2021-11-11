import _ from 'lodash';
import { Model, snakeCaseMappers } from 'objection';

import { connections } from '../connect';

class BaseAPIModel extends Model {
  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  $beforeInsert() {
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
  }

  $beforeUpdate() {
    this.updatedAt = Date.now();
  }

  $formatJson(json) {
    const _json = _.omit(super.$parseDatabaseJson(json), ['deleted']);

    return _json;
  }

  $parseDatabaseJson(json) {
    const _json = super.$parseDatabaseJson(json);

    _json.createdAt = parseInt(_json.createdAt, 10);
    _json.updatedAt = parseInt(_json.updatedAt, 10);

    return _json;
  }
}

BaseAPIModel.knex(connections.startr);

export default BaseAPIModel;
