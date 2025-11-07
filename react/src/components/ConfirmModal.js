import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', isDestructive = false }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay" onClick={onCancel} data-easytag="id118-react/src/components/ConfirmModal.js">
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()} data-easytag="id119-react/src/components/ConfirmModal.js">
        <h2 className="confirm-modal-title" data-easytag="id120-react/src/components/ConfirmModal.js">{title}</h2>
        <p className="confirm-modal-message" data-easytag="id121-react/src/components/ConfirmModal.js">{message}</p>
        <div className="confirm-modal-actions" data-easytag="id122-react/src/components/ConfirmModal.js">
          <button
            className="confirm-modal-button confirm-modal-button-cancel"
            onClick={onCancel}
            data-easytag="id123-react/src/components/ConfirmModal.js"
          >
            {cancelText}
          </button>
          <button
            className={`confirm-modal-button confirm-modal-button-confirm ${isDestructive ? 'destructive' : ''}`}
            onClick={onConfirm}
            data-easytag="id124-react/src/components/ConfirmModal.js"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
