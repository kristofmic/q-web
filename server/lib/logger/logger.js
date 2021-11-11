import _ from 'lodash';
import bunyan from 'bunyan';
import config from 'nconf';
import pretty from 'pretty-hrtime';

export const serverLogger = bunyan.createLogger({
  name: 'server',
  streams: [
    {
      level: config.get('logLevel'),
      stream: process.stdout,
    },
  ],
  serializers: bunyan.stdSerializers,
});

export const requestChildLogger = serverLogger.child({
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.originalUrl,
      query: !_.isEmpty(req.query) ? req.query : undefined,
      body: !_.isEmpty(req.body) ? req.body : undefined,
    }),
  },
});

function onResponseEnd(name, start, req) {
  return function handleResponseEnd() {
    const elapsed = process.hrtime(start);
    const duration = pretty(elapsed);

    requestChildLogger.info({ req, duration }, `Request End - ${name}`);
  };
}

export function requestLogger(req, res, next) {
  const start = process.hrtime();

  requestChildLogger.info({ req }, 'Request Received');

  res.on('finish', onResponseEnd('finish', start, req));
  // res.on('close', onResponseEnd('close', start, req));

  next();
}

export function createLogger(name, level) {
  return bunyan.createLogger({
    name,
    level: level || config.get('logLevel'),
    serializers: bunyan.stdSerializers,
  });
}
