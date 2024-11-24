// PaymentChart.js
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Paper, Typography } from '@mui/material';

function PaymentChart({ transactions }) {
  // Process the data
  const payerTotals = transactions.reduce((acc, transaction) => {
    const { payer, amount } = transaction;
    acc[payer] = (acc[payer] || 0) + amount;
    return acc;
  }, {});

  // Prepare data for the chart
  const data = Object.keys(payerTotals).map((payer) => ({
    name: payer,
    amount: payerTotals[payer]
  }));

  return (
    <Paper sx={{ p: 2, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Total Payments by Payer
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          <Legend />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default PaymentChart;
