import type { CreateTransaction } from "../types/transaction/CreateTransaction";
import type { TransactionData } from "../types/transaction/TransactionData";
import axiosInstance from "./interceptor/axiosInstance";

// Create a new transaction
export const createTransaction = async (payload: CreateTransaction) => {
  try {
    const response = await axiosInstance.post(`/transactions/create`, payload);
    return response.data; // Return the response data from the backend
  } catch (error: any) {
    console.error('Error creating transaction:', error); // Log the error
    throw error; // Propagate the error
  }
};


// Fetch all transactions for a specific user account
export const getUserTransactions = async (accountNb: number) => {
  try {
    const response = await axiosInstance.get(`/transactions/getUserTransactions`, {
      params: { accountNb }, // Pass account number as query parameter
    });
    return response.data; // Return fetched transactions
  } catch (error: any) {
    console.error('Error fetching user transactions:', error); // Log the error
    throw error; // Propagate the error
  }
};

// Fetch recent transactions for the current user
export const fetchUserRecentTransactions = async (): Promise<TransactionData[]> => {
  try {
    const response = await axiosInstance.get("/transactions/getRecentUserTrans");
    return response.data?.data?.recentTransactions || []; // Return recent transactions or empty array
  } catch (error: any) {
    throw error; // Propagate the error
  }
};


export type TransactionValueOverTime = {
  date: string;
  totalValue: number;
};

export const fetchTransactionValueOverTime = async (): Promise<TransactionValueOverTime[]> => {
  try {
    const response = await axiosInstance.get('/transactions/value-over-time');
    return response.data?.data || [];
  } catch (error: any) {
    console.error('Error fetching transaction value over time:', error);
    throw error;
  }
};
