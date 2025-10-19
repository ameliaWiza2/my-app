import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PrivacyPolicyLink } from './components/PrivacyPolicyLink';

const App = () => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollView}
        accessible={true}
        accessibilityLabel="Main screen content">
        <View
          style={styles.content}
          accessible={true}
          accessibilityRole="main"
          testID="app-container">
          <Text
            style={styles.title}
            accessible={true}
            accessibilityRole="header"
            accessibilityLabel="Mobile App">
            Mobile App
          </Text>
          <Text
            style={styles.subtitle}
            accessible={true}
            accessibilityLabel="Secure, tested, and accessible">
            🔒 Secure • ✅ Tested • ♿ Accessible
          </Text>
          <View style={styles.features}>
            <FeatureItem
              icon="🔐"
              title="Security First"
              description="HTTPS enforcement, secure storage, and input sanitization"
            />
            <FeatureItem
              icon="✅"
              title="Comprehensive Testing"
              description="Unit, integration, and E2E tests with 70% coverage"
            />
            <FeatureItem
              icon="🌍"
              title="Internationalization"
              description="Multi-language support with i18next"
            />
            <FeatureItem
              icon="♿"
              title="Accessibility"
              description="Full VoiceOver and TalkBack compliance"
            />
          </View>
          <View style={styles.footer}>
            <PrivacyPolicyLink />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
  <View
    style={styles.featureItem}
    accessible={true}
    accessibilityLabel={`${title}: ${description}`}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <View style={styles.featureText}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
  },
  features: {
    flex: 1,
    gap: 20,
  },
  featureItem: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
});

export default App;
