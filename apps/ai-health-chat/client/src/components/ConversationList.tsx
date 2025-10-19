import React from 'react';
import { ConversationSummary } from '../types';

interface ConversationListProps {
  conversations: ConversationSummary[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedId,
  onSelect,
  onDelete,
  loading,
}) => {
  if (loading) {
    return (
      <div style={{ padding: '16px', textAlign: 'center', color: '#666' }}>
        Loading conversations...
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div style={{ padding: '16px', textAlign: 'center', color: '#666' }}>
        No conversations yet. Start a new one!
      </div>
    );
  }

  return (
    <div style={{ overflowY: 'auto' }}>
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          onClick={() => onSelect(conversation.id)}
          style={{
            padding: '16px',
            borderBottom: '1px solid #e0e0e0',
            backgroundColor: selectedId === conversation.id ? '#f0f8ff' : '#ffffff',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            if (selectedId !== conversation.id) {
              e.currentTarget.style.backgroundColor = '#f9f9f9';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedId !== conversation.id) {
              e.currentTarget.style.backgroundColor = '#ffffff';
            }
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', marginBottom: '4px', color: '#333' }}>
                {conversation.title}
              </div>
              {conversation.familyMember && (
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                  {conversation.familyMember.name} ({conversation.familyMember.relationship})
                </div>
              )}
              <div style={{ fontSize: '12px', color: '#999' }}>
                {new Date(conversation.updatedAt).toLocaleDateString()}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Are you sure you want to delete this conversation?')) {
                  onDelete(conversation.id);
                }
              }}
              style={{
                padding: '4px 8px',
                backgroundColor: 'transparent',
                color: '#dc3545',
                border: '1px solid #dc3545',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
                marginLeft: '8px',
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
