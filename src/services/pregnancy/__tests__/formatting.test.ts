import { formatBloodPressure, formatFetalMovement, formatWeight } from '../health';

describe('Health metrics formatting', () => {
  it('formats weight in kg and lb', () => {
    expect(formatWeight(70)).toBe('70.0 kg');
    expect(formatWeight(70, 'lb')).toBe('154.3 lb');
  });

  it('formats blood pressure', () => {
    expect(formatBloodPressure(120, 80)).toBe('120/80 mmHg');
  });

  it('formats fetal movement', () => {
    expect(formatFetalMovement(12)).toBe('12 kicks');
  });
});
