import React from 'react';
import {Alert, View} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {Button} from '../../components/ui/Button';
import {Card} from '../../components/ui/Card';
import {Typography} from '../../components/ui/Typography';
import {getConfig} from '../../config/env';
import {analytics} from '../../instrumentation';
import {AuthenticatedTabParamList} from '../../navigation/types';
import {useTheme} from '../../theme';
import {useAppDispatch} from '../../state/hooks';
import {signOut} from '../../state/slices/authSlice';
import {clearUserProfile} from '../../state/slices/userSlice';

type SettingsScreenProps = BottomTabScreenProps<AuthenticatedTabParamList, 'Settings'>;

export const SettingsScreen: React.FC<SettingsScreenProps> = _props => {
  const {theme, colorScheme, toggleTheme} = useTheme();
  const dispatch = useAppDispatch();
  const config = getConfig();

  const handleSignOut = () => {
    analytics.trackEvent('sign_out');
    dispatch(signOut());
    dispatch(clearUserProfile());
    Alert.alert('Signed out', 'You have been signed out successfully.');
  };

  return (
    <View style={{flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background}}>
      <Card accessibleLabel="Theme preferences">
        <Typography variant="heading3">Appearance</Typography>
        <Typography style={{marginTop: theme.spacing.sm}}>Current theme: {colorScheme}</Typography>
        <Button title="Toggle theme" onPress={toggleTheme} style={{marginTop: theme.spacing.md}} variant="secondary" />
      </Card>
      <Card accessibleLabel="System configuration" style={{marginTop: theme.spacing.lg}}>
        <Typography variant="heading3">Configuration</Typography>
        <Typography style={{marginTop: theme.spacing.sm}}>Environment: {config.ENVIRONMENT}</Typography>
        <Typography style={{marginTop: theme.spacing.xs}}>API URL: {config.API_URL}</Typography>
        <Typography style={{marginTop: theme.spacing.xs}}>Mocks enabled: {config.USE_MOCKS ? 'Yes' : 'No'}</Typography>
      </Card>
      <Card accessibleLabel="Account actions" style={{marginTop: theme.spacing.lg}}>
        <Typography variant="heading3">Account</Typography>
        <Button title="Sign out" onPress={handleSignOut} variant="outline" style={{marginTop: theme.spacing.md}} />
      </Card>
    </View>
  );
};
