// PaymentTypeBarChart.js
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

function PaymentTypeBarChart({ transactions }) {
  // Define payers and payment types
  const payers = Array.from(new Set(transactions.map((t) => t.payer)));
  const paymentTypes = Array.from(new Set(transactions.map((t) => t.type)));

  // Initialize data structure
  const data = payers.map((payer) => ({
    payer,
    Mortgage: 0,
    Principal: 0,
    'Other Payment': 0
  }));

  // Aggregate amounts per payer and payment type
  transactions.forEach((transaction) => {
    const dataItem = data.find((item) => item.payer === transaction.payer);
    if (dataItem && paymentTypes.includes(transaction.type)) {
      dataItem[transaction.type] += transaction.amount;
    }
  });

  // Colors for the bars
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <Paper sx={{ p: 2, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Payments by Type and Payer
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="payer" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          <Legend />
          {paymentTypes.map((type, index) => (
            <Bar
              key={type}
              dataKey={type}
              stackId="a"
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default PaymentTypeBarChart;
