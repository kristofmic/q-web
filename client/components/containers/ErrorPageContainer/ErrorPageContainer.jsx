import React from 'react';

import { Route, Routes } from 'react-router-dom';

import Logo from '../../common/Images/Logo';
import { NotFoundPage, UnauthorizedPage } from '../../pages/ErrorPages';

if (process.env.BROWSER) {
  require('./ErrorPageContainer.scss');
}

export default function ErrorPageContainer() {
  return (
    <div id="error-container">
      <nav className="navbar navbar-light bg-light fixed-top">
        <div className="container">
          <span className="navbar-brand">
            <Logo />
          </span>
        </div>
      </nav>
      <div className="container error-body">
        <Routes>
          <Route path="notfound" element={<NotFoundPage />} />
          <Route path="unauthorized" element={<UnauthorizedPage />} />
        </Routes>
      </div>
    </div>
  );
}
