import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, parse, parseISO, isValid } from 'date-fns';
import 'react-day-picker/dist/style.css';

// Context to pass dataTestId to stable sub-components without re-creating them
const DatePickerTestIdContext = createContext('');

const parseDateValue = (val) => {
  if (!val) return undefined;
  if (val instanceof Date) return isValid(val) ? val : undefined;

  // Try ISO format (yyyy-MM-dd)
  let parsed = parseISO(val);
  if (isValid(parsed)) return parsed;

  // Try standard display format (d MMMM yyyy)
  parsed = parse(val, 'd MMMM yyyy', new Date());
  if (isValid(parsed)) return parsed;

  // Try standard date parsing
  parsed = new Date(val);
  if (isValid(parsed)) return parsed;

  return undefined;
};

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

export default function CustomDatePicker({
  id,
  dataTestId,
  value,
  onChange,
  formatStr = 'yyyy-MM-dd',
  label,
  disabled,
  captionLayout,
  startMonth,
  endMonth,
  inputClassName = '',
  containerClassName = '',
  isFloatingLabel = false,
  error = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [month, setMonth] = useState(new Date());
  const containerRef = useRef(null);

  const parsedDate = parseDateValue(value);

  useEffect(() => {
    if (parsedDate) {
      setMonth(parsedDate);
    }
  }, [value]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (date) => {
    if (!date) return;
    const formatted = format(date, formatStr);
    onChange(formatted);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${containerClassName}`}>
      {isFloatingLabel ? (
        <div className={`floating-input relative${isOpen ? ' focus-within' : ''}`} data-open={isOpen || undefined}>
          <input
            type="text"
            readOnly
            id={id}
            data-testid={dataTestId}
            value={value || ''}
            onClick={() => setIsOpen(!isOpen)}
            className={`${inputClassName} cursor-pointer`}
            placeholder=" "
          />
          <label
            htmlFor={id}
            className="absolute left-3 top-1/2 -translate-y-1/2 font-body-md text-body-md text-on-surface-variant transition-all pointer-events-none px-1 rounded-sm"
          >
            {label}
          </label>
          <span
            onClick={() => setIsOpen(!isOpen)}
            data-testid={`${dataTestId}-toggle`}
            className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant cursor-pointer hover:text-primary transition-colors"
          >
            calendar_today
          </span>
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            readOnly
            id={id}
            data-testid={dataTestId}
            value={value || ''}
            onClick={() => setIsOpen(!isOpen)}
            className={`${inputClassName} cursor-pointer`}
          />
          <span
            onClick={() => setIsOpen(!isOpen)}
            data-testid={`${dataTestId}-toggle`}
            className="material-symbols-outlined absolute right-3 top-3.5 text-secondary cursor-pointer hover:text-primary transition-colors"
          >
            calendar_today
          </span>
        </div>
      )}

      {isOpen && (
        <div
          data-testid={`${dataTestId}-popover`}
          className="absolute left-0 mt-2 z-50 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xl p-4 min-w-[320px] dark:bg-slate-900 dark:border-slate-800"
        >
          <DatePickerTestIdContext.Provider value={dataTestId}>
            <DayPicker
              mode="single"
              selected={parsedDate}
              onSelect={handleSelect}
              month={month}
              onMonthChange={setMonth}
              disabled={disabled}
              captionLayout={captionLayout}
              navLayout="around"
              startMonth={startMonth}
              endMonth={endMonth}
              components={customComponents}
            />
          </DatePickerTestIdContext.Provider>
        </div>
      )}
    </div>
  );
}
