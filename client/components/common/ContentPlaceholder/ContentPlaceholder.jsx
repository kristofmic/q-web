import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import cx from 'classnames';
import random from 'lodash/random';

export default function ContentPlaceholder(props) {
  const { children, className, colorPrimary, colorSecondary, height, width } =
    props;

  const clipID = useMemo(() => random(1000000), []);
  const gradientID = useMemo(() => random(1000000), []);
  const svgStyle = useMemo(() => ({ height, width }), [height, width]);

  return (
    <svg
      className={cx(className, 'content-placeholder')}
      style={svgStyle}
      version="1.1"
    >
      <rect
        style={{ fill: `url(#${gradientID})` }}
        clipPath={`url(#${clipID})`}
        x="0"
        y="0"
        width={width}
        height={height}
      />
      <defs>
        <clipPath id={clipID}>{children}</clipPath>
        <linearGradient id={gradientID}>
          <stop offset="0%" stopColor={colorPrimary}>
            <animate
              attributeName="offset"
              values="-2; 1"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="50%" stopColor={colorSecondary}>
            <animate
              attributeName="offset"
              values="-1.5; 1.5"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor={colorPrimary}>
            <animate
              attributeName="offset"
              values="-1; 2"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
      </defs>
    </svg>
  );
}

ContentPlaceholder.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  colorPrimary: PropTypes.string,
  colorSecondary: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
};

ContentPlaceholder.defaultProps = {
  colorPrimary: 'rgba(166,174,188, .16)',
  colorSecondary: 'rgba(166,174,188, .32)',
  height: '100%',
  width: '100%',
};
