import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {SettingsPregnancySection} from '../SettingsPregnancySection';
import {PregnancyService} from '../../services/pregnancy/PregnancyService';
import {NotificationsService} from '../../services/notifications';

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

describe('SettingsPregnancySection', () => {
  beforeEach(() => {
    NotificationsService.reset();
    // Reset failure mode
    ;(PregnancyService as any).shouldFail = false;
  });

  it('enforces permissions: non-pregnant roles cannot edit', () => {
    const {getByLabelText, getByText} = render(
      <SettingsPregnancySection role="Husband" initial={{lmpDate: '2025-01-01'}} />,
    );

    const lmpInput = getByLabelText('LMP input');
    const manualInput = getByLabelText('Manual EDD input');

    expect(lmpInput.props.editable).toBe(false);
    expect(manualInput.props.editable).toBe(false);

    const saveButton = getByText('Save');
    expect(saveButton.parent?.props.accessibilityState?.disabled || saveButton.parent?.props.disabled).toBeTruthy();
  });

  it('allows Pregnant role to edit and persists changes with notification on EDD change', async () => {
    const {getByLabelText, getByText} = render(
      <SettingsPregnancySection role="Pregnant" familyId="fam-1" initial={{manualEDD: '2025-12-01'}} />,
    );

    const lmpInput = getByLabelText('LMP input');

    // Change LMP to trigger source change to LMP and EDD change
    fireEvent.changeText(lmpInput, '2025-01-01');

    const saveButton = getByText('Save');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(NotificationsService.lastNotification).toBeTruthy();
      expect(NotificationsService.lastNotification?.type).toBe('EDD_CHANGED');
    });
  });

  it('rolls back on failure', async () => {
    // Make service fail
    PregnancyService.setFailureMode(true);

    const {getByLabelText, getByText} = render(
      <SettingsPregnancySection role="Pregnant" initial={{lmpDate: '2025-01-02'}} />,
    );

    const lmpInput = getByLabelText('LMP input');

    fireEvent.changeText(lmpInput, '2025-01-05');

    const saveButton = getByText('Save');
    fireEvent.press(saveButton);

    // After failure, input value should revert to initial value
    await waitFor(() => {
      expect(getByLabelText('LMP input').props.value).toBe('2025-01-02');
    });
  });
});
