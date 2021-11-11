import Knex from 'knex';

import { serverLogger as logger } from '../server/lib/logger';
import startrKnexfile from './startr/knexfile';

export const connections = {
  startr: Knex(startrKnexfile),
};

function validateConnection(name, connection) {
  return connection
    .raw('SELECT 1')
    .then(() => {
      logger.info(`${name} Postgres client connection established`);
    })
    .catch((err) => {
      logger.error(
        { err },
        `Unable to connect to ${name} Postgres client`,
        err
      );
      throw err;
    });
}

function validateShutdown(name, connection) {
  return connection
    .destroy()
    .then(() => {
      logger.info(`${name} Postgres client connection destroyed`);
    })
    .catch((err) => {
      logger.error(
        { err },
        `Unable to destroy connection to ${name} Postgres client`,
        err
      );
      throw err;
    });
}

export function connect() {
  return Promise.all([validateConnection('STARTR', connections.startr)]);
}

export function shutdown() {
  return Promise.all([validateShutdown('STARTR', connections.startr)]);
}
