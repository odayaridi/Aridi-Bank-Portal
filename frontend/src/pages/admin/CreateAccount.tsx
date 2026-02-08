import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import AccountForm from "../../components/forms/AccountForm";

/**
 * CreateAccount Component
 * Page for creating a new bank account.
 * Displays page title, subtitle, and renders the AccountForm for inputting account details.
 */
export default function CreateAccount() {
    return (
        <Box>
            {/* Page Title & Subtitle */}
            <Box mb={4}>
                <Typography variant="h4" fontWeight="bold">
                    Create New Account
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Set up a new bank account by filling out the form below with account details.
                </Typography>
            </Box>

            {/* Form Container */}
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                }}
            >
                {/* Account Form Component */}
                <AccountForm />
            </Paper>
        </Box>
    ); 
}
