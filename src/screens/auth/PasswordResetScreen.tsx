import React, {useMemo, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';
import {AuthStackParamList} from '@/navigation/RootNavigator';
import FormField from '@/components/FormField';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {
  clearPasswordResetState,
  requestPasswordReset
} from '@/store/authSlice';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = NativeStackScreenProps<AuthStackParamList, 'PasswordReset'>;

const PasswordResetScreen: React.FC<Props> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const {passwordResetStatus, passwordResetError} = useAppSelector(
    state => state.auth
  );

  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(clearPasswordResetState());
      setFieldError(null);
      setEmail('');
      return () => undefined;
    }, [dispatch])
  );

  const isSubmitting = passwordResetStatus === 'loading';
  const isSuccess = passwordResetStatus === 'succeeded';

  const isFormValid = useMemo(() => emailPattern.test(email.trim()), [email]);

  const handleSubmit = () => {
    if (!emailPattern.test(email.trim())) {
      setFieldError('Enter a valid email address.');
      return;
    }

    setFieldError(null);
    dispatch(requestPasswordReset({email: email.trim().toLowerCase()}));
  };

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
        <Text style={styles.title}>Reset your password</Text>
        <Text style={styles.subtitle}>
          Enter the email associated with your account and we will send you a
          reset link.
        </Text>

        <FormField
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          returnKeyType="send"
          error={fieldError}
        />

        {passwordResetError ? (
          <Text style={styles.error}>{passwordResetError}</Text>
        ) : null}

        {isSuccess ? (
          <Text style={styles.success}>
            If an account exists with this email, we have sent you instructions
            to reset your password.
          </Text>
        ) : null}

        <PrimaryButton
          label="Send reset link"
          onPress={handleSubmit}
          disabled={!isFormValid || isSuccess}
          loading={isSubmitting}
          accessibilityHint="Request a password reset email"
        />

        <SecondaryButton
          label="Back to login"
          onPress={() => navigation.navigate('Login')}
          accessibilityHint="Navigate back to the login screen"
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
    flexGrow: 1,
    justifyContent: 'center'
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
  success: {
    color: '#047857',
    fontSize: 14,
    marginBottom: 16
  },
  secondaryButton: {
    marginTop: 24
  }
});

export default PasswordResetScreen;
