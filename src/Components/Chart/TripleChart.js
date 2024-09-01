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
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const TripleChart = ({ heartRateData, title }) => {
  if (!heartRateData || !heartRateData.content) {
    console.error('Invalid data passed to TripleChart:', heartRateData);
    return <p>데이터를 불러오는 중 문제가 발생했습니다.</p>;
  }

  console.log('TripleChart received data:', heartRateData);

  const labels = heartRateData.content.map((item) => item.startAt);
  const minData = heartRateData.content.map((item) => item.minimum);
  const maxData = heartRateData.content.map((item) => item.maximum);
  const avgData = heartRateData.content.map((item) => item.average);

  const lineData = {
    labels,
    datasets: [
      {
        label: '최소 심박수',
        data: minData,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
      },
      {
        label: '최대 심박수',
        data: maxData,
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
      },
      {
        label: '평균 심박수',
        data: avgData,
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '심박수 변화 추이',
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
        title: {
          display: true,
          text: '날짜',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '심박수 (bpm)',
        },
      },
    },
  };

  return (
    <div>
      
      <Line data={lineData} options={options} height={500} width={1000}/>
    </div>
  );
};

export default TripleChart;
