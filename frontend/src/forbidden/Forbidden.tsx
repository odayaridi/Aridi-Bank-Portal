import React from "react";
import { Box, Button, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ErrorOutline } from "@mui/icons-material";

/**
 * NotFound Page Component
 * 
 * This component renders a user-friendly 404 error page for routes
 * that do not exist within the application. It includes:
 * - A brand-colored error icon.
 * - A prominent "404" heading.
 * - A subheading and helper text explaining the error.
 * - A "Go to Homepage" button that navigates back to the home page.
 */
export default function Forbidden() {
  const navigate = useNavigate();

  // Handler to navigate user back to the home page
  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh", // Full viewport height
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.100", // Light grey background for consistency
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            py: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Error Icon */}
          <ErrorOutline
            sx={{
              fontSize: 80,
              color: "primary.main", // Brand-colored
              mb: 2,
            }}
          />

          {/* Main 404 Heading */}
          <Typography
            variant="h1"
            fontWeight={700}
            color="text.primary"
            sx={{ mb: 1 }}
          >
            403
          </Typography>

          {/* Subheading */}
          <Typography
            variant="h5"
            fontWeight={600}
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Access Forbidden
          </Typography>

          {/* Helper Text */}
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Sorry, You do not have the access to visit this page.
          </Typography>

          {/* Button to navigate back to homepage */}
          <Button
            variant="contained"
            onClick={handleGoHome}
            sx={{
              py: 1.2,
              px: 4,
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
            Go to Homepage
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
