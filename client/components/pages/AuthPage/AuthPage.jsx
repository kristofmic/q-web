import React from 'react';
import PropTypes from 'prop-types';

import flow from 'lodash/flow';
import pick from 'lodash/pick';
import { connect } from 'react-redux';

import { Link, Route, Routes } from 'react-router-dom';

import AuthForm from './AuthForm';
import withLocation from '../../common/withLocation';
import SelectAuth from './SelectAuth';

import { actions as authenticationActions } from '../../../slices/authentication';
import { API_STATUS } from '../../../api';

export const VARIANT = {
  LOGIN: 'LOGIN',
  SIGNUP: 'SIGNUP',
};

export class AuthPage extends React.Component {
  static propTypes = {
    variant: PropTypes.oneOf(Object.values(VARIANT)).isRequired,

    // connect
    loginState: PropTypes.object.isRequired,
    loginWithEmail: PropTypes.func.isRequired,
    loginWithGoogle: PropTypes.func.isRequired,
    resetState: PropTypes.func.isRequired,
    signupState: PropTypes.object.isRequired,
    signupWithEmail: PropTypes.func.isRequired,
    signupWithGoogle: PropTypes.func.isRequired,

    // provided by route
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string,
    }).isRequired,
  };

  componentDidUpdate() {
    const { location, loginState, signupState } = this.props;
    const { data, status } = this.isLogin ? loginState : signupState;

    if (status === API_STATUS.SUCCESS && data && data.user) {
      const search = new URLSearchParams(location.search);
      const next = search.get('next');

      if (next && next.startsWith(window.location.origin)) {
        window.location.href = next;
      } else {
        window.location.href = '/';
      }
    }
  }

  get authFormState() {
    const { loginState, signupState } = this.props;

    if (this.isLogin) {
      return loginState;
    }

    return signupState;
  }

  get authFormSubmitHandler() {
    if (this.isLogin) {
      return this.handleEmailLogin;
    }

    return this.handleEmailSignup;
  }

  get isLogin() {
    const { variant } = this.props;

    return variant === VARIANT.LOGIN;
  }

  handleEmailLogin = (email, password) => {
    const { loginWithEmail } = this.props;

    loginWithEmail(email, password);
  };

  handleEmailSignup = (email, password) => {
    const { signupWithEmail } = this.props;

    signupWithEmail(email, password);
  };

  handleGoogleContinue = () => {
    const { loginWithGoogle, signupWithGoogle } = this.props;

    if (this.isLogin) {
      loginWithGoogle();
    } else {
      signupWithGoogle();
    }
  };

  render() {
    const { variant } = this.props;

    return (
      <div id="auth-page" className="container">
        <div className="row justify-content-center mb-5">
          <h2 className="text-center font-weight-normal">
            {this.isLogin ? 'Sign in' : 'Create an Account'}
          </h2>
        </div>

        <Routes>
          <Route
            index
            element={
              <SelectAuth
                onGoogleContinue={this.handleGoogleContinue}
                variant={variant}
              />
            }
          />
          <Route
            path="email"
            element={
              <AuthForm
                {...this.authFormState}
                onSubmit={this.authFormSubmitHandler}
                variant={variant}
              />
            }
          />
        </Routes>

        <div className="row justify-content-center mt-4">
          <p className="text-center">
            {this.isLogin ? (
              <>
                No account?{' '}
                <Link to="/auth/signup">
                  <strong>Sign up for free</strong>
                </Link>
              </>
            ) : (
              <>
                Have an account?{' '}
                <Link to="/auth/login">
                  <strong>Sign in</strong>
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    );
  }
}

export default flow(
  withLocation,
  connect(
    (state) => ({
      loginState: state.authentication.login,
      signupState: state.authentication.signup,
    }),
    pick(authenticationActions, [
      'loginWithEmail',
      'loginWithGoogle',
      'resetState',
      'signupWithEmail',
      'signupWithGoogle',
    ])
  )
)(AuthPage);
