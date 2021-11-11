import React from 'react';

import PermissionGate from '../../../common/PermissionGate';

export default function NotFoundPage() {
  return (
    <PermissionGate
      heading="This content doesn't exist"
      message="We're not sure how you got here, but don't worry, there's a way out 😅"
      primaryLinkExternal
      primaryLinkText="Take me out of here"
      primaryLinkTo="/home"
    />
  );
}
