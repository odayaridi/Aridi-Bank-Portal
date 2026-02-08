// =====================================================
// Redux Slice: Accounts
// Handles state for user's accounts and selected account info
// =====================================================

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllAccountsNbsByUserId,
  getAccountInfo,
} from "../../api/accountApi";
import type { AccountsState } from "../../types/state/AccountsState";

// -----------------------------------------------------
// INITIAL STATE
// -----------------------------------------------------
const initialState: AccountsState = {
  accounts: [],           // List of user's account numbers
  selectedAccount: null,  // Currently selected account number
  accountInfo: null,      // Detailed info of the selected account
};

// -----------------------------------------------------
// ASYNC THUNKS
// -----------------------------------------------------

// Fetches all account numbers for the logged-in user
export const fetchAccounts = createAsyncThunk(
  "accounts/fetchAccounts",
  async () => {
    const result = await getAllAccountsNbsByUserId();
    return result;
  }
);

// Fetches detailed information for a specific account
export const fetchAccountInfo = createAsyncThunk(
  "accounts/fetchAccountInfo",
  async (accountNb: number) => {
    const result = await getAccountInfo(accountNb);
    return result;
  }
);

// -----------------------------------------------------
// SLICE
// -----------------------------------------------------
export const accountInfoSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    // Sets the currently selected account number
    setSelectedAccount(state, action) {
      state.selectedAccount = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Update accounts list after fetching
    builder.addCase(fetchAccounts.fulfilled, (state, action) => {
      state.accounts = action.payload;
    });
    // Update detailed account info after fetching
    builder.addCase(fetchAccountInfo.fulfilled, (state, action) => {
      state.accountInfo = action.payload;
    });
  },
});

// -----------------------------------------------------
// EXPORTS
// -----------------------------------------------------
export const { setSelectedAccount } = accountInfoSlice.actions;
export default accountInfoSlice.reducer;
