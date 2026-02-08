import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Person,
  Lock,
  Visibility,
  VisibilityOff,
  AccountBalance,
  Google,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../api/authApi";
import AlertSnackbar from "../../components/common/AlertSnackbar";
import { useAlert } from "../../hooks/useAlert";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { open, message, severity, showAlert, handleClose } = useAlert();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // --- STANDARD LOGIN LOGIC ---
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const user = await loginUser({ username, password });
      setUser(user);

      showAlert("Login successful!", "success");

      setTimeout(() => {
        if (user.roleName === "Admin") navigate("/admin");
        else if (user.roleName === "User") navigate("/user");
        else navigate("/home");
      }, 1000);
    } catch (err: any) {
      showAlert(err.response?.data?.message || "Login failed. Try again.", "error");
    }
  };

  // --- OAUTH LOGIC ---
  const handleGoogleLogin = () => {
    // We simply redirect to the Backend. 
    // The Backend handles the handshake, sets the HTTP-Only cookie, 
    // and redirects the user back to the Dashboard.
    window.location.href = "http://localhost:3000/auth/google";
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

  // --- RENDER ---
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.100",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "#fff",
            borderRadius: 3,
          }}
        >
          <AccountBalance
            sx={{
              fontSize: 40,
              color: "primary.main",
              mb: 2,
            }}
          />
          <Typography
            component="h1"
            variant="h5"
            fontWeight={600}
            color="text.primary"
            gutterBottom
          >
            Welcome to Aridi Bank
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 3, color: "text.secondary" }}
          >
            Sign in to access your account
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Forgot Password Link - Aligned Right */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Button
                size="small"
                onClick={() => navigate("/forgot-password")}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  minWidth: 0,
                  padding: 0,
                }}
              >
                Forgot Password?
              </Button>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                mb: 2,
                py: 1.2,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
                bgcolor: "primary.main",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
            >
              Sign In
            </Button>

            {/* DIVIDER FOR OAUTH */}
            <Divider sx={{ my: 2, color: "text.secondary", fontSize: "0.875rem" }}>
              OR
            </Divider>

            {/* GOOGLE LOGIN BUTTON */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              onClick={handleGoogleLogin}
              sx={{
                mb: 2,
                py: 1.1,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                color: "#DB4437",
                borderColor: "#DB4437",
                "&:hover": {
                  borderColor: "#c53929",
                  bgcolor: "rgba(219, 68, 55, 0.04)",
                },
              }}
            >
              Sign in with Google
            </Button>

            {/* Back to Home Button */}
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate("/home")}
              sx={{
                mt: 1,
                py: 1.1,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Back to Home
            </Button>
          </Box>
        </Paper>

        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 3, color: "text.secondary" }}
        >
          © {new Date().getFullYear()} Aridi Bank
        </Typography>
        <Typography
          variant="caption"
          align="center"
          display="block"
          sx={{ color: "text.secondary" }}
        >
          Secure. Smart. Seamless.
        </Typography>
      </Container>

      <AlertSnackbar
        open={open}
        message={message}
        severity={severity}
        onClose={handleClose}
      />
    </Box>
  );
}