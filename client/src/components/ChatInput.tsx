import React, { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string, includeHealthContext: boolean) => void;
  disabled?: boolean;
  includeHealthContext: boolean;
  onToggleHealthContext: (value: boolean) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled,
  includeHealthContext,
  onToggleHealthContext,
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim(), includeHealthContext);
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        padding: '16px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e0e0e0',
      }}
    >
      <div style={{ marginBottom: '8px' }}>
        <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#666' }}>
          <input
            type="checkbox"
            checked={includeHealthContext}
            onChange={(e) => onToggleHealthContext(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          Include health context in response
        </label>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your health question..."
          disabled={disabled}
          rows={3}
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            resize: 'none',
            fontFamily: 'inherit',
          }}
        />
        <button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          style={{
            padding: '12px 24px',
            backgroundColor: disabled || !message.trim() ? '#cccccc' : '#007bff',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: disabled || !message.trim() ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};
