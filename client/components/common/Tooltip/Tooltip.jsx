import React from 'react';
import PropTypes from 'prop-types';

import cx from 'classnames';

import Popover from '../Popover';

if (process.env.BROWSER) {
  require('./Tooltip.scss');
}

export default class Tooltip extends React.PureComponent {
  // eslint-disable-next-line react/sort-comp
  static PLACEMENT = Popover.PLACEMENT;

  static propTypes = {
    children: PropTypes.func.isRequired,
    className: PropTypes.string,
    delay: PropTypes.number,
    disabled: PropTypes.bool,
    placement: PropTypes.oneOf(Object.values(Popover.PLACEMENT)),
    text: PropTypes.node,
    transitionDuration: PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.tooltipId = `tooltip${Math.floor(Math.random() * 1000000)}`;
    this.showTimeout = null;

    this.state = {
      childEl: null,
      isVisible: false,
    };
  }

  componentWillUnmount() {
    this.clearShowTimeout();
  }

  hide = () => {
    this.clearShowTimeout();

    this.setState({
      isVisible: false,
    });
  };

  show = () => {
    const { delay, disabled } = this.props;

    this.clearShowTimeout();

    if (disabled) {
      return;
    }

    if (delay) {
      this.showTimeout = setTimeout(() => {
        this.setState({
          isVisible: true,
        });
      }, delay);
      return;
    }

    this.setState({
      isVisible: true,
    });
  };

  setChildRef = (element) => {
    this.setState({
      childEl: element,
    });
  };

  clearShowTimeout() {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
  }

  render() {
    const { hide, show, tooltipId } = this;
    const { children, className, placement, text, transitionDuration } =
      this.props;
    const { childEl, isVisible } = this.state;

    return (
      <>
        <Popover
          anchorEl={childEl}
          arrow
          baseClassName="tooltip"
          isVisible={isVisible}
          placement={placement}
          transitionDuration={transitionDuration}>
          <div className="tooltip-inner">{text}</div>
        </Popover>
        {/* eslint-disable-next-line */}
        <span
          className={cx('tooltip-wrapper', className)}
          onBlur={hide}
          onClick={hide}
          onFocus={show}
          onMouseEnter={show}
          onMouseLeave={hide}
          ref={this.setChildRef}>
          {children({ hide, show, tooltipId })}
        </span>
      </>
    );
  }
}
