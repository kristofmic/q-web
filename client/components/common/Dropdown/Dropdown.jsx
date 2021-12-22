import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import cx from 'classnames';

import DropdownMenu from './DropdownMenu';

import useToggle from '../../../hooks/useToggle';

export default function Dropdown(props) {
  const {
    ButtonComponent = 'button',
    buttonProps,
    children,
    className,
    defaultShow = false,
    disabled,
    dropdownMenuProps,
    id,
    ...rest
  } = props;

  const [show, toggle, toggleOn, toggleOff] = useToggle(defaultShow);

  const handleToggle = useCallback(() => {
    if (disabled) {
      toggleOff();
    }

    toggle();
  }, [disabled, toggle, toggleOff]);

  const dropdownRef = useRef();
  const onWindowClick = useCallback(
    (event) => {
      if (
        show &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        toggleOff();
      }
    },
    [dropdownRef.current, show]
  );
  useEffect(() => {
    window.addEventListener('click', onWindowClick);

    return () => {
      window.removeEventListener('click', onWindowClick);
    };
  }, [onWindowClick]);

  return (
    <div
      className={cx(
        'dropdown',
        {
          show,
        },
        className
      )}
      ref={dropdownRef}
      {...rest}
    >
      <ButtonComponent
        aria-haspopup="true"
        aria-expanded={String(show)}
        className="btn"
        disabled={disabled}
        id={id}
        onClick={handleToggle}
        {...buttonProps}
      />
      <DropdownMenu {...dropdownMenuProps} labelledBy={id} show={show}>
        {children({
          toggle,
          toggleOn,
          toggleOff,
        })}
      </DropdownMenu>
    </div>
  );
}

Dropdown.propTypes = {
  ButtonComponent: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.func,
  ]),
  buttonProps: PropTypes.object,
  children: PropTypes.func.isRequired,
  className: PropTypes.string,
  defaultShow: PropTypes.bool,
  disabled: PropTypes.bool,
  dropdownMenuProps: PropTypes.object,
  id: PropTypes.string.isRequired,
};
