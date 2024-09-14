/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { registerRootComponent } from "expo";

// Initialize app

AppRegistry.registerComponent(appName, () => App);

// dev environment
registerRootComponent(App);