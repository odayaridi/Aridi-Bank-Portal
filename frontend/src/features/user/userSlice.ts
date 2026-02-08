// =====================================================
// Redux Slice: User Management
// Handles updating and deleting users, and storing form state
// =====================================================

import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { updateUser as updateUserApi, deleteUser as deleteUserApi } from "../../api/userApi";
import type { UpdateUser } from "../../types/user/UpdateUser";
import type { DeleteUser } from "../../types/user/DeleteUser";
import type { UserState } from "../../types/state/UserState";

// -----------------------------------------------------
// INITIAL STATE
// -----------------------------------------------------
const initialState: UserState = {
  error: null,           // Stores error messages from failed operations
  success: false,        // Indicates if the last operation was successful
  updateFormData: {},    // Stores form data for updating user
};

// -----------------------------------------------------
// ASYNC THUNKS
// -----------------------------------------------------

// Update a user by calling the API
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (data: UpdateUser, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(data);
      return response; // Resolves with API response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update user");
    }
  }
);

// Delete a user by calling the API
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (data: DeleteUser, { rejectWithValue }) => {
    try {
      await deleteUserApi(data);
      return data.username; // Return deleted username for reference
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete user");
    }
  }
);

// -----------------------------------------------------
// SLICE
// -----------------------------------------------------
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Set partial form data for updating user
    setUpdateFormData: (state, action: PayloadAction<Partial<UpdateUser>>) => {
      state.updateFormData = { ...state.updateFormData, ...action.payload };
    },
    // Reset form data to empty object
    resetUpdateFormData: (state) => {
      state.updateFormData = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle update user success and failure
      .addCase(updateUser.fulfilled, (state) => {
        state.success = true;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Handle delete user success and failure
      .addCase(deleteUser.fulfilled, (state) => {
        state.success = true;
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// -----------------------------------------------------
// EXPORTS
// -----------------------------------------------------
export const { setUpdateFormData, resetUpdateFormData } = userSlice.actions;
export default userSlice.reducer;
