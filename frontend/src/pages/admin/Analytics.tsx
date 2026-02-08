// ===== React & Hooks =====
import React, { useEffect, useState } from "react";

// ===== Material UI Components =====
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  CircularProgress,
} from "@mui/material";

// ===== Recharts Components for Data Visualization =====
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

// ===== API Calls =====
import { fetchTotalUsers } from "../../api/userApi";
import {
  fetchTotalAccounts,
  fetchAccountTypePercentage,
  type AccountTypePercentage,
} from "../../api/accountApi";
import {
  fetchTransactionValueOverTime,
  type TransactionValueOverTime,
} from "../../api/transactionApi";

// ===== Color Palette for Pie Chart Segments =====
const PIE_COLORS = ["#1976d2", "#9c27b0", "#2e7d32", "#ed6c02"];

// ===== Analytics Dashboard Component =====
const Analytics: React.FC = () => {
  // ===== Loading State =====
  const [loading, setLoading] = useState(true);

  // ===== Analytics Data States =====
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [accountTypes, setAccountTypes] = useState<AccountTypePercentage[]>([]);
  const [transactions, setTransactions] = useState<TransactionValueOverTime[]>([]);

  // ===== Fetch All Analytics Data on Component Mount =====
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        // Fetch all required analytics data in parallel
        const [
          usersCount,
          accountsCount,
          accountTypeData,
          transactionData,
        ] = await Promise.all([
          fetchTotalUsers(),
          fetchTotalAccounts(),
          fetchAccountTypePercentage(),
          fetchTransactionValueOverTime(),
        ]);

        // Store fetched data in state
        setTotalUsers(usersCount);
        setTotalAccounts(accountsCount);
        setAccountTypes(accountTypeData.breakdown);
        setTransactions(transactionData);
      } catch (error) {
        // Log errors if data fetching fails
        console.error("Failed to load analytics:", error);
      } finally {
        // Stop loading spinner once data is processed
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  // ===== Loading Indicator =====
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  // ===== Main Dashboard UI =====
  return (
    <Box>
      <Container maxWidth="xl">

        {/* ===== Dashboard Header ===== */}
        <Box mb={5}>
          <Typography variant="h4" fontWeight="bold">
            Analytics Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Overview of users, accounts, and transaction activity
          </Typography>
        </Box>

        {/* ===== Section 1: Total Users & Accounts ===== */}
        <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
          <Typography variant="h5" fontWeight="bold" mb={1}>
            Total Number of Users and Accounts
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            High-level system growth indicators
          </Typography>

          <Grid container spacing={4}>
            {/* Total Users */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Users
              </Typography>
              <Typography variant="h2" fontWeight="bold">
                {totalUsers}
              </Typography>
            </Grid>

            {/* Total Accounts */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Accounts
              </Typography>
              <Typography variant="h2" fontWeight="bold">
                {totalAccounts}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* ===== Section 2: Account Type Distribution ===== */}
        <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
          <Typography variant="h5" fontWeight="bold" mb={1}>
            Account Type Distribution
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Percentage breakdown of account types
          </Typography>

          {/* Pie Chart for Account Types */}
          <ResponsiveContainer width="100%" height={420}>
            <PieChart>
              <Pie
                data={accountTypes}
                dataKey="percentage"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={130}
                label={({ payload }) =>
                  payload
                    ? `${payload.type}: ${payload.percentage}%`
                    : ""
                }
              >
                {/* Assign colors to each pie segment */}
                {accountTypes.map((_, index) => (
                  <Cell
                    key={index}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>

              {/* Tooltip showing percentage */}
              <Tooltip
                formatter={(value?: number) =>
                  value !== undefined ? `${value}%` : ""
                }
              />

              {/* Legend at bottom */}
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </Paper>

        {/* ===== Section 3: Transaction Value Over Time ===== */}
        <Paper sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" fontWeight="bold" mb={1}>
            Transaction Value Over Time
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Aggregate transaction volume trend
          </Typography>

          {/* Line Chart for Transaction Trends */}
          <ResponsiveContainer width="100%" height={420}>
            <LineChart data={transactions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />

              {/* Line representing total transaction value */}
              <Line
                type="monotone"
                dataKey="totalValue"
                name="Total Transaction Value"
                stroke="#1976d2"
                strokeWidth={3}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

      </Container>
    </Box>
  );
};

// ===== Export Component =====
export default Analytics;
