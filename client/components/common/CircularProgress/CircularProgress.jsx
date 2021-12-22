import React from 'react';
import PropTypes from 'prop-types';

import cx from 'classnames';

const COLOR = {
  DANGER: 'danger',
  DARK: 'dark',
  INFO: 'info',
  LIGHT: 'light',
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  WARNING: 'warning',
};

const SIZE = {
  DEFAULT: 'default',
  SMALL: 'sm',
};

const VARIANT = {
  BORDER: 'border',
  GROW: 'grow',
};

function CircularProgress(props) {
  const {
    className,
    color,
    size = SIZE.DEFAULT,
    variant = VARIANT.BORDER,
  } = props;

  return (
    <div
      className={cx(
        `spinner-${variant}`,
        {
          [`text-${color}`]: !!color,
          [`spinner-${variant}-sm`]: size === SIZE.SMALL,
        },
        className
      )}
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );
}

CircularProgress.propTypes = {
  className: PropTypes.string,
  color: PropTypes.oneOf(Object.values(COLOR)),
  size: PropTypes.oneOf(Object.values(SIZE)),
  variant: PropTypes.oneOf(Object.values(VARIANT)),
};

const CircularProgressMemo = React.memo(CircularProgress);

CircularProgressMemo.COLOR = COLOR;
CircularProgressMemo.SIZE = SIZE;
CircularProgressMemo.VARIANT = VARIANT;

export default CircularProgressMemo;
