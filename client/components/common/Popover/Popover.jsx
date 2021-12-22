import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { Transition } from 'react-transition-group';

import cx from 'classnames';

if (process.env.BROWSER) {
  require('./Popover.scss');
}

const TRANSITION_KEYS = {
  ENTERING: 'entering',
  ENTERED: 'entered',
  EXITING: 'exiting',
  EXITED: 'exited',
};

export default class Popover extends React.PureComponent {
  // eslint-disable-next-line react/sort-comp
  static PLACEMENT = {
    BOTTOM: 'bottom',
    BOTTOM_LEFT: 'bottom-left',
    BOTTOM_RIGHT: 'bottom-right',
    LEFT: 'left',
    LEFT_BOTTOM: 'left-bottom',
    LEFT_TOP: 'left-top',
    RIGHT: 'right',
    RIGHT_BOTTOM: 'right-bottom',
    RIGHT_TOP: 'right-top',
    TOP: 'top',
    TOP_RIGHT: 'top-right',
    TOP_LEFT: 'top-left',
  };

  static propTypes = {
    anchorEl: PropTypes.object,
    arrow: PropTypes.bool,
    baseClassName: PropTypes.string,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    containerEl: PropTypes.object,
    isVisible: PropTypes.bool.isRequired,
    offset: PropTypes.number,
    placement: PropTypes.oneOf(Object.values(Popover.PLACEMENT)),
    transitionDuration: PropTypes.number,
    TransitionProps: PropTypes.object,
  };

  static defaultProps = {
    arrow: false,
    baseClassName: 'popover',
    offset: 4,
    placement: Popover.PLACEMENT.TOP,
    transitionDuration: 150,
    TransitionProps: {
      unmountOnExit: true,
    },
  };

  constructor(props) {
    super(props);

    this._calculatePosition = calculatePositionFactory();
    this._position = {
      left: -10000,
      top: -10000,
    };

    this.popoverRef = React.createRef();
  }

  get portal() {
    const { containerEl } = this.props;

    if (containerEl !== undefined) {
      return containerEl;
    }

    return typeof window !== 'undefined' ? window.document.body : null;
  }

  get popoverEl() {
    return this.popoverRef.current || null;
  }

  get popoverPosition() {
    return this._position;
  }

  calculatePosition() {
    const { anchorEl, isVisible, offset, placement } = this.props;

    if (!isVisible) {
      return;
    }

    const result = this._calculatePosition(
      this._position,
      placement,
      offset,
      anchorEl,
      this.popoverEl,
      this.portal
    );

    if (!result) {
      return;
    }

    this._position = result.nextPosition;
  }

  render() {
    const { portal } = this;
    const {
      anchorEl,
      arrow,
      baseClassName,
      children,
      className,
      containerEl,
      isVisible,
      offset,
      placement,
      transitionDuration,
      TransitionProps,
      ...rest
    } = this.props;

    if (!portal) {
      return null;
    }

    return ReactDOM.createPortal(
      <Transition
        in={isVisible}
        timeout={transitionDuration}
        {...TransitionProps}
      >
        {(state) => {
          const entered = state === TRANSITION_KEYS.ENTERED;
          const exited = state === TRANSITION_KEYS.EXITED;

          this.calculatePosition();

          return (
            <div
              className={cx(
                `${baseClassName} bs-${baseClassName}-${placement} fade d-flex`,
                className,
                {
                  'd-none': exited,
                  show: entered,
                  'justify-content-center':
                    placement === Popover.PLACEMENT.BOTTOM ||
                    placement === Popover.PLACEMENT.TOP,
                  'justify-content-start mb-1':
                    placement === Popover.PLACEMENT.BOTTOM_LEFT ||
                    placement === Popover.PLACEMENT.TOP_LEFT,
                  'justify-content-end me-1':
                    placement === Popover.PLACEMENT.BOTTOM_RIGHT ||
                    placement === Popover.PLACEMENT.TOP_RIGHT,
                  'align-items-center':
                    placement === Popover.PLACEMENT.LEFT ||
                    placement === Popover.PLACEMENT.RIGHT,
                  'align-items-start mt-1':
                    placement === Popover.PLACEMENT.LEFT_TOP ||
                    placement === Popover.PLACEMENT.RIGHT_TOP,
                  'align-items-end mb-1':
                    placement === Popover.PLACEMENT.LEFT_BOTTOM ||
                    placement === Popover.PLACEMENT.RIGHT_BOTTOM,
                }
              )}
              ref={this.popoverRef}
              role="tooltip"
              style={this.popoverPosition}
              {...rest}
            >
              {arrow && <div className="arrow" />}
              {children}
            </div>
          );
        }}
      </Transition>,
      portal
    );
  }
}

