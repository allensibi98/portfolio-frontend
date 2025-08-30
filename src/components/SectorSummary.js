'use client';

import React, { useMemo } from 'react';

const SectorSummary = ({ data }) => {
  const sectorSummary = useMemo(() => {
    if (!data || !Array.isArray(data.sectors)) return [];

    return data.sectors.map((sector) => {
      let totalInvestment = 0;
      let totalQuantity = 0;
      let presentValue = 0;

      sector.holdings.forEach((h) => {
        const investment = (h.purchasePrice || 0) * (h.quantity || 0);
        const present = (h.cmp || 0) * (h.quantity || 0);

        totalInvestment += investment;
        presentValue += present;
        totalQuantity += h.quantity || 0;
      });

      return {
        sector: sector.sector,
        totalInvestment,
        presentValue,
        gainLoss: presentValue - totalInvestment,
        totalQuantity,
      };
    });
  }, [data]);

  return (
    <div className="p-4 border rounded-lg shadow bg-white mb-4">
      <h2 className="text-xl font-bold mb-2">Sector Summary</h2>
      <table className="w-full border-collapse border border-gray-200 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 px-4 py-2 text-left">Sector</th>
            <th className="border border-gray-200 px-4 py-2 text-right">Investment</th>
            <th className="border border-gray-200 px-4 py-2 text-right">Present Value</th>
            <th className="border border-gray-200 px-4 py-2 text-right">Gain/Loss</th>
            <th className="border border-gray-200 px-4 py-2 text-right">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {sectorSummary.map((s, index) => (
            <tr key={index}>
              <td className="border border-gray-200 px-4 py-2">{s.sector}</td>
              <td className="border border-gray-200 px-4 py-2 text-right">
                ₹{s.totalInvestment.toLocaleString()}
              </td>
              <td className="border border-gray-200 px-4 py-2 text-right">
                ₹{s.presentValue.toLocaleString()}
              </td>
              <td
                className={`border border-gray-200 px-4 py-2 text-right ${s.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
              >
                ₹{s.gainLoss.toLocaleString()}
              </td>
              <td className="border border-gray-200 px-4 py-2 text-right">
                {s.totalQuantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SectorSummary;