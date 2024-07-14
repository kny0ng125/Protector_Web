import React, { useState } from 'react';
import './HealthCharts.css';

const HealthCharts = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('3 Months');

  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  return (
    <div className="health-charts">
      <div className="chart-header">
        <span>측정 기간 :</span>
        <select value={selectedPeriod} onChange={handlePeriodChange}>
          <option value="1 Month">1 Month</option>
          <option value="3 Months">3 Months</option>
          <option value="6 Months">6 Months</option>
          <option value="1 Year">1 Year</option>
        </select>
      </div>
      <div className="charts-grid">
        <div className="chart">
          <h3>혈압</h3>
          <div className="chart-placeholder">차트 컴포넌트 위치</div>
        </div>
        <div className="chart">
          <h3>심박수</h3>
          <div className="chart-placeholder">차트 컴포넌트 위치</div>
        </div>
        <div className="chart">
          <h3>심전도</h3>
          <div className="chart-placeholder">차트 컴포넌트 위치</div>
        </div>
        <div className="chart">
          <h3>수면시간</h3>
          <div className="chart-placeholder">차트 컴포넌트 위치</div>
        </div>
        <div className="chart">
          <h3>산소 포화도</h3>
          <div className="chart-placeholder">차트 컴포넌트 위치</div>
        </div>
        <div className="chart">
          <h3>스트레스</h3>
          <div className="chart-placeholder">차트 컴포넌트 위치</div>
        </div>
      </div>
    </div>
  );
};

export default HealthCharts;
