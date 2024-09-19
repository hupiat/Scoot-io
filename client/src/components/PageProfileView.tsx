import {Button, Card, Flex, Input} from '@ant-design/react-native';
import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
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

  return (
    <Flex style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Card style={styles.avatar}>
          {!typingUser.picture ? (
            <Icon name="user-o" style={styles.avatarIcon} />
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
      <Text>Email</Text>
      <Input
        placeholder="Email"
        type="email-address"
        value={typingUser.email}
        style={styles.input}
        onChangeText={email =>
          setTypingUser({
            ...typingUser,
            email: email,
          })
        }
      />
      <Text>Username</Text>
      <Input
        placeholder="Username"
        value={typingUser.username}
        style={styles.input}
        onChangeText={username =>
          setTypingUser({
            ...typingUser,
            username: username,
          })
        }
      />
      <Text>Password</Text>
      <Input
        placeholder="Password"
        type="password"
        style={styles.input}
        value={typingUser.password}
        onChangeText={password =>
          setTypingUser({
            ...typingUser,
            password: password,
          })
        }
      />
      <Text>Confirm password</Text>
      <Input
        placeholder="Confirm password"
        type="password"
        style={styles.input}
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
      />
      <Flex>
        <Button
          type="primary"
          disabled={!validateSchema()}
          onPress={handleSave}
          style={styles.button}>
          Save
        </Button>
        <Button type="warning" onPress={handleLogout} style={styles.button}>
          Logout
        </Button>
      </Flex>
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
    marginVertical: 5,
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
    marginTop: 40,
    marginHorizontal: 15,
  },
});
