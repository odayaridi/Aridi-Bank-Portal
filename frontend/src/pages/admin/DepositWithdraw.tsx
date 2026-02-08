import React from "react";
import { Box, Typography } from "@mui/material";
import DepositWithdrawForm from "../../components/forms/DepositWithdrawForm";

/**
 * DepositWithdraw Component
 * Page for managing account deposits and withdrawals.
 * Displays page title, subtitle, and renders the DepositWithdrawForm for performing fund operations.
 */
export default function DepositWithdraw() {
    return (
        <Box>
            {/* Page Header: Title and Subtitle */}
            <Box mb={4}>
                <Typography variant="h4" fontWeight="bold">
                    Deposit & Withdraw Funds
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Manage account balances by depositing or withdrawing funds.
                </Typography>
            </Box>

            {/* Form Container: Deposit & Withdraw Form Component */}
            <DepositWithdrawForm />
        </Box>
    ); 
}
