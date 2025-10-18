import React, {PropsWithChildren, useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import RootNavigator from '@/navigation/RootNavigator';
import {store} from '@/store/store';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {restoreSession} from '@/store/authSlice';
import {hydrateFamily} from '@/store/familySlice';

const SessionBootstrap: React.FC<PropsWithChildren> = ({children}) => {
  const dispatch = useAppDispatch();
  const isRestoring = useAppSelector(state => state.auth.isRestoring);
  const userId = useAppSelector(state => state.auth.user?.id);
  const hydrationStatus = useAppSelector(state => state.family.hydrationStatus);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  useEffect(() => {
    if (userId && hydrationStatus === 'idle') {
      dispatch(hydrateFamily({userId}));
    }
  }, [dispatch, userId, hydrationStatus]);

  if (isRestoring) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff'
        }}
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel="Restoring your session"
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <SessionBootstrap>
            <RootNavigator />
          </SessionBootstrap>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
