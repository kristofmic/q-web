import React, { useCallback, useEffect } from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';

import { useSelector } from 'react-redux';

import AppBar from './AppBar';

import HomePage from '../../pages/HomePage';

import { API_STATUS } from '../../../api';

import {
  actions as authenticationActions,
  selectors as authenticationSelectors,
} from '../../../slices/authentication';
import { selectors as userSelectors } from '../../../slices/user';

if (process.env.BROWSER) {
  require('./AppPageContainer.scss');
}

export default function AppPageContainer() {
  const logout = authenticationActions.useLogout();
  const logoutState = useSelector(authenticationSelectors.getLogoutState);
  const isSuccess = logoutState.status === API_STATUS.SUCCESS;
  const handleLogout = useCallback(() => logout(), [logout]);

  const userEmail = useSelector(userSelectors.getEmailAddress);

  useEffect(() => {
    if (isSuccess) {
      window.location.href = '/';
    }
  }, [isSuccess]);

  return (
    <div id="app-container">
      <AppBar
        logoutStatus={logoutState.status}
        onLogout={handleLogout}
        userEmail={userEmail}
      />
      <div className="app-body">
        <Routes>
          <Route index element={<Navigate to="/home" replace />} />

          <Route path="home" element={<HomePage />} />

          <Route path="*" element={<Navigate to="/error/notfound" replace />} />
        </Routes>
      </div>
    </div>
  );
}
