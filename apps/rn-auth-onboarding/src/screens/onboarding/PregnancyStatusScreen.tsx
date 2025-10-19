import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingStackParamList} from '@/navigation/RootNavigator';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import {useAppDispatch} from '@/store/hooks';
import {persistOnboarding, setPregnancyStatus} from '@/store/onboardingSlice';
import type {PregnancyStatus} from '@/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'PregnancyStatus'>;

const PregnancyStatusScreen: React.FC<Props> = ({navigation}) => {
  const dispatch = useAppDispatch();

  const selectStatus = async (status: PregnancyStatus) => {
    dispatch(setPregnancyStatus(status));
    await dispatch(persistOnboarding());
    if (status === 'AlreadyPregnant') {
      navigation.navigate('LMPEEDD');
    } else {
      navigation.navigate('FamilyChoice');
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Pregnancy status</Text>
        <Text style={styles.subtitle}>Select one option that applies to you.</Text>
      </View>
      <View>
        <PrimaryButton
          label="Already pregnant"
          onPress={() => selectStatus('AlreadyPregnant')}
          accessibilityHint="Proceed to enter your LMP and view EDD"
          style={styles.button}
        />
        <SecondaryButton
          label="Trying to conceive"
          onPress={() => selectStatus('TryingToConceive')}
          accessibilityHint="Skip LMP and EDD for now and continue"
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

export default PregnancyStatusScreen;
