import React from 'react';
import HorizontalStackedBarChart from '../ui/horizontal-stacked-bar-chart';

const chartData = [
  { label: 'Black-Owned Business', value: 30, color: '#5B657B' },
  { label: 'Expert', value: 40, color: '#6C8ED9' },
  { label: 'Consultants', value: 30, color: '#9BCCEF' },
];

const Funds = () => {
  return (
    <div className="">
      <HorizontalStackedBarChart
        segments={chartData}
        title="Purpose of Funds"
        subtitle="Equipment"
        link={{ text: 'View and contribute', url: '/fundraising' }}
      />
    </div>
  );
};

export default Funds;
