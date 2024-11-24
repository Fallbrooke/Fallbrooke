import React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { usePayments } from '../service/payment.service';
import { Paper, Typography } from '@mui/material';

function TransactionList() {
  // Using the custom hook from paymentService.js
  const { data, isLoading, error } = usePayments();

  // TODO: Add a loading spinner or error message
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const columns = [
    { field: 'payer', headerName: 'Payer', flex: 1 },
    {
      field: 'date',
      headerName: 'Date',
      type: 'date',
      flex: 1,
      valueGetter: (value) => new Date(value),
      valueFormatter: (value) => {
        const valueFormatted = new Date(value).toLocaleDateString();
        return `${valueFormatted}`;
      }
    },
    {
      field: 'amount',
      headerName: 'Amount ($)',
      type: 'number',
      flex: 1,
      valueFormatter: (value) => {
        return `$${Number.parseFloat(value)?.toFixed(2)}`;
      }
    },
    { field: 'type', headerName: 'Type', flex: 1 },
    { field: 'notes', headerName: 'Notes', flex: 2 }
  ];

  const rows = data.map((transaction) => ({
    id: transaction._id,
    payer: transaction.payer,
    date: transaction.date, // Should be in a parsable date format
    amount: transaction.amount, // Ensure this is a number
    type: transaction.type,
    notes: transaction.notes
  }));

  return (
    <>
      {Array.isArray(data) && data?.length > 0 ? (
        <>
          <Paper
            sx={{ p: 2, mt: 4 }}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <Typography variant="h6" gutterBottom>
              Payment History
            </Typography>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              autoHeight
              slots={{ toolbar: GridToolbar }}
              disableColumnFilter
            />
          </Paper>
        </>
      ) : null}
    </>
  );
}

export default TransactionList;
