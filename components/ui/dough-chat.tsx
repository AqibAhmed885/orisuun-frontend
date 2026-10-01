'use client';

import React, { useEffect, useRef } from 'react';
import { Chart, ChartData, registerables } from 'chart.js';

Chart.register(...registerables);

interface Section {
  name: string;
  color: string;
  percent: string;
}

interface DataSetItem {
  title: string;
  sections: Section[];
}

interface ChartProps {
  data: DataSetItem;
  className?: string;
}

const DoughnutChart: React.FC<ChartProps> = ({ data, className }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart<'doughnut', number[], string> | null>(
    null
  );

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const chartData: ChartData<'doughnut', number[], string> = {
      labels: data.sections.map((section) => section.name),
      datasets: [
        {
          data: data.sections.map((section) => parseFloat(section.percent)),
          backgroundColor: data.sections.map((section) => section.color),
          borderWidth: 1,
          borderColor: '#fff',
        },
      ],
    };

    chartInstance.current = new Chart<'doughnut', number[], string>(ctx, {
      type: 'doughnut',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.formattedValue;
                return `${label}: ${value}%`;
              },
            },
          },
        },
        cutout: '60%',
        radius: '90%',
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className={`w-full h-full ${className || ''}`}>
      <canvas ref={chartRef} className="w-full h-full" />
    </div>
  );
};

export default DoughnutChart;
