import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import FamilyRoleBadge from './FamilyRoleBadge';
import type { FamilyMember, FamilyRole } from '../../services/family';
import { useFamily } from '../../modules/family/state';
import { canEdit, canManage, roleLabel } from '../../modules/family/permissions';

export const FamilyMemberDetailScreen: React.FC<{ member: FamilyMember }>
= ({ member }) => {
  const { state, updateRole, remove } = useFamily();

  const onChangeRole = (role: FamilyRole) => updateRole(member.id, role);

  const currentMember = state.members.find(m => m.id === member.id) ?? member;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Member detail</Text>
      <Text style={styles.name}>{currentMember.name}</Text>
      <Text style={styles.email}>{currentMember.email}</Text>
      <FamilyRoleBadge role={currentMember.role} />

      <Text style={styles.section}>Permissions</Text>
      <Text>Can view: Yes</Text>
      <Text>Can edit: {canEdit(currentMember.role) ? 'Yes' : 'No'}</Text>
      <Text>Can manage: {canManage(currentMember.role) ? 'Yes' : 'No'}</Text>

      <Text style={styles.section}>Actions</Text>
      <View style={styles.actions}>
        <Button title={`Set ${roleLabel('viewer')}`} onPress={() => onChangeRole('viewer')} />
        <Button title={`Set ${roleLabel('editor')}`} onPress={() => onChangeRole('editor')} />
        <Button title={`Set ${roleLabel('admin')}`} onPress={() => onChangeRole('admin')} />
      </View>

      <View style={{ marginTop: 12 }}>
        <Button title="Remove from family" color="#c0392b" onPress={() => remove(member.id)} />
      </View>

      {state.roleUpdateStatus === 'loading' ? <Text>Updating role…</Text> : null}
      {state.removeStatus === 'loading' ? <Text>Removing…</Text> : null}
      {state.error ? <Text accessibilityRole="alert" style={styles.error}>{state.error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, gap: 8 },
  title: { fontSize: 22, fontWeight: '700' },
  name: { fontSize: 18, fontWeight: '600' },
  email: { fontSize: 14, color: '#555' },
  section: { marginTop: 12, fontSize: 16, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  error: { color: '#c0392b' },
});

export default FamilyMemberDetailScreen;
