import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="error-message" data-easytag="id12-react/src/components/ErrorMessage.js">
      <div className="error-message-content" data-easytag="id13-react/src/components/ErrorMessage.js">
        <span className="error-message-text" data-easytag="id14-react/src/components/ErrorMessage.js">{message}</span>
        {onClose && (
          <button
            className="error-message-close"
            onClick={onClose}
            data-easytag="id15-react/src/components/ErrorMessage.js"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
