import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Typography,
  Paper,
  Badge,
  MenuItem, // Added for the Dropdown
} from "@mui/material";
import {
  Person,
  Email,
  Lock,
  Cake,
  LocationCity,
  Public,
  Visibility,
  VisibilityOff,
  Phone,
  CloudUpload,
  CheckCircle,
} from "@mui/icons-material";
import type { CreateUser } from "../../types/user/CreateUser";
import { useAdmin } from "../../hooks/useAdmin";
import { useAlert } from "../../hooks/useAlert";
import AlertSnackbar from "../../components/common/AlertSnackbar";

/**
 * List of countries for the dropdown.
 * Value = ISO 3166-1 alpha-2 code (required by IDAnalyzer).
 */
const COUNTRIES = [
   { code: "LB", label: "Lebanon" },
  { code: "EG", label: "Egypt" },
  { code: "SA", label: "Saudi Arabia" },
  { code: "AE", label: "United Arab Emirates" }
];

/**
 * UserForm Component
 * -----------------
 * A React component for creating new users in the admin panel.
 * Updates:
 * - Dynamic Country Selection added.
 * - IDAnalyzer now uses selected country code.
 */

export default function UserForm() {
  // Hook to interact with admin-related operations (e.g., adding users)
  const { addUser } = useAdmin();

  // Custom alert hook to manage snackbar notifications
  const { open, message, severity, showAlert, handleClose } = useAlert();

  // Local state to manage the user form data
  const [formData, setFormData] = useState<CreateUser>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    dob: "",
    city: "",
    country: "", // This will now store the ISO code (e.g., "EG")
    phoneNumber: "",
  });

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  // State for the National ID file
  const [nationalIdFile, setNationalIdFile] = useState<File | null>(null);

  /**
   * Generic handler to update form data when input values change
   * @param e - Input change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handles file selection for National ID
   * @param e - File input change event
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNationalIdFile(e.target.files[0]);
    }
  };

  /**
   * Toggles password visibility between plain text and masked
   */
  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  /**
   * Helper to convert File to Base64 string
   */
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  /**
   * Handles form submission to create a new user
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- Password validation---
  const password = formData.password;
  if (password) {
    if (password.length < 8 || password.length > 32) {
      showAlert("Password must be between 8 and 32 characters.", "error");
      return;
    }

    let hasUppercase = false;
    for (const ch of password) {
      if (ch >= "A" && ch <= "Z") {
        hasUppercase = true;
        break;
      }
    }
    if (!hasUppercase) {
      showAlert("Password must contain at least one uppercase letter.", "error");
      return;
    }

    const specials = `!@#$%^&*(),.?":{}|<>_-/`;
    let hasSpecial = false;
    for (const ch of password) {
      if (specials.includes(ch)) {
        hasSpecial = true;
        break;
      }
    }
    if (!hasSpecial) {
      showAlert("Password must contain at least one special character.", "error");
      return;
    }
  }

    // --- Phone number validation ---
    const phone = formData.phoneNumber;
    if (phone) {
      if (!phone.startsWith("+")) {
        showAlert("Phone number must start with '+'.", "error");
        return;
      }

      const remaining = phone.slice(1);
      if (
        remaining.length === 0 ||
        !remaining.split("").every((ch) => ch >= "0" && ch <= "9")
      ) {
        showAlert("Phone number can only contain digits after '+'.", "error");
        return;
      }
    }

    // --- National ID Validation & Processing ---
    if (!nationalIdFile) {
      showAlert("Please upload a National ID image.", "error");
      return;
    }

    // Ensure country is selected for accurate scanning
    if (!formData.country) {
      showAlert("Please select a country before uploading ID.", "error");
      return;
    }

    try {
      // 1. Convert image to Base64
      const documentBase64 = await fileToBase64(nationalIdFile);

      // 2. Call External ID Analyzer API
      // Passing the dynamically selected country code
      const scanResponse = await axios.post(
        "https://api2.idanalyzer.com/scan",
        {
          document: documentBase64,
          country: formData.country, 
          type: "I",
        },
        { headers: { "X-API-KEY": "JrEQLFh9RpVLKTzpP7cOrIPsklvOfRQE" } }
      );

      const scanData = scanResponse.data.data;

      // Extract specific fields as requested
      const countryFull = scanData?.countryFull?.[0]?.value;
      const documentNumber = scanData?.documentNumber?.[0]?.value;

      if (!documentNumber || !countryFull) {
        showAlert(
          "Failed to extract user details from national ID Image.",
          "error"
        );
        return;
      }

      // 3. Prepare final payload
      const payload = {
        ...formData,
        countryFull,
        documentNumber,
      };
     console.log('My is ', payload.country);

      // 4. Create User
      await addUser(payload);
      showAlert("User created successfully!", "success");

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        dob: "",
        city: "",
        country: "",
        phoneNumber: "",
      });
      setNationalIdFile(null); // Reset file input
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create user.";
      showAlert(msg, "error");
    }
  };

  /**
   * Clears all input fields in the form
   */
  const handleClear = () => {
    setFormData({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      dob: "",
      city: "",
      country: "",
      phoneNumber: "",
    });
    setNationalIdFile(null);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* Container for all input fields with consistent spacing */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        
        {/* --- National ID Upload Section (Verified) --- */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: "2px dashed",
            borderColor: nationalIdFile ? "success.main" : "grey.300",
            backgroundColor: nationalIdFile ? "success.light" : "grey.50",
            borderRadius: 2,
            transition: "all 0.3s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "grey.100",
            },
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Badge color={nationalIdFile ? "success" : "default"} variant="dot">
              {nationalIdFile ? (
                <CheckCircle color="success" fontSize="large" />
              ) : (
                <Public color="disabled" fontSize="large" />
              )}
            </Badge>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color="text.secondary"
            >
              {nationalIdFile ? "ID Document Verified" : "Identity Verification"}
            </Typography>
          </Box>

          <Typography variant="body2" color="textSecondary" align="center">
            {nationalIdFile
              ? `Selected File: ${nationalIdFile.name}`
              : "Upload a clear image of the new user National ID for later auto-verify details."}
          </Typography>

          <Button
            component="label"
            variant={nationalIdFile ? "outlined" : "contained"}
            color={nationalIdFile ? "success" : "primary"}
            startIcon={<CloudUpload />}
            sx={{ mt: 1, textTransform: "none", fontWeight: 600 }}
          >
            {nationalIdFile ? "Change Document" : "Upload National ID"}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
        </Paper>

        {/* First Name & Last Name fields side by side */}
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
            sx={{ flex: "1 1 calc(50% - 12px)", minWidth: "250px" }}
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
            sx={{ flex: "1 1 calc(50% - 12px)", minWidth: "250px" }}
          />
        </Box>

        {/* Username & Email fields side by side */}
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
            sx={{ flex: "1 1 calc(50% - 12px)", minWidth: "250px" }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
            sx={{ flex: "1 1 calc(50% - 12px)", minWidth: "250px" }}
          />
        </Box>

        {/* Password & Date of Birth fields side by side */}
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ flex: "1 1 calc(50% - 12px)", minWidth: "250px" }}
          />
          <TextField
            fullWidth
            label="Date of Birth"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Cake />
                </InputAdornment>
              ),
            }}
            sx={{ flex: "1 1 calc(50% - 12px)", minWidth: "250px" }}
          />
        </Box>

        {/* City & Country fields side by side */}
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationCity />
                </InputAdornment>
              ),
            }}
            sx={{ flex: "1 1 calc(50% - 12px)", minWidth: "250px" }}
          />
          
          {/* UPDATED: Country Dropdown */}
          <TextField
            select
            fullWidth
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Public />
                </InputAdornment>
              ),
            }}
            sx={{ flex: "1 1 calc(50% - 12px)", minWidth: "250px" }}
          >
            {COUNTRIES.map((option) => (
              <MenuItem key={option.code} value={option.code}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Phone Number field */}
        <TextField
          fullWidth
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone />
              </InputAdornment>
            ),
          }}
          sx={{ flex: "1 1 calc(50% - 12px)", maxWidth: "520px" }}
        />

        {/* Form buttons: Clear and Submit */}
        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
          <Button variant="outlined" onClick={handleClear}>
            Clear
          </Button>
          <Button type="submit" variant="contained">
            Create User
          </Button>
        </Box>
      </Box>

      {/* Alert Snackbar for showing success/error messages */}
      <AlertSnackbar
        open={open}
        message={message}
        severity={severity}
        onClose={handleClose}
      />
    </Box>
  );
}