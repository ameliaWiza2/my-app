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

export type SignInScreenProps = NativeStackScreenProps<OnboardingStackParamList, 'SignIn'>;

export const SignInScreen: React.FC<SignInScreenProps> = ({navigation}) => {
  const {theme} = useTheme();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!email || !password) {
      Alert.alert('Missing information', 'Please provide both email and password.');
      return;
    }

    setLoading(true);
    logger.log('auth', 'Attempting sign in', {email});
    analytics.trackEvent('sign_in_attempt', {email});

    setTimeout(() => {
      dispatch(
        signIn({
          token: 'mock-token',
          refreshToken: 'mock-refresh-token',
        }),
      );
      dispatch(
        setUserProfile({
          id: 'user-1',
          email,
          name: 'Sample User',
        }),
      );
      dispatch(completeOnboarding());
      analytics.trackEvent('sign_in_success', {email});
      setLoading(false);
    }, 700);
  };

  return (
    <View style={{flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background}}>
      <Card accessibleLabel="Sign in form">
        <Typography variant="heading2">Sign in</Typography>
        <View style={{marginTop: theme.spacing.lg}}>
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
            autoCapitalize="none"
            textContentType="password"
            value={password}
            onChangeText={setPassword}
            accessibilityLabel="Password input"
            containerStyle={{marginBottom: theme.spacing.lg}}
          />
          <Button title="Submit" onPress={handleSubmit} loading={loading} style={{marginBottom: theme.spacing.sm}} />
          <Button
            title="Create an account"
            variant="outline"
            onPress={() => navigation.navigate('SignUp')}
          />
        </View>
      </Card>
    </View>
  );
};
