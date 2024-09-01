import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './HistoryDetail.css';
import { HistoryContext } from './HistoryContext';

const HistoryDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { handleSave } = useContext(HistoryContext);
  const [item, setItem] = useState(state?.item || {});
  const [isEditing, setIsEditing] = useState(state?.isEditing || false);
  const [showAddFileInput, setShowAddFileInput] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  useEffect(() => {
    if (!state?.item && id) {
      // Load the item from an API or state management if necessary
    }
  }, [id, state]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    const updatedItem = {
      ...item,
      lastModified: new Date().toISOString().split('T')[0] // Update the lastModified date
    };
    handleSave(updatedItem);
    setIsEditing(false);
    navigate('/history');
  };

  const handleCancel = () => {
    setIsEditing(false);
    navigate('/history');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prevItem) => ({
      ...prevItem,
      [name]: value
    }));
  };

  const handleAddFile = () => {
    setShowAddFileInput(true);
  };

  const handleFileNameChange = (e) => {
    setNewFileName(e.target.value);
  };

  const handleAddFileConfirm = () => {
    setItem((prevItem) => ({
      ...prevItem,
      files: [...(prevItem.files || []), newFileName]
    }));
    setNewFileName('');
    setShowAddFileInput(false);
  };

  const handleAddFileCancel = () => {
    setNewFileName('');
    setShowAddFileInput(false);
  };

  const handleMedicationSetting = () => {
    navigate(`/history/${id}/medication`);
  };

  return (
    <div className="history-detail">
      {isEditing ? (
        <>
          <header className="history-detail-header">
            <h1>{item.id ? '진료 이력 수정' : '새 진료 추가'}</h1>
            <div className="history-detail-controls">
              <button className="save-button" onClick={handleSaveClick}>저장</button>
              <button className="cancel-button" onClick={handleCancel}>취소</button>
            </div>
          </header>
          <div className="history-detail-content">
            <div className="history-detail-row">
              <span className="history-detail-label">날짜:</span>
              <input
                type="date"
                name="date"
                value={item.date}
                onChange={handleChange}
              />
            </div>
            <div className="history-detail-row">
              <span className="history-detail-label">병명 태그:</span>
              <input
                type="text"
                name="code"
                value={item.code}
                onChange={handleChange}
              />
            </div>
            <div className="history-detail-row">
              <span className="history-detail-label">진료 내용:</span>
              <textarea
                name="content"
                value={item.content}
                onChange={handleChange}
                rows="10" // Increase the number of rows for a larger text area
                style={{ width: '100%' }} // Full width for better readability
              />
            </div>
            <div className="history-detail-row">
              <span className="history-detail-label">설명:</span>
              <textarea
                name="description"
                value={item.description}
                onChange={handleChange}
                rows="10" // Increase the number of rows for a larger text area
                style={{ width: '100%' }} // Full width for better readability
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <header className="history-detail-header">
            <h1>{item.date} 진료</h1>
            <div className="history-detail-controls">
              <button className="edit-button" onClick={handleEdit}>수정</button>
              <button className="delete-button" onClick={handleCancel}>삭제</button>
            </div>
          </header>
          <div className="history-detail-content">
            <div className="history-detail-row">
              <span className="history-detail-label">상태:</span>
              <span className="history-detail-value">{item.status || '치료 진행 중'}</span>
            </div>
            <div className="history-detail-row">
              <span className="history-detail-label">병명 태그:</span>
              <span className="history-detail-value">{item.code}</span>
            </div>
            <div className="history-detail-row">
              <span className="history-detail-label">환자명:</span>
              <span className="history-detail-value">{item.patientName || '정재욱'}</span>
            </div>
            <div className="history-detail-row">
              <span className="history-detail-label">진료 내용:</span>
              <span className="history-detail-value">{item.content}</span>
            </div>
            <div className="history-detail-description">{item.description}</div>
            <div className="history-detail-footer">
              <span>마지막 수정: {item.lastModified}</span>
              <div className="file-links">
                {item.files?.map((file, index) => (
                  <a key={index} href="#">{file}</a>
                ))}
              </div>
              <button className="add-file-button" onClick={handleAddFile}>파일 추가하기</button>
              {showAddFileInput && (
                <div className="add-file-input">
                  <input
                    type="text"
                    value={newFileName}
                    onChange={handleFileNameChange}
                    placeholder="파일 이름 입력"
                  />
                  <button onClick={handleAddFileConfirm}>추가</button>
                  <button onClick={handleAddFileCancel}>취소</button>
                </div>
              )}
              <button className="medication-button" onClick={handleMedicationSetting}>복약 알림 설정</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HistoryDetail;
