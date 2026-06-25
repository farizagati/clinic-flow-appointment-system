import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';

// Context to pass dataTestId to stable sub-components without re-creating them
const DatePickerTestIdContext = createContext('');

// Stable sub-components defined OUTSIDE the render function
// so React doesn't treat them as new component types on every render.

function CustomDayButton(props) {
  const { day, modifiers, ...buttonProps } = props;
  return (
    <button
      {...buttonProps}
      data-testid={`day-${day.isoDate}`}
    />
  );
}

function CustomNextMonthButton(props) {
  const dataTestId = useContext(DatePickerTestIdContext);
  return (
    <button
      {...props}
      data-testid={`${dataTestId}-next-month`}
    />
  );
}

function CustomPreviousMonthButton(props) {
  const dataTestId = useContext(DatePickerTestIdContext);
  return (
    <button
      {...props}
      data-testid={`${dataTestId}-prev-month`}
    />
  );
}

function CustomSelect(props) {
  const dataTestId = useContext(DatePickerTestIdContext);
  const ariaLabel = props['aria-label'] || '';
  const isMonth = ariaLabel.toLowerCase().includes('month');
  const isYear = ariaLabel.toLowerCase().includes('year');

  let selectTestId = `${dataTestId}-select`;
  if (isMonth) {
    selectTestId = `${dataTestId}-month-select`;
  } else if (isYear) {
    selectTestId = `${dataTestId}-year-select`;
  }

  return (
    <select
      {...props}
      data-testid={selectTestId}
    />
  );
}

function CustomOption(props) {
  const dataTestId = useContext(DatePickerTestIdContext);
  return (
    <option
      {...props}
      data-testid={`${dataTestId}-option-${props.value}`}
    />
  );
}

// Stable components object (same reference across renders)
const customComponents = {
  DayButton: CustomDayButton,
  NextMonthButton: CustomNextMonthButton,
  PreviousMonthButton: CustomPreviousMonthButton,
  Select: CustomSelect,
  Option: CustomOption,
};

