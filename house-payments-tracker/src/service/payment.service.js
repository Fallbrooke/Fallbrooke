// services/paymentService.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = 'http://localhost:8080/api/v1/payments';

// Function to fetch payments
const fetchPayments = async () => {
  const { data } = await axios.get(API_BASE_URL);
  return data;
};

// Function to post a payment
export const postPayment = async (payment) => {
  await axios.post(API_BASE_URL, payment);
};

// Function to update a payment
export const updatePayment = async (payment) => {
  await axios.put(`${API_BASE_URL}/${payment.id}`, payment);
};

// Function to delete a payment
export const deletePayment = async (id) => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};

// Function to fetch payment types
const fetchPaymentTypes = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/types`);
  return data;
};

// Custom hook to fetch payments
export const usePayments = () => {
  return useQuery({ queryKey: ['payments'], queryFn: fetchPayments });
};

// Custom hook for posting a payment
export const usePostPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postPayment,
    onSuccess: () => {
      queryClient.invalidateQueries(['payments']);
    }
  });
};

// Custom hook for updating a payment
export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePayment,
    onSuccess: () => {
      queryClient.invalidateQueries(['payments']);
    }
  });
};

// Custom hook for deleting a payment
export const useDeletePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePayment,
    onSuccess: () => {
      queryClient.invalidateQueries(['payments']);
    }
  });
};

// Custom hook to fetch payment types
export const usePaymentTypes = () => {
  return useQuery({ queryKey: ['paymentTypes'], queryFn: fetchPaymentTypes });
};
