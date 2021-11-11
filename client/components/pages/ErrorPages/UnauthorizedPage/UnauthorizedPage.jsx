import React from 'react';

import PermissionGate from '../../../common/PermissionGate';

export default function UnauthorizedPage() {
  return (
    <PermissionGate
      heading="You are not authorized to perform this action"
      message="We're not sure how you got here, but don't worry, there's a way out 😅"
      primaryLinkExternal
      primaryLinkText="Take me out of here"
      primaryLinkTo="/auth/login"
    />
  );
}
