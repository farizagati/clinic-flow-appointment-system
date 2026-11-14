import React, { useEffect, useId, useMemo, useRef, useState } from 'react';

/**
 * SearchDropdown - Debounced, searchable single-select dropdown (combobox).
 *
 * Typing filters the option list after `debounceMs` of inactivity. While the
 * debounce timer is pending, a "Searching..." row is shown. Typing after a
 * value was picked clears the selection, so the field is only valid once an
 * option is actually chosen from the list.
 *
 * Props:
 *   id          {string}   id of the text input (used by the floating label).
 *   dataTestId  {string}   Base data-testid. Sub-elements are suffixed:
 *                            {base}               text input
 *                            {base}-toggle        open/close button
 *                            {base}-clear         clear button
 *                            {base}-listbox       suggestion list
 *                            {base}-loading       debounce pending row
 *                            {base}-empty         no results row
 *                            {base}-option-{id}   each option
 *   label       {string}   Floating label text.
 *   options     {Array}    [{ id, name, meta? }]. Only `name` is searched; `meta` is display-only secondary text.
 *   value       {string}   Selected option id ('' for none).
 *   onChange    {Function} Called with the selected id, or '' when cleared.
 *   debounceMs  {number}   Debounce delay in milliseconds. Default 400.
 *   error       {boolean}  Shows error styling.
 *   emptyText   {string}   Text shown when nothing matches.
 *   disabled    {boolean}  Disables the field.
 *   describedBy {string}   aria-describedby for the input (e.g. the FieldError id).
 */
