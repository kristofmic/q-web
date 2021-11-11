import cluster from 'cluster';
import os from 'os';

import { serverLogger as logger } from '../logger';

export default function clusterProcess(start) {
  if (cluster.isMaster) {
    logger.info(`Master ${process.pid} is running`);
    const numCPUs = os.cpus().length;

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      logger.info(
        `worker ${worker.process.pid} died (${signal || code}). restarting...`
      );
      cluster.fork();
    });
  } else {
    start();

    logger.info(`Worker ${process.pid} started`);
  }
}
