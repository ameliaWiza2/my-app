import React, { useState, useEffect } from 'react';
import { ConversationList } from './components/ConversationList';
import { ChatWindow } from './components/ChatWindow';
import { Pagination } from './components/Pagination';
import { useConversations } from './hooks/useConversations';
import { getConversation, createConversation } from './services/api';
import { Conversation } from './types';

const DEMO_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

function App() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const {
    conversations,
    loading,
    error,
    page,
    totalPages,
    goToPage,
    refresh,
    deleteConversation: handleDelete,
  } = useConversations(DEMO_USER_ID, 20);

  const handleSelectConversation = async (id: string) => {
    setLoadingConversation(true);
    try {
      const conversation = await getConversation(id, DEMO_USER_ID);
      setSelectedConversation(conversation);
    } catch (err) {
      console.error('Failed to load conversation:', err);
    } finally {
      setLoadingConversation(false);
    }
  };

  const handleNewConversation = async () => {
    const title = prompt('Enter a title for the new conversation:');
    if (!title) return;

    try {
      const newConversation = await createConversation(DEMO_USER_ID, title);
      await refresh();
      setSelectedConversation(newConversation);
    } catch (err) {
      console.error('Failed to create conversation:', err);
      alert('Failed to create conversation');
    }
  };

  const handleMessageSent = async () => {
    if (selectedConversation) {
      const updated = await getConversation(selectedConversation.id, DEMO_USER_ID);
      setSelectedConversation(updated);
      await refresh();
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await handleDelete(id);
      if (selectedConversation?.id === id) {
        setSelectedConversation(null);
      }
    } catch (err) {
      alert('Failed to delete conversation');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div
        style={{
          width: '320px',
          borderRight: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
        }}
      >
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid #e0e0e0',
            backgroundColor: '#f9f9f9',
          }}
        >
          <h1 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#333' }}>
            AI Health Chat
          </h1>
          <button
            onClick={handleNewConversation}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#007bff',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            + New Conversation
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {error && (
            <div style={{ padding: '16px', color: '#dc3545' }}>
              {error}
            </div>
          )}
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversation?.id}
            onSelect={handleSelectConversation}
            onDelete={handleDeleteConversation}
            loading={loading}
          />
        </div>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={goToPage} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f9f9f9' }}>
        {loadingConversation ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
            }}
          >
            Loading conversation...
          </div>
        ) : selectedConversation ? (
          <>
            <div
              style={{
                padding: '16px',
                borderBottom: '1px solid #e0e0e0',
                backgroundColor: '#ffffff',
              }}
            >
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>
                {selectedConversation.title}
              </h2>
              {selectedConversation.familyMember && (
                <p style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                  For: {selectedConversation.familyMember.name} (
                  {selectedConversation.familyMember.relationship})
                </p>
              )}
            </div>
            <ChatWindow
              conversationId={selectedConversation.id}
              userId={DEMO_USER_ID}
              messages={selectedConversation.messages}
              onMessageSent={handleMessageSent}
            />
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
              padding: '32px',
            }}
          >
            <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#333' }}>
              Welcome to AI Health Chat
            </h2>
            <p style={{ textAlign: 'center', maxWidth: '500px', lineHeight: '1.6' }}>
              Start a new conversation or select an existing one to begin chatting with our AI
              health assistant. Get personalized health guidance based on your health data while
              maintaining your privacy.
            </p>
            <button
              onClick={handleNewConversation}
              style={{
                marginTop: '24px',
                padding: '12px 24px',
                backgroundColor: '#007bff',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Start Your First Conversation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
