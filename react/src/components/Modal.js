import React, { useEffect } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children, maxWidth = '500px' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} data-easytag="id16-react/src/components/Modal.js">
      <div
        className="modal-content"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
        data-easytag="id17-react/src/components/Modal.js"
      >
        <div className="modal-header" data-easytag="id18-react/src/components/Modal.js">
          <h2 className="modal-title" data-easytag="id19-react/src/components/Modal.js">{title}</h2>
          <button className="modal-close" onClick={onClose} data-easytag="id20-react/src/components/Modal.js">
            ×
          </button>
        </div>
        <div className="modal-body" data-easytag="id21-react/src/components/Modal.js">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
