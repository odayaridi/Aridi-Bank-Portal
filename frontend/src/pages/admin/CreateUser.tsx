import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import UserForm from "../../components/forms/UserForm";

/**
 * CreateUser Component
 * Page for creating a new user.
 * Displays page title, subtitle, and renders the UserForm for inputting user details.
 */
export default function CreateUser() {
    return (
        <Box>
            {/* Page Header: Title and Subtitle */}
            <Box mb={4}>
                <Typography variant="h4" fontWeight="bold">
                    Create New User
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Register a new user by filling out the form below with their personal information.
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
                {/* User Form Component */}
                <UserForm />
            </Paper>
        </Box>
    );
}
