/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {registerRootComponent} from 'expo';
import * as Font from 'expo-font';

// Initialize app

AppRegistry.registerComponent(appName, () => App);

// dev environment

registerRootComponent(App);

Font.loadAsync(
  'antoutline',
  // eslint-disable-next-line
  require('@ant-design/icons-react-native/fonts/antoutline.ttf'),
);

Font.loadAsync(
  'antfill',
  // eslint-disable-next-line
  require('@ant-design/icons-react-native/fonts/antfill.ttf'),
);
