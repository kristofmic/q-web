import React, { useMemo } from 'react';
import loadable from '@loadable/component';

export default function LazyAuthPageContainer() {
  const AuthPageContainer = useMemo(() =>
    loadable(() => import('./AuthPageContainer'))
  );

  return <AuthPageContainer />;
}
