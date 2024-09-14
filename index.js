/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { registerRootComponent } from "expo";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnQDbKQ12m00Inddn18lCaYyM8Sr3hyZ0",
  authDomain: "scooti-o.firebaseapp.com",
  projectId: "scooti-o",
  storageBucket: "scooti-o.appspot.com",
  messagingSenderId: "704388443940",
  appId: "1:704388443940:web:980012d3bdd5f2078c4db1",
  measurementId: "G-8K8THETC3G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize app

AppRegistry.registerComponent(appName, () => App);

// dev environment
registerRootComponent(App);