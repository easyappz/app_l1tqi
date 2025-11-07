import React from 'react';
import './Textarea.css';

const Textarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  rows = 4,
  className = '',
}) => {
  return (
    <div className={`textarea-group ${className}`} data-easytag="id8-react/src/components/Textarea.js">
      {label && (
        <label htmlFor={name} className="textarea-label" data-easytag="id9-react/src/components/Textarea.js">
          {label}
          {required && <span className="textarea-required">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={`textarea-field ${error ? 'textarea-error' : ''}`}
        data-easytag="id10-react/src/components/Textarea.js"
      />
      {error && (
        <span className="textarea-error-message" data-easytag="id11-react/src/components/Textarea.js">
          {error}
        </span>
      )}
    </div>
  );
};

export default Textarea;
