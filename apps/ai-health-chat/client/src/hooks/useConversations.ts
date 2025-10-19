import { useState, useEffect, useCallback } from 'react';
import { ConversationSummary, PaginatedResponse } from '../types';
import { getConversations, deleteConversation } from '../services/api';

export function useConversations(userId: string, pageSize: number = 20) {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchConversations = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response: PaginatedResponse<ConversationSummary> = await getConversations(
        userId,
        page,
        pageSize
      );
      setConversations(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (err) {
      setError('Failed to load conversations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId, page, pageSize]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleDelete = async (conversationId: string) => {
    try {
      await deleteConversation(conversationId, userId);
      await fetchConversations();
    } catch (err) {
      console.error('Failed to delete conversation:', err);
      throw err;
    }
  };

  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return {
    conversations,
    loading,
    error,
    page,
    totalPages,
    total,
    nextPage,
    prevPage,
    goToPage,
    refresh: fetchConversations,
    deleteConversation: handleDelete,
  };
}
