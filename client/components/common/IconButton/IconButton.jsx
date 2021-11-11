import React from 'react';
import PropTypes from 'prop-types';

import cx from 'classnames';

import Button from '../Button';
import CircularProgress from '../CircularProgress';
import Icon from '../Icon';
import Tooltip from '../Tooltip';

if (process.env.BROWSER) {
  require('./IconButton.scss');
}

const IconButton = React.forwardRef((props, ref) => {
  const {
    className,
    disabled,
    iconClassName,
    icon,
    icons,
    loading,
    tooltipClassName,
    tooltipDisabled,
    tooltipPlacement,
    tooltipText,
    ...rest
  } = props;

  return (
    <Tooltip
      className={tooltipClassName}
      disabled={tooltipDisabled || disabled}
      placement={tooltipPlacement}
      text={tooltipText}>
      {({ tooltipId }) => (
        <Button
          aria-describedby={tooltipId}
          className={cx('btn btn-icon', className)}
          disabled={disabled}
          ref={ref}
          {...rest}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Icon className={iconClassName} icon={icon} />
          )}
        </Button>
      )}
    </Tooltip>
  );
});

IconButton.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  iconClassName: PropTypes.string,
  icon: PropTypes.string,
  icons: PropTypes.arrayOf(PropTypes.string),
  loading: PropTypes.bool,
  tooltipClassName: PropTypes.string,
  tooltipDisabled: PropTypes.bool,
  tooltipPlacement: Tooltip.propTypes.placement,
  tooltipText: Tooltip.propTypes.text,
};

export default IconButton;
