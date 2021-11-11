import React from 'react';
import PropTypes from 'prop-types';

import cx from 'classnames';

if (process.env.BROWSER) {
  require('./DropdownMenu.scss');
}

export default function DropdownMenu(props) {
  const { alignRight, children, className, labelledBy, show, ...rest } = props;

  return (
    <div
      className={cx(
        'dropdown-menu',
        {
          show,
          'dropdown-menu-right': alignRight,
        },
        className
      )}
      aria-labelledby={labelledBy}
      {...rest}>
      {children}
    </div>
  );
}

DropdownMenu.propTypes = {
  alignRight: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  labelledBy: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
};
