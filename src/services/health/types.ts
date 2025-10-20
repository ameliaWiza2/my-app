export type HealthMetricType = 'weight' | 'bloodPressure' | 'steps';

export type WeightUnit = 'kg' | 'lb';
export type PressureUnit = 'mmHg';
export type CountUnit = 'count';

export type HealthMetricBase = {
  type: HealthMetricType;
  startDate: string; // ISO
  endDate: string;   // ISO
  source?: string | null;
  metadata?: Record<string, any> | null;
};

export type WeightMetric = HealthMetricBase & {
  type: 'weight';
  value: number; // normalized to kg
  unit: WeightUnit;
};

export type BloodPressureMetric = HealthMetricBase & {
  type: 'bloodPressure';
  systolic: number; // mmHg
  diastolic: number; // mmHg
  unit: PressureUnit;
};

export type ActivityMetric = HealthMetricBase & {
  type: 'steps';
  steps: number; // count
  unit: CountUnit;
};

export type HealthMetric = WeightMetric | BloodPressureMetric | ActivityMetric;

// Minimal raw sample shapes compatible with common RN health libs
export type RawQuantitySample = {
  startDate: string | Date;
  endDate: string | Date;
  value: number;
  unit?: string | null;
  metadata?: Record<string, any> | null;
  source?: string | null;
};

export type RawBloodPressureSample = {
  startDate: string | Date;
  endDate: string | Date;
  systolic: number;
  diastolic: number;
  metadata?: Record<string, any> | null;
  source?: string | null;
};

export type HealthPermissions = {
  read: boolean;
  writePregnancy: boolean;
};
