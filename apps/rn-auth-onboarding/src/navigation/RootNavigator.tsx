import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WelcomeScreen from '@/screens/auth/WelcomeScreen';
import SignUpScreen from '@/screens/auth/SignUpScreen';
import LoginScreen from '@/screens/auth/LoginScreen';
import PasswordResetScreen from '@/screens/auth/PasswordResetScreen';
import FamilyChoiceScreen from '@/screens/onboarding/FamilyChoiceScreen';
import FamilyCreateScreen from '@/screens/onboarding/FamilyCreateScreen';
import FamilyJoinScreen from '@/screens/onboarding/FamilyJoinScreen';
import FamilyConfirmationScreen from '@/screens/onboarding/FamilyConfirmationScreen';
import HomeScreen from '@/screens/home/HomeScreen';
import {useAppSelector} from '@/store/hooks';
import RoleSelectionScreen from '@/screens/onboarding/RoleSelectionScreen';
import PregnancyStatusScreen from '@/screens/onboarding/PregnancyStatusScreen';
import LMPEEDDScreen from '@/screens/onboarding/LMPEEDDScreen';

export type AuthStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
  Login: undefined;
  PasswordReset: undefined;
};

export type OnboardingStackParamList = {
  RoleSelection: undefined;
  PregnancyStatus: undefined;
  LMPEEDD: undefined;
  FamilyChoice: undefined;
  FamilyCreate: undefined;
  FamilyJoin: undefined;
  FamilyConfirmation: undefined;
};

export type AppStackParamList = {
  Home: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      name="Welcome"
      component={WelcomeScreen}
      options={{headerShown: false}}
    />
    <AuthStack.Screen
      name="SignUp"
      component={SignUpScreen}
      options={{title: 'Create an account'}}
    />
    <AuthStack.Screen
      name="Login"
      component={LoginScreen}
      options={{title: 'Log in'}}
    />
    <AuthStack.Screen
      name="PasswordReset"
      component={PasswordResetScreen}
      options={{title: 'Reset password'}}
    />
  </AuthStack.Navigator>
);

const OnboardingNavigator = () => (
  <OnboardingStack.Navigator>
    <OnboardingStack.Screen
      name="RoleSelection"
      component={RoleSelectionScreen}
      options={{title: 'Select your role'}}
    />
    <OnboardingStack.Screen
      name="PregnancyStatus"
      component={PregnancyStatusScreen}
      options={{title: 'Pregnancy status'}}
    />
    <OnboardingStack.Screen
      name="LMPEEDD"
      component={LMPEEDDScreen}
      options={{title: 'LMP and EDD'}}
    />
    <OnboardingStack.Screen
      name="FamilyChoice"
      component={FamilyChoiceScreen}
      options={{title: 'Set up your family'}}
    />
    <OnboardingStack.Screen
      name="FamilyCreate"
      component={FamilyCreateScreen}
      options={{title: 'Create a family'}}
    />
    <OnboardingStack.Screen
      name="FamilyJoin"
      component={FamilyJoinScreen}
      options={{title: 'Join a family'}}
    />
    <OnboardingStack.Screen
      name="FamilyConfirmation"
      component={FamilyConfirmationScreen}
      options={{title: 'Confirm family'}}
    />
  </OnboardingStack.Navigator>
);

const AppNavigator = () => (
  <AppStack.Navigator>
    <AppStack.Screen
      name="Home"
      component={HomeScreen}
      options={{title: 'Family Hub'}}
    />
  </AppStack.Navigator>
);

const RootNavigator = () => {
  const user = useAppSelector(state => state.auth.user);
  const onboardingComplete = useAppSelector(state => state.family.onboardingComplete);

  if (!user) {
    return <AuthNavigator />;
  }

  if (!onboardingComplete) {
    return <OnboardingNavigator />;
  }

  return <AppNavigator />;
};

export default RootNavigator;
