'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import OverallSummary from './OverallSummary';
import PortfolioCharts from './PortfolioCharts';
import SectorSummary from './SectorSummary';

const PortfolioTable = () => {
    const [data, setData] = useState([]);
    const [isWsConnected, setIsWsConnected] = useState(false);

    useEffect(() => {
        console.log('[FRONTEND] Attempting to connect to WebSocket...');
        const ws = new WebSocket('ws://localhost:8080');

        ws.onopen = () => {
            console.log('[FRONTEND] WebSocket connected');
            setIsWsConnected(true);
        };

        ws.onmessage = (event) => {
            console.log('Received data from WebSocket');
            try {
                const receivedData = JSON.parse(event.data);
                console.log("Received Data:", receivedData);

                if (receivedData && Array.isArray(receivedData.sectors)) {
                    setData(receivedData);
                    console.log('Portfolio data set.');
                } else {
                    console.warn('Invalid data format:', receivedData);
                }
            } catch (error) {
                console.error('Failed to parse JSON data', error);
            }
        };


        ws.onclose = () => {
            console.log('WebSocket disconnected');
            setIsWsConnected(false);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            ws.close();
        };
    }, []);

    // const flatData = useMemo(() => {
    //     if (!Array.isArray(data)) return [];
    //     return data.flatMap(sector =>
    //         (sector.holdings || []).map(h => ({
    //             ...h,
    //             sector: sector.sector,
    //             purchasePrice: Number(h.purchasePrice) || 0,
    //             quantity: Number(h.quantity) || 0,
    //             cmp: Number(h.cmp) || 0,
    //             gainLoss: Number(h.gainLoss) || 0,
    //             portfolioPercentage: Number(h.portfolioPercentage) || 0,
    //         }))
    //     );
    // }, [data]);
    const flatData = useMemo(() => {
        if (!data || !Array.isArray(data.sectors)) return [];
        return data.sectors.flatMap(sector =>
            (sector.holdings || []).map(h => ({
                ...h,
                sector: sector.sector,
                purchasePrice: Number(h.purchasePrice) || 0,
                quantity: Number(h.quantity) || 0,
                cmp: Number(h.cmp) || 0,
                gainLoss: Number(h.gainLoss) || 0,
                portfolioPercentage: Number(h.portfolioPercentage) || 0,
            }))
        );
    }, [data]);


    const columns = useMemo(() => [
        { accessorKey: 'name', header: 'Stock' },
        { accessorKey: 'purchasePrice', header: 'Purchase Price' },
        { accessorKey: 'quantity', header: 'Qty' },
        {
            id: 'investment',
            header: 'Investment',
            accessorFn: row => row.purchasePrice * row.quantity,
            cell: info => `₹${Number(info.getValue() || 0).toFixed(2)}`,
        },
        {
            accessorKey: 'portfolioPercentage',
            header: 'Portfolio (%)',
            cell: info => (Number(info.getValue()) || 0).toFixed(2) + '%',
        },
        { accessorKey: 'exchange', header: 'Exchange' },
        {
            accessorKey: 'cmp',
            header: 'CMP',
            cell: info => info.getValue() ? `₹${Number(info.getValue()).toFixed(2)}` : 'N/A',
        },
        {
            id: 'presentValue',
            header: 'Present Value',
            accessorFn: row => row.cmp * row.quantity,
            cell: info => `₹${Number(info.getValue() || 0).toFixed(2)}`,
        },
        {
            id: 'gainLoss',
            header: 'Gain/Loss',
            accessorFn: row => row.gainLoss,
            cell: info => (
                <span className={info.getValue() >= 0 ? 'text-green-500' : 'text-red-500'}>
                    ₹{Number(info.getValue() || 0).toFixed(2)}
                </span>
            ),
        },

        { accessorKey: 'peRatio', header: 'P/E (TTM)' },
        { accessorKey: 'latestEarnings', header: 'Latest Earnings' },
        { accessorKey: 'marketCap', header: 'Market Cap' },
        { accessorKey: 'revenue', header: 'Revenue' },
        { accessorKey: 'ebitda', header: 'EBITDA' },
        { accessorKey: 'ebitdaPct', header: 'EBITDA (%)' },
        { accessorKey: 'pat', header: 'PAT' },
        { accessorKey: 'patPct', header: 'PAT (%)' },
        { accessorKey: 'freeCashFlow', header: 'Free Cash Flow' },
        { accessorKey: 'cfo', header: 'CFO' },
        { accessorKey: 'priceToSales', header: 'P/S' },
        { accessorKey: 'cfoToEbitda', header: 'CFO/EBITDA' },
        { accessorKey: 'cfoToPat', header: 'CFO/PAT' },
        { accessorKey: 'priceToBook', header: 'P/B' },
        { accessorKey: 'revenuePercent', header: 'Revenue %' },
        { accessorKey: 'profitPercent', header: 'Profit %' },
    ], []);

    const table = useReactTable({
        data: flatData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    // if (data.length === 0) {
    if (!data || !Array.isArray(data.sectors) || data.sectors.length === 0) {
        return (
            <div className="flex items-center justify-center p-8 text-gray-500">
                <svg className="animate-spin h-8 w-8 mr-3 text-blue-500" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 1016 0A8 8 0 004 12z"></path>
                </svg>
                {isWsConnected ? 'Waiting for data...' : 'Loading initial portfolio data...'}
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Financial Portfolio</h1>

            <OverallSummary data={data} />
            <PortfolioCharts data={data} />
            <SectorSummary data={data} />

            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Portfolio Holdings (Sector-wise)</h2>

                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse">
                        <thead className="bg-gray-100">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            className="px-4 py-2 text-left text-sm font-semibold text-gray-700"
                                        >
                                            {header.isPlaceholder ? null : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row, idx, arr) => {
                                const prevSector = idx > 0 ? arr[idx - 1].original.sector : null;
                                const currentSector = row.original.sector;
                                const showSectorRow = prevSector !== currentSector;

                                return (
                                    <React.Fragment key={row.id}>
                                        {showSectorRow && (
                                            <tr className="bg-blue-50">
                                                <td colSpan={columns.length} className="px-4 py-2 font-bold text-blue-800">
                                                    {currentSector}
                                                </td>
                                            </tr>
                                        )}
                                        <tr className="border-t border-gray-200">
                                            {row.getVisibleCells().map(cell => (
                                                <td key={cell.id} className="px-4 py-2 text-sm text-gray-600">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PortfolioTable;