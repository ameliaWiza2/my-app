export type UUID = string;

export type WeightEntry = {
  id: UUID;
  date: string; // ISO date-time
  kg: number;
  note?: string | null;
  pending?: boolean; // offline pending sync
};

export type BloodPressureEntry = {
  id: UUID;
  date: string; // ISO date-time
  systolic: number;
  diastolic: number;
  note?: string | null;
  pending?: boolean;
};

export type FetalMovementEntry = {
  id: UUID;
  date: string; // ISO date-time
  kicks: number; // number of movements in a session or per hour
  note?: string | null;
  pending?: boolean;
};

export type NoteEntry = {
  id: UUID;
  date: string; // ISO date-time
  text: string;
  pending?: boolean;
};

export type HealthMetrics = {
  weight: WeightEntry[];
  bloodPressure: BloodPressureEntry[];
  fetalMovement: FetalMovementEntry[];
  notes: NoteEntry[];
};

export const emptyMetrics = (): HealthMetrics => ({
  weight: [],
  bloodPressure: [],
  fetalMovement: [],
  notes: [],
});

export const formatWeight = (kg: number, unit: 'kg' | 'lb' = 'kg'): string => {
  if (unit === 'kg') return `${kg.toFixed(1)} kg`;
  const lb = kg * 2.20462;
  return `${lb.toFixed(1)} lb`;
};

export const formatBloodPressure = (systolic: number, diastolic: number): string => {
  return `${Math.round(systolic)}/${Math.round(diastolic)} mmHg`;
};

export const formatFetalMovement = (kicks: number): string => {
  return `${kicks} kicks`;
};

export const isValidISODate = (value: string): boolean => {
  const d = new Date(value);
  return !isNaN(d.getTime());
};

export const sortByDateAsc = <T extends { date: string }>(arr: T[]): T[] => {
  return [...arr].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const sortByDateDesc = <T extends { date: string }>(arr: T[]): T[] => {
  return [...arr].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
