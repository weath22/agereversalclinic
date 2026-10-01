import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Hash } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}: PaginationProps) {
  const [showQuickJump, setShowQuickJump] = useState(false);
  const quickJumpRef = useRef<HTMLDivElement>(null);

  // Close quick jump on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (quickJumpRef.current && !quickJumpRef.current.contains(e.target as Node)) {
        setShowQuickJump(false);
      }
    };
    if (showQuickJump) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showQuickJump]);

  if (totalPages <= 1) {
    return null;
  }

  // Determine which page numbers to display next to the active page
  let nextPages: number[] = [];
  let highestShown = currentPage;

  if (currentPage === 1) {
    // On page 1: show page 1, 2, 3 (if they exist)
    if (totalPages >= 2) nextPages.push(2);
    if (totalPages >= 3) nextPages.push(3);
    highestShown = Math.min(3, totalPages);
  } else {
    // On page 2+: show current page and next page (e.g. 2, 3)
    if (currentPage + 1 <= totalPages) {
      nextPages.push(currentPage + 1);
      highestShown = currentPage + 1;
    }
  }

  // Calculate remaining pages after the current sequence
  // For page 1: 16 - 3 = 13 remaining (+13)
  // For page 2: 16 - 4 = 12 remaining (+12)
  let remainingCount = 0;
  if (currentPage === 1) {
    remainingCount = Math.max(0, totalPages - 3);
  } else {
    remainingCount = Math.max(0, totalPages - (currentPage + 2));
  }

  const handleJumpToNextBatch = () => {
    const target = Math.min(highestShown + 1, totalPages);
    onPageChange(target);
    setShowQuickJump(false);
  };

  return (
    <nav
      aria-label="Clinical pagination navigation"
      className={`relative flex items-center justify-center gap-2 sm:gap-3 py-2 sm:py-3 select-none ${className}`}
    >
      {/* 1. Previous Page Arrow "<" (Hidden on page 1 per user spec) */}
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous Page"
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-luxury-border bg-white text-luxury-subtext hover:bg-luxury-card hover:text-luxury-text hover:border-luxury-chrome transition-all duration-200 shrink-0 cursor-pointer shadow-xs active:scale-95"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
        </button>
      )}

      {/* 2. Active Current Page Number */}
      <button
        onClick={() => onPageChange(currentPage)}
        aria-current="page"
        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full font-sans text-xs sm:text-sm font-semibold bg-luxury-text text-white shadow-sm transition-transform active:scale-95 cursor-default"
      >
        {currentPage}
      </button>

      {/* 3. Next Adjacent Page Numbers (e.g. 2, 3 on page 1; 3 on page 2) */}
      {nextPages.map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-luxury-border/60 bg-white/80 font-sans text-xs sm:text-sm text-luxury-subtext hover:bg-luxury-card hover:text-luxury-text hover:border-luxury-border transition-all duration-200 active:scale-95 cursor-pointer"
        >
          {pageNum}
        </button>
      ))}

      {/* 4. Remaining Pages Pill: +13 / +12 */}
      {remainingCount > 0 && (
        <div className="relative" ref={quickJumpRef}>
          <button
            onClick={() => setShowQuickJump(prev => !prev)}
            title={`View remaining ${remainingCount} pages or jump ahead`}
            className="h-9 sm:h-10 px-2.5 sm:px-3.5 flex items-center justify-center rounded-full border border-luxury-border bg-white font-sans text-xs sm:text-sm font-medium text-luxury-subtext hover:bg-luxury-card hover:text-luxury-text hover:border-luxury-gold/50 transition-all duration-200 active:scale-95 cursor-pointer shadow-xs gap-1 group"
          >
            <span className="font-mono text-xs sm:text-sm group-hover:text-luxury-text transition-colors">
              +{remainingCount}
            </span>
          </button>

          {/* Quick-Jump Dropdown Popover */}
          {showQuickJump && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 bg-white rounded-2xl shadow-2xl border border-luxury-border p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-luxury-border/60">
                <span className="font-serif text-xs font-medium text-luxury-text flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-luxury-gold" />
                  Jump to Page
                </span>
                <span className="text-[10px] text-luxury-subtext font-mono">
                  {totalPages} pages
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 max-h-48 overflow-y-auto no-scrollbar py-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      onPageChange(p);
                      setShowQuickJump(false);
                    }}
                    className={`h-8 rounded-lg font-sans text-xs font-medium transition-all ${
                      p === currentPage
                        ? 'bg-luxury-text text-white shadow-xs font-semibold'
                        : 'bg-luxury-secondary/70 text-luxury-text hover:bg-luxury-card hover:border hover:border-luxury-border'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="pt-2 mt-2 border-t border-luxury-border/60 flex justify-between items-center">
                <button
                  onClick={handleJumpToNextBatch}
                  className="w-full text-center py-1.5 rounded-lg bg-luxury-secondary text-luxury-text hover:bg-luxury-card font-sans text-[11px] font-medium transition-colors"
                >
                  Next batch (Page {Math.min(highestShown + 1, totalPages)}) &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Next Page Arrow ">" */}
      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next Page"
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-luxury-border bg-white text-luxury-subtext hover:bg-luxury-card hover:text-luxury-text hover:border-luxury-chrome transition-all duration-200 shrink-0 cursor-pointer shadow-xs active:scale-95"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
        </button>
      )}
    </nav>
  );
}
