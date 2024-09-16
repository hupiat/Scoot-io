import {Button, Card, Flex, Icon, Input} from '@ant-design/react-native';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useMiddlewareContext} from '../commons/middleware/context';
import {Account, WithoutId} from '../commons/types';
import {validateEmail, validatePassword} from '../commons/tools';

export default function PageProfileView() {
  const {user} = useMiddlewareContext();
  const [typingUser, setTypingUser] = useState<WithoutId<Account>>({
    email: user?.email ?? '',
    username: user?.username ?? '',
    password: '',
  });
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

  return (
    <Flex style={styles.container}>
      <TouchableOpacity>
        <Card style={styles.avatar}>
          <Icon name="user" style={styles.avatarIcon} />
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
      <Button type="primary" disabled={!validateSchema()}>
        Save
      </Button>
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
    width: 200,
    height: 200,
    marginBottom: 50,
  },
  avatarIcon: {
    fontSize: 200,
  },
});
