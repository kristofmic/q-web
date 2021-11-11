import React from 'react';
import PropTypes from 'prop-types';

import { isEscapeHotkey } from '../../../utils/keybindings';

class ClickAwayListener extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    containerEl: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    onClickAway: PropTypes.func.isRequired,
  };

  componentDidMount() {
    window.addEventListener('click', this.handleWindowClick);
    window.addEventListener('keyup', this.handleKeyUpClick);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleWindowClick);
    window.removeEventListener('keyup', this.handleKeyUpClick);
  }

  handleKeyUpClick = (e) => {
    const { onClickAway } = this.props;

    if (isEscapeHotkey(e)) {
      onClickAway(e);
    }
  };

  handleWindowClick = (e) => {
    const { containerEl, onClickAway } = this.props;
    const _containerEl =
      typeof containerEl === 'function' ? containerEl() : containerEl;

    if (_containerEl && _containerEl.contains(e.target)) {
      return;
    }

    onClickAway(e);
  };

  render() {
    const { children } = this.props;

    return <>{children}</>;
  }
}

export default ClickAwayListener;
