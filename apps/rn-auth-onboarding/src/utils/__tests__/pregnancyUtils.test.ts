import {addDaysUTC, calculateEDDFromLMP, deriveEDD, parseYMD, toYMD, validateLMPandEDD} from '../pregnancyUtils';

describe('pregnancyUtils', () => {
  it('calculates EDD as LMP + 280 days (Naegele’s rule)', () => {
    const lmp = '2024-01-01';
    const edd = calculateEDDFromLMP(lmp);
    expect(edd).toBe('2024-10-07'); // 280 days after Jan 1, 2024
  });

  it('handles leap years correctly', () => {
    const lmpLeap = '2024-02-29';
    const edd = calculateEDDFromLMP(lmpLeap);
    expect(edd).toBe('2024-12-05');
  });

  it('is timezone safe around DST transitions', () => {
    const lmp = '2019-03-10'; // US DST start
    const edd = calculateEDDFromLMP(lmp);
    expect(edd).toBe('2019-12-15');
  });

  it('validates that LMP cannot be in the future', () => {
    const today = toYMD(new Date());
    const future = addDaysUTC(parseYMD(today)!, 1);
    const result = validateLMPandEDD(toYMD(future), null);
    expect(result.valid).toBe(false);
    expect(result.errors.join(' ')).toMatch(/cannot be in the future/i);
  });

  it('validates EDD range 20–44 weeks from today', () => {
    const today = toYMD(new Date());
    const tooSoon = addDaysUTC(parseYMD(today)!, 7 * 10); // 10 weeks
    const tooLate = addDaysUTC(parseYMD(today)!, 7 * 50); // 50 weeks

    expect(validateLMPandEDD(null, toYMD(tooSoon)).valid).toBe(false);
    expect(validateLMPandEDD(null, toYMD(tooLate)).valid).toBe(false);
  });

  it('manual EDD override takes precedence', () => {
    const lmp = '2024-01-01';
    const manualEdd = '2024-10-10';
    const {edd, source} = deriveEDD(lmp, manualEdd);
    expect(edd).toBe(manualEdd);
    expect(source).toBe('manual');
  });
});
