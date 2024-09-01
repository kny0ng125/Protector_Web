import React, { useEffect, useState, useContext } from 'react';
import './PatientInfo.css';

const PatientInfo = ({ patient }) => {
  return (
    <div className="patient-info">
      <h2>환자 정보</h2>
      <p>UUID: {patient.uuid}</p>
      <p>Name: {patient.name}</p>
      <p>성별: {patient.gender === 'FEMALE' ? '여성' : '남성'}</p>
      <p>연락처: {patient.phone}</p>
      <p>E-mail: {patient.email}</p>
      <p>Birth: {patient.birth}</p>
      <p>마지막 내원일: {patient.lastAppointmentAt || '내원 기록 없음'}</p>
    </div>
  );
};

export default PatientInfo;
