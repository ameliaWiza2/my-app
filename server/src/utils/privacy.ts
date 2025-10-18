import { HealthContext, RedactedHealthContext } from '../types';

export function redactHealthData(healthData: HealthContext): RedactedHealthContext {
  const redacted: RedactedHealthContext = {
    hasWeight: !!healthData.weight,
    hasHeight: !!healthData.height,
    hasBloodPressure: !!healthData.bloodPressure,
    hasAllergies: healthData.allergies.length > 0,
    allergyCount: healthData.allergies.length,
    hasMedications: healthData.medications.length > 0,
    medicationCount: healthData.medications.length,
    hasConditions: healthData.conditions.length > 0,
    conditionCount: healthData.conditions.length,
    hasRecentCheckup: healthData.lastCheckup
      ? (new Date().getTime() - new Date(healthData.lastCheckup).getTime()) < 180 * 24 * 60 * 60 * 1000
      : false,
  };

  if (healthData.heartRate) {
    if (healthData.heartRate < 60) {
      redacted.heartRateRange = 'below-normal';
    } else if (healthData.heartRate > 100) {
      redacted.heartRateRange = 'above-normal';
    } else {
      redacted.heartRateRange = 'normal';
    }
  }

  if (healthData.pregnancyStage) {
    redacted.pregnancyStage = healthData.pregnancyStage;
  }

  return redacted;
}

export function buildHealthContextPrompt(redacted: RedactedHealthContext): string {
  const contextParts: string[] = [];

  if (redacted.pregnancyStage) {
    contextParts.push(`Patient is in ${redacted.pregnancyStage} of pregnancy`);
  }

  if (redacted.heartRateRange) {
    contextParts.push(`Heart rate is ${redacted.heartRateRange}`);
  }

  if (redacted.hasConditions && redacted.conditionCount > 0) {
    contextParts.push(`Patient has ${redacted.conditionCount} known health condition(s)`);
  }

  if (redacted.hasMedications && redacted.medicationCount > 0) {
    contextParts.push(`Patient is taking ${redacted.medicationCount} medication(s)`);
  }

  if (redacted.hasAllergies && redacted.allergyCount > 0) {
    contextParts.push(`Patient has ${redacted.allergyCount} known allergy/allergies`);
  }

  if (redacted.hasRecentCheckup) {
    contextParts.push('Patient had a recent checkup within the last 6 months');
  }

  if (contextParts.length === 0) {
    return '';
  }

  return `\n\nRelevant health context (privacy-redacted): ${contextParts.join('; ')}.`;
}

export function sanitizeUserMessage(message: string): string {
  const patterns = [
    /\b\d{3}-\d{2}-\d{4}\b/g,
    /\b\d{9}\b/g,
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    /\b\d{10,}\b/g,
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
  ];

  let sanitized = message;
  patterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  });

  return sanitized;
}
