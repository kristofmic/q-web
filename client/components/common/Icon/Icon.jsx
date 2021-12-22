import React from 'react';
import PropTypes from 'prop-types';

import cx from 'classnames';

if (process.env.BROWSER) {
  require('./Icon.scss');
}

export default function Icon(props) {
  const { className, icon, icons, ...rest } = props;
  const _icons = icons || [icon];

  return (
    <span
      className={cx('d-inline-flex', className, {
        'icon-layered': _icons.length > 1,
      })}
      {...rest}
    >
      {_icons.map((i, idx) => (
        <i
          className={cx('icon', i, {
            'icon-layer': idx > 0,
          })}
          key={i}
        />
      ))}
    </span>
  );
}

Icon.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
  icons: PropTypes.arrayOf(PropTypes.string),
};
