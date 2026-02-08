// =====================================================
// Redux Slice: Contact Us Form
// Handles state for contact form fields and sending messages
// =====================================================

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sendMessage } from "../../api/contactApi";
import type { CreateContactMessage } from "../../types/contact.ts/CreateContactMessage";
import type { ContactFormState } from "../../types/state/ContactFormState";

// -----------------------------------------------------
// INITIAL STATE
// -----------------------------------------------------
const initialState: ContactFormState = {
  subject: "",   // Subject of the message
  message: "",   // Body of the message
};

// -----------------------------------------------------
// ASYNC THUNK
// -----------------------------------------------------

// Sends a contact message using the API
export const sendContactMessage = createAsyncThunk(
  "contact/sendMessage",
  async (payload: CreateContactMessage, { rejectWithValue }) => {
    try {
      const res = await sendMessage(payload);
      return res; // Returns API response
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to send message");
    }
  }
);

// -----------------------------------------------------
// SLICE
// -----------------------------------------------------
export const contactUsSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    // Update subject field
    setSubject(state, action) {
      state.subject = action.payload;
    },
    // Update message field
    setMessage(state, action) {
      state.message = action.payload;
    },
    // Reset form fields to initial state
    resetForm(state) {
      state.subject = "";
      state.message = "";
    },
  },
  // extraReducers intentionally omitted as loading/error handling is not included
});

// -----------------------------------------------------
// EXPORTS
// -----------------------------------------------------
export const { setSubject, setMessage, resetForm } = contactUsSlice.actions;
export default contactUsSlice.reducer;
