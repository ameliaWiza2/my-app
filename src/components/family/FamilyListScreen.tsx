import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import { useFamily } from '../../modules/family/state';
import FamilyRoleBadge from './FamilyRoleBadge';
import type { FamilyMember } from '../../services/family';

export const FamilyListScreen: React.FC<{ onSelectMember?: (member: FamilyMember) => void }>
= ({ onSelectMember }) => {
  const { state, invite } = useFamily();
  const [email, setEmail] = useState('');

  const renderItem = ({ item }: { item: FamilyMember }) => (
    <View style={styles.item} accessible accessibilityRole="button" accessibilityLabel={`Member ${item.name}`}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <FamilyRoleBadge role={item.role} />
      {onSelectMember ? (
        <Button title="View" onPress={() => onSelectMember(item)} />
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Family members</Text>
      {state.family ? <Text style={styles.subtitle}>{state.family.name}</Text> : null}

      <View style={styles.inviteRow}>
        <TextInput
          placeholder="Invite by email"
          value={email}
          onChangeText={setEmail}
          accessibilityLabel="Invite email"
          style={styles.input}
        />
        <Button
          title={state.inviteStatus === 'loading' ? 'Inviting…' : 'Invite'}
          onPress={() => invite(email)}
          disabled={!email || state.inviteStatus === 'loading'}
        />
      </View>

      {state.loading ? <Text>Loading…</Text> : null}
      {state.error ? <Text accessibilityRole="alert" style={styles.error}>{state.error}</Text> : null}

      <FlatList
        data={state.members}
        keyExtractor={m => m.id}
        renderItem={renderItem}
        accessibilityLabel="Family member list"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 14, color: '#555' },
  inviteRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6 },
  error: { color: '#c0392b' },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  name: { fontSize: 16, fontWeight: '600' },
  email: { fontSize: 12, color: '#555' },
});

export default FamilyListScreen;
