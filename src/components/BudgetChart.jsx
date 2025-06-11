import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import '../styles/PortfolioChart.css';
import { AccountContext } from "./AccountContext";


const defaultCategories = [
  { label: 'Housing', value: 'housing' },
  { label: 'Automobile', value: 'automobile' },
  { label: 'Utilities', value: 'utilities' },
  { label: 'Subscriptions', value: 'subscriptions' },
  { label: 'Groceries', value: 'groceries' },
  { label: 'Eating Out', value: 'eatingout' },
  { label: 'Saving', value: 'saving' },
  { label: 'Investing', value: 'investing' },
  { label: 'Gifts', value: 'gifts'}, 
  { label: 'Charity', value: 'charity'}, 
  { label: 'Leisure', value: 'leisure'}, 
  { label: 'Other necessary goods', value: 'goods'}, 
  { label: 'Other', value: 'other'},
];

export default function BudgetChart() {
  const [budget, setbudget] = useState([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/budget`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.budget) {
          setbudget(data.budget);
        }
      })
      .catch((err) => console.error('Failed to load budget:', err));
  }, []);

  const updatebudget = (newbudget) => {
    const sanitizedBudget = newbudget.map((item) => ({
      category: item.category,
      amount: Number(item.amount),
    }));
    setbudget(sanitizedBudget);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/budget`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({budget: sanitizedBudget}),
    }).catch((err) => console.error('Failed to save budget:', err));
  };

  const handleChange = (index, field, value) => {
    const updated = [...budget];
    updated[index] = { ...updated[index], [field]: field === 'amount' ? Number(value) : value };
    setbudget(updated);
  };

  const addAsset = () => {
    const newbudget = [...budget, { category: defaultCategories[0].value, amount: 0 }];
    setbudget(newbudget);
  };

  const removeAsset = (index) => {
    const updated = budget.filter((_, i) => i !== index);
    setbudget(updated);
  };

  const chartData = {
    labels: budget.map((a) => {
      const assetLabel = defaultCategories.find((d) => d.value === a.category)?.label;
      return assetLabel || a.categoy;
    }),
    datasets: [
      {
        data: budget.map((a) => Number(a.amount)),
        backgroundColor: [
          '#4f46e5', '#10b981', '#f59e0b', '#6b7280', '#0ea5e9', '#eab308', '#6366f1', '#ec4899', '#3b82f6', '#db2777',
          '#8b5cf6', '#ef4444', '#14b8a6', '#a855f7', '#f97316', '#22c55e', '#7c3aed', '#f43f5e', '#e11d48', '#0d9488'
        ],
      },
    ],
  };

  return (
    <div className="chart-container">
      <h3>Budget Overview</h3>

      <div className="portfolio-controls">
        {budget.map((entry, index) => (
          <div key={index} className="portfolio-entry">
            <select
              value={entry.category}
              onChange={(e) => handleChange(index, 'category', e.target.value)}
              className="asset-select"
            >
              {defaultCategories.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              step="1"
              value={entry.amount}
              onChange={(e) => handleChange(index, 'amount', e.target.value)}
              className="percent-input"
            />
            <button onClick={() => removeAsset(index)} className="remove-btn" title="Remove Asset">✖</button>
          </div>
        ))}
        <button onClick={addAsset} className="add-btn">+ Add Category</button>
        <button onClick={() => updatebudget(budget)} className="save-btn">
          Save budget
        </button>
      </div>
      <Pie data={chartData} />
    </div>

  );
}
