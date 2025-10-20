import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import type { FamilyRole } from '../../services/family';

const colorForRole = (role: FamilyRole) => {
  switch (role) {
    case 'admin':
      return '#d35400';
    case 'editor':
      return '#27ae60';
    case 'viewer':
    default:
      return '#7f8c8d';
  }
};

export const FamilyRoleBadge: React.FC<{ role: FamilyRole }>
= ({ role }) => {
  const color = colorForRole(role);
  return (
    <View style={[styles.container, { backgroundColor: color }]} accessibilityRole="text" accessibilityLabel={`Role ${role}`}>
      <Text style={styles.text}>{role.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  text: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
});

export default FamilyRoleBadge;
