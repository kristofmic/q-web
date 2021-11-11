import React from 'react';
import PropTypes from 'prop-types';

import { Provider as ReduxProvider } from 'react-redux';

import Router from '../Router';
import ErrorBoundary from '../common/ErrorBoundary';

export default function Main(props) {
  const { location, store } = props;

  return (
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <Router location={location} />
      </ReduxProvider>
    </ErrorBoundary>
  );
}

Main.propTypes = {
  location: Router.propTypes.location,
  store: PropTypes.object.isRequired,
};
