import React from "react";
import { Box, Button, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useAlert } from "../../hooks/useAlert";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  setSubject,
  setMessage,
  resetForm,
  sendContactMessage,
} from "../../features/contactUs/contactUsSlice";
import AlertSnackbar from "../common/AlertSnackbar";

export default function ContactForm() {
  const dispatch = useAppDispatch();


  const { subject, message } = useAppSelector((state) => state.contact);

  const { open, message: alertMsg, severity, showAlert, handleClose } = useAlert();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message.trim()) return;

    try {
      await dispatch(sendContactMessage({ subject, message })).unwrap();
      showAlert("Message sent successfully!", "success");
      dispatch(resetForm());
    } catch (error) {
      showAlert("Failed to send message", "error");
    }
  };

  // Removed 'loading' from the disabled check
  const isDisabled = !subject || message.trim() === "";

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
          maxWidth: 500,
          mt: 3,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          SUBJECT
        </Typography>

        <Select
          value={subject}
          onChange={(e) => dispatch(setSubject(e.target.value))}
          displayEmpty
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Select a subject</MenuItem>
          <MenuItem value="account_issue">Account Issue</MenuItem>
          <MenuItem value="transaction_problem">Transaction Problem</MenuItem>
          <MenuItem value="card_issue">Card Issue</MenuItem>
          <MenuItem value="technical_support">Technical Support</MenuItem>
          <MenuItem value="general_inquiry">General Inquiry</MenuItem>
        </Select>

        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          MESSAGE
        </Typography>

        <TextField
          multiline
          minRows={4}
          value={message}
          onChange={(e) => dispatch(setMessage(e.target.value))}
          placeholder="Write your message here..."
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isDisabled}
          sx={{
            mt: 2,
            alignSelf: "flex-start",
            // Kept the color logic based on valid inputs only
            backgroundColor: isDisabled ? "#a0a0a0" : "#1976d2",
          }}
        >
          {/* Removed the ternary operator for loading text */}
          Send Message
        </Button>
      </Box>

      <AlertSnackbar
        open={open}
        message={alertMsg}
        severity={severity}
        onClose={handleClose}
      />
    </>
  );
}