import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  Paper,
  Typography,
  Divider,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import {
  AccountBalance,
  AttachMoney,
  ArrowDownward,
  ArrowUpward,
} from "@mui/icons-material";
import { useAlert } from "../../hooks/useAlert";
import type { DepositWithdraw } from "../../types/account/DepositWithdraw";
import { depositAmount, withdrawAmount, getAllAccountNbsInSystem } from "../../api/accountApi";
import AlertSnackbar from "../common/AlertSnackbar";

/**
 * DepositWithdrawForm Component
 * ----------------------------
 * A React component for managing deposit and withdrawal operations for a user's account.
 */
export default function DepositWithdrawForm() {
  // Custom alert hook for handling notifications
  const { open, message, severity, handleClose, showAlert } = useAlert();

  // -------------------------------
  // State Definitions
  // -------------------------------

  // Deposit form state
  const [depositData, setDepositData] = useState<DepositWithdraw>({
    accountNb: 0,
    amount: 0,
  });

  // Withdraw form state
  const [withdrawData, setWithdrawData] = useState<DepositWithdraw>({
    accountNb: 0,
    amount: 0,
  });

  // --- ACCOUNT NUMBER SEARCH & SCROLL STATE (SHARED) ---
  const [accOptions, setAccOptions] = useState<number[]>([]);
  const [accPage, setAccPage] = useState(1);
  const [accTotalPages, setAccTotalPages] = useState(1);
  const [accLoading, setAccLoading] = useState(false);
  const [accSearch, setAccSearch] = useState("");

  /** ----------------------------
   * ACCOUNT FETCHING LOGIC
   * ---------------------------- */
  useEffect(() => {
    let active = true;

    const fetchAccounts = async () => {
      setAccLoading(true);
      try {
        const res = await getAllAccountNbsInSystem(accPage, accSearch);
        if (active && res?.accounts) {
          const newAccounts = res.accounts.map((a: any) => a.accountNb);
          setAccTotalPages(res.totalPages || 1);

          if (accPage === 1) {
            setAccOptions(newAccounts);
          } else {
            // Append and remove duplicates
            setAccOptions((prev) => {
              const combined = [...prev, ...newAccounts];
              return [...new Set(combined)];
            });
          }
        }
      } catch (err) {
        console.error("Error fetching accounts:", err);
      } finally {
        if (active) setAccLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchAccounts();
    }, 400);

    return () => {
      clearTimeout(timer);
      active = false;
    };
  }, [accPage, accSearch]);

  const handleAccountScroll = (event: React.SyntheticEvent) => {
    const listboxNode = event.currentTarget;
    if (
      listboxNode.scrollTop + listboxNode.clientHeight >=
      listboxNode.scrollHeight - 5
    ) {
      if (!accLoading && accPage < accTotalPages) {
        setAccPage((prev) => prev + 1);
      }
    }
  };

  const handleAccountBlur = () => {
    setAccSearch("");
    setAccPage(1);
  };

  // -------------------------------
  // Event Handlers
  // -------------------------------

  /**
   * Handle deposit input changes (Amount only)
   */
  const handleDepositAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numericValue = Number(value);
    setDepositData((prev) => ({
      ...prev,
      amount: numericValue < 0 ? 0 : numericValue,
    }));
  };

  /**
   * Handle withdraw input changes (Amount only)
   */
  const handleWithdrawAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numericValue = Number(value);
    setWithdrawData((prev) => ({
      ...prev,
      amount: numericValue < 0 ? 0 : numericValue,
    }));
  };

  /**
   * Handle Deposit submission
   */
  const handleDeposit = async () => {
    if (!depositData.accountNb || depositData.amount <= 0) {
      showAlert("Please enter a valid account number and amount.", "error");
      return;
    }

    try {
      const res = await depositAmount(depositData);
      showAlert("Money deposited successfully!", "success");
      console.log("Deposit Response:", res);
      setDepositData({ accountNb: 0, amount: 0 });
    } catch (error: any) {
      showAlert(
        error.response?.data?.message || "Deposit failed. Try again.",
        "error"
      );
    }
  };

  /**
   * Handle Withdraw submission
   */
  const handleWithdraw = async () => {
    if (!withdrawData.accountNb || withdrawData.amount <= 0) {
      showAlert("Please enter a valid account number and amount.", "error");
      return;
    }

    try {
      const res = await withdrawAmount(withdrawData);
      showAlert("Money withdrawn successfully!", "success");
      console.log("Withdraw Response:", res);
      setWithdrawData({ accountNb: 0, amount: 0 });
    } catch (error: any) {
      showAlert(
        error.response?.data?.message || "Withdrawal failed. Try again.",
        "error"
      );
    }
  };

  // Clear forms
  const handleClearDeposit = () => setDepositData({ accountNb: 0, amount: 0 });
  const handleClearWithdraw = () => setWithdrawData({ accountNb: 0, amount: 0 });

  // -------------------------------
  // Component Render
  // -------------------------------
  return (
    <>
      {/* Global Alert Snackbar for success/error messages */}
      <AlertSnackbar
        open={open}
        message={message}
        severity={severity}
        onClose={handleClose}
      />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {/* Deposit Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{
              mb: 3,
              color: "#0a1929",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <ArrowDownward color="success" />
            Deposit Funds
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            
            {/* Account Number Autocomplete (Deposit) */}
            <Autocomplete
              options={accOptions}
              getOptionLabel={(option) => option.toString()}
              filterOptions={(x) => x}
              loading={accLoading}
              value={depositData.accountNb || null}
              onChange={(event, newValue) => {
                setDepositData((prev) => ({ ...prev, accountNb: newValue || 0 }));
              }}
              onInputChange={(event, newInputValue, reason) => {
                if (reason === "input") {
                  setAccSearch(newInputValue);
                  setAccPage(1);
                }
              }}
              onBlur={handleAccountBlur}
              ListboxProps={{
                onScroll: handleAccountScroll,
                style: { maxHeight: 150, overflowY: "auto" },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Account Number"
                  required
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <AccountBalance color="action" />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                    endAdornment: (
                      <React.Fragment>
                        {accLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />

            {/* Amount Input */}
            <TextField
              fullWidth
              label="Amount ($)"
              name="amount"
              type="number"
              value={depositData.amount}
              onChange={handleDepositAmountChange}
              required
              inputProps={{ min: 0, step: "0.01" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney color="action" />
                  </InputAdornment>
                ),
                inputMode: "decimal",
                sx: {
                  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                    { display: "none" },
                  "& input[type=number]": { MozAppearance: "textfield" },
                },
              }}
            />

            {/* Deposit Buttons */}
            <Box
              sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}
            >
              <Button
                variant="outlined"
                size="large"
                onClick={handleClearDeposit}
                sx={{ px: 4, borderRadius: 2 }}
              >
                Clear
              </Button>
              <Button
                variant="contained"
                size="large"
                startIcon={<ArrowDownward />}
                onClick={handleDeposit}
                color="success"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: "bold",
                  borderRadius: 2,
                }}
              >
                Deposit
              </Button>
            </Box>
          </Box>
        </Paper>

        <Divider sx={{ my: 2 }} />

        {/* Withdraw Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{
              mb: 3,
              color: "#0a1929",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <ArrowUpward color="error" />
            Withdraw Funds
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            
            {/* Account Number Autocomplete (Withdraw) */}
            <Autocomplete
              options={accOptions}
              getOptionLabel={(option) => option.toString()}
              filterOptions={(x) => x}
              loading={accLoading}
              value={withdrawData.accountNb || null}
              onChange={(event, newValue) => {
                setWithdrawData((prev) => ({ ...prev, accountNb: newValue || 0 }));
              }}
              onInputChange={(event, newInputValue, reason) => {
                if (reason === "input") {
                  setAccSearch(newInputValue);
                  setAccPage(1);
                }
              }}
              onBlur={handleAccountBlur}
              ListboxProps={{
                onScroll: handleAccountScroll,
                style: { maxHeight: 150, overflowY: "auto" },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Account Number"
                  required
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <AccountBalance color="action" />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                    endAdornment: (
                      <React.Fragment>
                        {accLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />

            {/* Amount Input */}
            <TextField
              fullWidth
              label="Amount ($)"
              name="amount"
              type="number"
              value={withdrawData.amount}
              onChange={handleWithdrawAmountChange}
              required
              inputProps={{ min: 0, step: "0.01" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney color="action" />
                  </InputAdornment>
                ),
                inputMode: "decimal",
                sx: {
                  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                    { display: "none" },
                  "& input[type=number]": { MozAppearance: "textfield" },
                },
              }}
            />

            {/* Withdraw Buttons */}
            <Box
              sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}
            >
              <Button
                variant="outlined"
                size="large"
                onClick={handleClearWithdraw}
                sx={{ px: 4, borderRadius: 2 }}
              >
                Clear
              </Button>
              <Button
                variant="contained"
                size="large"
                startIcon={<ArrowUpward />}
                onClick={handleWithdraw}
                color="error"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: "bold",
                  borderRadius: 2,
                }}
              >
                Withdraw
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
}