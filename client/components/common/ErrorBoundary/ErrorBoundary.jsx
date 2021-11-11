import React from 'react';
import PropTypes from 'prop-types';

import Logo from '../Images/Logo';
import PermissionGate from '../PermissionGate';

if (process.env.BROWSER) {
  require('./ErrorBoundary.scss');
}

class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('UNCAUGHT ERROR: ', {
      error,
      errorInfo,
    });
  }

  render() {
    const { hasError } = this.state;

    if (hasError) {
      return (
        <div className="error-boundary container">
          <nav className="navbar navbar-light bg-white fixed-top">
            <span className="navbar-brand ml-2">
              <Logo />
            </span>
          </nav>
          <PermissionGate
            heading="Uh oh! This is embarrassing..."
            message="We're not quite sure what happened, but something went wrong. We've been notified and will investigate the problem as soon as possible."
            primaryLinkExternal
            primaryLinkText="Take me out of here"
            primaryLinkTo="/home"
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
