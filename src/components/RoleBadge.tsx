import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {FamilyRole, getRoleBadgeColor} from '../utils/rolePermissions';

export type RoleBadgeProps = {
  role: FamilyRole;
};

export const RoleBadge: React.FC<RoleBadgeProps> = ({role}) => {
  const bg = getRoleBadgeColor(role);
  return (
    <View style={[styles.container, {backgroundColor: bg}]}
      accessible accessibilityLabel={`Role: ${role}`}>
      <Text style={styles.text}>{role}</Text>
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

export default RoleBadge;
