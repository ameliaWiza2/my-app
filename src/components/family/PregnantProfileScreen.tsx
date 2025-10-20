import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PregnancyService, PregnancyRecord } from '../../services/pregnancy/PregnancyService';
import { PregnancyTimeline } from '../PregnancyTimeline';

export const PregnantProfileScreen: React.FC = () => {
  const [record, setRecord] = useState<PregnancyRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const rec = await PregnancyService.getPregnancy();
        if (mounted) setRecord(rec);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load pregnancy');
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pregnancy profile</Text>
      {loading ? <Text>Loading…</Text> : null}
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      {!record ? <Text>No pregnancy record</Text> : (
        <>
          <Text>EDD Source: {record.eddSource}</Text>
          <Text>EDD: {record.edd ?? 'N/A'}</Text>
          <Text>Last updated: {record.lastUpdatedAt ?? 'N/A'}</Text>
          <View style={{ marginTop: 12 }}>
            <PregnancyTimeline data={{ lmpDate: record.lmpDate ?? null, manualEDD: record.manualEDD ?? null }} />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, gap: 8 },
  title: { fontSize: 22, fontWeight: '700' },
  error: { color: '#c0392b' },
});

export default PregnantProfileScreen;
