import React from "react";
import { Box, Typography } from "@mui/material";
import ContactForm from "../../components/forms/ContactForm";

/**
 * ContactUs Page Component
 *
 * This component provides a contact page where users can reach out for support.
 * It includes:
 * - A title and subtitle explaining the purpose of the page.
 * - A contact form for users to send messages to the support team.
 */
export default function ContactUs() {
  return (
    <Box sx={{ p: 4 }}>
      {/* === Title and Subtitle Section === */}
      <Box sx={{ mb: 4 }}>
        {/* Main Page Title */}
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, mb: 1, textAlign: "left" }}
        >
          Contact Us
        </Typography>

        {/* Subtitle / Helper Text */}
        <Typography
          variant="subtitle1"
          sx={{ color: "text.secondary", textAlign: "left" }}
        >
          Need help? Send us a message and our support team will assist you shortly.
        </Typography>

        {/* Divider */}
        <hr/>
      </Box>

      {/* === Contact Form Section === */}
      <ContactForm />
    </Box>
  );
}
