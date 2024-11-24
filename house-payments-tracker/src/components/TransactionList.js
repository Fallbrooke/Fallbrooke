import React, { useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { usePayments } from '../service/payment.service';
import {
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import TransactionForm from './TransactionForm'; // Import the TransactionForm component

function TransactionList() {
  const { data, isLoading, error } = usePayments();

  // State for edit dialog
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // TODO: Implement state and functions to manage transactions, including deleting and updating

  // Handle Edit Click
  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
    setOpenEditDialog(true);
  };

  // Handle Edit Dialog Close
  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setSelectedTransaction(null);
  };

  // Handle Delete Click
  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      // TODO: Implement the delete functionality
    }
  };

  // Function to update a transaction
  const updateTransaction = (updatedTransaction) => {
    // TODO: Implement the update functionality
    // Close the dialog after updating
    handleEditDialogClose();
  };

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
      valueFormatter: (value) => format(new Date(value), 'MMM-dd-yyyy')
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
    { field: 'notes', headerName: 'Notes', flex: 2 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="Edit">
            <IconButton
              onClick={() => handleEditClick(params.row)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => handleDeleteClick(params.id)}
              color="secondary"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      )
    }
  ];

  const rows = data.map((transaction) => ({
    id: transaction._id,
    payer: transaction.payer,
    date: transaction.date,
    amount: transaction.amount,
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

          {/* Edit Transaction Dialog */}
          <Dialog
            open={openEditDialog}
            onClose={handleEditDialogClose}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogContent>
              {selectedTransaction && (
                <TransactionForm
                  transaction={selectedTransaction}
                  handleClose={handleEditDialogClose}
                  updateTransaction={updateTransaction}
                />
              )}
            </DialogContent>
          </Dialog>
        </>
      ) : null}
    </>
  );
}

export default TransactionList;
