import React from "react";
import { Box, Container, Typography, Grid, Link, Divider } from "@mui/material";
import {
    Phone,
    Email,
    LocationOn,
    Facebook,
    Twitter,
    LinkedIn,
    Instagram,
} from "@mui/icons-material";

export default function Footer() {
    return (
        // Footer container
        <Box
            component="footer"
            sx={{
                bgcolor: "#0a1929", // Dark background color
                color: "#fff", // Default text color
                pt: 6, // Padding top
                pb: 3, // Padding bottom
                mt: "auto", // Push footer to bottom if page content is short
            }}
        >
            <Container maxWidth="lg">
                {/* Main Footer Content Grid */}
                <Grid container spacing={4} sx={{ mb: 4 }}>
                    {/* About Section */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            gutterBottom
                            sx={{ color: "primary.main" }} // Brand color for heading
                        >
                            Aridi Bank Portal
                        </Typography>
                        <Typography
                            variant="body2"
                            color="grey.400"
                            sx={{ mb: 2, lineHeight: 1.7 }}
                        >
                            Your trusted partner for secure, smart, and seamless digital banking
                            solutions. Empowering customers with innovative financial services.
                        </Typography>

                        {/* Social Media Icons */}
                        <Box display="flex" gap={1.5} sx={{ mt: 2 }}>
                            {[
                                { icon: <Facebook />, label: "Facebook" },
                                { icon: <Twitter />, label: "Twitter" },
                                { icon: <LinkedIn />, label: "LinkedIn" },
                                { icon: <Instagram />, label: "Instagram" },
                            ].map((social, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: "50%",
                                        bgcolor: "rgba(255, 255, 255, 0.05)", // Light hover background
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            bgcolor: "primary.main", // Highlight on hover
                                            transform: "translateY(-3px)",
                                        },
                                    }}
                                    aria-label={social.label} // Accessibility label
                                >
                                    {social.icon}
                                </Box>
                            ))}
                        </Box>
                    </Grid>

                    {/* Quick Links Section */}
                    <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            Quick Links
                        </Typography>
                        <Box display="flex" flexDirection="column" gap={1}>
                            {[
                                "About Us",
                                "Services",
                                "Security",
                                "Privacy Policy",
                                "Terms of Use",
                            ].map((link, index) => (
                                <Link
                                    key={index}
                                    href="#"
                                    underline="none"
                                    color="grey.400"
                                    sx={{
                                        fontSize: "0.875rem",
                                        transition: "color 0.2s ease",
                                        "&:hover": {
                                            color: "primary.main", // Highlight on hover
                                        },
                                    }}
                                >
                                    {link}
                                </Link>
                            ))}
                        </Box>
                    </Grid>

                    {/* Support Section */}
                    <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            Support
                        </Typography>
                        <Box display="flex" flexDirection="column" gap={1}>
                            {[
                                "Help Center",
                                "FAQs",
                                "Contact Us",
                                "Report Issue",
                                "Feedback",
                            ].map((link, index) => (
                                <Link
                                    key={index}
                                    href="#"
                                    underline="none"
                                    color="grey.400"
                                    sx={{
                                        fontSize: "0.875rem",
                                        transition: "color 0.2s ease",
                                        "&:hover": {
                                            color: "primary.main",
                                        },
                                    }}
                                >
                                    {link}
                                </Link>
                            ))}
                        </Box>
                    </Grid>

                    {/* Contact Information Section */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            Contact Us
                        </Typography>
                        <Box display="flex" flexDirection="column" gap={1.5}>
                            {/* Phone */}
                            <Box display="flex" alignItems="center" gap={1}>
                                <Phone sx={{ fontSize: 18, color: "primary.main" }} />
                                <Typography variant="body2" color="grey.400">
                                    +1 (555) 123-4567
                                </Typography>
                            </Box>

                            {/* Email */}
                            <Box display="flex" alignItems="center" gap={1}>
                                <Email sx={{ fontSize: 18, color: "primary.main" }} />
                                <Typography variant="body2" color="grey.400">
                                    support@aridibank.com
                                </Typography>
                            </Box>

                            {/* Address */}
                            <Box display="flex" alignItems="flex-start" gap={1}>
                                <LocationOn sx={{ fontSize: 18, color: "primary.main" }} />
                                <Typography variant="body2" color="grey.400" sx={{ lineHeight: 1.5 }}>
                                    123 Banking Street,
                                    <br />
                                    Financial District, NY 10004
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                {/* Divider Line */}
                <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 3 }} />

                {/* Bottom Footer Section */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexDirection={{ xs: "column", sm: "row" }}
                    gap={2}
                >
                    {/* Copyright */}
                    <Typography variant="body2" color="grey.500" textAlign="center">
                        © {new Date().getFullYear()} Aridi Bank Portal. All rights reserved.
                    </Typography>

                    {/* Bottom links */}
                    <Box display="flex" gap={3}>
                        {["Privacy", "Terms", "Security"].map((link, index) => (
                            <Link
                                key={index}
                                href="#"
                                underline="none"
                                color="grey.500"
                                sx={{
                                    fontSize: "0.875rem",
                                    transition: "color 0.2s ease",
                                    "&:hover": {
                                        color: "primary.main",
                                    },
                                }}
                            >
                                {link}
                            </Link>
                        ))}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
