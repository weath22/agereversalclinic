import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface AppointmentDatePickerProps {
  value: string; // ISO format 'YYYY-MM-DD'
  onChange: (dateStr: string) => void;
  label?: string;
  placeholder?: string;
  minDate?: string; // defaults to today in 'YYYY-MM-DD'
  maxDate?: string;
  disabledDates?: string[];
  required?: boolean;
  className?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Helper to format ISO YYYY-MM-DD into readable string
export const formatDisplayDate = (isoStr: string): string => {
  if (!isoStr) return '';
  const parts = isoStr.split('-');
  if (parts.length !== 3) return isoStr;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const dateObj = new Date(year, month, day);
  
  if (isNaN(dateObj.getTime())) return isoStr;
  
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const getTodayISO = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function AppointmentDatePicker({
  value,
  onChange,
  label = 'Preferred Appointment Date',
  placeholder = 'Select an appointment date',
  minDate,
  maxDate,
  disabledDates = [],
  required = false,
  className = ''
}: AppointmentDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize calendar view to selected date's month or current month
  const todayISO = getTodayISO();
  const effectiveMinDate = minDate !== undefined ? minDate : todayISO;

  const initialDate = value ? new Date(value + 'T00:00:00') : new Date();
  const [viewYear, setViewYear] = useState<number>(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initialDate.getMonth());

  // Keep view in sync when value changes externally
  useEffect(() => {
    if (value) {
      const d = new Date(value + 'T00:00:00');
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [value]);

  // Click outside and Escape handling
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  // Generate days for the current view month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const handleSelectDay = (day: number) => {
    const monthStr = String(viewMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const isoString = `${viewYear}-${monthStr}-${dayStr}`;
    onChange(isoString);
    setIsOpen(false);
  };

  const handleQuickSelect = (offsetDays: number) => {
    const target = new Date();
    target.setDate(target.getDate() + offsetDays);
    const year = target.getFullYear();
    const month = String(target.getMonth() + 1).padStart(2, '0');
    const day = String(target.getDate()).padStart(2, '0');
    const isoString = `${year}-${month}-${day}`;
    onChange(isoString);
    setViewYear(year);
    setViewMonth(target.getMonth());
    setIsOpen(false);
  };

  const isDateDisabled = (day: number) => {
    const monthStr = String(viewMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const isoString = `${viewYear}-${monthStr}-${dayStr}`;

    if (effectiveMinDate && isoString < effectiveMinDate) return true;
    if (maxDate && isoString > maxDate) return true;
    if (disabledDates.includes(isoString)) return true;

    return false;
  };

  return (
    <div ref={containerRef} className={`space-y-2 relative ${className}`}>
      {label && (
        <label className="font-sans font-bold text-xs tracking-wider uppercase text-luxury-text flex items-center justify-between">
          <span>{label}</span>
          {required && <span className="text-luxury-gold text-[10px] lowercase tracking-normal">* required</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-5 py-4 rounded-xl border bg-white text-sm text-luxury-text font-semibold flex items-center justify-between transition-all duration-200 cursor-pointer shadow-xs ${
          isOpen
            ? 'border-luxury-gold ring-1 ring-luxury-gold/50 shadow-md'
            : 'border-luxury-border hover:border-luxury-gold/60'
        }`}
      >
        <div className="flex items-center gap-3 truncate min-w-0 pr-2">
          <div className={`p-1.5 rounded-lg transition-colors ${value ? 'bg-black text-luxury-gold' : 'bg-slate-100 text-slate-400'}`}>
            <CalendarIcon className="h-4 w-4" />
          </div>
          <span className={`truncate ${!value ? 'text-luxury-subtext font-normal' : 'text-luxury-text font-semibold'}`}>
            {value ? formatDisplayDate(value) : placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {value && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-md transition-colors mr-1"
              title="Clear date"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
          <span className="text-[11px] font-bold text-luxury-gold bg-luxury-gold/10 px-2 py-0.5 rounded uppercase tracking-wider">
            {value ? 'Change' : 'Pick'}
          </span>
        </div>
      </button>

      {/* Calendar Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full mt-2 z-50 bg-white rounded-2xl border border-luxury-border shadow-2xl p-4 sm:p-5 font-sans"
          >
            {/* Quick shortcuts */}
            <div className="flex items-center gap-1.5 pb-3.5 mb-3.5 border-b border-luxury-border/40 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-muted mr-1 shrink-0">
                Quick:
              </span>
              <button
                type="button"
                onClick={() => handleQuickSelect(0)}
                className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-luxury-gold/15 hover:text-luxury-text text-luxury-subtext transition-colors shrink-0 cursor-pointer"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect(1)}
                className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-luxury-gold/15 hover:text-luxury-text text-luxury-subtext transition-colors shrink-0 cursor-pointer"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect(7)}
                className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-luxury-gold/15 hover:text-luxury-text text-luxury-subtext transition-colors shrink-0 cursor-pointer"
              >
                +1 Week
              </button>
            </div>

            {/* Calendar Navigation Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <h4 className="font-serif font-bold text-sm text-luxury-text">
                {MONTH_NAMES[viewMonth]} <span className="text-luxury-gold">{viewYear}</span>
              </h4>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-luxury-text transition-colors cursor-pointer"
                  title="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-luxury-text transition-colors cursor-pointer"
                  title="Next month"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
              {DAY_NAMES.map((name) => (
                <span key={name} className="text-[10px] font-bold text-luxury-muted uppercase py-1">
                  {name}
                </span>
              ))}
            </div>

            {/* Month Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Empty leading cells */}
              {Array.from({ length: firstDay }).map((_, index) => (
                <div key={`empty-${index}`} className="h-8 w-8" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const dayNumber = index + 1;
                const monthStr = String(viewMonth + 1).padStart(2, '0');
                const dayStr = String(dayNumber).padStart(2, '0');
                const currentDayISO = `${viewYear}-${monthStr}-${dayStr}`;

                const isSelected = value === currentDayISO;
                const isToday = todayISO === currentDayISO;
                const disabled = isDateDisabled(dayNumber);

                return (
                  <button
                    key={`day-${dayNumber}`}
                    type="button"
                    disabled={disabled}
                    onClick={() => handleSelectDay(dayNumber)}
                    className={`h-8 w-8 mx-auto rounded-xl text-xs font-semibold flex items-center justify-center transition-all ${
                      disabled
                        ? 'text-slate-300 cursor-not-allowed'
                        : isSelected
                        ? 'bg-black text-white font-bold shadow-sm scale-105'
                        : isToday
                        ? 'bg-luxury-gold/15 text-luxury-gold font-bold ring-1 ring-luxury-gold/50 hover:bg-luxury-gold/25 cursor-pointer'
                        : 'text-luxury-text hover:bg-luxury-secondary/70 cursor-pointer'
                    }`}
                  >
                    {dayNumber}
                  </button>
                );
              })}
            </div>

            {/* Footer status / close */}
            <div className="mt-4 pt-3 border-t border-luxury-border/40 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                {value ? `Selected: ${formatDisplayDate(value)}` : 'No date chosen'}
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-luxury-text hover:text-luxury-gold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
