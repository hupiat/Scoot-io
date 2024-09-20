import Toast from 'react-native-toast-message';

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
