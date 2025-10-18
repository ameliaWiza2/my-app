import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChatMessage } from '../ChatMessage';
import { Message } from '../../types';

describe('ChatMessage', () => {
  it('renders user message correctly', () => {
    const message: Message = {
      id: '1',
      role: 'user',
      content: 'Hello, I have a question',
      usedHealthData: false,
      createdAt: new Date().toISOString(),
    };

    render(<ChatMessage message={message} />);
    expect(screen.getByText('Hello, I have a question')).toBeInTheDocument();
  });

  it('renders assistant message correctly', () => {
    const message: Message = {
      id: '2',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      usedHealthData: false,
      createdAt: new Date().toISOString(),
    };

    render(<ChatMessage message={message} />);
    expect(screen.getByText('Hello! How can I help you today?')).toBeInTheDocument();
  });

  it('shows health data indicator when usedHealthData is true', () => {
    const message: Message = {
      id: '3',
      role: 'assistant',
      content: 'Based on your health data...',
      usedHealthData: true,
      createdAt: new Date().toISOString(),
    };

    render(<ChatMessage message={message} />);
    expect(screen.getByText(/Response includes your health context/i)).toBeInTheDocument();
  });

  it('does not show health data indicator for user messages', () => {
    const message: Message = {
      id: '4',
      role: 'user',
      content: 'What about my condition?',
      usedHealthData: true,
      createdAt: new Date().toISOString(),
    };

    render(<ChatMessage message={message} />);
    expect(screen.queryByText(/Response includes your health context/i)).not.toBeInTheDocument();
  });
});
