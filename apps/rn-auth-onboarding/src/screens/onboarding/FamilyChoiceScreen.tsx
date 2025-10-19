import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';
import {OnboardingStackParamList} from '@/navigation/RootNavigator';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import {useAppDispatch} from '@/store/hooks';
import {resetFamilyFlow} from '@/store/familySlice';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'FamilyChoice'>;

const FamilyChoiceScreen: React.FC<Props> = ({navigation}) => {
  const dispatch = useAppDispatch();

  useFocusEffect(
    React.useCallback(() => {
      dispatch(resetFamilyFlow());
      return () => undefined;
    }, [dispatch])
  );

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Bring your family together</Text>
        <Text style={styles.subtitle}>
          Create a new family space or join an existing one with an invitation
          code.
        </Text>
      </View>

      <View>
        <PrimaryButton
          label="Create a family"
          onPress={() => navigation.navigate('FamilyCreate')}
          accessibilityHint="Navigate to create a new family group"
          style={styles.primaryButton}
        />
        <SecondaryButton
          label="Join with an invitation"
          onPress={() => navigation.navigate('FamilyJoin')}
          accessibilityHint="Navigate to enter an invitation code"
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
    marginBottom: 12
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563'
  },
  primaryButton: {
    marginBottom: 16
  }
});

export default FamilyChoiceScreen;
