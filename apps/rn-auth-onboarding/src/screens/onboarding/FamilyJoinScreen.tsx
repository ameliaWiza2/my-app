import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';
import {OnboardingStackParamList} from '@/navigation/RootNavigator';
import FormField from '@/components/FormField';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {
  clearJoinState,
  previewInvitation
} from '@/store/familySlice';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'FamilyJoin'>;

const FamilyJoinScreen: React.FC<Props> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const {previewStatus, previewError} = useAppSelector(state => state.family);
  const invitationPreview = useAppSelector(state => state.family.invitationPreview);

  const [code, setCode] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(clearJoinState());
      setCode('');
      setFieldError(null);
      return () => undefined;
    }, [dispatch])
  );

  const isSubmitting = previewStatus === 'loading';
  const isFormValid = code.trim().length >= 4;

  const handleSubmit = () => {
    if (!isFormValid) {
      setFieldError('Invitation codes are at least four characters.');
      return;
    }

    setFieldError(null);
    dispatch(previewInvitation({code}));
  };

  useEffect(() => {
    if (previewStatus === 'succeeded' && invitationPreview) {
      navigation.navigate('FamilyConfirmation');
    }
  }, [navigation, previewStatus, invitationPreview]);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Join an existing family</Text>
        <Text style={styles.subtitle}>
          Enter the invitation code shared with you to preview the family
          details.
        </Text>

        <FormField
          label="Invitation code"
          value={code}
          onChangeText={text => setCode(text.toUpperCase())}
          autoCapitalize="characters"
          returnKeyType="done"
          error={fieldError}
          accessibilityHint="Enter the code provided by a family member"
        />

        {previewError ? <Text style={styles.error}>{previewError}</Text> : null}

        <PrimaryButton
          label="Preview family"
          onPress={handleSubmit}
          disabled={!isFormValid}
          loading={isSubmitting}
          accessibilityHint="Preview the family associated with this code"
        />

        <SecondaryButton
          label="Create a family instead"
          onPress={() => navigation.navigate('FamilyCreate')}
          accessibilityHint="Navigate to the create family screen"
          style={styles.secondaryButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  content: {
    padding: 24,
    flexGrow: 1
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 24
  },
  error: {
    color: '#dc2626',
    fontSize: 14,
    marginBottom: 16
  },
  secondaryButton: {
    marginTop: 16
  }
});

export default FamilyJoinScreen;
