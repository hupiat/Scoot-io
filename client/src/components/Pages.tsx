import React, {useEffect} from 'react';
import {useMiddlewareContext} from '../commons/middleware/context';
import PageLogin from './PageLogin';
import PagesRideContext from './PagesRideContext';
import RideContext from '../commons/rides/context';
import {PermissionsAndroid} from 'react-native';
import {removeToken, storeToken} from '../commons/tools';
import DarkModeContext from '../commons/DarkModeContext';

export default function Pages() {
  const {user, shouldSaveToken} = useMiddlewareContext();

  useEffect(() => {
    if (user && shouldSaveToken) {
      removeToken();
      storeToken(user.username, user.token!);
    }
    if (user && !shouldSaveToken) {
      removeToken();
    }
  }, [user, shouldSaveToken]);

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
    <DarkModeContext>
      <>
        {!user && <PageLogin />}
        {user && (
          <RideContext>
            <PagesRideContext />
          </RideContext>
        )}
      </>
    </DarkModeContext>
  );
}
