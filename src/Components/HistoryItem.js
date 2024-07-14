import React from 'react';
import './HistoryItem.css';

const HistoryItem = ({ item, onClick, onEdit, onDelete }) => {
  return (
    <div className="history-item" onClick={onClick}>
      <div className="history-item-content">
        <div className="history-item-date">{item.date}</div>
        <div className="history-item-description">{item.description}</div>
        <div className="history-item-code">{item.code}</div>
        <div className="history-item-last-modified">마지막 수정: {item.lastModified}</div>
      </div>
      <div className="history-item-actions">
        <button className="edit-button" onClick={(e) => { e.stopPropagation(); onEdit(item); }}>수정</button>
        <button className="delete-button" onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}>삭제</button>
      </div>
    </div>
  );
};

export default HistoryItem;
