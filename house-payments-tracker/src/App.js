// App.js
import React, { useState } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import {
  createTheme,
  ThemeProvider,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PaymentChart from './components/PaymentChart';
import PaymentTypeBarChart from './components/PaymentTypeBarChart';
import PayerContributionPieChart from './components/PayerContributionPieChart';

function App() {
  const [transactions, setTransactions] = useState([
    {
      id: 'cb30e513-e0a9-4bc6-b90e-253948c8dedb',
      payer: 'Amir',
      date: '2024-11-14',
      amount: 5500,
      type: 'Mortgage',
      notes: ''
    },
    {
      id: '10fafbc2-27a8-4826-b53e-9d39e38103b8',
      payer: 'Ravi',
      date: '2024-10-15',
      amount: 3000,
      type: 'Mortgage',
      notes: ''
    },
    {
      id: 'bed8a58e-ed75-45dc-a234-8f00f1781052',
      payer: 'Amir',
      date: '2024-10-15',
      amount: 5500,
      type: 'Mortgage',
      notes: ''
    }
  ]);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2' // Customize primary color
      },
      secondary: {
        main: '#dc004e' // Customize secondary color
      }
    }
  });

  const addTransaction = (transaction) => {
    setTransactions([...transactions, transaction]);
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App" style={{ width: '95%', margin: '1rem auto' }}>
        <h1>House Payments Tracker</h1>
        <TransactionList transactions={transactions} />
        {/* Include the Bar Chart for Payment Types */}
        <PaymentTypeBarChart transactions={transactions} />

        {/* Include the Pie Chart for Payer Contributions */}
        <PayerContributionPieChart transactions={transactions} />

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleOpen}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16
          }}
        >
          <AddIcon />
        </Fab>

        {/* Dialog containing the TransactionForm */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle sx={{ textAlign: 'center' }}>
            Add New Transaction
          </DialogTitle>
          <DialogContent>
            <TransactionForm
              addTransaction={addTransaction}
              handleClose={handleClose}
            />
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}

export default App;