export default function CustomDateRangePicker({
  value,
  onChange,
  dataTestId = 'date-range-picker',
  placeholderStart = 'Start date',
  placeholderEnd = 'End date',
  containerClassName = '',
  captionLayout = 'dropdown',
  startMonth,
  endMonth,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [month, setMonth] = useState(new Date());
  // Internal draft range — tracks in-progress selection separately from committed value
  const [draftRange, setDraftRange] = useState(value || { from: undefined, to: undefined });
  const containerRef = useRef(null);
  // Ref to always have the latest committed value in event handlers (avoids stale closure)
  const valueRef = useRef(value);
  useEffect(() => { valueRef.current = value; }, [value]);

  const computedStartMonth = startMonth || new Date(new Date().getFullYear() - 10, 0);
  const computedEndMonth = endMonth || new Date(new Date().getFullYear() + 5, 11);

  // Sync draft from external value when picker is not open
  useEffect(() => {
    if (!isOpen) {
      setDraftRange(value || { from: undefined, to: undefined });
    }
  }, [value, isOpen]);

  // When picker opens, navigate to the from-date month (or current month)
  const handleOpen = () => {
    const current = valueRef.current;
    const navTarget = current?.from || new Date();
    setMonth(navTarget);
    setDraftRange(current || { from: undefined, to: undefined });
    setIsOpen(true);
  };

  const handleToggle = () => {
    if (isOpen) {
      handleDiscard();
    } else {
      handleOpen();
    }
  };

  // Discard draft and close without changing parent value
  const handleDiscard = () => {
    setIsOpen(false);
    setDraftRange(valueRef.current || { from: undefined, to: undefined });
  };

  // Click outside to close (discards draft)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        handleDiscard();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Escape to close (discards draft)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleDiscard();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Update the draft as the user clicks days
  const handleSelect = (range) => {
    setDraftRange(range || { from: undefined, to: undefined });
  };

  // Commit draft to parent and close
  const handleApply = () => {
    onChange(draftRange);
    setIsOpen(false);
  };

  // Clear the draft range entirely (without closing)
  const handleClear = () => {
    setDraftRange({ from: undefined, to: undefined });
  };

  // Determine the selection hint label
  const getHintLabel = () => {
    if (!draftRange?.from) return 'Select start date';
    if (draftRange.from && !draftRange.to) return 'Now select end date';
    return `${format(draftRange.from, 'dd-MM-yyyy')} — ${format(draftRange.to, 'dd-MM-yyyy')}`;
  };

  const isRangeComplete = draftRange?.from && draftRange?.to;
  const hasAnyDraft = draftRange?.from || draftRange?.to;

  return (
    <div ref={containerRef} className={`relative ${containerClassName}`} data-testid={dataTestId}>
      <div
        onClick={handleToggle}
        data-testid={`${dataTestId}-toggle`}
        className="flex items-center justify-between border border-outline rounded-lg px-3 py-2 bg-surface hover:border-primary focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition-colors cursor-pointer w-full text-on-surface"
      >
        <div className="flex items-center min-w-0 flex-1">
          <span className="material-symbols-outlined text-secondary mr-2 text-[20px] flex-shrink-0">calendar_today</span>
          <div className="flex items-center gap-1 font-body-sm min-w-0 flex-1">
            <span
              className={`truncate ${value?.from ? 'text-on-surface font-medium' : 'text-secondary'}`}
              data-testid={`${dataTestId}-from-display`}
            >
              {value?.from ? format(value.from, 'dd-MM-yyyy') : placeholderStart}
            </span>
            <span className="text-outline-variant flex-shrink-0 mx-0.5">—</span>
            <span
              className={`truncate ${value?.to ? 'text-on-surface font-medium' : 'text-secondary'}`}
              data-testid={`${dataTestId}-to-display`}
            >
              {value?.to ? format(value.to, 'dd-MM-yyyy') : placeholderEnd}
            </span>
          </div>
        </div>
        {(value?.from || value?.to) && (
          <button
            type="button"
            data-testid={`${dataTestId}-clear-btn`}
            onClick={(e) => {
              e.stopPropagation();
              onChange({ from: undefined, to: undefined });
            }}
            className="ml-2 flex-shrink-0 text-secondary hover:text-error transition-colors"
            aria-label="Clear date range"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {isOpen && (
        <div
          data-testid={`${dataTestId}-popover`}
          className="absolute left-0 mt-2 z-50 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xl min-w-[320px] dark:bg-slate-900 dark:border-slate-800 overflow-hidden"
        >
          {/* Hint / status bar */}
          <div
            data-testid={`${dataTestId}-hint`}
            className={`px-4 py-2.5 border-b border-outline-variant/30 flex items-center gap-2 text-sm font-medium transition-colors ${
              isRangeComplete
                ? 'bg-primary/10 text-primary'
                : draftRange?.from
                ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                : 'bg-surface-container-low text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isRangeComplete ? 'check_circle' : draftRange?.from ? 'radio_button_checked' : 'radio_button_unchecked'}
            </span>
            <span>{getHintLabel()}</span>
          </div>

          <div className="p-4">
            <DatePickerTestIdContext.Provider value={dataTestId}>
              <DayPicker
                mode="range"
                selected={draftRange}
                onSelect={handleSelect}
                month={month}
                onMonthChange={setMonth}
                captionLayout={captionLayout}
                navLayout="around"
                startMonth={computedStartMonth}
                endMonth={computedEndMonth}
                components={customComponents}
              />
            </DatePickerTestIdContext.Provider>
          </div>

          {/* Footer actions */}
          <div className="px-4 pb-4 flex items-center justify-between gap-2 border-t border-outline-variant/30 pt-3">
            <button
              type="button"
              data-testid={`${dataTestId}-btn-clear`}
              onClick={handleClear}
              disabled={!hasAnyDraft}
              className="px-3 py-1.5 text-sm font-medium text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Clear
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                data-testid={`${dataTestId}-btn-cancel`}
                onClick={handleDiscard}
                className="px-3 py-1.5 text-sm font-medium text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                data-testid={`${dataTestId}-btn-apply`}
                onClick={handleApply}
                disabled={!isRangeComplete}
                className="px-4 py-1.5 text-sm font-medium bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
