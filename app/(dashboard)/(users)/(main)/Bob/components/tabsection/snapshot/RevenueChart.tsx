'use client';
import { profile } from 'console';
import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const RevenueChart = ({ LastRevenues, currency }) => {
    const formatValue = (value) => {
        if (typeof value !== 'number') return '—';

        if (value >= 1000000) {
            return `${currency}${(value / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
        }

        if (value >= 1000) {
            return `${currency}${(value / 1000).toFixed(1).replace(/\.0$/, '')}K`;
        }

        return `$${value}`;
    };


    const formattedData = LastRevenues?.map((item, index) => {
        const value = item.Revenue;
        let numericValue;

        if (value.includes('M')) {
            numericValue = parseFloat(value.replace(/\$|M/g, '')) * 1000;
        } else {
            numericValue = parseFloat(value.replace(/\$|K/g, ''));
        }

        return {
            year: item.Year,
            revenue: numericValue,
            formattedRevenue: formatValue(value)
        };
    });

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm pb-10">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Revenue (Last 5 Years)</h2>

            {/* Enable horizontal scroll on mobile */}
            <div className="overflow-x-auto">
                {/* Force wide chart for scroll on small screens */}
                <div className="min-w-[600px]" style={{ height: '400px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                            <CartesianGrid horizontal vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="year"
                                axisLine={{ stroke: '#655B96', strokeWidth: 2 }}
                                tickLine={{ stroke: '#655B96', strokeWidth: 2 }}
                                tick={{ fill: '#475467', fontWeight: 'bold', fontSize: 14, dy: 8 }}
                                padding={{ left: 20, right: 20 }}
                            />
                            <YAxis
                                tickFormatter={(value) => {
                                    const format = (num) => (num % 1 === 0 ? num : num.toFixed(1));

                                    if (value >= 1_000_000_000) {
                                        return `${currency}${format(value / 1_000_000_000)}B`;
                                    } else if (value >= 1_000_000) {
                                        return `${currency}${format(value / 1_000_000)}M`;
                                    } else if (value >= 1_000) {
                                        return `${currency}${format(value / 1_000)}K`;
                                    } else {
                                        return `${currency}${value}`;
                                    }
                                }}

                                axisLine={{ stroke: '#655B96', strokeWidth: 2 }}
                                tickLine={{ stroke: '#655B96' }}
                                tick={{ fill: '#98A2B3', fontWeight: 'bold', fontSize: 14, dx: -8 }}
                                width={80}
                            />
                            <Tooltip
                                formatter={(value) => [formatValue(value), "Revenue"]}
                                labelFormatter={(year) => `Year: ${year}`}
                            />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#2357C6"
                                strokeWidth={3}
                                dot={{ r: 8, fill: '#2D65DD', strokeWidth: 0, stroke: '#ffffff' }}
                                activeDot={{ r: 8, fill: '#3b82f6', stroke: '#ffffff', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>


    );
};

export default RevenueChart;