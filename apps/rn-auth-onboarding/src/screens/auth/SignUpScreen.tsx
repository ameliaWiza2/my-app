import React, {useMemo, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';
import {AuthStackParamList} from '@/navigation/RootNavigator';
import FormField from '@/components/FormField';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {
  clearAuthError,
  resetAuthStatus,
  signUp
} from '@/store/authSlice';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const SignUpScreen: React.FC<Props> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const {status, error} = useAppSelector(state => state.auth);

  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useFocusEffect(
    React.useCallback(() => {
      dispatch(clearAuthError());
      dispatch(resetAuthStatus());
      return () => undefined;
    }, [dispatch])
  );

  const isSubmitting = status === 'loading';

  const isFormValid = useMemo(() => {
    return (
      formValues.name.trim().length > 0 &&
      emailPattern.test(formValues.email.trim()) &&
      formValues.password.length >= 8 &&
      formValues.password === formValues.confirmPassword
    );
  }, [formValues]);

  const setFieldValue = (field: keyof typeof formValues, value: string) => {
    setFormValues(prev => ({...prev, [field]: value}));
  };

  const validate = (): boolean => {
    const errors: FieldErrors = {};

    if (!formValues.name.trim()) {
      errors.name = 'Please enter your full name.';
    }

    if (!emailPattern.test(formValues.email.trim())) {
      errors.email = 'Enter a valid email address.';
    }

    if (formValues.password.length < 8) {
      errors.password = 'Use at least 8 characters for your password.';
    }

    if (formValues.password !== formValues.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    dispatch(
      signUp({
        name: formValues.name.trim(),
        email: formValues.email.trim().toLowerCase(),
        password: formValues.password
      })
    );
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
        accessibilityRole="form"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            Start building your family space with secure messaging, shared
            calendars, and more.
          </Text>
        </View>

        <View>
          <FormField
            label="Full name"
            value={formValues.name}
            onChangeText={text => setFieldValue('name', text)}
            autoCapitalize="words"
            textContentType="name"
            autoComplete="name"
            returnKeyType="next"
            error={fieldErrors.name}
          />
          <FormField
            label="Email"
            value={formValues.email}
            onChangeText={text => setFieldValue('email', text)}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            returnKeyType="next"
            error={fieldErrors.email}
          />
          <FormField
            label="Password"
            value={formValues.password}
            onChangeText={text => setFieldValue('password', text)}
            secureTextEntry
            textContentType="password"
            autoComplete="password"
            returnKeyType="done"
            error={fieldErrors.password}
            accessibilityHint="Enter a password with at least eight characters"
          />
          <FormField
            label="Confirm password"
            value={formValues.confirmPassword}
            onChangeText={text => setFieldValue('confirmPassword', text)}
            secureTextEntry
            textContentType="password"
            autoComplete="password"
            returnKeyType="done"
            error={fieldErrors.confirmPassword}
          />
        </View>

        {error ? <Text style={styles.errorMessage}>{error}</Text> : null}

        <PrimaryButton
          label="Create account"
          onPress={handleSubmit}
          disabled={!isFormValid}
          loading={isSubmitting}
          accessibilityHint="Submit the form to create your account"
        />

        <SecondaryButton
          label="Already have an account? Log in"
          onPress={() => navigation.navigate('Login')}
          accessibilityHint="Navigate to the login screen"
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
    justifyContent: 'space-between'
  },
  header: {
    marginBottom: 24
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 22
  },
  errorMessage: {
    marginBottom: 16,
    color: '#dc2626',
    fontSize: 14
  },
  secondaryButton: {
    marginTop: 12
  }
});

export default SignUpScreen;
