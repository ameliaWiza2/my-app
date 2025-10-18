import React from 'react';
import { render } from '@testing-library/react-native';
import App from './App';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

describe('App', () => {
  it('should render without crashing', () => {
    const { getByText } = render(<App />);
    expect(getByText('Mobile App')).toBeTruthy();
  });

  it('should display security feature', () => {
    const { getByText } = render(<App />);
    expect(getByText('Security First')).toBeTruthy();
  });

  it('should display testing feature', () => {
    const { getByText } = render(<App />);
    expect(getByText('Comprehensive Testing')).toBeTruthy();
  });

  it('should display internationalization feature', () => {
    const { getByText } = render(<App />);
    expect(getByText('Internationalization')).toBeTruthy();
  });

  it('should display accessibility feature', () => {
    const { getByText } = render(<App />);
    expect(getByText('Accessibility')).toBeTruthy();
  });

  it('should display privacy policy link', () => {
    const { getByText } = render(<App />);
    expect(getByText('Privacy Policy')).toBeTruthy();
  });

  it('should have proper accessibility labels', () => {
    const { getByLabelText } = render(<App />);
    expect(getByLabelText('Main screen content')).toBeTruthy();
    expect(getByLabelText('Mobile App')).toBeTruthy();
  });

  it('should have testID for E2E testing', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('app-container')).toBeTruthy();
  });
});
