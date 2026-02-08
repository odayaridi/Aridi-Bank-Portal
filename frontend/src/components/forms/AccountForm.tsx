import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  MenuItem,
  Autocomplete,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  AccountBalance,
  Business,
  AttachMoney,
  AccountBalanceWallet,
  Person,
  Refresh,
} from "@mui/icons-material";
import type { AccountForm as AccountFormType } from "../../types/account/AccountForm";

import { useAlert } from "../../hooks/useAlert";
import AlertSnackbar from "../../components/common/AlertSnackbar";
import { createUserBankAccount, generateAccountNb } from "../../api/accountApi";
import { getAllUsernames } from "../../api/userApi"; // Ensure this import path is correct

/**
 * AccountForm component renders a form for creating a user bank account.
 */
export default function AccountForm() {
  // State for form fields
  const [formData, setFormData] = useState<AccountFormType>({
    accountNb: 0, // number
    accountName: "",
    accountBranch: "",
    accountBalance: 0, // number
    accountType: "",
    users: [], // string[]
  });

  // Custom alert hook for showing feedback messages
  const { alertInfo, showAlert, closeAlert } = useAlert();

  // --- USERS SEARCH & SCROLL STATE ---
  const [userOptions, setUserOptions] = useState<string[]>([]);
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [userLoading, setUserLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  /**
   * USER FETCHING LOGIC (Infinite Scroll + Search)
   */
  useEffect(() => {
    let active = true;

    const fetchUsernames = async () => {
      setUserLoading(true);
      try {
        const res = await getAllUsernames(userPage, userSearch);
        if (active && res?.users) {
          // Map response to simple string array based on your JSON structure
          const newUsers = res.users.map((u: any) => u.username);
          setUserTotalPages(res.totalPages || 1);

          if (userPage === 1) {
            setUserOptions(newUsers);
          } else {
            // Append and remove duplicates
            setUserOptions((prev) => {
              const combined = [...prev, ...newUsers];
              return [...new Set(combined)];
            });
          }
        }
      } catch (err) {
        console.error("Error fetching usernames:", err);
      } finally {
        if (active) setUserLoading(false);
      }
    };

    // Debounce the API call
    const timer = setTimeout(() => {
      fetchUsernames();
    }, 400);

    return () => {
      clearTimeout(timer);
      active = false;
    };
  }, [userPage, userSearch]);

  const handleUserScroll = (event: React.SyntheticEvent) => {
    const listboxNode = event.currentTarget;
    if (
      listboxNode.scrollTop + listboxNode.clientHeight >=
      listboxNode.scrollHeight - 5
    ) {
      if (!userLoading && userPage < userTotalPages) {
        setUserPage((prev) => prev + 1);
      }
    }
  };

  const handleUserBlur = () => {
    // Reset search when user leaves the field without selecting
    setUserSearch("");
    setUserPage(1);
  };

  /**
   * Handles changes in text/number fields and updates the form state.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? Number(value) // convert numeric inputs to number
          : value,
    }));
  };

  /**
   * Generates a new account number via API and updates the form.
   */
  const handleGenerateAccountNumber = async () => {
    try {
      const accountNumber = await generateAccountNb();
      setFormData((prev) => ({
        ...prev,
        accountNb: Number(accountNumber),
      }));
      showAlert("Account number generated successfully!", "success");
    } catch (error: any) {
      showAlert("Error generating account number.", "error");
      console.error("Error generating account number:", error);
    }
  };

  /**
   * Submits the form data to create a new bank account.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate account balance
    if (formData.accountBalance <= 0) {
      showAlert("Account balance must be greater than 0.", "error");
      return;
    }

    try {
      await createUserBankAccount(formData);
      showAlert("Account created successfully!", "success");
      handleClear();
    } catch (error: any) {
      showAlert(
        error.response?.data?.message ||
          "Error creating account. Please try again.",
        "error"
      );
      console.error("Error creating account:", error);
    }
  };

  /**
   * Clears the form and resets all input fields.
   */
  const handleClear = () => {
    setFormData({
      accountNb: 0,
      accountName: "",
      accountBranch: "",
      accountBalance: 0,
      accountType: "",
      users: [],
    });
    // Reset search states
    setUserSearch("");
    setUserPage(1);
  };

  return (
    <>
      {/* Account creation form */}
      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Account Number */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: { xs: "wrap", sm: "nowrap" },
            }}
          >
            <TextField
              fullWidth
              label="Account Number"
              name="accountNb"
              value={formData.accountNb || ""}
              disabled
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountBalance color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1 }}
            />
            <Button
              variant="outlined"
              onClick={handleGenerateAccountNumber}
              startIcon={<Refresh />}
              sx={{
                height: 56,
                px: 3,
                borderRadius: 2,
                minWidth: "150px",
                whiteSpace: "nowrap",
              }}
            >
              Generate
            </Button>
          </Box>

          {/* Account Name */}
          <TextField
            fullWidth
            label="Account Name"
            name="accountName"
            value={formData.accountName}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Business color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Account Branch */}
          <TextField
            fullWidth
            label="Account Branch"
            name="accountBranch"
            value={formData.accountBranch}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Business color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Account Balance */}
          <TextField
            fullWidth
            label="Account Balance"
            name="accountBalance"
            type="number"
            value={formData.accountBalance}
            onChange={handleChange}
            required
            inputProps={{ min: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoney color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Account Type */}
          <TextField
            fullWidth
            select
            label="Account Type"
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountBalanceWallet color="action" />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="CHECKINGS">Checkings</MenuItem>
            <MenuItem value="SAVINGS">Savings</MenuItem>
          </TextField>

          {/* Users - Autocomplete with Infinite Scroll */}
          <Box>
            <Autocomplete
              multiple
              options={userOptions}
              getOptionLabel={(option) => option}
              filterOptions={(x) => x} // Disable client-side filtering
              loading={userLoading}
              value={formData.users}
              onChange={(event, newValue) => {
                setFormData((prev) => ({ ...prev, users: newValue }));
              }}
              onInputChange={(event, newInputValue, reason) => {
                if (reason === "input") {
                  setUserSearch(newInputValue);
                  setUserPage(1);
                }
              }}
              onBlur={handleUserBlur}
              ListboxProps={{
                onScroll: handleUserScroll,
                style: { maxHeight: 150, overflowY: "auto" },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Users"
                  placeholder={formData.users.length === 0 ? "Select users" : ""}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start" sx={{ pl: 1 }}>
                          <Person color="action" />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                    endAdornment: (
                      <React.Fragment>
                        {userLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip
                      key={key}
                      label={option}
                      {...tagProps}
                      color="primary"
                      variant="outlined"
                    />
                  );
                })
              }
            />
          </Box>

          {/* Buttons */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="outlined"
              size="large"
              sx={{ px: 4, borderRadius: 2 }}
              onClick={handleClear}
            >
              Clear
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: "bold",
                borderRadius: 2,
                bgcolor: "#1976d2",
                "&:hover": { bgcolor: "#1565c0" },
              }}
            >
              Create Account
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Feedback Snackbar */}
      <AlertSnackbar
        open={alertInfo.open}
        message={alertInfo.message}
        severity={alertInfo.severity}
        onClose={closeAlert}
      />
    </>
  );
}