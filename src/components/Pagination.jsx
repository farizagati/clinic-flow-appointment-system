import React from 'react';

const getPageNumbers = (page, totalPages) => {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages = [1];
  if (page > 3) pages.push('...');
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
  if (page < totalPages - 2) pages.push('...');
  pages.push(totalPages);
  return pages;
};

// Renders nothing when there are no items.
export default function Pagination({ page, pageSize, total, onPageChange, testIdPrefix }) {
  if (total === 0) return null;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;

  return (
    <div
      data-testid={`${testIdPrefix}-pagination`}
      className="pt-md border-t border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-md font-body-sm text-body-sm text-secondary"
    >
      <div data-testid={`${testIdPrefix}-pagination-summary`}>
        Showing <span className="font-medium text-on-surface">{start + 1}</span> to{' '}
        <span className="font-medium text-on-surface">{Math.min(start + pageSize, total)}</span> of{' '}
        <span className="font-medium text-on-surface">{total}</span> results
      </div>
      <div className="flex items-center gap-xs">
        <button
          type="button"
          aria-label="Previous Page"
          data-testid={`${testIdPrefix}-page-prev`}
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-1 rounded hover:bg-surface-variant disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="material-symbols-outlined" aria-hidden="true">chevron_left</span>
        </button>
        {getPageNumbers(page, totalPages).map((p, idx) =>
          p === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-1 text-outline">...</span>
          ) : (
            <button
              type="button"
              key={p}
              data-testid={`${testIdPrefix}-page-${p}`}
              aria-current={p === page ? 'page' : undefined}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg font-medium flex items-center justify-center transition-colors ${
                p === page ? 'bg-primary text-on-primary' : 'hover:bg-surface-variant text-on-surface'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          aria-label="Next Page"
          data-testid={`${testIdPrefix}-page-next`}
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-1 rounded hover:bg-surface-variant disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
