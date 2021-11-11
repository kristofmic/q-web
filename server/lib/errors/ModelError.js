import HttpError from './HttpError';

export default class ModelError extends Error {
  constructor(message, model, code, httpStatusCode = 500) {
    super(message);

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);

    this.model = model;
    this.statusCode = httpStatusCode;
    this.code = code;
  }

  toHttpError() {
    return new HttpError(this.message, this.statusCode, this.code);
  }
}
