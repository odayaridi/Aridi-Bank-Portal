import React, { useEffect, useState } from "react";
import { Box, Typography, Divider, CircularProgress } from "@mui/material";
import DebitCardList from "../../components/lists/DebitCardList";
import TransactionTable from "../../components/tables/TransactionTable";
import { fetchUserRecentTransactions } from "../../api/transactionApi";
import { useAlert } from "../../hooks/useAlert";
import AlertSnackbar from "../../components/common/AlertSnackbar";
import type { TransactionData } from "../../types/transaction/TransactionData";

/**
 * Dashboard Page Component
 *
 * This component serves as the central hub for users to view their banking information.
 * It includes:
 * - A title and subtitle describing the page purpose.
 * - A section listing the user's debit cards.
 * - A section displaying recent transactions.
 * - Loading state and error handling with an alert snackbar.
 */
export default function Dashboard() {
  // State to store recent transactions
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  
  // State to manage loading indicator
  const [loading, setLoading] = useState(true);

  // Custom alert hook for showing messages
  const { alertInfo, showAlert, handleClose } = useAlert();

  // Fetch recent transactions on component mount
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await fetchUserRecentTransactions();
        setTransactions(data);
      } catch (error: any) {
        showAlert(error?.response?.data?.message || "Failed to fetch transactions", "error");
      } finally {
        setLoading(false);
      }
    };
    loadTransactions();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#f9fafc",
        p: { xs: 2, sm: 4 },
      }}
    >
      {/* === Title & Subtitle (Top Left) === */}
      <Box sx={{ mb: 4, textAlign: "left" }}>
        {/* Main Page Title */}
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          My Dashboard
        </Typography>

        {/* Subtitle / Description */}
        <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
          Your central hub for your banking information
        </Typography>

        {/* Divider */}
        <hr></hr>
      </Box>

      {/* === Section 1: My Debit Cards === */}
      <Box sx={{ mb: 6 }}>
        {/* Section Title */}
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, mb: 2, color: "#00264d" }}
        >
          My Debit Cards
        </Typography>

        {/* Section Subtitle */}
        <Typography
          variant="subtitle2"
          sx={{ mb: 3, color: "text.secondary" }}
        >
          Review your active and expired debit cards
        </Typography>

        {/* Debit Card List Container */}
        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: 4,
            bgcolor: "white",
          }}
        >
          <DebitCardList />
        </Box>
      </Box>

      {/* Divider between sections */}
      <Divider sx={{ my: 4 }} />

      {/* === Section 2: Recent Transactions === */}
      <Box sx={{ textAlign: "left" }}>
        {/* Section Title */}
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, mb: 2, color: "#00264d" }}
        >
          Recent Transactions
        </Typography>

        {/* Section Subtitle */}
        <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 3 }}>
          Check your latest financial activities
        </Typography>

        {/* Transactions Table or Loading Indicator */}
        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: 4,
            bgcolor: "white",
            minHeight: 250,
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TransactionTable transactions={transactions} />
          )}
        </Box>
      </Box>

      {/* === Alert Snackbar for Notifications / Errors === */}
      <AlertSnackbar
        open={alertInfo.open}
        message={alertInfo.message}
        severity={alertInfo.severity}
        onClose={handleClose}
      />
    </Box>
  ); 
}
