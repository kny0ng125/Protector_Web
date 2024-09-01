import React, { useState } from 'react';
import './EditHistoryItem.css';

const EditHistoryItem = ({ item, onSave, onCancel }) => {
  const [editedItem, setEditedItem] = useState({ ...item });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedItem(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedItem);
  };

  return (
    <div className="edit-history-item">
      <h2>{item.id ? '진료 수정' : '새 진료 추가'}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          날짜:
          <input type="date" name="date" value={editedItem.date} onChange={handleChange} required />
        </label>
        <label>
          설명:
          <input type="text" name="description" value={editedItem.description} onChange={handleChange} required />
        </label>
        <label>
          코드:
          <input type="text" name="code" value={editedItem.code} onChange={handleChange} required />
        </label>
        <div className="form-controls">
          <button type="submit">저장</button>
          <button type="button" onClick={onCancel}>취소</button>
        </div>
      </form>
    </div>
  );
};

export default EditHistoryItem;
