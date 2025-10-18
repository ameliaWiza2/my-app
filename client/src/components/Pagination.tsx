import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        padding: '16px',
        borderTop: '1px solid #e0e0e0',
      }}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: '8px 12px',
          backgroundColor: currentPage === 1 ? '#f0f0f0' : '#ffffff',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
        }}
      >
        Previous
      </button>
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#ffffff',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            1
          </button>
          {startPage > 2 && <span>...</span>}
        </>
      )}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            padding: '8px 12px',
            backgroundColor: page === currentPage ? '#007bff' : '#ffffff',
            color: page === currentPage ? '#ffffff' : '#333333',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: page === currentPage ? '600' : '400',
          }}
        >
          {page}
        </button>
      ))}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span>...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#ffffff',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {totalPages}
          </button>
        </>
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: '8px 12px',
          backgroundColor: currentPage === totalPages ? '#f0f0f0' : '#ffffff',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
        }}
      >
        Next
      </button>
    </div>
  );
};
