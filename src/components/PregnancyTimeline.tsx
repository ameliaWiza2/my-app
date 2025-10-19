import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {PregnancyData, calculateGestationalAge, formatWeeksDays} from '../services/pregnancy/ga';

export type PregnancyTimelineProps = {
  data: PregnancyData;
  now?: Date; // for testing
};

export const PregnancyTimeline: React.FC<PregnancyTimelineProps> = ({data, now}) => {
  const calc = calculateGestationalAge(now ?? new Date(), data);
  const gaText = formatWeeksDays(calc.gaWeeks, calc.gaRemainingDays);
  const dueCount = calc.daysUntilEDD !== null ? `${calc.daysUntilEDD} days` : 'Unknown';
  const eddText = calc.edd ? new Date(calc.edd).toDateString() : 'Unknown';

  return (
    <View style={styles.container} accessibilityLabel="Pregnancy timeline">
      <Text style={styles.heading}>Gestational age</Text>
      <Text accessibilityLabel="Gestational age value" style={styles.ga}>{gaText}</Text>
      <Text style={styles.countdownLabel}>Countdown to EDD</Text>
      <Text accessibilityLabel="EDD countdown value" style={styles.countdown}>{dueCount}</Text>
      <Text style={styles.eddLabel}>EDD</Text>
      <Text accessibilityLabel="EDD value" style={styles.edd}>{eddText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  ga: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  countdownLabel: {
    marginTop: 8,
    color: '#666',
  },
  countdown: {
    fontSize: 18,
    fontWeight: '600',
  },
  eddLabel: {
    marginTop: 8,
    color: '#666',
  },
  edd: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default PregnancyTimeline;
