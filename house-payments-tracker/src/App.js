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
import PaymentTypeBarChart from './components/PaymentTypeBarChart';
import PayerContributionPieChart from './components/PayerContributionPieChart';
import Grid from '@mui/material/Grid2';

function App() {
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

  return (
    <ThemeProvider theme={theme}>
      <div className="App" style={{ width: '95%', margin: '1rem auto' }}>
        <h1>House Payments Tracker</h1>
        <Grid container spacing={2}>
          <Grid item size={{ xs: 12, sm: 8 }}>
            <TransactionList />
          </Grid>
          <Grid item size={{ xs: 12, sm: 4 }}>
            <PaymentTypeBarChart />
            <PayerContributionPieChart />
          </Grid>
        </Grid>
        <TransactionList />
        {/* Include the Bar Chart for Payment Types */}
        <PaymentTypeBarChart />

        {/* Include the Pie Chart for Payer Contributions */}
        <PayerContributionPieChart />

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
            <TransactionForm handleClose={handleClose} />
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}

export default App;
