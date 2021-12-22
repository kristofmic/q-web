import React from 'react';
import PropTypes from 'prop-types';

import cx from 'classnames';

if (process.env.BROWSER) {
  require('./PlaceholderImage.scss');
}

export default function PlaceholderImage(props) {
  const { className, componentClass, height, width } = props;
  let svgComponent;

  if (componentClass === 'circle') {
    svgComponent = <circle cx={width / 2} cy={height / 2} r={width / 2} />;
  } else {
    svgComponent = <rect width={width} height={height} />;
  }

  return (
    <svg
      className={cx('placeholder-image', className)}
      width={width}
      height={height}
      xmlns="https://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      <g>{svgComponent}</g>
    </svg>
  );
}

PlaceholderImage.propTypes = {
  className: PropTypes.string,
  componentClass: PropTypes.oneOf(['circle', 'square']),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
