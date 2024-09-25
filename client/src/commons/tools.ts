import Toast from 'react-native-toast-message';
import * as Keychain from 'react-native-keychain';
import {GeoCode} from './types';

export const storeToken = async (username: string, token: string) => {
  try {
    await Keychain.setGenericPassword(username, token);
  } catch (error) {
    console.error('Could not store the token securely', error);
  }
};

export const getToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      return credentials.password;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Could not retrieve the secure token', error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await Keychain.resetGenericPassword();
  } catch (error) {
    console.error('Could not remove the token securely', error);
  }
};

export const displayErrorToast = (e: Error): void => {
  Toast.show({
    type: 'error',
    text1: e.name.toLocaleUpperCase(),
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

export const computePathDistanceKm = (
  position: GeoCode,
  other: GeoCode,
): number => {
  const EARTH_RADIUS_KM = 6371;

  const toRadians = (degree: number) => degree * (Math.PI / 180);

  const lon1Rad = toRadians(position.longitude);
  const lat1Rad = toRadians(position.latitude);
  const lon2Rad = toRadians(other.longitude);
  const lat2Rad = toRadians(other.latitude);

  const deltaLat = lat2Rad - lat1Rad;
  const deltaLon = lon2Rad - lon1Rad;

  // Haversine formula
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Path distance computation
  const distance = EARTH_RADIUS_KM * c;

  return Number(distance.toFixed(3));
};
