import {Button, Input} from '@ant-design/react-native';
import React, {useState} from 'react';
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';
import logo from '../assets/logo.png';
import {useMiddlewareContext} from '../commons/middleware/context';
import {Account} from '../commons/types';
import {FloatingAction} from 'react-native-floating-action';
import {
  displayErrorToast,
  validateEmail,
  validatePassword,
} from '../commons/tools';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function PageLogin() {
  const [isSuscribing, setIsSuscribing] = useState<boolean>(false);
  const [mail, setMail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const {setUser, storeDataAccounts} = useMiddlewareContext();

  const validateSchema = (): boolean => {
    if (isSuscribing) {
      return (
        validateEmail(mail) &&
        validatePassword(password) &&
        validatePassword(passwordConfirm) &&
        password === passwordConfirm
      );
    } else {
      return validateEmail(mail) && validatePassword(password);
    }
  };

  const handlePress = () => {
    if (isSuscribing) {
      storeDataAccounts
        .add({
          email: mail,
          username: mail,
          password: passwordConfirm,
        })
        .then(() =>
          Toast.show({
            type: 'success',
            text1: 'Suscribe',
            text2: 'You have been suscribed ! An e-mail has been sent :-)',
          }),
        )
        .catch(() =>
          displayErrorToast({
            name: 'Error',
            message: 'An account with this e-mail is already in base',
          }),
        );
    } else {
      setUser({
        email: mail,
        password: password,
      } as Account);
    }
  };

  return (
    <SafeAreaView style={styles.rootView}>
      <View style={styles.view}>
        <Input
          placeholder="Email"
          type="email-address"
          prefix={<Icon name="user-secret" size={20} />}
          value={mail}
          onChangeText={text => setMail(text)}
        />
        <Input
          placeholder="Password"
          type="password"
          prefix={<Icon name="unlock-alt" size={20} />}
          value={password}
          onChangeText={text => setPassword(text)}
        />
        {isSuscribing && (
          <Input
            placeholder="Confirm password"
            type="password"
            prefix={<Icon name="unlock-alt" size={20} />}
            value={passwordConfirm}
            onChangeText={text => setPasswordConfirm(text)}
          />
        )}
        <Button
          type="primary"
          disabled={!validateSchema()}
          onPress={handlePress}>
          {isSuscribing ? 'Suscribe' : 'Login'}
        </Button>
      </View>
      <Image source={logo} style={styles.logo} />
      <FloatingAction
        showBackground={false}
        onClose={() => setIsSuscribing(false)}
        onOpen={() => setIsSuscribing(true)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootView: {
    height: '100%',
  },
  view: {
    display: 'flex',
    flexDirection: 'column',
    height: 250,
    marginHorizontal: 30,
    justifyContent: 'space-around',
    top: 50,
  },
  logo: {
    width: 400,
    height: 400,
    top: 85,
  },
});
