/**
 * FieldError — Reusable inline field validation error.
 *
 * Props:
 *   message  {string}  The error message to display. Renders nothing if falsy.
 *   fieldId  {string}  The id/data-testid of the associated input.
 *                      Generates data-testid as `{fieldId}-error` for QA automation.
 */
export function FieldError({ message, fieldId }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      data-testid={`${fieldId}-error`}
      className="field-error-msg"
    >
      <span
        className="material-symbols-outlined"
        aria-hidden="true"
        style={{ fontSize: '14px', verticalAlign: 'middle' }}
      >
        error
      </span>
      {message}
    </p>
  );
}
