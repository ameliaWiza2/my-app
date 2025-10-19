import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./services/api');

describe('App', () => {
  it('renders welcome message when no conversation is selected', () => {
    render(<App />);
    expect(screen.getByText(/Welcome to AI Health Chat/i)).toBeInTheDocument();
  });

  it('renders new conversation button', () => {
    render(<App />);
    const buttons = screen.getAllByText(/New Conversation/i);
    expect(buttons.length).toBeGreaterThan(0);
  });
});
