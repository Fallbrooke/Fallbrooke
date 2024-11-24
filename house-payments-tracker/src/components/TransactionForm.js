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
  FormControl
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { usePostPayment, useUpdatePayment } from '../service/payment.service';
import CustomSnackbar from '../components/CustomSnackbar';

function TransactionForm({ handleClose, transaction, updateTransaction }) {
  const [payer, setPayer] = useState(transaction ? transaction.payer : '');
  const [date, setDate] = useState(
    transaction ? transaction.date.slice(0, 10) : ''
  );
  const [amount, setAmount] = useState(transaction ? transaction.amount : '');
  const [type, setType] = useState(
    transaction ? transaction.type : 'Principal'
  );
  const [notes, setNotes] = useState(transaction ? transaction.notes : '');

  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const { mutate: addPayment, isLoading: isPosting, error } = usePostPayment();
  const {
    mutate: updatePayment,
    isLoading: isUpdating,
    error: updateError
  } = useUpdatePayment();

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
        id: transaction ? transaction.id : uuidv4(),
        payer,
        date: new Date(date).toISOString(),
        amount: parseFloat(amount),
        type,
        notes
      };

      if (transaction) {
        // Update existing transaction
        updatePayment(newTransaction);
      } else {
        // Add new transaction
        addPayment(newTransaction);
      }

      // Reset form fields
      setPayer('');
      setDate('');
      setAmount('');
      setType('Mortgage');
      setNotes('');
      setErrors({});
      // Display success message
      setSnackbarMessage(
        transaction
          ? 'Transaction updated successfully!'
          : 'Transaction added successfully!'
      );
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleClose();
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (isPosting || isUpdating) {
    return <div>Loading...</div>;
  }

  if (error || updateError) {
    return <div>Error: {(error || updateError).message}</div>;
  }

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
        <Grid item xs={12} sm={6}>
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
              onChange={(e) => setPayer(e.target.value)}
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
        <Grid item xs={12} sm={6}>
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
        <Grid item xs={12} sm={6}>
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
        <Grid item xs={12} sm={6}>
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
              <MenuItem value="Principal">Principal</MenuItem>
              <MenuItem value="Mortgage">Mortgage</MenuItem>
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
        <Grid item xs={12}>
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
        <Grid item xs={12}>
          <Box textAlign="center" width="100%">
            <Button variant="contained" color="primary" type="submit">
              {transaction ? 'Update Transaction' : 'Add Transaction'}
            </Button>
          </Box>
        </Grid>
      </Grid>
      {/* Snackbar for displaying messages */}
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
}

export default TransactionForm;
