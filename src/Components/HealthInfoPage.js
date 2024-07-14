import React from 'react';
import PatientInfo from './PatientInfo';
import Calendar from './Calendar';
import SearchAndList from './SearchAndList';
import HealthCharts from './HealthCharts';
import './HealthInfoPage.css';

const HealthInfoPage = () => {
  return (
    <div className="health-info-page">
      <div className="top-section">
        <PatientInfo />
        <Calendar />
        <SearchAndList />
      </div>
      <HealthCharts />
    </div>
  );
};

export default HealthInfoPage;
