import conf from 'nconf';

const HEALTH_MESSAGE = conf.get('health');

export function healthcheck(req, res) {
  res.status(200).json({
    message: HEALTH_MESSAGE,
  });
}
