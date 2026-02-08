import React, { useState, useEffect } from "react";
import { Box, Typography, Select, MenuItem, Button, FormControl, InputLabel } from "@mui/material";
import TransactionTable from "../../components/tables/TransactionTable";
import TransactionForm from "../../components/forms/TransactionForm";
import { getUserTransactions } from "../../api/transactionApi";
import type { TransactionData } from "../../types/transaction/TransactionData";
import { getAllAccountsNbs } from "../../api/accountApi";

/**
 * Transactions Page Component
 *
 * This component allows the user to:
 * - View transaction history for their accounts
 * - Send money via a transaction form
 * 
 * Features include:
 * - Account selection dropdown
 * - Transaction table with loading state
 * - Secure money transfer form
 */
export default function Transactions() {
  // List of user's account numbers for dropdown selection
  const [accountNbs, setAccountNbs] = useState<number[]>([]);

  // Currently selected account for viewing transactions
  const [selectedAccount, setSelectedAccount] = useState<number | "">("");

  // Transactions fetched for the selected account
  const [transactions, setTransactions] = useState<TransactionData[]>([]);

  // Loading state while fetching transactions
  const [loading, setLoading] = useState(false);

  /**
   * Fetch all account numbers on component mount
   * Populates the dropdown for account selection
   */
  useEffect(() => {
    (async () => {
      try {
        const res = await getAllAccountsNbs();
        setAccountNbs(res.data.accountNbs || []);
      } catch (err) {
        console.error("Error fetching account numbers:", err);
      }
    })();
  }, []);

  /**
   * Fetch transactions for the selected account
   * Triggered when "Show Transactions" button is clicked
   */
  const handleShowTransactions = async () => {
    if (!selectedAccount) return;

    setLoading(true);
    try {
      const res = await getUserTransactions(selectedAccount);
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* === Section 1: Transactions === */}
      {/* Page Title and Subtitle */}
      <Box sx={{ mb: 4, textAlign: "left" }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Transactions
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
          View your transaction history by selecting an account.
        </Typography>
        <hr></hr>
      </Box>

      {/* Account Selection & Show Transactions Button */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Select Account</InputLabel>
          <Select
            value={selectedAccount}
            label="Select Account"
            onChange={(e) => setSelectedAccount(Number(e.target.value))}
          >
            {accountNbs.map((nb) => (
              <MenuItem key={nb} value={nb}>
                {nb}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleShowTransactions}
          disabled={!selectedAccount}
        >
          Show Transactions
        </Button>
      </Box>

      {/* Transactions Table */}
      <TransactionTable transactions={transactions} loading={loading} />

      {/* === Section 2: Send Money === */}
      <Box mt={6}>
        {/* Section Title */}
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Send Money
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" mb={2}>
          Transfer money securely between accounts.
        </Typography>

        {/* Transaction Form */}
        <TransactionForm />
      </Box>
    </Box>
  );
}
