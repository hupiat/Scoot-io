import Toast from "react-native-toast-message"

export const displayErrorToast = (e: Error) => {
    Toast.show({
        type: 'error',
        text1: e.name,
        text2: e.message
    })
}

export const validateEmail = (email: string): boolean => {
    return Boolean(email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ));
};