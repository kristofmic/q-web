import { serverLogger as logger } from '../logger';

export function routeError(err, req, res) {
  logger.error({ err, req, res }, 'ROUTE ERROR', err);
}

export function uncaughtExceptionError(err) {
  logger.error('UNCAUGHT EXCEPTION ERROR', err);
}
