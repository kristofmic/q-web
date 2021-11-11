import { serverLogger as logger } from '../lib/logger';
import { UnexpectedServerError } from '../lib/errors';
import sleep from '../lib/utils/sleep';

import HTTP_STATUS_CODES from '../constants/httpStatusCodes';

const ERROR_CODE = {
  I_AM_GROOT_ERROR: 'API:I_AM_GROOT:100',
};

export async function iAmGroot(req, res, next) {
  await sleep(2000);

  const { error } = req.query;

  if (error) {
    logger.error(error);
    return next(new UnexpectedServerError(ERROR_CODE.I_AM_GROOT_ERROR));
  }

  res.status(HTTP_STATUS_CODES.OK).json({
    message: 'I am Groot!',
  });
}
