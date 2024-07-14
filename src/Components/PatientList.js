import React, { useState } from 'react';
import PatientItem from './PatientItem';
import './PatientList.css';

const PatientList = ({ searchTerm, searchBy, sortBy, showFavorites }) => {
  const [patients, setPatients] = useState([
    { name: '정재욱', id: '#XOEIF5GJ', registrationDate: '2024-01-01', isFavorite: false },
    { name: '여은동', id: '#EXFQ921K', registrationDate: '2024-02-15', isFavorite: true },
    { name: '현뚱따', id: '#MEQWRTX1', registrationDate: '2024-03-20', isFavorite: false },
    { name: '정진우', id: '#DGUCSE11', registrationDate: '2024-01-10', isFavorite: true }
  ]);

  const toggleFavorite = (id) => {
    setPatients(patients.map(patient => 
      patient.id === id ? { ...patient, isFavorite: !patient.isFavorite } : patient
    ));
  };

  const filteredPatients = patients
    .filter((patient) => {
      if (showFavorites && !patient.isFavorite) {
        return false;
      }
      if (searchBy === 'name') {
        return patient.name.includes(searchTerm);
      } else if (searchBy === 'id') {
        return patient.id.includes(searchTerm);
      }
      return false;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'id') {
        return a.id.localeCompare(b.id);
      } else if (sortBy === 'registrationDate') {
        return new Date(a.registrationDate) - new Date(b.registrationDate);
      }
      return 0;
    });

  return (
    <div className="patient-list">
      {filteredPatients.map((patient, index) => (
        <PatientItem key={index} patient={patient} toggleFavorite={toggleFavorite} />
      ))}
    </div>
  );
};

export default PatientList;
