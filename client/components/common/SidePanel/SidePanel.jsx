import React from 'react';
import PropTypes from 'prop-types';

import cx from 'classnames';

import IconButton from '../IconButton';

if (process.env.BROWSER) {
  require('./SidePanel.scss');
}

export default class SidePanel extends React.Component {
  static POSITION = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
  };

  static propTypes = {
    body: PropTypes.node.isRequired,
    className: PropTypes.string,
    footer: PropTypes.node,
    header: PropTypes.node,
    position: PropTypes.oneOf(Object.values(SidePanel.POSITION)),
  };

  static defaultProps = {
    position: SidePanel.POSITION.LEFT,
  };

  constructor(props) {
    super(props);

    this.state = {
      bodyStyle: {},
      isCollapsed: false,
    };

    this.headerRef = React.createRef();
    this.footerRef = React.createRef();
  }

  componentDidMount() {
    this.setBodyStyle();
  }

  get tooltipText() {
    const { isCollapsed } = this.state;

    return isCollapsed ? 'Expand' : 'Collapse';
  }

  setBodyStyle = () => {
    const { current: footerEl } = this.footerRef;
    const { current: headerEl } = this.headerRef;

    if (!headerEl && !footerEl) {
      return;
    }

    let footerRect = {
      height: 0,
    };
    let headerRect = {
      height: 0,
    };

    if (footerEl) {
      footerRect = footerEl.getBoundingClientRect();
    }

    if (headerEl) {
      headerRect = headerEl.getBoundingClientRect();
    }

    this.setState({
      bodyStyle: {
        height: `calc(100vh - ${footerRect.height}px - ${headerRect.height}px - ${headerRect.top}px)`,
      },
    });
  };

  toggleCollapsed = () => {
    this.setState((prevState) => ({
      isCollapsed: !prevState.isCollapsed,
    }));
  };

  render() {
    const { body, className, footer, header, position } = this.props;
    const { bodyStyle, isCollapsed } = this.state;

    return (
      <div
        className={cx(`side-panel side-panel--${position}`, className, {
          'side-panel--collapsed': isCollapsed,
        })}>
        <IconButton
          iconClassName={cx('d-inline-block', {
            flip:
              (position === SidePanel.POSITION.LEFT && isCollapsed) ||
              (position === SidePanel.POSITION.RIGHT && !isCollapsed),
          })}
          icons={['icon-menu-left-right', 'icon-caret-left']}
          onClick={this.toggleCollapsed}
          tooltipClassName="side-panel-toggle"
          tooltipPlacement="right"
          tooltipText={this.tooltipText}
        />
        {header && (
          <div
            className="side-panel-header d-flex flex-column align-items-center"
            ref={this.headerRef}>
            {header}
          </div>
        )}
        <div className="side-panel-body" style={bodyStyle}>
          {body}
        </div>
        {footer && (
          <div className="side-panel-footer" ref={this.footerRef}>
            {footer}
          </div>
        )}
      </div>
    );
  }
}
