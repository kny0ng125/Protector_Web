import React from 'react';
import './PatientInfo.css';

const PatientInfo = () => {
  return (
    <div className="patient-info">
      <h2>환자 정보</h2>
      <p>UUID: ASTANKBOY</p>
      <p>Name: 정재욱</p>
      <p>Birth: 1999.11.16</p>
      <p>마지막 내원일: 2024.05.01</p>
    </div>
  );
};

export default PatientInfo;
