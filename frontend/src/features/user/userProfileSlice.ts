// =====================================================
// Redux Slice: User Profile
// Manages fetching and storing the current user's profile
// =====================================================

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCurrentUser } from "../../api/authApi";
import type { UserProfileState } from "../../types/state/UserProfileState";

// -----------------------------------------------------
// INITIAL STATE
// -----------------------------------------------------
const initialState: UserProfileState = {
  user: null, // Initially, no user is loaded
};

// -----------------------------------------------------
// ASYNC THUNK: getUserProfile
// Fetches the current authenticated user's profile
// -----------------------------------------------------
export const getUserProfile = createAsyncThunk(
  "userProfile/getUserProfile",
  async () => {
    const data = await fetchCurrentUser();
    return data; // Returned data will populate the state
  }
);

// -----------------------------------------------------
// SLICE: userProfileSlice
// Handles user profile state updates
// -----------------------------------------------------
export const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {}, // No synchronous reducers needed here

  // Handle asynchronous actions (fulfilled, pending, rejected)
  extraReducers: (builder) => {
    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      state.user = action.payload; // Update state when fetch is successful
    });
  },
});

// Export the reducer to be included in the store
export default userProfileSlice.reducer;
