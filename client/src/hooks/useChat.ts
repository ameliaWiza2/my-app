import { useState, useCallback } from 'react';
import { sendMessage, streamMessage } from '../services/api';

export function useChat(conversationId: string, userId: string) {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendChatMessage = useCallback(
    async (
      content: string,
      includeHealthContext: boolean = true,
      onChunk?: (chunk: string) => void
    ): Promise<string> => {
      setSending(true);
      setError(null);

      try {
        if (onChunk) {
          let fullResponse = '';
          for await (const chunk of streamMessage(conversationId, userId, {
            content,
            includeHealthContext,
          })) {
            if (!chunk.done && chunk.content) {
              fullResponse += chunk.content;
              onChunk(chunk.content);
            }
            if (chunk.error) {
              setError('Failed to get AI response');
            }
          }
          return fullResponse;
        } else {
          const response = await sendMessage(conversationId, userId, {
            content,
            includeHealthContext,
          });
          if (response.error) {
            setError('Failed to get AI response');
          }
          return response.content;
        }
      } catch (err) {
        const errorMessage = 'Failed to send message';
        setError(errorMessage);
        console.error(err);
        throw new Error(errorMessage);
      } finally {
        setSending(false);
      }
    },
    [conversationId, userId]
  );

  return {
    sendMessage: sendChatMessage,
    sending,
    error,
  };
}
