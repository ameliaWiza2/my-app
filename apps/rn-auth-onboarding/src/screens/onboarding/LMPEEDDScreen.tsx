import React, {useEffect, useMemo, useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingStackParamList} from '@/navigation/RootNavigator';
import FormField from '@/components/FormField';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import {useAppDispatch} from '@/store/hooks';
import {persistOnboarding, setEddDate, setLmpDate} from '@/store/onboardingSlice';
import {calculateEDDFromLMP, deriveEDD, parseYMD, toYMD, validateLMPandEDD} from '@/utils/pregnancyUtils';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'LMPEEDD'>;

const dateMask = /^(\d{4})-(\d{2})-(\d{2})$/;

const LMPEEDDScreen: React.FC<Props> = ({navigation}) => {
  const dispatch = useAppDispatch();

  const [lmp, setLmp] = useState('');
  const [eddManual, setEddManual] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const calculatedEDD = useMemo(() => {
    const calc = calculateEDDFromLMP(lmp);
    return calc ?? '';
  }, [lmp]);

  const eddPreview = useMemo(() => {
    if (eddManual && dateMask.test(eddManual)) return eddManual;
    return calculatedEDD;
  }, [eddManual, calculatedEDD]);

  useEffect(() => {
    const {valid, errors} = validateLMPandEDD(lmp || null, eddPreview || null);
    setErrors(valid ? [] : errors);
  }, [lmp, eddPreview]);

  const handleContinue = async () => {
    const {valid} = validateLMPandEDD(lmp || null, eddPreview || null);
    if (!valid) return;

    const source = eddManual && eddManual !== calculatedEDD ? 'manual' : 'calculated';

    dispatch(setLmpDate(lmp));
    dispatch(setEddDate({date: eddPreview, source}));
    await dispatch(persistOnboarding());

    navigation.navigate('FamilyChoice');
  };

  const isValidDateInput = (value: string) => (value === '' ? true : Boolean(parseYMD(value)));

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Last menstrual period (LMP)</Text>
          <Text style={styles.subtitle}>
            We'll use your LMP to calculate your estimated due date (EDD) using Naegele's rule.
          </Text>
        </View>

        <FormField
          label="LMP date (YYYY-MM-DD)"
          value={lmp}
          onChangeText={text => setLmp(text.trim())}
          placeholder="YYYY-MM-DD"
          keyboardType="numbers-and-punctuation"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityHint="Enter your last menstrual period date in YYYY-MM-DD format"
          error={lmp !== '' && !isValidDateInput(lmp) ? 'Enter a valid date in YYYY-MM-DD.' : undefined}
        />

        <View style={styles.preview}>
          <Text style={styles.previewLabel}>Estimated due date (EDD)</Text>
          <Text style={styles.previewValue} accessibilityLabel="Estimated due date preview">
            {eddPreview || '—'}
          </Text>
        </View>

        <Text style={styles.helper}>Need to change the EDD? You can override it below.</Text>

        <FormField
          label="EDD override (optional, YYYY-MM-DD)"
          value={eddManual}
          onChangeText={text => setEddManual(text.trim())}
          placeholder="YYYY-MM-DD"
          keyboardType="numbers-and-punctuation"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityHint="Optionally override the due date in YYYY-MM-DD format"
          error={eddManual !== '' && !isValidDateInput(eddManual) ? 'Enter a valid date in YYYY-MM-DD.' : undefined}
        />

        {errors.length > 0 ? (
          <View accessibilityLabel="Validation errors" accessible>
            {errors.map(err => (
              <Text key={err} style={styles.error}>
                {err}
              </Text>
            ))}
          </View>
        ) : null}

        <PrimaryButton
          label="Continue"
          onPress={handleContinue}
          disabled={!lmp || errors.length > 0}
          accessibilityHint="Save your dates and continue to family setup"
          style={styles.continueButton}
        />

        <SecondaryButton
          label="Back"
          onPress={() => navigation.goBack()}
          accessibilityHint="Go back to previous screen"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1, backgroundColor: '#ffffff'},
  content: {padding: 24, flexGrow: 1, justifyContent: 'space-between'},
  header: {marginBottom: 16},
  title: {fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 6},
  subtitle: {fontSize: 14, color: '#4b5563', lineHeight: 20},
  preview: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 12
  },
  previewLabel: {fontSize: 12, color: '#6b7280', marginBottom: 4},
  previewValue: {fontSize: 18, fontWeight: '600', color: '#111827'},
  helper: {fontSize: 13, color: '#6b7280', marginBottom: 8},
  error: {color: '#dc2626', marginBottom: 6},
  continueButton: {marginTop: 8}
});

export default LMPEEDDScreen;
