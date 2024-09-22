import {Button, Card, Flex, Input, Switch} from '@ant-design/react-native';
import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useMiddlewareContext} from '../commons/middleware/context';
import {Account, WithoutId} from '../commons/types';
import {
  displayErrorToast,
  validateEmail,
  validatePassword,
} from '../commons/tools';
import Toast from 'react-native-toast-message';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  COLOR_DARK_MODE_PRIMARY,
  useDarkModeContext,
} from '../commons/DarkModeContext';

const baseTypingUser = (user: Account): WithoutId<Account> => ({
  email: user.email,
  username: user.username,
  password: '',
  picture: user.picture,
});

export default function PageProfileView() {
  const {user, setUser, storeDataAccounts} = useMiddlewareContext();
  const [typingUser, setTypingUser] = useState<WithoutId<Account>>(
    baseTypingUser(user!),
  );
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const {isDarkMode, setIsDarkMode} = useDarkModeContext();

  const validateSchema = () => {
    return (
      validateEmail(typingUser.email) &&
      !!typingUser.username &&
      validatePassword(typingUser.password!) &&
      validatePassword(passwordConfirm) &&
      typingUser.password === passwordConfirm
    );
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
    });
    setTypingUser({
      ...typingUser,
      picture: !result.didCancel ? result.assets![0].base64 : undefined,
    });
  };

  const handleSave = () => {
    user!.username = typingUser.username;
    user!.email = typingUser.email;
    user!.password = typingUser.password;
    user!.picture = typingUser.picture;
    storeDataAccounts
      .update(user!)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'UPDATE',
          text2: 'Your profile has been updated !',
        });
        setTypingUser(baseTypingUser(user!));
        setPasswordConfirm('');
      })
      .catch(() =>
        displayErrorToast({
          name: 'Error',
          message: 'This email or username is already in use',
        }),
      );
  };

  const handleLogout = () => {
    setUser(null).then(() =>
      Toast.show({
        type: 'info',
        text1: 'Logout',
        text2: 'You have been logged out',
      }),
    );
  };

  const inputStyle = {
    ...styles.input,
    color: isDarkMode ? 'white' : 'black',
  };

  return (
    <Flex style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Card
          style={{
            ...styles.avatar,
            backgroundColor: isDarkMode ? COLOR_DARK_MODE_PRIMARY : undefined,
          }}>
          {!typingUser.picture ? (
            <Icon
              name="user-o"
              style={styles.avatarIcon}
              color={isDarkMode ? 'white' : undefined}
            />
          ) : (
            <Image
              source={{
                uri: `data:image/png;base64,${typingUser.picture}`,
              }}
              style={styles.avatarImage}
            />
          )}
        </Card>
      </TouchableOpacity>
      <Input
        disabled
        placeholder={typingUser.email}
        type="email-address"
        inputStyle={inputStyle}
      />
      <Input
        placeholder="Username"
        value={typingUser.username}
        inputStyle={inputStyle}
        onChangeText={username =>
          setTypingUser({
            ...typingUser,
            username: username,
          })
        }
      />
      <Input
        placeholder="Password"
        type="password"
        inputStyle={inputStyle}
        value={typingUser.password}
        onChangeText={password =>
          setTypingUser({
            ...typingUser,
            password: password,
          })
        }
      />
      <Input
        placeholder="Confirm password"
        type="password"
        inputStyle={inputStyle}
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
      />
      <Flex>
        <Button type="warning" onPress={handleLogout} style={styles.button}>
          Logout
        </Button>
        <Button
          type="primary"
          disabled={!validateSchema()}
          onPress={handleSave}
          style={styles.button}>
          Save
        </Button>
      </Flex>
      <Switch
        checkedChildren={<Icon name="moon-o" color="white" />}
        unCheckedChildren={<Icon name="sun-o" color="white" />}
        checked={isDarkMode}
        onChange={setIsDarkMode}
        style={styles.switch}
      />
    </Flex>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    top: 50,
  },
  input: {
    left: 25,
    marginVertical: 10,
  },
  avatar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: 200,
    height: 200,
    marginBottom: 50,
  },
  avatarIcon: {
    fontSize: 200,
  },
  avatarImage: {
    width: 200,
    height: 200,
  },
  button: {
    marginTop: 20,
    marginHorizontal: 15,
  },
  switch: {
    marginTop: 40,
  },
});
