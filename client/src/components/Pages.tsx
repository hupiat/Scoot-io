import React from 'react';
import {useMiddlewareContext} from '../commons/middleware/context';
import PageLogin from './PageLogin';
import PagesRideContext from './PagesRideContext';
import RideContext from '../commons/rides/context';

export default function Pages() {
  const {user} = useMiddlewareContext();
  return (
    <>
      {!user && <PageLogin />}
      {user && (
        <RideContext>
          <PagesRideContext />
        </RideContext>
      )}
    </>
  );
}
