import React from 'react';
import PropTypes from 'prop-types';

import cx from 'classnames';

import Button from '../../common/Button';
import Icon from '../../common/Icon';

import { isValidEmail } from '../../../utils/emailValidation';

import { API_STATUS, API_STATUSES } from '../../../api';

function isPasswordValid(password = '') {
  return password.length >= 6;
}

export default class AuthForm extends React.Component {
  static propTypes = {
    error: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    status: PropTypes.oneOf(API_STATUSES),
    variant: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      email: {
        error: null,
        value: '',
      },
      password: {
        error: null,
        value: '',
        visible: false,
      },
    };

    this.emailRef = React.createRef();
  }

  componentDidMount() {
    this.focusEmailField();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.variant !== this.props.variant) {
      this.resetState();
      this.focusEmailField();
    }
  }

  setEmailValue = (event) => {
    this.setState((state) => ({
      email: {
        ...state.email,
        error: null,
        value: event.target.value,
      },
    }));
  };

  setPasswordValue = (event) => {
    this.setState((state) => ({
      password: {
        ...state.password,
        error: null,
        value: event.target.value,
      },
    }));
  };

  handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { onSubmit } = this.props;
    const { value: email } = this.state.email;
    const { value: password } = this.state.password;
    let isValid = true;

    if (!isValidEmail(email)) {
      this.setState((state) => ({
        email: {
          ...state.email,
          error: "Oops! That email doesn't seem to be valid.",
        },
      }));

      isValid = false;
    }

    if (!isPasswordValid(password)) {
      this.setState((state) => ({
        password: {
          ...state.password,
          error: 'At least 6 characters, please.',
        },
      }));

      isValid = false;
    }

    if (isValid) {
      onSubmit(email, password);
    }
  };

  togglePasswordVisibility = () => {
    this.setState((state) => ({
      password: {
        ...state.password,
        visible: !state.password.visible,
      },
    }));
  };

  focusEmailField() {
    if (this.emailRef.current) {
      this.emailRef.current.focus();
    }
  }

  resetState() {
    this.setState({
      email: {
        error: null,
        value: '',
      },
      password: {
        error: null,
        value: '',
        visible: false,
      },
    });
  }

  render() {
    const { error, status } = this.props;
    const { email, password } = this.state;

    const isLoading =
      status === API_STATUS.LOADING || status === API_STATUS.SUCCESS;

    return (
      <>
        {error && (
          <p className="text-center text-danger mb-3 small font-weight-bold">
            {error.message}
          </p>
        )}

        <form onSubmit={this.handleSubmit}>
          <div className="row justify-content-center mb-2">
            <div className="col col-md-8">
              <div className="form-group">
                <label htmlFor="email">email</label>
                <input
                  className={cx('form-control', {
                    'is-invalid': email.error,
                  })}
                  disabled={isLoading}
                  id="email"
                  onChange={this.setEmailValue}
                  placeholder="danny@westeros.gov"
                  ref={this.emailRef}
                  type="text"
                  value={email.value}
                />
                {email.error && (
                  <div className="invalid-feedback">{email.error}</div>
                )}
              </div>
            </div>
          </div>
          <div className="row justify-content-center mb-4">
            <div className="col col-md-8">
              <div className="form-group">
                <label htmlFor="password">password</label>
                <div
                  className={cx('input-group', {
                    'has-validation': password.error,
                  })}>
                  <input
                    className={cx('form-control', {
                      'is-invalid': password.error,
                    })}
                    disabled={isLoading}
                    id="password"
                    onChange={this.setPasswordValue}
                    placeholder="Dracarys!"
                    type={cx({
                      password: !password.visible,
                      text: password.visible,
                    })}
                    value={password.value}
                  />
                  <Button
                    className="btn btn-outline"
                    onClick={this.togglePasswordVisibility}>
                    <Icon
                      icon={cx({
                        'icon-visible-outlined': password.visible,
                        'icon-hidden-outlined': !password.visible,
                      })}
                    />
                  </Button>
                  {password.error && (
                    <div className="invalid-feedback">{password.error}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col col-md-8">
              <div className="d-grid">
                <Button
                  className="btn btn-primary"
                  disabled={isLoading}
                  loading={isLoading}
                  type="submit">
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </form>
      </>
    );
  }
}
