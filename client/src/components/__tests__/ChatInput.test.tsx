import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatInput } from '../ChatInput';

describe('ChatInput', () => {
  it('renders input and send button', () => {
    const onSend = jest.fn();
    const onToggle = jest.fn();
    
    render(
      <ChatInput
        onSend={onSend}
        includeHealthContext={true}
        onToggleHealthContext={onToggle}
      />
    );

    expect(screen.getByPlaceholderText(/Type your health question/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('calls onSend when send button is clicked', () => {
    const onSend = jest.fn();
    const onToggle = jest.fn();

    render(
      <ChatInput
        onSend={onSend}
        includeHealthContext={true}
        onToggleHealthContext={onToggle}
      />
    );

    const input = screen.getByPlaceholderText(/Type your health question/i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    expect(onSend).toHaveBeenCalledWith('Test message', true);
  });

  it('disables send button when input is empty', () => {
    const onSend = jest.fn();
    const onToggle = jest.fn();

    render(
      <ChatInput
        onSend={onSend}
        includeHealthContext={true}
        onToggleHealthContext={onToggle}
      />
    );

    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).toBeDisabled();
  });

  it('toggles health context checkbox', () => {
    const onSend = jest.fn();
    const onToggle = jest.fn();

    render(
      <ChatInput
        onSend={onSend}
        includeHealthContext={false}
        onToggleHealthContext={onToggle}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('disables input when disabled prop is true', () => {
    const onSend = jest.fn();
    const onToggle = jest.fn();

    render(
      <ChatInput
        onSend={onSend}
        disabled={true}
        includeHealthContext={true}
        onToggleHealthContext={onToggle}
      />
    );

    const input = screen.getByPlaceholderText(/Type your health question/i);
    expect(input).toBeDisabled();
  });
});
