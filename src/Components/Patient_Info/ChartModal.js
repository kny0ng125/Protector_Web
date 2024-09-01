import React from 'react';
import './ChartModal.css'; // 모달 스타일을 위한 CSS

const Modal = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="chart-modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <div className="modal-chart-wrapper">
          <div className="chart-container">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
