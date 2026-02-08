import type { AccountForm } from "../types/account/AccountForm";
import type { DepositWithdraw } from "../types/account/DepositWithdraw";
import axiosInstance from "./interceptor/axiosInstance";

// Function to deposit money into an account
export const depositAmount = async (dw: DepositWithdraw) => {
  try {
    const response = await axiosInstance.put('/accounts/depositMoney', dw);
    return response.data.modifiedAcc; // Returning only the modified account
  } catch (error: any) {
    console.error('Error depositing amount:', error); // Log the error for debugging
    throw error; // Re-throw to allow higher-level error handling
  }
};

// Function to withdraw money from an account
export const withdrawAmount = async (dw: DepositWithdraw) => {
  try {
    const response = await axiosInstance.put('/accounts/withdrawMoney', dw);
    return response.data.modifiedAcc; // Returning only the modified account
  } catch (error: any) {
    console.error('Error withdrawing amount:', error);
    throw error;
  }
};

// Fetch all checking account numbers
export const getCheckingAccountsNbs = async () => {
  try {
    const response = await axiosInstance.get('/accounts/getCheckingAccountsNbs');
    return response.data; // Consider typing the response for better TypeScript safety
  } catch (error: any) {
    console.error('Error fetching checking account numbers:', error);
    throw error;
  }
};

// Fetch all account numbers (checking + others)
export const getAllAccountsNbs = async () => {
  try {
    const response = await axiosInstance.get('/accounts/getAllAccountsNbs');
    return response.data; // Consider typing the response for clarity
  } catch (error: any) {
    console.error('Error fetching all account numbers:', error);
    throw error;
  }
};

// Create a new bank account for a user
export const createUserBankAccount = async (newAccount: AccountForm) => {
  try {
    const newAcc = await axiosInstance.post('/accounts/createUserAccount', newAccount);
    return newAcc; // Could consider returning newAcc.data directly for consistency
  } catch (error: any) {
    console.error('Error creating user bank account:', error);
    throw error;
  }
};

// Fetch all account numbers associated with the current user
export const getAllAccountsNbsByUserId = async () => {
  try {
    const { data } = await axiosInstance.get("/accounts/getAllAccountsNbs");
    return data?.data?.accountNbs || []; // Fallback to empty array if no accounts
  } catch (error: any) {
    console.error("Error fetching account numbers:", error);
    throw error;
  }
};

// Fetch detailed information for a specific account
export const getAccountInfo = async (accountNb: number) => {
  try {
    const { data } = await axiosInstance.get(`/accounts/getAccountInfo/${accountNb}`);
    return data?.data?.accountInfo; // Optional chaining to avoid undefined errors
  } catch (error: any) {
    console.error("Error fetching account info:", error);
    throw error;
  }
};

// Generate a new unique account number
export const generateAccountNb = async () => {
  try {
    const newAccNb = await axiosInstance.get('/accounts/generateAccountNumber');
    return newAccNb.data.data.accountNb; // Ensure backend always returns the correct structure
  } catch (error: any) {
    console.error('error generating account number:', error);
    throw error;
  }
};

//Generate all accounts numbers present in the system
export const getAllAccountNbsInSystem = async (page = 1, search = "") => {
  try {
    const res = await axiosInstance.get("/accounts/all-account-nbs", {
      params: { page, limit: 5, search },
    });
    return res.data?.data;
  } catch (err) {
    console.error("Error fetching account numbers:", err);
    throw err;
  }
};

//Generate all accounts numbers except a certain account number
export const getAllAccountNbsExceptOne = async (
  excludeAccountNb: number,
  page = 1,
  search = ""
) => {
  try {
    const res = await axiosInstance.get("/accounts/all-account-nbs-except", {
      params: { exclude: excludeAccountNb, page, limit: 5, search },
    });

    return res.data?.data;
  } catch (err) {
    console.error("Error fetching account numbers (excluding one):", err);
    throw err;
  }
};

export type AccountTypePercentage = {
  type: string;
  count: number;
  percentage: number;
};
// Fetch total number of accounts (Analytics KPI)
export const fetchTotalAccounts = async (): Promise<number> => {
  try {
    const response = await axiosInstance.get('/accounts/total-accounts');
    return response.data?.data?.totalAccounts || 0;
  } catch (error: any) {
    console.error('Error fetching total accounts:', error);
    throw error;
  }
};

// Fetch total number of accounts types (Analytics KPI)
export const fetchAccountTypePercentage = async (): Promise<{
  total: number;
  breakdown: AccountTypePercentage[];
}> => {
  try {
    const response = await axiosInstance.get('/accounts/type-percentage');
    return response.data?.data || { total: 0, breakdown: [] };
  } catch (error: any) {
    console.error('Error fetching account type percentage:', error);
    throw error;
  }
};
