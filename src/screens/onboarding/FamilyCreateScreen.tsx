import React, {useState} from 'react';
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
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {clearCreateState, createFamily} from '@/store/familySlice';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'FamilyCreate'>;

const FamilyCreateScreen: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const {createStatus, error} = useAppSelector(state => state.family);

  const [name, setName] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(clearCreateState());
      setName('');
      setFieldError(null);
      return () => undefined;
    }, [dispatch])
  );

  const isSubmitting = createStatus === 'loading';
  const isFormValid = name.trim().length >= 2;

  const handleSubmit = () => {
    if (!isFormValid) {
      setFieldError('Enter a name with at least two characters.');
      return;
    }

    setFieldError(null);
    dispatch(createFamily({name: name.trim()}));
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
        <Text style={styles.title}>Name your family</Text>
        <Text style={styles.subtitle}>
          This name will be visible to everyone you invite to the family space.
        </Text>

        <FormField
          label="Family name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          returnKeyType="done"
          error={fieldError}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton
          label="Create family"
          onPress={handleSubmit}
          disabled={!isFormValid}
          loading={isSubmitting}
          accessibilityHint="Create your family group"
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
  }
});

export default FamilyCreateScreen;
