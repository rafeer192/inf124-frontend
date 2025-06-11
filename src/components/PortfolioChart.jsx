import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import '../styles/PortfolioChart.css';
import { AccountContext } from "./AccountContext";


const defaultAssets = [
  { label: 'Stocks', value: 'stocks' },
  { label: 'Crypto', value: 'crypto' },
  { label: 'Bonds', value: 'bonds' },
  { label: 'Cash', value: 'cash' },
  { label: 'Real Estate', value: 'realestate' },
  { label: 'Private Investment', value: 'private' },
  { label: 'Accounts Receivable', value: 'receivable' },
  { label: 'Other', value: 'other' },
];

export default function PortfolioChart() {
  const [portfolio, setPortfolio] = useState([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/some-endpoint`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.portfolio) {
          setPortfolio(data.portfolio);
        }
      })
      .catch((err) => console.error('Failed to load portfolio:', err));
  }, []);

  const updatePortfolio = (newPortfolio) => {
    const sanitizedPortfolio = newPortfolio.map((item) => ({
      asset: item.asset,
      percent: Number(item.percent),
    }));
    setPortfolio(sanitizedPortfolio);
    console.log(sanitizedPortfolio);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/some-endpoint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({portfolio: sanitizedPortfolio}),
    }).catch((err) => console.error('Failed to save portfolio:', err));
  };

  const handleChange = (index, field, value) => {
    const updated = [...portfolio];
    updated[index] = { ...updated[index], [field]: field === 'percent' ? Number(value) : value };
    setPortfolio(updated);
  };

  const addAsset = () => {
    const newPortfolio = [...portfolio, { asset: defaultAssets[0].value, percent: 0 }];
    setPortfolio(newPortfolio);
  };

  const removeAsset = (index) => {
    const updated = portfolio.filter((_, i) => i !== index);
    setPortfolio(updated);
  };

  const chartData = {
    labels: portfolio.map((a) => {
      const assetLabel = defaultAssets.find((d) => d.value === a.asset)?.label;
      return assetLabel || a.asset;
    }),
    datasets: [
      {
        data: portfolio.map((a) => Number(a.percent)),
        backgroundColor: [
          '#4f46e5', '#10b981', '#f59e0b', '#6b7280',
          '#8b5cf6', '#ef4444', '#14b8a6', '#a855f7'
        ],
      },
    ],
  };

  return (
    <div className="chart-container">
      <h3>Portfolio Overview</h3>

      <div className="portfolio-controls">
        {portfolio.map((entry, index) => (
          <div key={index} className="portfolio-entry">
            <select
              value={entry.asset}
              onChange={(e) => handleChange(index, 'asset', e.target.value)}
              className="asset-select"
            >
              {defaultAssets.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={entry.percent}
              onChange={(e) => handleChange(index, 'percent', e.target.value)}
              className="percent-input"
            />
            <span className="percent-symbol">%</span>
            <button onClick={() => removeAsset(index)} className="remove-btn" title="Remove Asset">✖</button>
          </div>
        ))}
        <button onClick={addAsset} className="add-btn">+ Add Asset</button>
        <button onClick={() => updatePortfolio(portfolio)} className="save-btn">
          Save Portfolio
        </button>
      </div>
      <Pie data={chartData} />
    </div>

  );
}
