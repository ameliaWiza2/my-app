import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import AppNavigator from '../navigation/AppNavigator';
import {ThemeProvider} from '../theme';
import {persistor, store} from '../state/store';

const LoadingFallback = () => (
  <View
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <ActivityIndicator size="large" />
  </View>
);

export const AppProviders = () => (
  <Provider store={store}>
    <PersistGate loading={<LoadingFallback />} persistor={persistor}>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
