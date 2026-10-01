import React, { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

interface BarSegment {
  label: string;
  value: number;
  color: string;
}

interface HorizontalStackedBarChartProps {
  segments: BarSegment[];
  title: string;
  subtitle: string;
  link?: {
    text: string;
    url: string;
  };
}

const HorizontalStackedBarChart: React.FC<HorizontalStackedBarChartProps> = ({
  segments,
  title,
  subtitle,
  link,
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const config: ChartConfiguration = {
          type: 'bar',
          data: {
            labels: [''],
            datasets: segments.map((segment) => ({
              label: segment.label,
              data: [segment.value],
              backgroundColor: segment.color,
              borderColor: 'white',
              borderWidth: 1,
            })),
          },
          options: {
            indexAxis: 'y',
            scales: {
              x: {
                stacked: true,
                display: false,
                max: 100,
              },
              y: {
                stacked: true,
                display: false,
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: (context) =>
                    `${context.dataset.label}: ${context.parsed.x}%`,
                },
              },
            },
            responsive: true,
            maintainAspectRatio: false,
          },
        };

        chartInstance.current = new Chart(ctx, config);
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [segments]);

  return (
    <div className="w-full max-w-[35rem]">
      <div className="flex flex-col md:flex-row gap-2 justify-between items-start md:items-center mb-2">
        <h6 className="text-h6 2xl:text-scaled-h6 font-semibold text-blue-500">
          {title}: <span className="font-medium">{subtitle}</span>
        </h6>
        {link && (
          <a
            href={link.url}
            className="text-omblue-500 text-h9 2xl:text-scaled-h9 font-semibold"
          >
            {link.text} &gt;
          </a>
        )}
      </div>
      <div className="h-12">
        <canvas ref={chartRef} />
      </div>
      <div className="mt-2 flex flex-wrap">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center mr-4 mb-2">
            <div
              className="w-4 h-4 mr-2"
              style={{ backgroundColor: segment.color }}
            ></div>
            <span>{segment.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalStackedBarChart;
