// =====================================================
// Redux Store Configuration
// Combines all feature slices into a single store
// =====================================================

import { configureStore } from "@reduxjs/toolkit";

// ===== Import Feature Reducers =====
import contactReducer from "../features/contactUs/contactUsSlice";
import userProfileReducer from "../features/user/userProfileSlice";
import accountInfoReducer from "../features/account/accountInfoSlice";
import userReducer from "../features/user/userSlice";

// -----------------------------------------------------
// STORE: configureStore
// Combines reducers for contact, userProfile, accounts, and user
// -----------------------------------------------------
export const store = configureStore({
  reducer: {
    contact: contactReducer,          // State for contact us messages
    userProfile: userProfileReducer,  // State for user profile info
    accounts: accountInfoReducer,     // State for user account information
    user: userReducer,                // State for user authentication and info
  },
});

// -----------------------------------------------------
// TYPES: For use with TypeScript
// -----------------------------------------------------
export type RootState = ReturnType<typeof store.getState>; // Type of the Redux state
export type AppDispatch = typeof store.dispatch;           // Type of the dispatch function
