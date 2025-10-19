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
import {clearAuthError, resetAuthStatus, login} from '@/store/authSlice';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

type FieldErrors = {
  email?: string;
  password?: string;
};

const LoginScreen: React.FC<Props> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const {status, error} = useAppSelector(state => state.auth);

  const [formValues, setFormValues] = useState({
    email: '',
    password: ''
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
      emailPattern.test(formValues.email.trim()) && formValues.password.length > 0
    );
  }, [formValues]);

  const setFieldValue = (field: keyof typeof formValues, value: string) => {
    setFormValues(prev => ({...prev, [field]: value}));
  };

  const validate = (): boolean => {
    const errors: FieldErrors = {};

    if (!emailPattern.test(formValues.email.trim())) {
      errors.email = 'Enter a valid email address.';
    }

    if (!formValues.password) {
      errors.password = 'Enter your password.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    dispatch(
      login({
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
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Enter your details to access your family hub.
        </Text>

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
        />

        {error ? <Text style={styles.errorMessage}>{error}</Text> : null}

        <PrimaryButton
          label="Log in"
          onPress={handleSubmit}
          disabled={!isFormValid}
          loading={isSubmitting}
          accessibilityHint="Submit the form to log into your account"
        />

        <Text
          style={styles.link}
          accessibilityRole="link"
          accessibilityHint="Navigate to reset your password"
          onPress={() => navigation.navigate('PasswordReset')}
        >
          Forgot your password?
        </Text>

        <SecondaryButton
          label="Need an account? Sign up"
          onPress={() => navigation.navigate('SignUp')}
          accessibilityHint="Navigate to the sign up screen"
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
  errorMessage: {
    marginBottom: 16,
    color: '#dc2626',
    fontSize: 14
  },
  link: {
    marginTop: 16,
    fontSize: 15,
    color: '#2563eb'
  },
  secondaryButton: {
    marginTop: 24
  }
});

export default LoginScreen;
