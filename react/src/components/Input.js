import React from 'react';
import './Input.css';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`input-group ${className}`} data-easytag="id4-react/src/components/Input.js">
      {label && (
        <label htmlFor={name} className="input-label" data-easytag="id5-react/src/components/Input.js">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`input-field ${error ? 'input-error' : ''}`}
        data-easytag="id6-react/src/components/Input.js"
      />
      {error && (
        <span className="input-error-message" data-easytag="id7-react/src/components/Input.js">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
