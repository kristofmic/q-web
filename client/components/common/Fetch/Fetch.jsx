import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import noop from 'lodash/noop';

import CircularProgress from '../CircularProgress';
import ErrorMessage from '../ErrorMessage';

import { API_STATUS, API_STATUSES } from '../../../api';

export default function Fetch(props) {
  const {
    children,
    fetchKey,
    errorMessage,
    loader = <CircularProgress />,
    onFetch,
    onRetry,
    status,
    renderError = noop,
    ...rest
  } = props;

  useEffect(() => {
    if (status !== API_STATUS.LOADING && status !== API_STATUS.SUCCESS) {
      onFetch(fetchKey);
    }
  }, [fetchKey]);
  const handleRetry = useCallback(() => {
    onRetry?.(fetchKey);
  }, [fetchKey, onRetry]);

  return (
    <div {...rest}>
      {status === API_STATUS.LOADING && <>{loader}</>}
      {status === API_STATUS.ERROR && (
        <>
          {renderError({
            errorMessage,
            onRetry: handleRetry,
            status,
          }) || (
            <ErrorMessage onRetry={handleRetry}>
              {errorMessage ||
                'Oops! Something went wrong. Please wait a moment and try again.'}
            </ErrorMessage>
          )}
        </>
      )}
      {status === API_STATUS.SUCCESS && children()}
    </div>
  );
}

Fetch.propTypes = {
  children: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  fetchKey: PropTypes.any,
  loader: PropTypes.node,
  onFetch: PropTypes.func.isRequired,
  onRetry: PropTypes.func,
  renderError: PropTypes.func,
  status: PropTypes.oneOf(API_STATUSES).isRequired,
};
