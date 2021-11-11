import React, { useMemo } from 'react';
import loadable from '@loadable/component';

export default function LazyAppPageContainer() {
  const AppPageContainer = useMemo(() =>
    loadable(() => import('./AppPageContainer'))
  );

  return <AppPageContainer />;
}
