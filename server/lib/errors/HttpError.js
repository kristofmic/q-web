export default class HttpError extends Error {
  constructor(message, status = 500, code) {
    super(message);

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);

    this.statusCode = status;
    this.code = code;
  }
}
