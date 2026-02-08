import React, { useState, useMemo, useEffect } from "react";
import {
  Box, Button, TextField, Typography, Container, Paper,
  InputAdornment, IconButton, CircularProgress,
} from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff, LockReset } from "@mui/icons-material";
import { resetPassword } from "../../api/userApi";
import AlertSnackbar from "../../components/common/AlertSnackbar";
import { useAlert } from "../../hooks/useAlert";

// RESTORED: Password strength validation
const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (password.length > 32) return "Password must be at most 32 characters";
  if (!/[A-Z]/.test(password)) return "Must contain an uppercase letter";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Must contain a special character";
  return null;
};

export default function ResetPass() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { open, message, severity, showAlert, handleClose } = useAlert();

  // URL Params: ?token=...&id=...
  const token = searchParams.get("token");
  const id = searchParams.get("id");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  // RESTORED: Validation hooks
  const passwordError = useMemo(() => validatePassword(newPassword), [newPassword]);
  const confirmError = useMemo(() => {
    if (!confirmPassword) return null;
    if (confirmPassword !== newPassword) return "Passwords do not match";
    return null;
  }, [confirmPassword, newPassword]);

  const isValid = !passwordError && !confirmError && newPassword && token && id;

  useEffect(() => {
    if (!token || !id) {
      navigate('/accessforbidden')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    try {
      await resetPassword({
        token: token!,
        id: id!, // Mapped to userId on backend
        newPassword,
      });

      showAlert("Password reset successfully! Redirecting to login...", "success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      showAlert(err.response?.data?.message || "Failed to reset password", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "grey.100" }}>
      <Container maxWidth="xs">
        <Paper elevation={6} sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center", bgcolor: "#fff", borderRadius: 3 }}>
          <LockReset sx={{ fontSize: 40, color: "primary.main", mb: 2 }} />
          <Typography component="h1" variant="h5" fontWeight={600} color="text.primary" gutterBottom>
            Reset Password
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
            Enter your new secure password
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%" }}>
            <TextField
              margin="normal" required fullWidth label="New Password"
              type={showPw ? "text" : "password"} value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={!!newPassword && !!passwordError}
              helperText={!!newPassword && passwordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPw(!showPw)} edge="end">
                      {showPw ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              margin="normal" required fullWidth label="Confirm Password"
              type={showPw ? "text" : "password"} value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!confirmPassword && !!confirmError}
              helperText={!!confirmPassword && confirmError}
            />

            <Button type="submit" fullWidth variant="contained" disabled={loading || !isValid}
              sx={{ mt: 3, mb: 2, py: 1.2, borderRadius: 2, fontWeight: 600, textTransform: "none", fontSize: "1rem" }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
            </Button>
          </Box>
        </Paper>
      </Container>
      <AlertSnackbar open={open} message={message} severity={severity} onClose={handleClose} />
    </Box>
  );
}