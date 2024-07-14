import React, { useContext } from 'react';
import './HistoryPage.css';
import HistoryItem from './HistoryItem';
import { useNavigate } from 'react-router-dom';
import { HistoryContext } from './HistoryContext';

const HistoryPage = () => {
  const { historyItems, handleDelete } = useContext(HistoryContext);
  const navigate = useNavigate();

  const handleEdit = (item) => {
    navigate(`/history/${item.id}`, { state: { item, isEditing: true } });
  };

  const handleAdd = () => {
    const newItem = {
      id: null,
      date: '',
      description: '',
      code: '',
      lastModified: new Date().toISOString().split('T')[0],
      content: ''
    };
    navigate(`/history/new`, { state: { item: newItem, isEditing: true } });
  };

  const handleItemClick = (item) => {
    navigate(`/history/${item.id}`, { state: { item } });
  };

  return (
    <div className="history-page">
      <header className="history-header">
        <h1>진료 이력 확인</h1>
        <div className="header-controls">
          <input type="text" placeholder="검색하기..." />
          <button className="add-button" onClick={handleAdd}>
            <i className="fas fa-plus"></i> 새 진료 추가하기
          </button>
        </div>
      </header>
      <div className="history-list">
        {historyItems.map((item, index) => (
          <HistoryItem key={index} item={item} onClick={() => handleItemClick(item)} onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item.id)} />
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
