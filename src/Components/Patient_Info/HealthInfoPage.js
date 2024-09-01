import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API_BASE_URL from '../Config';
import { AuthContext } from '../AuthContext';
import PatientInfo from './PatientInfo';
import Calendar from './Calendar';
import HealthCharts from './HealthCharts';
import './HealthInfoPage.css';

const HealthInfoPage = () => {
  const { id } = useParams();
  const { authFetch } = useContext(AuthContext);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await authFetch(`${API_BASE_URL}/doctor/patient/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 200) {
          setPatientData(response.data);
        } else {
          console.error('Error fetching patient data:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id, authFetch]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!patientData) {
    return <p>환자 데이터를 불러오지 못했습니다.</p>;
  }

  return (
    <div className="health-info-page">
      <div className="top-section">
        <PatientInfo patient={patientData} />
        <Calendar />
      </div>
      <div className="charts-section">
        <HealthCharts />
      </div>
    </div>
  );
};

export default HealthInfoPage;
