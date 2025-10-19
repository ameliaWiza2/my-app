import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import App from '../App';
import {AuthService} from '@/services/authService';
import {FamilyService} from '@/services/familyService';

describe('Authentication and onboarding flow', () => {
  beforeEach(() => {
    AuthService.__dangerous__reset();
    FamilyService.__dangerous__reset();
    jest.clearAllMocks();
  });

  it('allows a user to sign up and create a family', async () => {
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
