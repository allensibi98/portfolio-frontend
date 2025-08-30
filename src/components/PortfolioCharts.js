'use client';

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const PortfolioCharts = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data.sectors)) return [];

    return data.sectors.map((sector) => {
      let totalInvestment = 0;
      sector.holdings.forEach((h) => {
        totalInvestment += (h.purchasePrice || 0) * (h.quantity || 0);
      });
      return { name: sector.sector, value: totalInvestment };
    });
  }, [data]);

  return (
    <div className="p-4 border rounded-lg shadow bg-white mb-4">
      <h2 className="text-xl font-bold mb-2">Portfolio Allocation</h2>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(1)}%`
              }
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PortfolioCharts;


