import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PregnancyTimeline } from '../PregnancyTimeline';
import { PregnancyData, calculateGestationalAge } from '../../services/pregnancy/ga';
import { HealthMetrics, emptyMetrics } from '../../services/pregnancy/health';
import HealthMetricsServiceClass, { HealthMetricsService } from '../../services/pregnancy/HealthMetricsService';
import { WeightChart, BloodPressureChart, FetalMovementChart } from './Charts';
import { WeightForm } from './forms/WeightForm';
import { BPForm } from './forms/BPForm';
import { FetalMovementForm } from './forms/FetalMovementForm';
import { NoteForm } from './forms/NoteForm';
import { getInsightForWeek } from '../../services/pregnancy/insights';

export type PregnancyDashboardProps = {
  data: PregnancyData;
  service?: HealthMetricsService;
};

export const PregnancyDashboard: React.FC<PregnancyDashboardProps> = ({ data, service }) => {
  const [metrics, setMetrics] = useState<HealthMetrics>(emptyMetrics());
  const svc = useMemo(() => service ?? HealthMetricsServiceClass, [service]);

  const calc = useMemo(() => calculateGestationalAge(new Date(), data), [data]);
  const insight = getInsightForWeek(calc.gaWeeks ?? 0);

  useEffect(() => {
    let mounted = true;
    svc.list().then(m => { if (mounted) setMetrics(m); }).catch(() => void 0);
    return () => { mounted = false; };
  }, [svc]);

  const reload = async () => {
    const m = await svc.getCachedMetrics();
    setMetrics(m);
  };

  return (
    <View accessibilityLabel="Pregnancy dashboard" style={styles.container}>
      <PregnancyTimeline data={data} />

      <Text style={styles.sectionHeader}>Baby development</Text>
      <Text accessibilityLabel="Baby development insight" style={styles.insight}>{insight.title}: {insight.description}</Text>

      <Text style={styles.sectionHeader}>Weight</Text>
      <WeightChart data={metrics.weight} />
      <WeightForm service={svc} onSaved={reload} />

      <Text style={styles.sectionHeader}>Blood Pressure</Text>
      <BloodPressureChart data={metrics.bloodPressure} />
      <BPForm service={svc} onSaved={reload} />

      <Text style={styles.sectionHeader}>Fetal movement</Text>
      <FetalMovementChart data={metrics.fetalMovement} />
      <FetalMovementForm service={svc} onSaved={reload} />

      <Text style={styles.sectionHeader}>Notes</Text>
      <NoteForm service={svc} onSaved={reload} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12 },
  sectionHeader: { marginTop: 16, marginBottom: 8, fontWeight: '700' },
  insight: { color: '#333' },
});

export default PregnancyDashboard;
