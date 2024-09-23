/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import MiddlewareContext from './src/commons/middleware/context';
import Toast from 'react-native-toast-message';
import Pages from './src/components/Pages';
import {Provider} from '@ant-design/react-native';
import enUS from '@ant-design/react-native/es/locale-provider/en_US';

function App(): React.JSX.Element {
  return (
    <MiddlewareContext>
      <Provider locale={enUS}>
        <Pages />
        <Toast />
      </Provider>
    </MiddlewareContext>
  );
}

export default App;
