import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppProviders} from './providers/AppProviders';

const App = () => (
  <SafeAreaProvider>
    <AppProviders />
  </SafeAreaProvider>
);

export default App;
