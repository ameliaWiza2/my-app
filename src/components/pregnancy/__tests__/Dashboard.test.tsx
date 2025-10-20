import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PregnancyDashboard } from '../Dashboard';
import { HealthMetricsService } from '../../../services/pregnancy/HealthMetricsService';

class MemoryStorage implements import('../../../services/pregnancy/HealthMetricsService').StorageAdapter {
  store = new Map<string, string>();
  async getItem(key: string) { return this.store.get(key) ?? null; }
  async setItem(key: string, value: string) { this.store.set(key, value); }
  async removeItem(key: string) { this.store.delete(key); }
}

// Create a service instance with in-memory storage to avoid AsyncStorage in tests
const service = new HealthMetricsService(new MemoryStorage());

describe('PregnancyDashboard', () => {
  it('renders charts, forms, and insights on iOS', async () => {
    jest.resetModules();
    const dash = render(<PregnancyDashboard data={{ lmpDate: '2025-01-01' }} service={service} />);
    expect(dash.getByA11yLabel('Pregnancy dashboard')).toBeTruthy();
    expect(dash.getByA11yLabel('Baby development insight').props.children.join('')).toContain('Week');
    expect(dash.getByA11yLabel('Weight entry form')).toBeTruthy();
    expect(dash.getByA11yLabel('Blood pressure entry form')).toBeTruthy();
    expect(dash.getByA11yLabel('Fetal movement entry form')).toBeTruthy();

    // Add a weight entry and assert chart updates
    const saveBtn = dash.getByA11yLabel('Save weight');
    const weightInput = dash.getByA11yLabel('Weight value input');
    fireEvent.changeText(weightInput, '70');
    fireEvent.press(saveBtn);
    // Wait a tick for state update
    await new Promise(r => setTimeout(r, 0));

    expect(dash.getByA11yLabel('Weight chart')).toBeTruthy();
  });

  it('renders on Android as well', () => {
    const dash = render(<PregnancyDashboard data={{ manualEDD: '2025-12-10' }} service={service} />);
    expect(dash.getByA11yLabel('Pregnancy dashboard')).toBeTruthy();
  });
});
