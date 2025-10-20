import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WeightEntry, BloodPressureEntry, FetalMovementEntry } from '../../services/pregnancy/health';

export const WeightChart: React.FC<{ data: WeightEntry[] }>
  = ({ data }) => {
  if (!data.length) return <Text accessibilityLabel="No weight data">No weight data</Text>;
  // Normalize weights for simple bar heights
  const values = data.map(d => d.kg);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);

  return (
    <View accessibilityLabel="Weight chart" style={styles.chart}>
      {data.slice(-10).map((d, idx) => {
        const h = 20 + ((d.kg - min) / range) * 60; // 20..80 px
        return <View key={d.id || idx} style={[styles.bar, { height: h }]} />;
      })}
    </View>
  );
};

export const BloodPressureChart: React.FC<{ data: BloodPressureEntry[] }>
  = ({ data }) => {
  if (!data.length) return <Text accessibilityLabel="No blood pressure data">No blood pressure data</Text>;
  const values = data.map(d => (d.systolic + d.diastolic) / 2);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);

  return (
    <View accessibilityLabel="Blood pressure chart" style={styles.chart}>
      {data.slice(-10).map((d, idx) => {
        const avg = (d.systolic + d.diastolic) / 2;
        const h = 20 + ((avg - min) / range) * 60;
        return <View key={d.id || idx} style={[styles.bar, styles.bpBar, { height: h }]} />;
      })}
    </View>
  );
};

export const FetalMovementChart: React.FC<{ data: FetalMovementEntry[] }>
  = ({ data }) => {
  if (!data.length) return <Text accessibilityLabel="No fetal movement data">No fetal movement data</Text>;
  const values = data.map(d => d.kicks);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);

  return (
    <View accessibilityLabel="Fetal movement chart" style={styles.chart}>
      {data.slice(-10).map((d, idx) => {
        const h = 20 + ((d.kicks - min) / range) * 60;
        return <View key={d.id || idx} style={[styles.bar, styles.fmBar, { height: h }]} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    paddingVertical: 8,
    minHeight: 100,
  },
  bar: {
    width: 12,
    backgroundColor: '#4C9AFF',
    borderRadius: 4,
  },
  bpBar: {
    backgroundColor: '#FF6B6B',
  },
  fmBar: {
    backgroundColor: '#6BCB77',
  },
});
