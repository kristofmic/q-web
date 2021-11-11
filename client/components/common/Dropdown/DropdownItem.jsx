import React from 'react';
import PropTypes from 'prop-types';

import cx from 'classnames';

if (process.env.BROWSER) {
  require('./DropdownItem.scss');
}

export default function DropdownItem(props) {
  const { children, className, Component = 'a', ...rest } = props;

  return (
    <Component className={cx('dropdown-item', className)} {...rest}>
      {children}
    </Component>
  );
}

DropdownItem.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  Component: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(React.Component),
    PropTypes.func,
  ]),
};
