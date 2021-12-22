import React from 'react';

import { useSelector } from 'react-redux';

import {
  actions as grootActions,
  selectors as grootSelectors,
} from '../../../slices/groot';

import Button from '../../common/Button';
import Fetch from '../../common/Fetch';

export default function HomePage() {
  const iAmGroot = grootActions.useIAmGroot();
  const { data, status = '' } = useSelector(grootSelectors.getSlice);

  return (
    <div className="container-flex" id="home-page">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-7">
          <Fetch onFetch={iAmGroot} onRetry={iAmGroot} status={status}>
            {() => (
              <div className="card">
                <div className="card-body">
                  <div className="card-text">{data.message}</div>
                  <Button className="btn btn-primary" onClick={iAmGroot}>
                    Fetch
                  </Button>
                </div>
              </div>
            )}
          </Fetch>
        </div>
      </div>
    </div>
  );
}
