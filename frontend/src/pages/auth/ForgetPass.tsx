import React, { useState } from "react";
import {
  Box, Button, TextField, Typography, Container, Paper,
  InputAdornment, CircularProgress, Link
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Email, LockReset } from "@mui/icons-material";
import { requestPasswordReset } from "../../api/userApi";
import AlertSnackbar from "../../components/common/AlertSnackbar";
import { useAlert } from "../../hooks/useAlert";

export default function ForgetPass() {
  const navigate = useNavigate();
  const { open, message, severity, showAlert, handleClose } = useAlert();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;

    setLoading(true);
    setResetLink("");
    try {
      const response = await requestPasswordReset(email);
      
      // Backend returns { message: string, resetLink: string }
      if (response.resetLink) {
        setResetLink(response.resetLink);
      }
      
      showAlert(response.message || "Reset email sent successfully!", "success");
    } catch (err: any) {
      showAlert(err.response?.data?.message || "Failed to process request.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "grey.100" }}>
      <Container maxWidth="xs">
        <Paper elevation={6} sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center", borderRadius: 3 }}>
          <LockReset sx={{ fontSize: 40, color: "primary.main", mb: 2 }} />
          <Typography component="h1" variant="h5" fontWeight={600} gutterBottom>
            Forgot Password
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: "text.secondary", textAlign: "center" }}>
            Enter your email. We will send a reset link to your inbox.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%" }}>
            <TextField
              margin="normal" required fullWidth id="email" label="Email Address"
              autoFocus value={email} onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment>,
              }}
            />

            {resetLink && (
              <Box sx={{ mt: 2, p: 2, bgcolor: "#e3f2fd", borderRadius: 2, border: "1px solid #90caf9" }}>
                <Typography variant="caption" color="primary" fontWeight="bold">DEBUG MODE: Reset Link</Typography>
                <Link href={resetLink} sx={{ display: 'block', wordBreak: 'break-all', fontSize: '0.75rem' }}>{resetLink}</Link>
              </Box>
            )}

            <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 3, mb: 2, py: 1.2, fontWeight: 600 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Send Reset Link"}
            </Button>

            <Button fullWidth variant="outlined" onClick={() => navigate("/login")} sx={{ fontWeight: 600 }}>
              Back to Login
            </Button>
          </Box>
        </Paper>
      </Container>
      <AlertSnackbar open={open} message={message} severity={severity} onClose={handleClose} />
    </Box>
  );
}