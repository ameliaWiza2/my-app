import React, {useState} from 'react';
import {Alert, View} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {Button} from '../../components/ui/Button';
import {Card} from '../../components/ui/Card';
import {Input} from '../../components/ui/Input';
import {Typography} from '../../components/ui/Typography';
import {analytics, logger} from '../../instrumentation';
import {AuthenticatedTabParamList} from '../../navigation/types';
import {useTheme} from '../../theme';
import {useAppDispatch, useAppSelector} from '../../state/hooks';
import {useUpdateUserProfileMutation} from '../../state/services/userApi';
import {updateUserProfile} from '../../state/slices/userSlice';
import {ApiError} from '../../utils/errorHandling';

type ProfileScreenProps = BottomTabScreenProps<AuthenticatedTabParamList, 'Profile'>;

export const ProfileScreen: React.FC<ProfileScreenProps> = _props => {
  const {theme} = useTheme();
  const dispatch = useAppDispatch();
  const {profile} = useAppSelector(state => state.user);
  const [name, setName] = useState(profile?.name ?? '');
  const [updateProfile, {isLoading}] = useUpdateUserProfileMutation();

  const handleSave = async () => {
    if (!profile) {
      Alert.alert('No profile', 'We could not locate a profile to update.');
      return;
    }
    try {
      await updateProfile({name}).unwrap();
      dispatch(updateUserProfile({name}));
      analytics.trackEvent('profile_update', {name});
      Alert.alert('Profile updated', 'Your profile changes have been saved.');
    } catch (err) {
      const error = err as ApiError;
      logger.error('profile', 'Failed to update profile', error);
      Alert.alert('Profile update failed', error.message ?? 'Please try again later.');
    }
  };

  return (
    <View style={{flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background}}>
      <Card accessibleLabel="Profile details">
        <Typography variant="heading2">Profile</Typography>
        <View style={{marginTop: theme.spacing.md}}>
          <Input
            label="Email"
            value={profile?.email ?? ''}
            editable={false}
            containerStyle={{marginBottom: theme.spacing.md}}
          />
          <Input
            label="Display name"
            value={name}
            onChangeText={setName}
            containerStyle={{marginBottom: theme.spacing.lg}}
          />
          <Button title="Save changes" onPress={handleSave} loading={isLoading} />
        </View>
      </Card>
    </View>
  );
};
