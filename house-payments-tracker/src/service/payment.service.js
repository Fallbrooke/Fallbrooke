// services/paymentService.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Function to fetch payments
const fetchPayments = async () => {
  const { data } = await axios.get('http://localhost:8080/api/v1/payments');
  return data;
};

// Function to post a payment
export const postPayment = async (payment) => {
  await axios.post('http://localhost:8080/api/v1/payments', payment);
};

// Function to fetch payment types
const fetchPaymentTypes = async () => {
  const { data } = await axios.get(
    'http://localhost:8080/api/v1/payments/types'
  );
  return data;
};

// Custom hook to use in your component
export const usePayments = () => {
  return useQuery({ queryKey: ['payments'], queryFn: fetchPayments });
};

// Custom hook for posting a payment
export const usePostPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postPayment,
    // After the payment is successfully posted, invalidate the 'payments' query to refresh the data
    onSuccess: () => {
      queryClient.invalidateQueries(['payments']);
    }
  });
};

// Custom hook to fetch payment types
export const usePaymentTypes = () => {
  return useQuery({ queryKey: ['paymentTypes'], queryFn: fetchPaymentTypes });
};
