import axios from 'axios';
import get from 'lodash/get';

import localData from '../utils/localData';

const TOTAL_RETRIES = 2;
let CSRF_TOKEN = get(localData(), 'csrfToken');

const api = axios.create({
  timeout: 5000,
});
api.interceptors.request.use((config) => {
  if (CSRF_TOKEN) {
    // eslint-disable-next-line no-param-reassign
    config.headers = {
      ...config.headers,
      'csrf-token': CSRF_TOKEN,
    };
  }

  return config;
});
api.interceptors.response.use(undefined, (error) => {
  const errorResponseStatus = get(error, 'response.status');
  const errorCode = get(error, 'code');
  const retries = get(error, 'config.headers.x-retries', 0);
  const refresh = get(error, 'config.headers.x-refresh', false);

  if (errorResponseStatus === 401) {
    if (refresh) {
      window.location.href = `/auth/login?next=${encodeURIComponent(
        window.location.href
      )}`;

      throw error;
    }

    return api({
      method: 'POST',
      url: '/api/auth/refresh',
      headers: {
        'x-refresh': true,
      },
    }).then(() => api(error.config));
  }

  if (errorResponseStatus === 403) {
    if (refresh) {
      window.location.href = `/auth/login?next=${encodeURIComponent(
        window.location.href
      )}`;

      throw error;
    }

    return api({
      method: 'GET',
      url: '/api/auth/csrf',
      headers: {
        'x-refresh': true,
      },
    }).then((response) => {
      CSRF_TOKEN = response.data.csrfToken;

      return api(error.config);
    });
  }

  if (errorCode === 'ECONNRESET' && retries < TOTAL_RETRIES) {
    return api({
      ...error.config,
      headers: {
        ...error.config.headers,
        'x-retries': retries + 1,
      },
    });
  }

  // eslint-disable-next-line no-param-reassign
  error.response = {
    ...error.response,
    data: {
      ...get(error, 'response.data'),
      error: {
        ...get(error, 'response.data.error'),
        message:
          get(error, 'response.data.error.message') ||
          'Oops! Something went wrong. Please wait a moment and try again.',
      },
    },
    status: errorResponseStatus || 500,
  };

  throw error;
});

export default api;
