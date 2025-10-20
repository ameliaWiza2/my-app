export type PregnancySource = 'lmp' | 'manual' | 'unknown';

export type PregnancyData = {
  lmpDate?: string | null;
  manualEDD?: string | null;
};

export type CalculatedPregnancy = {
  edd: Date | null;
  source: PregnancySource;
  gaDays: number | null; // total days pregnant (0..280 typically)
  gaWeeks: number | null;
  gaRemainingDays: number | null; // days remaining in the current week
  daysUntilEDD: number | null;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const toDateOnly = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const parseISODate = (value?: string | null): Date | null => {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return toDateOnly(d);
};

export const addDays = (date: Date, days: number): Date => {
  // operate on date-only to avoid DST/timezone artifacts
  const base = toDateOnly(date).getTime();
  return new Date(base + days * MS_PER_DAY);
};

export const daysBetween = (start: Date, end: Date): number => {
  const a = toDateOnly(start).getTime();
  const b = toDateOnly(end).getTime();
  return Math.round((b - a) / MS_PER_DAY);
};

export const computeEDDFromLMP = (lmp: Date): Date => addDays(lmp, 280);

export const chooseEDD = (data: PregnancyData): { edd: Date | null; source: PregnancySource } => {
  const lmp = parseISODate(data.lmpDate ?? undefined);
  const manual = parseISODate(data.manualEDD ?? undefined);

  if (lmp) {
    return { edd: computeEDDFromLMP(lmp), source: 'lmp' };
  }
  if (manual) {
    return { edd: manual, source: 'manual' };
  }
  return { edd: null, source: 'unknown' };
};

export const calculateGestationalAge = (
  todayInput: Date,
  data: PregnancyData
): CalculatedPregnancy => {
  const today = toDateOnly(todayInput);
  const lmp = parseISODate(data.lmpDate ?? undefined);
  const { edd, source } = chooseEDD(data);

  if (!edd) {
    return {
      edd: null,
      source,
      gaDays: null,
      gaWeeks: null,
      gaRemainingDays: null,
      daysUntilEDD: null,
    };
  }

  const daysUntilEDD = Math.max(daysBetween(today, edd), 0) + (daysBetween(today, edd) < 0 ? daysBetween(today, edd) : 0);
  // If overdue, daysUntilEDD becomes negative; keep negative value for countdown semantics

  let gaDays: number;
  if (lmp) {
    gaDays = Math.max(daysBetween(lmp, today), 0);
  } else {
    const daysToDue = daysBetween(today, edd);
    gaDays = 280 - daysToDue;
  }

  const gaWeeks = Math.floor(gaDays / 7);
  const gaRemainingDays = gaDays % 7;

  return {
    edd,
    source,
    gaDays,
    gaWeeks,
    gaRemainingDays,
    daysUntilEDD: daysBetween(today, edd),
  };
};

export const formatWeeksDays = (weeks: number | null, days: number | null): string => {
  if (weeks === null || days === null) return 'Unknown';
  return `${weeks}w ${days}d`;
};
