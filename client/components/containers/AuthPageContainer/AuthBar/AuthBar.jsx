import React from 'react';

import Logo from '../../../common/Images/Logo';

export default function AuthBar() {
  return (
    <nav className="navbar navbar-light bg-light fixed-top">
      <div className="container">
        <span className="navbar-brand">
          <Logo />
        </span>
      </div>
    </nav>
  );
}
