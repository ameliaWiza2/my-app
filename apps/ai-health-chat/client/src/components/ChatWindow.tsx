import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useChat } from '../hooks/useChat';

interface ChatWindowProps {
  conversationId: string;
  userId: string;
  messages: Message[];
  onMessageSent: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversationId,
  userId,
  messages: initialMessages,
  onMessageSent,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [includeHealthContext, setIncludeHealthContext] = useState(true);
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage, sending, error } = useChat(conversationId, userId);

  useEffect(() => {
    setMessages(initialMessages);
    setStreamingMessage('');
  }, [initialMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  const handleSend = async (content: string, includeContext: boolean) => {
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content,
      usedHealthData: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setStreamingMessage('');

    try {
      await sendMessage(content, includeContext, (chunk) => {
        setStreamingMessage((prev) => prev + chunk);
      });

      onMessageSent();
      setStreamingMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          backgroundColor: '#f9f9f9',
        }}
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {streamingMessage && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                color: '#333333',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                wordWrap: 'break-word',
              }}
            >
              <div style={{ whiteSpace: 'pre-wrap' }}>{streamingMessage}</div>
            </div>
          </div>
        )}
        {sending && !streamingMessage && (
          <div style={{ textAlign: 'center', color: '#666', padding: '16px' }}>
            Thinking...
          </div>
        )}
        {error && (
          <div
            style={{
              padding: '12px',
              backgroundColor: '#fee',
              color: '#c33',
              borderRadius: '8px',
              marginBottom: '16px',
            }}
          >
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput
        onSend={handleSend}
        disabled={sending}
        includeHealthContext={includeHealthContext}
        onToggleHealthContext={setIncludeHealthContext}
      />
    </div>
  );
};
