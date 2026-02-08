import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import DebitCardForm from "../../components/forms/DebitCardForm";

/**
 * DebitCard Component
 * Page for managing debit cards.
 * Displays page title, subtitle, and renders the DebitCardForm for card operations.
 */
export default function DebitCard() {
    return (
        <Box>
            {/* Page Header: Title and Subtitle */}
            <Box mb={4}>
                <Typography variant="h4" fontWeight="bold">
                    Manage Debit Cards
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Create, update, or delete debit cards for customer accounts.
                </Typography>
            </Box>

            {/* Form Container: Debit Card Form Component */}
            <DebitCardForm />
        </Box>
    ); 
}
