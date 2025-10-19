/**
 * Date utilities for pregnancy calculations (timezone-safe, UTC-based).
 * All dates are serialized as YYYY-MM-DD in UTC.
 */

export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

export const toYMD = (date: Date): string => {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
    .toISOString()
    .slice(0, 10);
};

export const parseYMD = (ymd: string): Date | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return null;
  const [y, m, d] = ymd.split('-').map(n => parseInt(n, 10));
  const dt = new Date(Date.UTC(y, m - 1, d));
  // Validate the date components (e.g., catch 2024-02-31)
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) {
    return null;
  }
  return dt;
};

export const addDaysUTC = (date: Date, days: number): Date => {
  const msPerDay = 24 * 60 * 60 * 1000;
  return new Date(date.getTime() + days * msPerDay);
};

export const calculateEDDFromLMP = (lmpYMD: string): string | null => {
  const lmp = parseYMD(lmpYMD);
  if (!lmp) return null;
  const edd = addDaysUTC(lmp, 280);
  return toYMD(edd);
};

export const todayUTC = (): Date => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};

export const isFuture = (ymd: string): boolean => {
  const date = parseYMD(ymd);
  if (!date) return false;
  const today = todayUTC();
  return date.getTime() > today.getTime();
};

export const weeksToDays = (weeks: number) => weeks * 7;

export const validateLMPandEDD = (
  lmpYMD: string | null,
  eddYMD: string | null,
  options?: {minWeeksFromToday?: number; maxWeeksFromToday?: number}
): ValidationResult => {
  const errors: string[] = [];
  const minWeeks = options?.minWeeksFromToday ?? 20;
  const maxWeeks = options?.maxWeeksFromToday ?? 44;
  const minDeltaDays = weeksToDays(minWeeks);
  const maxDeltaDays = weeksToDays(maxWeeks);

  const today = todayUTC();

  if (lmpYMD) {
    if (!parseYMD(lmpYMD)) {
      errors.push('Invalid LMP date format. Use YYYY-MM-DD.');
    } else if (isFuture(lmpYMD)) {
      errors.push('LMP date cannot be in the future.');
    }
  }

  if (eddYMD) {
    const edd = parseYMD(eddYMD);
    if (!edd) {
      errors.push('Invalid EDD date format. Use YYYY-MM-DD.');
    } else {
      const deltaDays = Math.round((edd.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
      if (deltaDays < minDeltaDays || deltaDays > maxDeltaDays) {
        errors.push(`EDD must be within ${minWeeks}-${maxWeeks} weeks from today.`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export const deriveEDD = (
  lmpYMD: string | null,
  eddYMDManualOverride: string | null
): {edd: string | null; source: 'calculated' | 'manual' | null} => {
  if (eddYMDManualOverride) {
    return {edd: eddYMDManualOverride, source: 'manual'};
  }
  if (lmpYMD) {
    const calc = calculateEDDFromLMP(lmpYMD);
    return {edd: calc, source: calc ? 'calculated' : null};
  }
  return {edd: null, source: null};
};
