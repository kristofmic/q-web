import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { CSSTransition } from 'react-transition-group';

import Button from '../../../common/Button';
import IconButton from '../../../common/IconButton';
import Logo from '../../../common/Images/Logo';

import { API_STATUS, API_STATUSES } from '../../../../api';

import useBodyClassToggle from '../../../../hooks/useBodyClassToggle';
import useToggle from '../../../../hooks/useToggle';

if (process.env.BROWSER) {
  require('./AppBar.scss');
}

export default function AppBar(props) {
  const { logoutStatus, onLogout, userEmail } = props;

  const [isMobileNavVisible, , showMobileNav, hideMobileNav] = useToggle(false);
  const [hideBodyOverflow, showBodyOverflow] =
    useBodyClassToggle('overflow-hidden');
  const dismissMobileNav = useCallback(() => {
    showBodyOverflow();
    hideMobileNav();
  }, [hideMobileNav, showBodyOverflow]);
  const displayMobileNav = useCallback(() => {
    hideBodyOverflow();
    showMobileNav();
  }, [showMobileNav, hideBodyOverflow]);

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light fixed-top">
      <a className="navbar-brand" href="#">
        <Logo />
      </a>

      <IconButton
        className="navbar-toggler border-0"
        icon="icon-menu-left-right"
        onClick={displayMobileNav}
        tooltipDisabled
      />

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item me-3">
            <Button
              className="btn btn-light text-danger text-left"
              disabled={
                logoutStatus === API_STATUS.LOADING ||
                logoutStatus === API_STATUS.SUCCESS
              }
              loading={
                logoutStatus === API_STATUS.LOADING ||
                logoutStatus === API_STATUS.SUCCESS
              }
              onClick={onLogout}
            >
              {`Log out (${userEmail})`}
            </Button>
          </li>
        </ul>
      </div>

      <CSSTransition
        classNames="mobile-nav"
        in={isMobileNavVisible}
        timeout={200}
      >
        <div className="navbar-nav mobile-nav bg-light">
          <IconButton
            className="navbar-toggler border-0"
            icon="icon-clear"
            onClick={dismissMobileNav}
            tooltipDisabled
          />
          <ul className="list-unstyled">
            <li className="nav-item mb-4">
              <Button
                className="btn btn-light text-danger text-left"
                disabled={
                  logoutStatus === API_STATUS.LOADING ||
                  logoutStatus === API_STATUS.SUCCESS
                }
                loading={
                  logoutStatus === API_STATUS.LOADING ||
                  logoutStatus === API_STATUS.SUCCESS
                }
                onClick={onLogout}
              >
                {`Log out (${userEmail})`}
              </Button>
            </li>
          </ul>
          <a className="navbar-brand" href="#" onClick={dismissMobileNav}>
            <Logo className="text-muted small" />
          </a>
        </div>
      </CSSTransition>
    </nav>
  );
}

AppBar.propTypes = {
  logoutStatus: PropTypes.oneOf(API_STATUSES),
  onLogout: PropTypes.func.isRequired,
  userEmail: PropTypes.string,
};
