import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

if (process.env.BROWSER) {
  require('./PermissionGate.scss');
}

export default function PermissionGate(props) {
  const {
    heading,
    primaryLinkExternal,
    primaryLinkText,
    primaryLinkTo,
    message,
    secondaryLinkExternal,
    secondaryLinkText,
    secondaryLinkTo,
  } = props;

  return (
    <div className="permission-gate">
      <div className="row justify-content-center">
        <div className="col col-sm-9 col-md-8 col-lg-7 text-center">
          <h4 className="mb-5">{heading}</h4>
          <p className="mb-6">{message}</p>
        </div>
      </div>
      {!!primaryLinkTo && (
        <div className="row justify-content-center">
          <div className="col col-sm-7 col-md-6 col-lg-5 col-xl-4 text-center mb-3">
            {primaryLinkExternal ? (
              <a className="btn btn-primary btn-block" href={primaryLinkTo}>
                {primaryLinkText}
              </a>
            ) : (
              <Link className="btn btn-primary btn-block" to={primaryLinkTo}>
                {primaryLinkText}
              </Link>
            )}
          </div>
        </div>
      )}
      {!!secondaryLinkTo && (
        <div className="row justify-content-center">
          <div className="col col-sm-7 col-md-6 col-lg-5 col-xl-4 text-center">
            {secondaryLinkExternal ? (
              <a className="btn btn-secondary btn-block" href={secondaryLinkTo}>
                {secondaryLinkText}
              </a>
            ) : (
              <Link
                className="btn btn-secondary btn-block"
                to={secondaryLinkTo}
              >
                {secondaryLinkText}
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

PermissionGate.propTypes = {
  heading: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  primaryLinkExternal: PropTypes.bool,
  primaryLinkText: PropTypes.string,
  primaryLinkTo: PropTypes.string,
  secondaryLinkExternal: PropTypes.bool,
  secondaryLinkText: PropTypes.string,
  secondaryLinkTo: PropTypes.string,
};
