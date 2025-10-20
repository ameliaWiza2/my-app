import { HealthService } from '../HealthService';

describe('Health mappers', () => {
  it('parses weight samples and converts to kg', () => {
    const input = [
      { startDate: '2025-01-01T00:00:00Z', endDate: '2025-01-01T00:05:00Z', value: 150, unit: 'lb' },
      { startDate: '2025-01-02T00:00:00Z', endDate: '2025-01-02T00:05:00Z', value: 70, unit: 'kg' },
    ];

    const out = HealthService.__debug.parseWeightSamples(input as any);

    expect(out[0].type).toBe('weight');
    expect(out[0].unit).toBe('kg');
    expect(out[0].value).toBeCloseTo(68.0389, 3);

    expect(out[1].value).toBe(70);
  });

  it('parses blood pressure samples', () => {
    const input = [
      { startDate: '2025-02-01T00:00:00Z', endDate: '2025-02-01T00:01:00Z', systolic: 120, diastolic: 80 },
    ];

    const out = HealthService.__debug.parseBloodPressureSamples(input as any);

    expect(out[0]).toEqual(
      expect.objectContaining({ type: 'bloodPressure', systolic: 120, diastolic: 80, unit: 'mmHg' })
    );
  });

  it('parses step samples', () => {
    const input = [
      { startDate: '2025-03-01T00:00:00Z', endDate: '2025-03-01T01:00:00Z', value: 1234 },
      { startDate: '2025-03-02T00:00:00Z', endDate: '2025-03-02T01:00:00Z', value: -50 }, // clamps to 0
    ];

    const out = HealthService.__debug.parseStepSamples(input as any);

    expect(out[0]).toEqual(expect.objectContaining({ type: 'steps', steps: 1234, unit: 'count' }));
    expect(out[1].steps).toBe(0);
  });
});
