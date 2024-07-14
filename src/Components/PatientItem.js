import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PatientItem.css';

const PatientItem = ({ patient, toggleFavorite }) => {
  const navigate = useNavigate();

  const handleHistoryClick = () => {
    navigate('/history');
  };

  const handleInfoClick = () => {
    navigate('/health-info');
  };

  return (
    <div className="patient-item">
      <div className="patient-info">
        <span className="patient-name">{patient.name}</span>
        <span className="patient-id">{patient.id}</span>
        <span className="patient-date">{patient.registrationDate}</span>
      </div>
      <div className="patient-actions">
        <button className="action-button" onClick={handleInfoClick}>📊</button>
        <button className="action-button" onClick={handleHistoryClick}>📋</button>
        <button className="action-button" onClick={() => toggleFavorite(patient.id)}>
          {patient.isFavorite ? '⭐' : '☆'}
        </button>
      </div>
    </div>
  );
};

export default PatientItem;
