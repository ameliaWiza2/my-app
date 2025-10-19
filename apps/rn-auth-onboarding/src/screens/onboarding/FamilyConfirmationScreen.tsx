import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingStackParamList} from '@/navigation/RootNavigator';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {clearJoinState, confirmJoinFamily} from '@/store/familySlice';

type Props = NativeStackScreenProps<
  OnboardingStackParamList,
  'FamilyConfirmation'
>;

const FamilyConfirmationScreen: React.FC<Props> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const {invitationPreview, joinStatus, joinError} = useAppSelector(
    state => state.family
  );

  useEffect(() => {
    if (!invitationPreview) {
      navigation.replace('FamilyJoin');
    }
  }, [invitationPreview, navigation]);

  if (!invitationPreview) {
    return null;
  }

  const isJoining = joinStatus === 'loading';

  const handleConfirm = () => {
    dispatch(confirmJoinFamily({code: invitationPreview.code}));
  };

  const handleCancel = () => {
    dispatch(clearJoinState());
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Join {invitationPreview.familyName}</Text>
        <Text style={styles.description}>
          This family currently has {invitationPreview.memberCount} member
          {invitationPreview.memberCount === 1 ? '' : 's'}. Confirm below to
          become part of the group.
        </Text>

        {joinError ? <Text style={styles.error}>{joinError}</Text> : null}
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          label="Join family"
          onPress={handleConfirm}
          loading={isJoining}
          accessibilityHint="Confirm joining this family"
        />
        <SecondaryButton
          label="Go back"
          onPress={handleCancel}
          accessibilityHint="Return to enter a different code"
          style={styles.secondaryButton}
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
  card: {
    backgroundColor: '#f9fafb',
    padding: 24,
    borderRadius: 16
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 22
  },
  error: {
    color: '#dc2626',
    fontSize: 14,
    marginTop: 20
  },
  actions: {
    marginTop: 24
  },
  secondaryButton: {
    marginTop: 12
  }
});

export default FamilyConfirmationScreen;
