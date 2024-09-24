import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {
  COLOR_DARK_MODE_PRIMARY,
  useDarkModeContext,
} from '../commons/DarkModeContext';
import Icon from 'react-native-vector-icons/FontAwesome';

interface IProps {
  onPress?: () => void;
}

export default function ButtonClearSearch({onPress}: IProps) {
  const {isDarkMode} = useDarkModeContext();
  return (
    <TouchableOpacity
      style={{
        ...styles.button,
        backgroundColor: isDarkMode ? COLOR_DARK_MODE_PRIMARY : 'white',
      }}
      onPress={onPress}>
      <Icon name="close" color={isDarkMode ? 'white' : undefined} size={30} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'relative',
    right: 10,
  },
});
