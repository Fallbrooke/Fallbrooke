// PayerContributionPieChart.js
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Paper, Typography } from '@mui/material';

function PayerContributionPieChart({ transactions }) {
  // Process the data
  const payerTotals = transactions.reduce((acc, transaction) => {
    const { payer, amount } = transaction;
    acc[payer] = (acc[payer] || 0) + amount;
    return acc;
  }, {});

  // Prepare data for the chart
  const data = Object.keys(payerTotals).map((payer) => ({
    name: payer,
    value: payerTotals[payer]
  }));

  // Colors for the chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <Paper sx={{ p: 2, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Payer Contribution Percentage
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(1)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default PayerContributionPieChart;
