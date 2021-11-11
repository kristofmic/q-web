import _ from 'lodash';
import conf from 'nconf';

import GOOGLE_AUTH from '../../conf/secrets/decrypted/googleAuth.json';

import Main from '../../client/components/Main';
import { createStore } from '../../client/store';

import reactServer from '../lib/utils/reactServer';

import getAssets from '../../views/assets';

import HTTP_STATUS_CODES from '../constants/httpStatusCodes';

import { isUnhandledPath } from './error';

const SERVER_RENDER = conf.get('serverRender');
const NODE_ENV = conf.get('NODE_ENV');
const GOOGLE_CLIENT_ID = GOOGLE_AUTH.web.client_id;
const CLIENT_ASSETS = getAssets();

export async function mainView(req, res, next) {
  if (isUnhandledPath(req.path)) {
    return next();
  }

  const localData = _.merge({}, _.get(req, ['locals', 'localData'], {}), {
    config: {},
    csrfToken: req.csrfToken?.(),
  });

  const locals = {
    ...req.locals,
    body: null,
    localData,
    ...CLIENT_ASSETS,
    env: NODE_ENV,
    googleClientId: GOOGLE_CLIENT_ID,
  };

  if (SERVER_RENDER) {
    locals.body = reactServer(Main, {
      location: req.originalUrl,
      store: createStore(localData),
    });
  }

  return res.status(HTTP_STATUS_CODES.OK).render('main.ejs', locals);
}

export async function errorView(req, res, next) {
  const localData = _.merge({}, _.get(req, ['locals', 'localData'], {}), {
    config: {},
  });
  _.set(req, ['locals', 'localData'], localData);

  return mainView(req, res, next);
}
