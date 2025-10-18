import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={`chat-message ${isUser ? 'user-message' : 'assistant-message'}`}
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '16px',
      }}
    >
      <div
        style={{
          maxWidth: '70%',
          padding: '12px 16px',
          borderRadius: '12px',
          backgroundColor: isUser ? '#007bff' : '#ffffff',
          color: isUser ? '#ffffff' : '#333333',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          wordWrap: 'break-word',
        }}
      >
        <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
        {message.usedHealthData && !isUser && (
          <div
            style={{
              marginTop: '8px',
              fontSize: '12px',
              color: '#666666',
              fontStyle: 'italic',
            }}
          >
            ℹ️ Response includes your health context
          </div>
        )}
      </div>
    </div>
  );
};
