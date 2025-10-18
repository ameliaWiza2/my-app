import React from 'react';
import { Text, TouchableOpacity, Linking, StyleSheet, Alert } from 'react-native';

interface PrivacyPolicyLinkProps {
  url?: string;
  style?: object;
  textStyle?: object;
}

export const PrivacyPolicyLink: React.FC<PrivacyPolicyLinkProps> = ({
  url = 'https://example.com/privacy-policy',
  style,
  textStyle,
}) => {
  const handlePress = async () => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open privacy policy URL');
      }
    } catch (error) {
      console.error('Error opening privacy policy:', error);
      Alert.alert('Error', 'Failed to open privacy policy');
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.container, style]}
      accessible={true}
      accessibilityRole="link"
      accessibilityLabel="Privacy Policy"
      accessibilityHint="Opens the privacy policy in your browser">
      <Text style={[styles.text, textStyle]}>Privacy Policy</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  text: {
    color: '#007AFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
