import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

const DoubleChart = ({ oxygenSaturationData, title }) => {
  if (!oxygenSaturationData || !oxygenSaturationData.content) {
    console.log('Data:', oxygenSaturationData);
    return <p>데이터를 불러오는 중 문제가 발생했습니다.</p>;
  }

  const labels = oxygenSaturationData.content.map((item) => new Date(item.measuredAt));
  const o2SatData = oxygenSaturationData.content.map((item) => item.o2Sat * 100);
  const atmData = oxygenSaturationData.content.map((item) => item.atm);

  const barData = {
    labels,
    datasets: [
      {
        type: 'bar',
        label: '산소 포화도 (%)',
        data: o2SatData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderWidth: 1,
        yAxisID: 'y1',
      },
      {
        type: 'line',
        label: '대기압 (atm)',
        data: atmData,
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        yAxisID: 'y2',
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
        text: title, // title prop을 사용하여 차트 제목 설정
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
      y1: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: '산소 포화도 (%)',
        },
        ticks: {
          beginAtZero: true,
        },
      },
      y2: {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: '대기압 (atm)',
        },
        ticks: {
          beginAtZero: true,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div>
      <Bar data={barData} options={options} height={500} width={1000} />
    </div>
  );
};

export default DoubleChart;
