import React from 'react';
import PropTypes from 'prop-types';

import { Link, useLocation } from 'react-router-dom';

import Button from '../../common/Button';
import GoogleG from '../../common/Images/GoogleG';

export default function SelectAuth(props) {
  const { isLogin, onGoogleContinue } = props;
  const location = useLocation();

  return (
    <div className="row justify-content-center">
      <div className="col col-md-8">
        <div className="d-grid gap-3">
          <Button
            className="btn btn-outline-primary"
            onClick={onGoogleContinue}
          >
            <GoogleG className="me-2" height="24" />
            {isLogin ? 'Sign in' : 'Continue'} with Google
          </Button>
          <Link
            className="btn btn-outline-primary"
            to={{
              pathname: isLogin ? 'email' : 'email',
              search: location.search,
            }}
          >
            {isLogin ? 'Sign in' : 'Continue'} with Email
          </Link>
        </div>
      </div>
    </div>
  );
}

SelectAuth.propTypes = {
  isLogin: PropTypes.bool,
  onGoogleContinue: PropTypes.func.isRequired,
};
