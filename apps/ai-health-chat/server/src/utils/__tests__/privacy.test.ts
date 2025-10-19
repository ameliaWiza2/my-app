import { redactHealthData, buildHealthContextPrompt, sanitizeUserMessage } from '../privacy';
import { HealthContext } from '../../types';

describe('Privacy Utils', () => {
  describe('redactHealthData', () => {
    it('should redact sensitive health data', () => {
      const healthData: HealthContext = {
        weight: 70,
        height: 175,
        bloodPressure: '120/80',
        heartRate: 75,
        bloodType: 'O+',
        allergies: ['peanuts', 'shellfish'],
        medications: ['aspirin'],
        conditions: ['hypertension'],
        pregnancyStage: 'second trimester',
        lastCheckup: new Date(),
      };

      const redacted = redactHealthData(healthData);

      expect(redacted.hasWeight).toBe(true);
      expect(redacted.hasHeight).toBe(true);
      expect(redacted.heartRateRange).toBe('normal');
      expect(redacted.allergyCount).toBe(2);
      expect(redacted.medicationCount).toBe(1);
      expect(redacted.conditionCount).toBe(1);
      expect(redacted.pregnancyStage).toBe('second trimester');
      expect(redacted.hasRecentCheckup).toBe(true);
    });

    it('should categorize heart rate correctly', () => {
      const lowHeartRate = redactHealthData({
        heartRate: 55,
        allergies: [],
        medications: [],
        conditions: [],
      });
      expect(lowHeartRate.heartRateRange).toBe('below-normal');

      const highHeartRate = redactHealthData({
        heartRate: 105,
        allergies: [],
        medications: [],
        conditions: [],
      });
      expect(highHeartRate.heartRateRange).toBe('above-normal');
    });

    it('should handle empty health data', () => {
      const emptyData: HealthContext = {
        allergies: [],
        medications: [],
        conditions: [],
      };

      const redacted = redactHealthData(emptyData);

      expect(redacted.hasAllergies).toBe(false);
      expect(redacted.hasMedications).toBe(false);
      expect(redacted.hasConditions).toBe(false);
    });
  });

  describe('buildHealthContextPrompt', () => {
    it('should build context prompt from redacted data', () => {
      const redacted = {
        hasWeight: true,
        hasHeight: true,
        hasBloodPressure: true,
        heartRateRange: 'normal' as const,
        hasAllergies: true,
        allergyCount: 2,
        hasMedications: true,
        medicationCount: 1,
        hasConditions: true,
        conditionCount: 1,
        pregnancyStage: 'second trimester',
        hasRecentCheckup: true,
      };

      const prompt = buildHealthContextPrompt(redacted);

      expect(prompt).toContain('second trimester');
      expect(prompt).toContain('Heart rate is normal');
      expect(prompt).toContain('1 known health condition');
      expect(prompt).toContain('1 medication');
      expect(prompt).toContain('2 known allergy');
    });

    it('should return empty string for minimal data', () => {
      const redacted = {
        hasWeight: false,
        hasHeight: false,
        hasBloodPressure: false,
        hasAllergies: false,
        allergyCount: 0,
        hasMedications: false,
        medicationCount: 0,
        hasConditions: false,
        conditionCount: 0,
        hasRecentCheckup: false,
      };

      const prompt = buildHealthContextPrompt(redacted);
      expect(prompt).toBe('');
    });
  });

  describe('sanitizeUserMessage', () => {
    it('should redact SSN patterns', () => {
      const message = 'My SSN is 123-45-6789';
      const sanitized = sanitizeUserMessage(message);
      expect(sanitized).toBe('My SSN is [REDACTED]');
    });

    it('should redact email addresses', () => {
      const message = 'Contact me at john.doe@example.com';
      const sanitized = sanitizeUserMessage(message);
      expect(sanitized).toBe('Contact me at [REDACTED]');
    });

    it('should redact phone numbers', () => {
      const message = 'Call me at 555-123-4567';
      const sanitized = sanitizeUserMessage(message);
      expect(sanitized).toBe('Call me at [REDACTED]');
    });

    it('should not redact normal text', () => {
      const message = 'I have a headache and feel tired';
      const sanitized = sanitizeUserMessage(message);
      expect(sanitized).toBe(message);
    });
  });
});
