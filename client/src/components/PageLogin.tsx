import {Button, Input, Modal, Switch} from '@ant-design/react-native';
import React, {useEffect, useState} from 'react';
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';
import logo from '../assets/logo.png';
import {useMiddlewareContext} from '../commons/middleware/context';
import {Account} from '../commons/types';
import {FloatingAction} from 'react-native-floating-action';
import {
  displayErrorToast,
  getToken,
  validateEmail,
  validatePassword,
} from '../commons/tools';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import DataStore from '../commons/middleware/DataStore';
import {
  API_ACCOUNTS,
  API_PREFIX,
  URL_BACKEND,
} from '../commons/middleware/paths';
import {
  COLOR_DARK_MODE_PRIMARY,
  useDarkModeContext,
} from '../commons/DarkModeContext';

export default function PageLogin() {
  const [isSuscribing, setIsSuscribing] = useState<boolean>(false);
  const [mail, setMail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const {
    setUser,
    setUserState,
    storeDataAccounts,
    shouldSaveToken,
    setShouldSaveToken,
  } = useMiddlewareContext();
  const {isDarkMode} = useDarkModeContext();

  useEffect(() => {
    const getTokenThenRequest = async () => {
      const token = await getToken();
      if (token) {
        const res = await DataStore.doFetch(
          `${URL_BACKEND}/${API_PREFIX}/${API_ACCOUNTS}/login_from_token`,
          url =>
            fetch(url, {
              method: 'POST',
              body: token,
            }),
          false,
        );
        setUserState(await res?.json());
      }
    };
    getTokenThenRequest();
  }, []);

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
            text1: 'SUSCRIBE',
            text2: 'You have been suscribed ! An e-mail has been sent :-)',
          }),
        )
        .catch(e => {
          displayErrorToast({
            name: 'Error',
            message: 'An account with this e-mail is already in base',
          });
        });
    } else {
      setUser({
        email: mail,
        password: password,
      } as Account);
    }
  };

  const validateSchemaRetrievePassword = (): boolean => {
    return validateEmail(mail);
  };

  const handlePressRetrievePassword = (): void => {
    Modal.alert('Confirmation', 'Generate a new password for this mail ?', [
      {text: 'Close'},
      {
        text: 'OK',
        onPress: () =>
          DataStore.doFetch(
            `${URL_BACKEND}/${API_PREFIX}/${API_ACCOUNTS}/retrieve_password/` +
              mail,
            url =>
              fetch(url, {
                method: 'POST',
              }),
          )
            .then(() =>
              Toast.show({
                type: 'success',
                text1: 'UPDATE',
                text2: 'A new password has been sent to your e-mail !',
              }),
            )
            .catch(() =>
              displayErrorToast({
                name: 'Error',
                message: 'This account could not be found',
              }),
            ),
      },
    ]);
  };

  return (
    <SafeAreaView
      style={{
        ...styles.rootView,
        backgroundColor: isDarkMode ? COLOR_DARK_MODE_PRIMARY : undefined,
      }}>
      <View style={styles.view}>
        <Input
          placeholder="Email"
          type="email-address"
          inputStyle={{
            color: isDarkMode ? 'white' : undefined,
          }}
          prefix={
            <Icon
              name="user"
              size={20}
              color={isDarkMode ? 'white' : undefined}
            />
          }
          value={mail}
          onChangeText={text => setMail(text)}
        />
        <Input
          placeholder="Password"
          type="password"
          inputStyle={{
            color: isDarkMode ? 'white' : undefined,
          }}
          prefix={
            <Icon
              name="unlock-alt"
              size={20}
              color={isDarkMode ? 'white' : undefined}
            />
          }
          value={password}
          onChangeText={text => setPassword(text)}
        />
        {isSuscribing && (
          <Input
            placeholder="Confirm password"
            type="password"
            inputStyle={{
              color: isDarkMode ? 'white' : undefined,
            }}
            prefix={
              <Icon
                name="unlock-alt"
                size={20}
                color={isDarkMode ? 'white' : undefined}
              />
            }
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
        {!isSuscribing && (
          <>
            <Button
              type="primary"
              onPress={handlePressRetrievePassword}
              disabled={!validateSchemaRetrievePassword()}>
              Retrieve password
            </Button>
            <Switch
              style={styles.switch}
              checkedChildren={<Icon name="save" color="white" />}
              unCheckedChildren={<Icon name="save" color="white" />}
              checked={shouldSaveToken}
              onChange={setShouldSaveToken}
            />
          </>
        )}
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
  switch: {
    top: 20,
    alignSelf: 'center',
  },
});
