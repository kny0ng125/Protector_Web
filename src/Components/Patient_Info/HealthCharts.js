import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import API_BASE_URL from '../Config';
import SingleChart from '../Chart/SingleChart';
import DoubleChart from '../Chart/DoubleChart';
import TripleChart from '../Chart/TripleChart';
import Modal from './ChartModal'; // 추가된 모달 컴포넌트
import './HealthCharts.css';

const HealthCharts = () => {
  const { id } = useParams();
  const { authFetch } = useContext(AuthContext);
  const [ecgData, setEcgData] = useState(null);
  const [hrvData, setHrvData] = useState(null);
  const [rrData, setRrData] = useState(null);
  const [oxygenSaturationData, setOxygenSaturationData] = useState(null);
  const [heartRateData, setHeartRateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [metricPeriod, setMetricPeriod] = useState('LAST_MONTH');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);

  const fetchMeasurementData = async (measurementType, setDataCallback, responseKey) => {
    try {
      const response = await authFetch(
        `${API_BASE_URL}/doctor/${measurementType}/${id}?page=&size=&metricPeriod=${metricPeriod}`, 
        {
          method: 'GET',
        }
      );

      if (response.status === 200) {
        const data = response.data;
        if (data && data[responseKey] && Array.isArray(data[responseKey].content)) {
          setDataCallback(data[responseKey]);
        } else {
          console.error(`Invalid response structure for ${measurementType}:`, data);
          setDataCallback({ content: [] });
        }
      } else {
        console.error(`Failed to fetch ${measurementType} data:`, response.statusText);
      }
    } catch (error) {
      console.error(`Error fetching ${measurementType} data:`, error);
      setDataCallback({ content: [] });
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchMeasurementData('ecg', setEcgData, 'ecgList'),
      fetchMeasurementData('hrv', setHrvData, 'hrvBySdnnList'),
      fetchMeasurementData('rr', setRrData, 'respiratoryRateList'),
      fetchMeasurementData('o2sat', setOxygenSaturationData, 'oxygenSaturationList'),
      fetchMeasurementData('hr', setHeartRateData, 'heartRateList')
    ])
    .then(() => setLoading(false))
    .catch((error) => {
      console.error('Error in fetching measurement data:', error);
      setLoading(false);
    });
  }, [id, authFetch, metricPeriod]);

  const handleChartClick = (chartComponent) => {
    setSelectedChart(chartComponent);
    setModalOpen(true);
  };

  if (loading) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className="health-charts">
      <div className="chart-header">
        <span>측정 기간 </span>
        <select value={metricPeriod} onChange={(e) => setMetricPeriod(e.target.value)}>
          <option value="LAST_WEEK">1주</option>
          <option value="LAST_MONTH">1개월</option>
          <option value="LAST_THREE_MONTHS">3개월</option>
        </select>
      </div>
      <div className="charts-grid">
        {ecgData && ecgData.content.length > 0 && (
          <div className="chart-box" onClick={() => handleChartClick(<SingleChart data={ecgData} title="심전도" />)}>
            <SingleChart data={ecgData} title="심전도" />
          </div>
        )}
        {hrvData && hrvData.content.length > 0 && (
          <div className="chart-box" onClick={() => handleChartClick(<SingleChart data={hrvData} title="심박수 변동성" />)}>
            <SingleChart data={hrvData} title="심박수 변동성" />
          </div>
        )}
        {rrData && rrData.content.length > 0 && (
          <div className="chart-box" onClick={() => handleChartClick(<SingleChart data={rrData} title="호흡률" />)}>
            <SingleChart data={rrData} title="호흡률" />
          </div>
        )}
        {oxygenSaturationData && oxygenSaturationData.content.length > 0 && (
          <div className="chart-box" onClick={() => handleChartClick(<DoubleChart oxygenSaturationData={oxygenSaturationData} title="산소 포화도" />)}>
            <DoubleChart oxygenSaturationData={oxygenSaturationData} title="산소 포화도" />
          </div>
        )}
        {heartRateData && heartRateData.content.length > 0 && (
          <div className="chart-box" onClick={() => handleChartClick(<TripleChart heartRateData={heartRateData} title="분당 심장 박동 수" />)}>
            <TripleChart heartRateData={heartRateData} title="분당 심장 박동 수" />
          </div>
        )}
      </div>
      <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
        {selectedChart}
      </Modal>
    </div>
  );
};

export default HealthCharts;
