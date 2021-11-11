import React from 'react';

import { useLocation } from 'react-router-dom';

export default function withLocation(Component) {
  return function WithLocationProvider(props) {
    const location = useLocation();

    return <Component {...props} location={location} />;
  };
}
