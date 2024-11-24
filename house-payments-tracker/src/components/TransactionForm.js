import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
  InputLabel,
  FormControl,
  Snackbar,
  Alert
} from '@mui/material';
import Grid from '@mui/material/Grid2';

function TransactionForm({ addTransaction }) {
  const [payer, setPayer] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Mortgage');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const validate = () => {
    const errors = {};

    if (!payer) {
      errors.payer = 'Payer is required.';
    }

    if (!date) {
      errors.date = 'Date is required.';
    } else if (new Date(date) > new Date()) {
      errors.date = 'Date cannot be in the future.';
    }

    if (!amount) {
      errors.amount = 'Amount is required.';
    } else if (parseFloat(amount) <= 0) {
      errors.amount = 'Amount must be greater than zero.';
    }

    if (!type) {
      errors.type = 'Type is required.';
    }

    if (notes.length > 500) {
      errors.notes = 'Notes cannot exceed 500 characters.';
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const errorMessages = Object.values(validationErrors).join(' ');
      setSnackbarMessage(`Validation Error: ${errorMessages}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } else {
      const newTransaction = {
        id: uuidv4(),
        payer,
        date,
        amount: parseFloat(amount),
        type,
        notes
      };
      addTransaction(newTransaction);
      // Reset form fields
      setPayer('');
      setDate('');
      setAmount('');
      setType('Mortgage');
      setNotes('');
      setErrors({});
      // Display success message
      setSnackbarMessage('Transaction added successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 3,
        mb: 3,
        p: 2,
        border: '1px solid #ccc',
        borderRadius: '8px'
      }}
      noValidate
      autoComplete="off"
    >
      <Grid container spacing={2}>
        {/* Payer Field */}
        <Grid item size={{ xs: 12, sm: 6 }}>
          <FormControl
            variant="outlined"
            fullWidth
            required
            error={!!errors.payer}
          >
            <InputLabel id="payer-label">Payer</InputLabel>
            <Select
              labelId="payer-label"
              label="Payer"
              value={payer}
              onChange={(e) => setPayer(e.target.value)} // Corrected handler
            >
              <MenuItem value="Amir">Amir</MenuItem>
              <MenuItem value="Vidya">Vidya</MenuItem>
              <MenuItem value="Ravi">Ravi</MenuItem>
            </Select>
            {errors.payer && (
              <Typography variant="body2" color="error">
                {errors.payer}
              </Typography>
            )}
          </FormControl>
        </Grid>
        {/* Date Field */}
        <Grid item size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Date"
            type="date"
            variant="outlined"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true
            }}
            required
            error={!!errors.date}
            helperText={errors.date}
          />
        </Grid>
        {/* Amount Field */}
        <Grid item size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Amount"
            type="number"
            variant="outlined"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputProps={{ step: '0.01' }}
            required
            error={!!errors.amount}
            helperText={errors.amount}
          />
        </Grid>
        {/* Type Field */}
        <Grid item size={{ xs: 12, sm: 6 }}>
          <FormControl
            variant="outlined"
            fullWidth
            required
            error={!!errors.type}
          >
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              labelId="type-label"
              label="Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <MenuItem value="Mortgage">Mortgage</MenuItem>
              <MenuItem value="Principal">Principal</MenuItem>
              <MenuItem value="Other Payment">Other Payment</MenuItem>
            </Select>
            {errors.type && (
              <Typography variant="body2" color="error">
                {errors.type}
              </Typography>
            )}
          </FormControl>
        </Grid>
        {/* Notes Field */}
        <Grid item size={{ xs: 12, sm: 12 }}>
          <TextField
            label="Notes"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            error={!!errors.notes}
            helperText={errors.notes}
          />
        </Grid>
        {/* Submit Button */}
        <Grid item size={{ xs: 12, sm: 12 }}>
          <Box textAlign="center" width="100%">
            <Button variant="contained" color="primary" type="submit">
              Add Transaction
            </Button>
          </Box>
        </Grid>
      </Grid>
      {/* Snackbar for displaying messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default TransactionForm;
