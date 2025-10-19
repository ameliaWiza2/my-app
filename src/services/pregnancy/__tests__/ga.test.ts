import {addDays, calculateGestationalAge, chooseEDD, computeEDDFromLMP, parseISODate, toDateOnly} from '../ga';

describe('Gestational age service', () => {
  it('prefers LMP-derived EDD over manual', () => {
    const lmp = '2025-01-01';
    const manual = '2025-10-10';
    const {edd, source} = chooseEDD({lmpDate: lmp, manualEDD: manual});
    expect(source).toBe('lmp');
    expect(edd?.toISOString().slice(0, 10)).toBe(addDays(new Date(lmp), 280).toISOString().slice(0, 10));
  });

  it('falls back to manual EDD when LMP missing', () => {
    const manual = '2025-10-10';
    const {edd, source} = chooseEDD({manualEDD: manual});
    expect(source).toBe('manual');
    expect(edd?.toISOString().slice(0, 10)).toBe(new Date(manual).toISOString().slice(0, 10));
  });

  it('calculates GA correctly from LMP', () => {
    const lmp = '2025-01-01';
    const today = new Date('2025-02-12T15:23:00.000Z');
    const calc = calculateGestationalAge(today, {lmpDate: lmp});
    // From Jan 1 to Feb 12 inclusive difference in days by date-only
    const expectedDays = Math.max(
      Math.round((toDateOnly(today).getTime() - toDateOnly(new Date(lmp)).getTime()) / (24 * 60 * 60 * 1000)),
      0,
    );
    expect(calc.gaDays).toBe(expectedDays);
    expect(calc.gaWeeks).toBe(Math.floor(expectedDays / 7));
    expect(calc.gaRemainingDays).toBe(expectedDays % 7);
  });

  it('calculates GA from manual EDD when LMP missing', () => {
    const manual = '2025-10-10';
    const today = new Date('2025-09-10T02:00:00.000Z');
    const calc = calculateGestationalAge(today, {manualEDD: manual});
    const daysToDue = Math.round((toDateOnly(new Date(manual)).getTime() - toDateOnly(today).getTime()) / (24 * 60 * 60 * 1000));
    const gaDays = 280 - daysToDue;
    expect(calc.gaDays).toBe(gaDays);
  });

  it('handles timezone boundaries without off-by-one errors', () => {
    const lmp = '2025-01-01';
    // Date near midnight in a timezone could cause issues if not normalized
    const lateNight = new Date('2025-01-08T23:59:59.000Z');
    const earlyMorning = new Date('2025-01-09T00:01:00.000Z');
    const calc1 = calculateGestationalAge(lateNight, {lmpDate: lmp});
    const calc2 = calculateGestationalAge(earlyMorning, {lmpDate: lmp});

    // Both should be around 1 week gestation, difference at most 1 day step across date change
    expect(calc2.gaDays! - calc1.gaDays!).toBeGreaterThanOrEqual(0);
    expect(calc2.gaDays! - calc1.gaDays!).toBeLessThanOrEqual(1);
  });

  it('updates GA when EDD/LMP changes', () => {
    const today = new Date('2025-05-01T12:00:00.000Z');
    const initial = calculateGestationalAge(today, {manualEDD: '2025-12-01'});
    const next = calculateGestationalAge(today, {lmpDate: '2025-04-01'}); // now use LMP which should take precedence

    expect(next.source).toBe('lmp');
    // Edd derived from LMP April 1 => Jan 6 2026 approx
    const expectedEDD = computeEDDFromLMP(new Date('2025-04-01'));
    expect(next.edd?.toISOString().slice(0, 10)).toBe(expectedEDD.toISOString().slice(0, 10));
    // GA now 30 days
    expect(next.gaDays).toBe(30);
    expect(initial.gaDays).not.toBe(next.gaDays);
  });
});
