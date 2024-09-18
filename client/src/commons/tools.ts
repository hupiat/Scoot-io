import Toast from 'react-native-toast-message';
import {GeoCode} from './types';

export const displayErrorToast = (e: Error): void => {
  Toast.show({
    type: 'error',
    text1: e.name,
    text2: e.message,
  });
};

export const validateEmail = (email: string): boolean => {
  return Boolean(
    email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    ),
  );
};

export const validatePassword = (pw: string): boolean => {
  return (
    /[A-Z]/.test(pw) &&
    /[a-z]/.test(pw) &&
    /[0-9]/.test(pw) &&
    /[^A-Za-z0-9]/.test(pw) &&
    pw.length > 8
  );
};

const EPSILON = 1e-4;

export const areCoordinatesEqual = (
  geometry: GeoCode,
  geometry2: GeoCode,
): boolean => {
  return (
    Math.abs(geometry.latitude - geometry2.latitude) < EPSILON &&
    Math.abs(geometry.longitude - geometry2.longitude) < EPSILON
  );
};
