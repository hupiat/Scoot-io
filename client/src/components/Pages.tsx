import React from 'react';
import {useMiddlewareContext} from '../commons/middleware/context';
import PageLogin from './PageLogin';
import PagesRideContext from './PagesRideContext';
import RideContext from '../commons/rides/context';
import {PermissionsAndroid} from 'react-native';

export default function Pages() {
  const {user} = useMiddlewareContext();

  PermissionsAndroid.request('android.permission.ACCESS_COARSE_LOCATION');
  PermissionsAndroid.request('android.permission.ACCESS_FINE_LOCATION');
  PermissionsAndroid.request('android.permission.READ_EXTERNAL_STORAGE');
  PermissionsAndroid.request('android.permission.WRITE_EXTERNAL_STORAGE');
  PermissionsAndroid.request('android.permission.CAMERA');

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