function calculatePositionFactory() {
  let prevArgs = [];
  let prevReturn = null;

  function calculatePosition(
    currentPosition,
    placement,
    offset,
    anchorEl,
    popoverEl,
    containerEl
  ) {
    const currentArgs = [
      currentPosition,
      placement,
      offset,
      anchorEl,
      popoverEl,
      containerEl,
    ];
    const isDirty =
      !prevArgs.length || prevArgs.some((arg, i) => currentArgs[i] !== arg);
    prevArgs = currentArgs;

    if (!isDirty) {
      return prevReturn;
    }

    if (!anchorEl || !popoverEl || !containerEl) {
      return prevReturn;
    }

    const nextPosition = { ...currentPosition };

    const anchorRect = anchorEl.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();
    const popoverRect = popoverEl.getBoundingClientRect();

    switch (placement) {
      case Popover.PLACEMENT.BOTTOM:
        nextPosition.left =
          anchorRect.left -
          popoverRect.width / 2 +
          anchorRect.width / 2 -
          containerRect.left;
        nextPosition.top = anchorRect.bottom + offset - containerRect.top;
        break;
      case Popover.PLACEMENT.BOTTOM_LEFT:
        nextPosition.left = anchorRect.left;
        nextPosition.top = anchorRect.bottom + offset - containerRect.top;
        break;
      case Popover.PLACEMENT.BOTTOM_RIGHT:
        nextPosition.left = anchorRect.right - popoverRect.width;
        nextPosition.top = anchorRect.bottom + offset - containerRect.top;
        break;
      case Popover.PLACEMENT.LEFT:
        nextPosition.left =
          anchorRect.left - popoverRect.width - offset - containerRect.top;
        nextPosition.top =
          anchorRect.top -
          popoverRect.height / 2 +
          anchorRect.height / 2 -
          containerRect.left;
        nextPosition.bottom = undefined;
        nextPosition.right = undefined;
        break;
      case Popover.PLACEMENT.LEFT_BOTTOM:
        nextPosition.left =
          anchorRect.left - popoverRect.width - offset - containerRect.top;
        nextPosition.bottom = anchorRect.bottom;
        nextPosition.top = undefined;
        nextPosition.right = undefined;
        break;
      case Popover.PLACEMENT.LEFT_TOP:
        nextPosition.left =
          anchorRect.left - popoverRect.width - offset - containerRect.top;
        nextPosition.top = anchorRect.top;
        nextPosition.bottom = undefined;
        nextPosition.right = undefined;
        break;
      case Popover.PLACEMENT.RIGHT:
        nextPosition.left = anchorRect.right + offset - containerRect.left;
        nextPosition.top =
          anchorRect.top -
          popoverRect.height / 2 +
          anchorRect.height / 2 -
          containerRect.top;
        nextPosition.bottom = undefined;
        nextPosition.right = undefined;
        break;
      case Popover.PLACEMENT.RIGHT_BOTTOM:
        nextPosition.left = anchorRect.right + offset - containerRect.left;
        nextPosition.bottom = anchorRect.bottom;
        nextPosition.top = undefined;
        nextPosition.right = undefined;
        break;
      case Popover.PLACEMENT.RIGHT_TOP:
        nextPosition.left = anchorRect.right + offset - containerRect.left;
        nextPosition.top = anchorRect.top;
        nextPosition.bottom = undefined;
        nextPosition.right = undefined;
        break;
      case Popover.PLACEMENT.TOP:
        nextPosition.left =
          anchorRect.left -
          popoverRect.width / 2 +
          anchorRect.width / 2 -
          containerRect.left;
        nextPosition.top =
          anchorRect.top - popoverRect.height - offset - containerRect.top;
        nextPosition.bottom = undefined;
        nextPosition.right = undefined;
        break;
      case Popover.PLACEMENT.TOP_LEFT:
        nextPosition.left = anchorRect.left;
        nextPosition.top =
          anchorRect.top - popoverRect.height - offset - containerRect.top;
        nextPosition.bottom = undefined;
        nextPosition.right = undefined;
        break;
      case Popover.PLACEMENT.TOP_RIGHT:
        nextPosition.right = anchorRect.right;
        nextPosition.top =
          anchorRect.top - popoverRect.height - offset - containerRect.top;
        nextPosition.bottom = undefined;
        nextPosition.left = undefined;
        break;
      default:
        console.warn('No placement provided for Popover');
        break;
    }

    prevReturn = {
      nextPosition,
      containerRect,
    };

    return prevReturn;
  }

  return calculatePosition;
}
