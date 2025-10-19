import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PermissionConfig } from '../utils/permissions';

interface PermissionRationaleModalProps {
  visible: boolean;
  config: PermissionConfig;
  onAccept: () => void;
  onDecline: () => void;
}

export const PermissionRationaleModal: React.FC<PermissionRationaleModalProps> = ({
  visible,
  config,
  onAccept,
  onDecline,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDecline}
      accessible={true}
      accessibilityLabel="Permission request dialog"
      accessibilityRole="alert">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text
            style={styles.title}
            accessible={true}
            accessibilityRole="header"
            accessibilityLabel={config.title}>
            {config.title}
          </Text>
          <Text
            style={styles.message}
            accessible={true}
            accessibilityLabel={config.message}>
            {config.message}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonNegative]}
              onPress={onDecline}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={config.buttonNegative || 'Cancel'}
              accessibilityHint="Dismiss the permission request">
              <Text style={styles.buttonTextNegative}>
                {config.buttonNegative || 'Cancel'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonPositive]}
              onPress={onAccept}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={config.buttonPositive || 'Grant Access'}
              accessibilityHint="Grant the requested permission">
              <Text style={styles.buttonTextPositive}>
                {config.buttonPositive || 'Grant Access'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 32,
    maxWidth: 400,
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
  },
  buttonNegative: {
    backgroundColor: '#F0F0F0',
  },
  buttonPositive: {
    backgroundColor: '#007AFF',
  },
  buttonTextNegative: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonTextPositive: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
