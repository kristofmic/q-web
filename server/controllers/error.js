import http from 'http';
import conf from 'nconf';

import { HttpError, routeError } from '../lib/errors';

import getAssets from '../../views/assets';

import HTTP_STATUS_CODES from '../constants/httpStatusCodes';

const NODE_ENV = conf.get('NODE_ENV');
const CLIENT_ASSETS = getAssets();
const ANALYTICS_KEY = conf.get('analytics:key');

const UNHANDLED_PATHS = ['/heathcheck', '/public', '/api', '/auth'];

export function isUnhandledPath(path) {
  return UNHANDLED_PATHS.some((p) => path.startsWith(p));
}

export function handleNotFoundError(req, res, next) {
  if (isUnhandledPath(req.path)) {
    return next(
      new HttpError(`Path ${req.path} not found`, HTTP_STATUS_CODES.NOT_FOUND)
    );
  }

  res.redirect(HTTP_STATUS_CODES.FOUND, '/error/notfound');
}

function renderHTML(res, status, errorDetails) {
  return () => {
    res.status(status).render('error.ejs', {
      ...errorDetails,
      ...CLIENT_ASSETS,
      env: NODE_ENV,
      localData: {
        config: {
          analyticsKey: ANALYTICS_KEY,
          error: true,
        },
      },
    });
  };
}

function renderJSON(res, status, errorDetails) {
  return () => {
    res.status(status).json({
      error: errorDetails,
    });
  };
}

// error handler in express has to have four arguments in signature
// eslint-disable-next-line no-unused-vars
export function handleServerError(err, req, res, next) {
  routeError(err, req, res);

  const status = err.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
  const statusDefinition = http.STATUS_CODES[status];
  const message = err.message || statusDefinition;
  const stack = NODE_ENV !== 'production' ? err.stack : '';

  const errorDetails = {
    status,
    statusDefinition,
    message,
    stack,
  };

  const resHTML = renderHTML(res, status, errorDetails);
  const resJSON = renderJSON(res, status, errorDetails);

  res.format({
    default: resHTML,
    html: resHTML,
    json: resJSON,
    text: resJSON,
  });
}
