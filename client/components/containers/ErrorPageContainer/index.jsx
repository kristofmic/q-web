import React, { useMemo } from 'react';
import loadable from '@loadable/component';

export default function LazyErrorPageContainer() {
  const ErrorPageContainer = useMemo(() =>
    loadable(() => import('./ErrorPageContainer'))
  );

  return <ErrorPageContainer />;
}
