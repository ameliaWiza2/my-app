import React, {useEffect} from 'react';
import {ScrollView, View} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {Button} from '../../components/ui/Button';
import {Card} from '../../components/ui/Card';
import {Typography} from '../../components/ui/Typography';
import {analytics, logger} from '../../instrumentation';
import {AuthenticatedTabParamList} from '../../navigation/types';
import {useTheme} from '../../theme';
import {useAppDispatch, useAppSelector} from '../../state/hooks';
import {useGetCurrentUserQuery} from '../../state/services/userApi';
import {setUserProfile} from '../../state/slices/userSlice';
import {ApiError} from '../../utils/errorHandling';

type HomeScreenProps = BottomTabScreenProps<AuthenticatedTabParamList, 'Home'>;

export const HomeScreen: React.FC<HomeScreenProps> = _props => {
  const {theme} = useTheme();
  const dispatch = useAppDispatch();
  const {profile} = useAppSelector(state => state.user);
  const {token} = useAppSelector(state => state.auth);

  const {data, isFetching, refetch, error, isError} = useGetCurrentUserQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (data) {
      dispatch(setUserProfile(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (isError) {
      const message = (error as ApiError)?.message ?? 'Unknown error';
      logger.error('home', 'Failed to load profile', error as ApiError);
      analytics.trackEvent('profile_load_failed', {message});
    }
  }, [error, isError]);

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: theme.colors.background}}
      contentContainerStyle={{padding: theme.spacing.lg}}
    >
      <Typography variant="heading1" style={{marginBottom: theme.spacing.lg}}>
        Welcome back{profile?.name ? `, ${profile.name}` : ''}!
      </Typography>
      <Card accessibleLabel="Account overview">
        <Typography variant="heading3">Account status</Typography>
        <View style={{marginTop: theme.spacing.md}}>
          <Typography>Email: {profile?.email ?? 'Not available'}</Typography>
          <Typography style={{marginTop: theme.spacing.xs}}>ID: {profile?.id ?? 'Not available'}</Typography>
        </View>
        <Button
          title={isFetching ? 'Refreshing…' : 'Refresh profile'}
          onPress={() => {
            analytics.trackEvent('profile_refresh');
            refetch();
          }}
          loading={isFetching}
          style={{marginTop: theme.spacing.lg}}
        />
      </Card>
      {isError ? (
        <Card accessibleLabel="Profile error state" style={{marginTop: theme.spacing.lg}}>
          <Typography variant="heading3">We hit a snag</Typography>
          <Typography style={{marginTop: theme.spacing.sm}}>{
            (error as ApiError)?.message ?? 'Unable to fetch profile data.'
          }</Typography>
        </Card>
      ) : null}
    </ScrollView>
  );
};
