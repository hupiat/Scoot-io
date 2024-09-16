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

function App(): React.JSX.Element {
  return (
    <MiddlewareContext>
      <Pages />
      <Toast />
    </MiddlewareContext>
  );
}

export default App;
