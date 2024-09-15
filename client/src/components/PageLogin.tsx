import {IconOutline} from '@ant-design/icons-react-native';
import {Button, Input} from '@ant-design/react-native';
import React, {useState} from 'react';
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';
import logo from '../assets/logo.png';
import {useMiddlewareContext} from '../commons/middleware/context';
import {Account} from '../commons/types';
import Toast from 'react-native-toast-message';
import {FloatingAction} from 'react-native-floating-action';
import {validateEmail, validatePassword} from '../commons/tools';

export default function PageLogin() {
  const [isSuscribing, setIsSuscribing] = useState<boolean>(false);
  const [mail, setMail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const {user, setUser, storeDataAccounts} = useMiddlewareContext();

  if (!!user) {
    Toast.show({
      type: 'info',
      text1: 'Login',
      text2: 'You have been logged',
    });
  }

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
      storeDataAccounts.add({
        email: mail,
        username: mail,
        password: passwordConfirm,
      });
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
          placeholder="E-mail"
          type="email-address"
          prefix={<IconOutline name="mail" />}
          value={mail}
          onChangeText={text => setMail(text)}
        />
        <Input
          placeholder="Password"
          type="password"
          prefix={<IconOutline name="lock" />}
          value={password}
          onChangeText={text => setPassword(text)}
        />
        {isSuscribing && (
          <Input
            placeholder="Confirm password"
            type="password"
            prefix={<IconOutline name="lock" />}
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
    top: 25,
  },
  logo: {
    width: 400,
    height: 400,
    top: 50,
  },
});