export default function SearchDropdown({
  id,
  dataTestId,
  label,
  options,
  value,
  onChange,
  debounceMs = 400,
  error = false,
  emptyText = 'No results found',
  disabled = false,
  describedBy,
}) {
  const listboxId = useId();
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const selected = options.find((o) => o.id === value) || null;

  const [query, setQuery] = useState(selected ? selected.name : '');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Keep the input text in sync when the value changes from outside
  // (initial state from the review screen, or a reset by the parent form).
  useEffect(() => {
    if (!isOpen) {
      const text = selected ? selected.name : '';
      setQuery(text);
      setDebouncedQuery(text);
    }
  }, [value, selected?.name]);

  // Debounce: only update the applied search term after the user stops typing.
  useEffect(() => {
    if (query === debouncedQuery) {
      setIsSearching(false);
      return undefined;
    }
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setIsSearching(false);
      setActiveIndex(-1);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [query, debouncedQuery, debounceMs]);

  const results = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    // When the text is just the selected option's name, show the full list.
    if (!q || (selected && debouncedQuery === selected.name)) return options;
    return options.filter((o) => o.name.toLowerCase().includes(q));
  }, [options, debouncedQuery, selected]);

  const highlightTerm = selected && debouncedQuery === selected.name ? '' : debouncedQuery;

  // Close when clicking outside and restore the input text to the selection.
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleMouseDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        closeList();
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isOpen, selected]);

  // Keep the keyboard-highlighted option scrolled into view.
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  function openList() {
    if (disabled) return;
    setIsOpen(true);
  }

  function closeList() {
    setIsOpen(false);
    setActiveIndex(-1);
    const restored = selected ? selected.name : '';
    setQuery(restored);
    setDebouncedQuery(restored);
  }

  function selectOption(option) {
    onChange(option.id);
    setQuery(option.name);
    setDebouncedQuery(option.name);
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function handleInputChange(e) {
    const next = e.target.value;
    setQuery(next);
    setIsOpen(true);
    if (value) onChange('');
  }

  function handleClear() {
    onChange('');
    setQuery('');
    setDebouncedQuery('');
    setActiveIndex(-1);
    setIsOpen(true);
    inputRef.current?.focus();
  }

  function handleKeyDown(e) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          openList();
          return;
        }
        if (!isSearching && results.length) {
          setActiveIndex((i) => (i + 1) % results.length);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen && !isSearching && results.length) {
          setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
        }
        break;
      case 'Enter':
        if (isOpen) {
          // Never submit the form from inside the dropdown.
          e.preventDefault();
          if (!isSearching && activeIndex >= 0 && results[activeIndex]) {
            selectOption(results[activeIndex]);
          }
        }
        break;
      case 'Escape':
        if (isOpen) {
          e.preventDefault();
          closeList();
        }
        break;
      case 'Tab':
        if (isOpen) closeList();
        break;
      default:
        break;
    }
  }

  const activeOptionId =
    isOpen && activeIndex >= 0 && results[activeIndex]
      ? `${listboxId}-opt-${results[activeIndex].id}`
      : undefined;

  return (
    <div
      ref={containerRef}
      className="floating-input relative"
      data-open={isOpen ? '' : undefined}
      data-testid={`${dataTestId}-container`}
    >
      <input
        ref={inputRef}
        id={id}
        data-testid={dataTestId}
        data-selected-value={value || ''}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={activeOptionId}
        aria-invalid={error}
        aria-describedby={describedBy}
        aria-busy={isSearching}
        disabled={disabled}
        value={query}
        placeholder=" "
        onChange={handleInputChange}
        onFocus={openList}
        onClick={openList}
        onKeyDown={handleKeyDown}
        className={`w-full h-14 pl-4 pr-20 bg-transparent border rounded-lg text-on-surface focus:outline-none transition-colors ${
          error ? 'input-error' : 'border-outline'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      />
      <label
        htmlFor={id}
        className="absolute left-3 top-1/2 -translate-y-1/2 font-body-md text-body-md text-on-surface-variant transition-all pointer-events-none px-1 rounded-sm"
      >
        {label}
      </label>

      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {query && !disabled && (
          <button
            type="button"
            data-testid={`${dataTestId}-clear`}
            aria-label="Clear selection"
            onClick={handleClear}
            className="p-1 rounded-full text-on-surface-variant hover:bg-surface-variant transition-colors flex items-center"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        )}
        <button
          type="button"
          tabIndex={-1}
          data-testid={`${dataTestId}-toggle`}
          aria-label={isOpen ? 'Close list' : 'Open list'}
          disabled={disabled}
          onClick={() => {
            if (isOpen) {
              closeList();
            } else {
              openList();
              inputRef.current?.focus();
            }
          }}
          className="p-1 rounded-full text-on-surface-variant hover:bg-surface-variant transition-colors flex items-center"
        >
          <span className={`material-symbols-outlined transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </button>
      </div>

      {isOpen && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          data-testid={`${dataTestId}-listbox`}
          aria-label={label}
          className="absolute left-0 right-0 top-full mt-1 z-50 max-h-64 overflow-y-auto bg-surface-container-lowest border border-outline-variant rounded-lg shadow-[0px_8px_24px_rgba(0,0,0,0.12)] py-1"
        >
          {isSearching ? (
            <li
              data-testid={`${dataTestId}-loading`}
              className="px-4 py-3 flex items-center gap-2 text-on-surface-variant font-body-sm"
              aria-live="polite"
            >
              <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
              Searching...
            </li>
          ) : results.length === 0 ? (
            <li
              data-testid={`${dataTestId}-empty`}
              className="px-4 py-3 text-on-surface-variant font-body-sm"
              aria-live="polite"
            >
              {emptyText}
            </li>
          ) : (
            results.map((option, index) => {
              const isSelected = option.id === value;
              const isActive = index === activeIndex;
              return (
                <li
                  key={option.id}
                  id={`${listboxId}-opt-${option.id}`}
                  role="option"
                  aria-selected={isSelected}
                  data-index={index}
                  data-testid={`${dataTestId}-option-${option.id}`}
                  // mousedown + preventDefault keeps focus in the input.
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectOption(option);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`px-4 py-2 cursor-pointer flex items-center justify-between gap-2 ${
                    isActive ? 'bg-surface-variant' : ''
                  } ${isSelected ? 'text-primary' : 'text-on-surface'}`}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="font-body-md truncate">
                      <Highlight text={option.name} term={highlightTerm} />
                    </span>
                    {option.meta && (
                      <span className="font-body-sm text-on-surface-variant truncate">
                        {option.meta}
                      </span>
                    )}
                  </div>
                  {isSelected && <span className="material-symbols-outlined text-[18px]">check</span>}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}

/** Wraps the first case-insensitive match of `term` in a <mark>. */
function Highlight({ text, term }) {
  const q = term.trim();
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-transparent text-primary font-semibold">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}
