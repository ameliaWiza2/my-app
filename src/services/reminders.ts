import { Platform } from 'react-native';

export type Reminder = {
  id?: string;
  when: Date;
  title: string;
  message: string;
  repeatInterval?: 'none' | 'day' | 'week';
};

export interface NotificationAdapter {
  schedule(reminder: Reminder): Promise<void>;
}

class InMemoryAdapter implements NotificationAdapter {
  scheduled: Reminder[] = [];
  async schedule(reminder: Reminder): Promise<void> {
    this.scheduled.push(reminder);
  }
}

export const InMemoryNotifications = new InMemoryAdapter();

export const computeZonedDate = (date: Date, time: string, timeZone: string): Date => {
  // time format HH:mm
  const [hStr, mStr] = time.split(':');
  const target = new Date(date);
  if (timeZone === 'UTC') {
    // If UTC is requested, set UTC hours directly to avoid environment-specific parsing
    target.setUTCHours(parseInt(hStr, 10), parseInt(mStr, 10), 0, 0);
    return target;
  }
  target.setHours(parseInt(hStr, 10), parseInt(mStr, 10), 0, 0);
  // Intl conversion: build a string representation in the target timezone, then parse
  const parts = new Date(target).toLocaleString('en-US', { timeZone });
  return new Date(parts);
};

export const scheduleMedicationReminder = async (
  adapter: NotificationAdapter,
  {
    startDate,
    time = '09:00',
    timeZone = 'UTC',
    title = 'Medication Reminder',
    message = 'Time to take your medication',
    repeatInterval = 'day' as Reminder['repeatInterval'],
  }: {
    startDate: Date;
    time?: string; // HH:mm
    timeZone?: string;
    title?: string;
    message?: string;
    repeatInterval?: Reminder['repeatInterval'];
  }
) => {
  const when = computeZonedDate(startDate, time, timeZone);
  await adapter.schedule({ when, title, message, repeatInterval });
};

export const schedulePrenatalCheckups = async (
  adapter: NotificationAdapter,
  {
    lmpDate,
    timeZone = 'UTC',
  }: {
    lmpDate: Date; // last menstrual period
    timeZone?: string;
  }
) => {
  // Simplified recommended weeks for prenatal visits
  const weeks = [12, 16, 20, 24, 28, 30, 32, 34, 36, 37, 38, 39, 40];
  for (const w of weeks) {
    const when = new Date(lmpDate);
    when.setDate(when.getDate() + w * 7);
    const local = computeZonedDate(when, '09:00', timeZone);
    await adapter.schedule({
      when: local,
      title: `Prenatal Checkup (Week ${w})`,
      message: 'Remember your prenatal appointment',
      repeatInterval: 'none',
    });
  }
};

export const getDefaultAdapter = (): NotificationAdapter => {
  // Placeholder for integration with native modules
  // If a real notification library is available, integrate here
  if (Platform.OS === 'ios') {
    // Could integrate PushNotificationIOS
    return InMemoryNotifications;
  }
  return InMemoryNotifications;
};
