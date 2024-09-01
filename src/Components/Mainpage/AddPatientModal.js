import React, { useState, useContext } from 'react';
import API_BASE_URL from '../Config';
import { AuthContext } from '../AuthContext';
import './AddPatientModal.css';

const AddPatientModal = ({ isOpen, onClose, onAddPatient }) => {
  const [uuid, setUuid] = useState('');
  const [message, setMessage] = useState('');
  const { authFetch } = useContext(AuthContext);

  const handleAddPatient = async () => {
    if (!uuid) {
      setMessage('UUID를 입력해주세요.');
      return;
    }

    try {
      console.log('Request URL:', `${API_BASE_URL}/doctor/patient`);
      console.log('Request Headers:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      });
      console.log('Request Body:', { uuid });

      const response = await authFetch(`${API_BASE_URL}/doctor/patient`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({ uuid }),
      });

      console.log('Response Status:', response.status);

      if (response.status === 200 || response.status === 201) {
        setMessage('환자가 추가되었습니다!');
        onAddPatient(); // 환자 추가 후 PatientList 새로고침
      } else {
        setMessage('환자 추가에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Error adding patient:', error);
      setMessage('서버와의 통신에 실패했습니다.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="a_modal-content">
        <button className="modal-close-icon" onClick={onClose}>×</button>
        <h2>환자 추가하기</h2>
        <p>해당 칸에 UUID를 입력해주세요</p>
        <input
          type="text"
          value={uuid}
          onChange={(e) => setUuid(e.target.value)}
          placeholder="UUID 입력"
          className="modal-input"
        />
        {message && <p className="modal-message">{message}</p>}
        <button onClick={handleAddPatient} className="modal-button">등록하기</button>
      </div>
    </div>
  );
};

export default AddPatientModal;
