import Toast from "react-native-toast-message"

export const displayErrorToast = (e: Error) => {
    Toast.show({
        type: 'error',
        text1: e.name,
        text2: e.message
    })
}