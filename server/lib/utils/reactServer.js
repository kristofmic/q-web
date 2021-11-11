import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { ChunkExtractor } from '@loadable/server';

const stats = require('../../../public/loadable-stats.json');

function reactServer(Component, props) {
  const extractor = new ChunkExtractor({ stats });
  const element = React.createElement(Component, props);
  const jsx = extractor.collectChunks(element);

  return ReactDOMServer.renderToString(jsx);
}

export default reactServer;
