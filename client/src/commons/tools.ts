import Toast from 'react-native-toast-message';
import * as Keychain from 'react-native-keychain';

export const storeToken = async (username: string, token: string) => {
  try {
    await Keychain.setGenericPassword(username, token);
    console.log('Token stored securely');
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
      console.log('No token found');
      return null;
    }
  } catch (error) {
    console.error('Could not retrieve the token', error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await Keychain.resetGenericPassword();
    console.log('Token removed securely');
  } catch (error) {
    console.error('Could not remove the token securely', error);
  }
};

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
