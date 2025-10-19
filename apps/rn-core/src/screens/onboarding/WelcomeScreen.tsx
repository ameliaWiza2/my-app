import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {View, StyleSheet} from 'react-native';
import {Button} from '../../components/ui/Button';
import {Card} from '../../components/ui/Card';
import {Typography} from '../../components/ui/Typography';
import {analytics} from '../../instrumentation';
import {OnboardingStackParamList} from '../../navigation/types';
import {useTheme} from '../../theme';

export type WelcomeScreenProps = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({navigation}) => {
  const {theme, toggleTheme} = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background, padding: theme.spacing.lg}]}>
      <Card accessibleLabel="Welcome to the application">
        <Typography variant="heading1" accessibilityRole="header">
          Welcome
        </Typography>
        <Typography style={{marginTop: theme.spacing.md}}>
          Sign in or create a profile to continue. Toggle between light and dark mode to preview the accessible color contrast.
        </Typography>
        <View style={{marginTop: theme.spacing.lg}}>
          <Button
            title="Sign in"
            onPress={() => {
              analytics.trackEvent('navigate_sign_in');
              navigation.navigate('SignIn');
            }}
            style={{marginBottom: theme.spacing.sm}}
          />
          <Button
            title="Create account"
            variant="secondary"
            onPress={() => {
              analytics.trackEvent('navigate_sign_up');
              navigation.navigate('SignUp');
            }}
            style={{marginBottom: theme.spacing.sm}}
          />
          <Button title="Toggle theme" variant="outline" onPress={toggleTheme} />
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
