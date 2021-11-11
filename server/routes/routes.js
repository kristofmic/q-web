import * as api from '../controllers/api';
import * as authentication from '../controllers/authentication';
import * as error from '../controllers/error';
import * as health from '../controllers/health';
import * as main from '../controllers/main';

import authMiddleware from '../controllers/middleware/authMiddleware';
import unauthMiddleware from '../controllers/middleware/unauthMiddleware';

const apiAuthMiddleware = authMiddleware({ redirect: false });

export default function routes(server, { csrfProtection }) {
  /**
   * Healthcheck
   */
  server.get('/healthcheck', health.healthcheck);

  /**
   * Authentication routes
   */
  server.get('/api/auth/authorize', authentication.authorize);
  server.post('/api/auth/refresh', authentication.refresh);
  server.post('/api/auth/login/email', authentication.loginWithEmail);
  server.post('/api/auth/login/google', authentication.loginWithGoogle);
  server.post('/api/auth/signup/email', authentication.signupWithEmail);
  server.post('/api/auth/signup/google', authentication.signupWithGoogle);
  server.post(
    '/api/auth/logout',
    csrfProtection,
    apiAuthMiddleware,
    authentication.logout
  );
  server.get(
    '/api/auth/csrf',
    csrfProtection,
    apiAuthMiddleware,
    authentication.refreshCsrfToken
  );

  /**
   * API Routes
   */
  server.post('/api/groot', csrfProtection, apiAuthMiddleware, api.iAmGroot);

  /**
   * Main Routes
   */
  server.use(['/auth/login', '/auth/signup'], unauthMiddleware, main.mainView);
  server.use(['/error/unauthorized', '/error/notfound'], main.errorView);
  server.use(
    '/',
    csrfProtection,
    authMiddleware({ to: '/auth/login' }),
    main.mainView
  );

  /**
   * Error handlers
   * These must be last
   */
  server.use(error.handleNotFoundError);
  server.use(error.handleServerError);
}
