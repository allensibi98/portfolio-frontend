'use client';

import React, { useMemo } from 'react';

const OverallSummary = ({ data }) => {
  const summary = useMemo(() => {
    if (!data || !Array.isArray(data.sectors)) {
      return {
        totalInvestment: 0,
        totalPresentValue: 0,
        totalGainLoss: 0,
        totalStocks: 0,
      };
    }

    let totalInvestment = 0;
    let totalPresentValue = 0;
    let totalGainLoss = 0;
    let totalStocks = 0;

    data.sectors.forEach((sector) => {
      sector.holdings.forEach((h) => {
        const investment = (h.purchasePrice || 0) * (h.quantity || 0);
        const present = (h.cmp || 0) * (h.quantity || 0);
        const gainLoss = present - investment;

        totalInvestment += investment;
        totalPresentValue += present;
        totalGainLoss += gainLoss;
        totalStocks += 1;
      });
    });

    return { totalInvestment, totalPresentValue, totalGainLoss, totalStocks };
  }, [data]);

  return (
    <div className="p-4 border rounded-lg shadow bg-white mb-4">
      <h2 className="text-xl font-bold mb-2">Overall Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-gray-600">Total Investment</p>
          <p className="text-lg font-semibold">₹{summary.totalInvestment.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-600">Present Value</p>
          <p className="text-lg font-semibold">₹{summary.totalPresentValue.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-600">Gain/Loss</p>
          <p
            className={`text-lg font-semibold ${summary.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
          >
            ₹{summary.totalGainLoss.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Total Stocks</p>
          <p className="text-lg font-semibold">{summary.totalStocks}</p>
        </div>
      </div>
    </div>
  );
};

export default OverallSummary;


