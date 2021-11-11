import express from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import path from 'path';
import conf from 'nconf';
import requestID from 'express-request-id';
import csurf from 'csurf';

import { uncaughtExceptionError } from './lib/errors';
import { requestLogger, serverLogger as logger } from './lib/logger';
import webpackServer from './lib/utils/webpackServer';
import routes from './routes';

// Create Express server
const server = express();
server.set('trust proxy', true);

// Setup security
server.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
const csrfProtection = csurf({
  cookie: true,
  secure: true,
  httpOnly: true,
});

// Setup parsing
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cookieParser());

// Setup compression
server.use(compression());

// Setup logging
server.use(requestID());
server.use(requestLogger);

// Setup dev middleware
if (!conf.get('SKIP_WP') && conf.get('NODE_ENV') !== 'production') {
  webpackServer(server);
} else {
  logger.info(
    `NODE_ENV is ${conf.get('NODE_ENV')}, skipping Webpack middleware.`
  );
}

// Public assets
server.use('/public', express.static(path.join(__dirname, '..', 'public')));

// View setup
server.set('views', path.join(__dirname, '..', 'views'));
server.set('view engine', 'ejs');

// Setup routes and route handlers
routes(server, { csrfProtection });

process.on('uncaughtException', uncaughtExceptionError);

export default server;
