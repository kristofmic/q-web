import HttpError from './HttpError';

import HTTP_STATUS_CODES from '../../constants/httpStatusCodes';

const DEFAULT_MESSAGE =
  "Sorry, we're experiencing unexpected server errors. Please try again later.";

export default class UnexpectedServerError extends HttpError {
  constructor(code, message = DEFAULT_MESSAGE) {
    super(message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, code);
  }
}
