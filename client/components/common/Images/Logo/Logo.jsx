import React from 'react';

import cx from 'classnames';

export default function Logo(props) {
  const { className, ...rest } = props;

  return (
    <h5 className={cx('logo m-0', className)} {...rest}>
      STARTR
    </h5>
  );
}
