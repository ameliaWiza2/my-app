import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Alert, View} from 'react-native';
import {Button} from '../../components/ui/Button';
import {Card} from '../../components/ui/Card';
import {Input} from '../../components/ui/Input';
import {Typography} from '../../components/ui/Typography';
import {analytics, logger} from '../../instrumentation';
import {OnboardingStackParamList} from '../../navigation/types';
import {useAppDispatch} from '../../state/hooks';
import {completeOnboarding, signIn} from '../../state/slices/authSlice';
import {setUserProfile} from '../../state/slices/userSlice';
import {useTheme} from '../../theme';

export type SignUpScreenProps = NativeStackScreenProps<OnboardingStackParamList, 'SignUp'>;

export const SignUpScreen: React.FC<SignUpScreenProps> = ({navigation}) => {
  const {theme} = useTheme();
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!name || !email || !password) {
      Alert.alert('Missing information', 'Please complete all fields to continue.');
      return;
    }

    setLoading(true);
    logger.log('auth', 'Attempting sign up', {email});
    analytics.trackEvent('sign_up_attempt', {email});

    setTimeout(() => {
      dispatch(
        setUserProfile({
          id: 'user-1',
          email,
          name,
        }),
      );
      dispatch(
        signIn({
          token: 'mock-token',
          refreshToken: 'mock-refresh-token',
        }),
      );
      dispatch(completeOnboarding());
      analytics.trackEvent('sign_up_success', {email});
      Alert.alert('Welcome aboard', 'Your account has been created.');
      setLoading(false);
    }, 700);
  };

  return (
    <View style={{flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background}}>
      <Card accessibleLabel="Sign up form">
        <Typography variant="heading2">Create your account</Typography>
        <View style={{marginTop: theme.spacing.lg}}>
          <Input
            label="Full name"
            value={name}
            onChangeText={setName}
            accessibilityLabel="Full name input"
            containerStyle={{marginBottom: theme.spacing.md}}
          />
          <Input
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            value={email}
            onChangeText={setEmail}
            accessibilityLabel="Email input"
            containerStyle={{marginBottom: theme.spacing.md}}
          />
          <Input
            label="Password"
            secureTextEntry
            textContentType="password"
            value={password}
            onChangeText={setPassword}
            accessibilityLabel="Password input"
            containerStyle={{marginBottom: theme.spacing.lg}}
          />
          <Button title="Create account" onPress={handleSubmit} loading={loading} style={{marginBottom: theme.spacing.sm}} />
          <Button title="Back to sign in" variant="outline" onPress={() => navigation.goBack()} />
        </View>
      </Card>
    </View>
  );
};
