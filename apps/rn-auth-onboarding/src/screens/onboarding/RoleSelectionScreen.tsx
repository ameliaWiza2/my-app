import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingStackParamList} from '@/navigation/RootNavigator';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import {useAppDispatch} from '@/store/hooks';
import {persistOnboarding, setRole} from '@/store/onboardingSlice';
import type {Role} from '@/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'RoleSelection'>;

const RoleSelectionScreen: React.FC<Props> = ({navigation}) => {
  const dispatch = useAppDispatch();

  const selectRole = async (role: Role) => {
    dispatch(setRole(role));
    await dispatch(persistOnboarding());
    if (role === 'Pregnant') {
      navigation.navigate('PregnancyStatus');
    } else {
      navigation.navigate('FamilyChoice');
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Tell us your role</Text>
        <Text style={styles.subtitle}>
          Choose how you'll use the app so we can set things up for you.
        </Text>
      </View>
      <View>
        <PrimaryButton
          label="I'm pregnant"
          onPress={() => selectRole('Pregnant')}
          accessibilityHint="Select pregnant role"
          style={styles.button}
        />
        <SecondaryButton
          label="I'm a husband"
          onPress={() => selectRole('Husband')}
          accessibilityHint="Select husband role"
          style={styles.button}
        />
        <SecondaryButton
          label="I'm another family member"
          onPress={() => selectRole('Other')}
          accessibilityHint="Select other family role"
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
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563'
  },
  button: {
    marginBottom: 12
  }
});

export default RoleSelectionScreen;
