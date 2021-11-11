import { createTerminus } from '@godaddy/terminus';

import { uncaughtExceptionError } from '../errors';
import { serverLogger as logger } from '../logger';

function onSignal() {
  logger.info('Server is starting cleanup');
}

function onShutdown() {
  logger.info('Server is shutting down');
}

export default function cleanup(server) {
  process.on('uncaughtException', uncaughtExceptionError);

  return createTerminus(server, {
    healthChecks: {},
    timeout: 2000,
    signals: ['SIGTERM', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException'],
    onSignal,
    onShutdown,
  });
}
