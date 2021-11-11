import _ from 'lodash';

/* eslint-disable import/no-extraneous-dependencies */
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
/* eslint-enable */

import { serverLogger as logger } from '../logger';
import webpackConfig from '../../../client/webpack.config';

export default function webpackServer(server) {
  const compiler = webpack(webpackConfig);

  compiler.watch(
    {
      aggregateTimeout: 300,
      poll: undefined,
    },
    (err, stats) => {
      const rawMessages = stats.toJson({}, true);
      const messages = formatWebpackMessages({
        errors: rawMessages.errors.map((msg) => msg.message),
        warnings: rawMessages.errors.map((msg) => msg.message),
      });

      if (err || stats.hasErrors()) {
        logger.info('Failed to compile.');
        messages.errors.forEach((e) => logger.info(e));
        return;
      }

      if (stats.hasWarnings()) {
        logger.info('Compiled with warnings.');
        messages.warnings.forEach((w) => logger.info(w));
      }
    }
  );

  // build server and serve assets from Server memory
  server.use(
    webpackMiddleware(compiler, {
      publicPath: _.get(webpackConfig, 'output.publicPath', ''),
    })
  );

  return server;
}
