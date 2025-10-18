import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {logout} from '@/store/authSlice';

const HomeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const family = useAppSelector(state => state.family.family);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Hello {user?.name ?? 'there'}!</Text>
        {family ? (
          <Text style={styles.subtitle}>
            You are part of the {family.name} family with {family.members.length}{' '}
            member{family.members.length === 1 ? '' : 's'}.
          </Text>
        ) : (
          <Text style={styles.subtitle}>
            Your onboarding is complete. Invite loved ones to start collaborating
            together.
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          label="Invite family"
          onPress={() => {}}
          accessibilityHint="Feature placeholder for inviting family members"
          disabled
        />
        <SecondaryButton
          label="Log out"
          onPress={handleLogout}
          accessibilityHint="Log out of your account"
          style={styles.logoutButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 24,
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 22
  },
  actions: {
    marginTop: 24
  },
  logoutButton: {
    marginTop: 12
  }
});

export default HomeScreen;
