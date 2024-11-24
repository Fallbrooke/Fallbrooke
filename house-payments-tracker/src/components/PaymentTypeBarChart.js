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
import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { usePayments, usePaymentTypes } from '../service/payment.service';

function PaymentTypeBarChart() {
  const {
    data: transactions,
    isLoading: isPaymentsLoading,
    error: paymentsError
  } = usePayments();
  const {
    data: paymentTypesList,
    isLoading: isPaymentTypesLoading,
    error: paymentTypesError
  } = usePaymentTypes();

  // Handle loading state
  if (isPaymentsLoading || isPaymentTypesLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Handle error state
  if (paymentsError || paymentTypesError) {
    return (
      <Typography color="error" sx={{ mt: 4 }}>
        Error: {paymentsError?.message || paymentTypesError?.message}
      </Typography>
    );
  }
  // Define payers and payment types
  const payers = Array.from(new Set(transactions?.map((t) => t.payer)));

  const data = payers.map((payer) => {
    const obj = { payer };
    paymentTypesList.forEach((type) => {
      obj[type] = 0;
    });
    return obj;
  });

  // Aggregate amounts per payer and payment type
  if (Array.isArray(transactions) && transactions?.length > 0) {
    transactions?.forEach((transaction) => {
      const dataItem = data.find((item) => item.payer === transaction.payer);
      if (dataItem && paymentTypesList.includes(transaction.type)) {
        dataItem[transaction.type] += transaction.amount;
      }
    });
  }

  // Colors for the bars
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <>
      {Array.isArray(data) && data?.length > 0 ? (
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
              {paymentTypesList.map((type, index) => (
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
      ) : null}
    </>
  );
}

export default PaymentTypeBarChart;
