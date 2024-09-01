import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale, // 추가된 부분: TimeScale 등록
} from 'chart.js';
import 'chartjs-adapter-date-fns'; // 추가된 부분: Date 어댑터를 import

// Chart.js 모듈 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale // 추가된 부분: TimeScale 등록
);

const SingleChart = ({ data, title }) => {
  if (!data || !data.content) {
    return <p>데이터를 불러오는 중 문제가 발생했습니다.</p>;
  }

  // 데이터 구조를 확인하여 기본 데이터 포인트 준비
  const labels = data.content.map((item) => item.measuredAt || item.startAt); // 시간
  const dataPoints = data.content.map((item) => item.value || item.average); // 측정값

  // 차트 데이터
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: title,
        data: dataPoints,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  // 차트 옵션
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'MM/dd',
          },
        },
      },
    },
  };

  return (
    <div>
      <Line data={chartData} options={options} height={500} width={1000}/>
    </div>
  );
};

export default SingleChart;
