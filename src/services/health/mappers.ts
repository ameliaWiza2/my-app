import { ActivityMetric, BloodPressureMetric, HealthMetric, RawBloodPressureSample, RawQuantitySample, WeightMetric } from './types';

const toISO = (d: string | Date): string => (d instanceof Date ? d.toISOString() : new Date(d).toISOString());

export const parseWeightSamples = (samples: RawQuantitySample[]): WeightMetric[] => {
  return samples.map((s) => {
    const unit = (s.unit || 'kg').toLowerCase();
    let valueKg = s.value;
    if (unit === 'lb' || unit === 'lbs' || unit === 'pound' || unit === 'pounds') {
      valueKg = s.value * 0.45359237;
    }
    return {
      type: 'weight',
      startDate: toISO(s.startDate),
      endDate: toISO(s.endDate),
      value: Number(valueKg.toFixed(3)),
      unit: 'kg',
      metadata: s.metadata ?? null,
      source: s.source ?? null,
    } as WeightMetric;
  });
};

export const parseBloodPressureSamples = (samples: RawBloodPressureSample[]): BloodPressureMetric[] => {
  return samples.map((s) => ({
    type: 'bloodPressure',
    startDate: toISO(s.startDate),
    endDate: toISO(s.endDate),
    systolic: s.systolic,
    diastolic: s.diastolic,
    unit: 'mmHg',
    metadata: s.metadata ?? null,
    source: s.source ?? null,
  }));
};

export const parseStepSamples = (samples: RawQuantitySample[]): ActivityMetric[] => {
  return samples.map((s) => ({
    type: 'steps',
    startDate: toISO(s.startDate),
    endDate: toISO(s.endDate),
    steps: Math.max(0, Math.round(s.value)),
    unit: 'count',
    metadata: s.metadata ?? null,
    source: s.source ?? null,
  }));
};

export type ParserMapInput = {
  weight?: RawQuantitySample[];
  bloodPressure?: RawBloodPressureSample[];
  steps?: RawQuantitySample[];
};

export const mapAll = (input: ParserMapInput): HealthMetric[] => {
  const out: HealthMetric[] = [];
  if (input.weight?.length) out.push(...parseWeightSamples(input.weight));
  if (input.bloodPressure?.length) out.push(...parseBloodPressureSamples(input.bloodPressure));
  if (input.steps?.length) out.push(...parseStepSamples(input.steps));
  return out.sort((a, b) => a.startDate.localeCompare(b.startDate));
};
