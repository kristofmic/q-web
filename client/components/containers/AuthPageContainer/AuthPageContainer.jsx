import React from 'react';

import { Route, Routes } from 'react-router-dom';

import AuthBar from './AuthBar';
import AuthPage, { VARIANT } from '../../pages/AuthPage';

if (process.env.BROWSER) {
  require('./AuthPageContainer.scss');
}

export default function AuthPageContainer() {
  return (
    <div id="auth-container">
      <AuthBar />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col col-md-11 col-lg-9 col-xl-7">
            <Routes>
              <Route
                path="login/*"
                element={<AuthPage variant={VARIANT.LOGIN} />}
              />
              <Route
                path="signup/*"
                element={<AuthPage variant={VARIANT.SIGNUP} />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}
