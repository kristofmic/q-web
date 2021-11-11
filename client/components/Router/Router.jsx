import React from 'react';
import PropTypes from 'prop-types';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

import AuthPageContainer from '../containers/AuthPageContainer';
import AppPageContainer from '../containers/AppPageContainer';
import ErrorPageContainer from '../containers/ErrorPageContainer';

const Router = process.env.BROWSER ? BrowserRouter : StaticRouter;
export default function MainRouter(props) {
  // Only required for server rendering
  const { location } = props;

  return (
    <Router location={location}>
      <Routes>
        <Route path="/auth/*" element={<AuthPageContainer />} />

        <Route path="/error/*" element={<ErrorPageContainer />} />

        <Route path="/*" element={<AppPageContainer />} />

        <Route path="*" element={<Navigate to="/error/notfound" replace />} />
      </Routes>
    </Router>
  );
}

MainRouter.propTypes = {
  location: PropTypes.string,
};
