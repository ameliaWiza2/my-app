import { InMemoryNotifications, computeZonedDate, scheduleMedicationReminder, schedulePrenatalCheckups } from '../reminders';

describe('Reminder scheduling', () => {
  beforeEach(() => {
    InMemoryNotifications.scheduled = [];
  });

  it('computes UTC zoned date correctly', () => {
    const base = new Date('2025-01-01T00:00:00.000Z');
    const d = computeZonedDate(base, '09:30', 'UTC');
    expect(d.getUTCHours()).toBe(9);
    expect(d.getUTCMinutes()).toBe(30);
  });

  it('schedules a daily medication reminder', async () => {
    const base = new Date('2025-01-01T00:00:00.000Z');
    await scheduleMedicationReminder(InMemoryNotifications, { startDate: base, time: '09:00', timeZone: 'UTC' });
    expect(InMemoryNotifications.scheduled.length).toBe(1);
    expect(InMemoryNotifications.scheduled[0].title).toContain('Medication');
  });

  it('schedules prenatal checkups at key weeks', async () => {
    const lmp = new Date('2025-01-01T00:00:00.000Z');
    await schedulePrenatalCheckups(InMemoryNotifications, { lmpDate: lmp, timeZone: 'UTC' });
    expect(InMemoryNotifications.scheduled.length).toBeGreaterThan(5);
    expect(InMemoryNotifications.scheduled[0].title).toMatch(/Prenatal Checkup/);
  });
});
