import React, {useMemo, useRef} from 'react';
import {NavigationContainer, NavigationContainerRef} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {analytics} from '../instrumentation';
import {useAppSelector} from '../state/hooks';
import {useTheme} from '../theme';
import {HomeScreen} from '../screens/main/HomeScreen';
import {ProfileScreen} from '../screens/main/ProfileScreen';
import {SettingsScreen} from '../screens/main/SettingsScreen';
import {SignInScreen} from '../screens/onboarding/SignInScreen';
import {SignUpScreen} from '../screens/onboarding/SignUpScreen';
import {WelcomeScreen} from '../screens/onboarding/WelcomeScreen';
import {AuthenticatedTabParamList, OnboardingStackParamList, RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const Tab = createBottomTabNavigator<AuthenticatedTabParamList>();

const OnboardingNavigator = () => {
  const {theme} = useTheme();
  const {onboardingComplete} = useAppSelector(state => state.auth);

  const screenOptions = useMemo(
    () => ({
      contentStyle: {
        backgroundColor: theme.colors.background,
      },
      headerStyle: {
        backgroundColor: theme.colors.surface,
      },
      headerTintColor: theme.colors.text,
      headerTitleStyle: {
        fontSize: theme.typography.heading3.fontSize,
        fontWeight: theme.typography.heading3.fontWeight,
      },
    }),
    [theme],
  );

  const initialRouteName: keyof OnboardingStackParamList = onboardingComplete ? 'SignIn' : 'Welcome';

  return (
    <OnboardingStack.Navigator screenOptions={screenOptions} initialRouteName={initialRouteName}>
      <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown: false}} />
      <OnboardingStack.Screen name="SignIn" component={SignInScreen} options={{title: 'Sign in'}} />
      <OnboardingStack.Screen name="SignUp" component={SignUpScreen} options={{title: 'Create account'}} />
    </OnboardingStack.Navigator>
  );
};

const MainTabs = () => {
  const {theme} = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.caption.fontSize,
        },
        tabBarIconStyle: {display: 'none'},
        title: route.name,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);
  const routeNameRef = useRef<string>();
  const {navigationTheme} = useTheme();
  const {isAuthenticated} = useAppSelector(state => state.auth);

  const initialRoute = isAuthenticated ? 'Main' : 'Onboarding';

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={navigationTheme}
      onReady={() => {
        const routeName = navigationRef.current?.getCurrentRoute()?.name;
        if (routeName) {
          routeNameRef.current = routeName;
          analytics.trackScreen(routeName);
        }
      }}
      onStateChange={() => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;
        if (currentRouteName && previousRouteName !== currentRouteName) {
          routeNameRef.current = currentRouteName;
          analytics.trackScreen(currentRouteName);
        }
      }}
    >
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{headerShown: false}}>
        {!isAuthenticated ? (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : null}
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
