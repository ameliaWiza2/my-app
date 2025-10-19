import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@/navigation/RootNavigator';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC<Props> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>Welcome to Family Hub</Text>
        <Text style={styles.subtitle}>

          coordinate events, and celebrate milestones together.
        </Text>
      </View>
      <View style={styles.actions}>
        <PrimaryButton
          label="Get started"
          onPress={() => navigation.navigate('SignUp')}
          accessibilityHint="Navigate to create a new account"
          style={styles.primaryButton}
        />
        <SecondaryButton
          label="I already have an account"
          onPress={() => navigation.navigate('Login')}
          accessibilityHint="Navigate to the login screen"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'space-between',
    backgroundColor: '#ffffff'
  },
  hero: {
    alignItems: 'center',
    marginBottom: 32
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1f2937'
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#4b5563',
    lineHeight: 22,
    marginTop: 12
  },
  actions: {
    width: '100%'
  },
  primaryButton: {
    marginBottom: 12
  }
});

export default WelcomeScreen;
