import React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

function TransactionList({ transactions }) {
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

  const rows = transactions.map((transaction) => ({
    id: transaction.id,
    payer: transaction.payer,
    date: transaction.date, // Should be in a parsable date format
    amount: transaction.amount, // Ensure this is a number
    type: transaction.type,
    notes: transaction.notes
  }));

  return (
    <>
      <h2>Payment History</h2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          autoHeight
          slots={{ toolbar: GridToolbar }}
          disableColumnFilter
        />
      </div>
    </>
  );
}

export default TransactionList;
