import React, {useEffect} from 'react';
import {useMiddlewareContext} from '../commons/middleware/context';
import PageLogin from './PageLogin';
import PagesRideContext from './PagesRideContext';
import RideContext from '../commons/rides/context';
import {PermissionsAndroid} from 'react-native';

export default function Pages() {
  const {user} = useMiddlewareContext();

  useEffect(() => {
    const requestPermissions = async () => {
      await PermissionsAndroid.request(
        'android.permission.ACCESS_COARSE_LOCATION',
      );
      await PermissionsAndroid.request(
        'android.permission.ACCESS_FINE_LOCATION',
      );
      await PermissionsAndroid.request(
        'android.permission.READ_EXTERNAL_STORAGE',
      );
      await PermissionsAndroid.request(
        'android.permission.WRITE_EXTERNAL_STORAGE',
      );
      await PermissionsAndroid.request('android.permission.CAMERA');
      await PermissionsAndroid.request('android.permission.RECORD_AUDIO');
    };

    requestPermissions();
  }, []);

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
