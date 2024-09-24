import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface IProps {
  onPress?: () => void;
}

export default function ButtonMyLocation({onPress}: IProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Icon name="crosshairs" size={25} color={'white'} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    backgroundColor: '#00695C',
    padding: 15,
    borderRadius: 27.5,
    width: 55,
    height: 55,
    alignItems: 'center',
  },
});
