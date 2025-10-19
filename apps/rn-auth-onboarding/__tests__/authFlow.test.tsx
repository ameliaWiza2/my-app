import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import App from '../App';
import {AuthService} from '@/services/authService';
import {FamilyService} from '@/services/familyService';
import {addDaysUTC, parseYMD, toYMD} from '@/utils/pregnancyUtils';

describe('Authentication and onboarding flow', () => {
  beforeEach(() => {
    AuthService.__dangerous__reset();
    FamilyService.__dangerous__reset();
    jest.clearAllMocks();
  });

  it('allows a pregnant user to sign up, enter LMP/EDD, and create a family', async () => {
    const screen = render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Get started')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Get started'));

    await waitFor(() => {
      expect(screen.getByText('Create your account')).toBeTruthy();
    });

    fireEvent.changeText(screen.getByLabelText('Full name'), 'Test User');
    fireEvent.changeText(screen.getByLabelText('Email'), 'test@example.com');
    fireEvent.changeText(screen.getByLabelText('Password'), 'password123');
    fireEvent.changeText(
      screen.getByLabelText('Confirm password'),
      'password123'
    );

    fireEvent.press(screen.getByText('Create account'));

    await waitFor(() => {
      expect(screen.getByText('Tell us your role')).toBeTruthy();
    });

    fireEvent.press(screen.getByText("I'm pregnant"));

    await waitFor(() => {
      expect(screen.getByText('Pregnancy status')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Already pregnant'));

    await waitFor(() => {
      expect(screen.getByText('Last menstrual period (LMP)')).toBeTruthy();
    });

    // Choose an LMP such that the EDD is ~200 days from today (within 20-44 weeks)
    const today = new Date();
    const eddTarget = addDaysUTC(parseYMD(toYMD(today))!, 200);
    const lmpDate = addDaysUTC(eddTarget, -280);
    const lmpYMD = toYMD(lmpDate);
    const expectedEdd = toYMD(eddTarget);

    fireEvent.changeText(screen.getByLabelText('LMP date (YYYY-MM-DD)'), lmpYMD);

    await waitFor(() => {
      expect(screen.getByLabelText('Estimated due date preview').props.children).toBe(expectedEdd);
    });

    fireEvent.press(screen.getByText('Continue'));

    await waitFor(() => {
      expect(screen.getByText('Bring your family together')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Create a family'));

    await waitFor(() => {
      expect(screen.getByText('Name your family')).toBeTruthy();
    });

    fireEvent.changeText(screen.getByLabelText('Family name'), 'The Testers');
    fireEvent.press(screen.getByText('Create family'));

    await waitFor(() => {
      expect(screen.getByText(/Hello Test User/i)).toBeTruthy();
    });
  });
});
