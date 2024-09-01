import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import API_BASE_URL from '../Config';
import './PatientItem.css';

const PatientItem = ({ patient,toggleFavorite, deletePatient }) => {
  const navigate = useNavigate();
  const { authFetch } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleHistoryClick = () => {
    navigate(`/history/${patient.id}`);
  };

  const handleInfoClick = () => {
    navigate(`/health-info/${patient.id}`);
  };

  const fetchFavoriteStatus = async () => {
    try {
      const response = await authFetch(`${API_BASE_URL}/doctor/patient/favorite/${patient.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': `application/json` // 필요 시 토큰 추가
        }
      })
      if (response.status === 200) {
        const favoriteStatus = response.data;
        setIsFavorite(favoriteStatus === 'FAVORITE'); // API의 응답에 따라 상태를 설정합니다.
      } else {
        console.error('Failed to fetch favorite status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching favorite status:', error);
    }
  };

  useEffect(() => {
    fetchFavoriteStatus(); // 컴포넌트 마운트 시 즐겨찾기 상태를 확인합니다.
  }, [patient.id]);


  return (
    <div className="patient-item">
      <div className="patient-infobutton">
        <div className="patient-details">
          <span className="patient-name">{patient.name}</span>
          <span className="patient-id">#{patient.uuid}</span>
        </div>
      </div>
      <div className="patient-actions">
        <button className="action-button" onClick={handleInfoClick}>📊</button>
        <button className="action-button" onClick={handleHistoryClick}>📋</button>
        <button className="action-button" onClick={() => toggleFavorite(patient.id, isFavorite)}>
          {isFavorite ? '⭐' : '☆'}
        </button>
        <button className="action-button" onClick={() => deletePatient(patient.id)}>❌</button>
      </div>
    </div>
  );
};

export default PatientItem;
