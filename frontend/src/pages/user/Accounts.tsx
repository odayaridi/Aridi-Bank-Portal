import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import { jsPDF } from "jspdf";
import FileDownloadIcon from "@mui/icons-material/FileDownload"; // Import the icon

import AccountNbsList from "../../components/lists/AccountNbsList";
import {
  fetchAccountInfo,
  fetchAccounts,
  setSelectedAccount,
} from "../../features/account/accountInfoSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

export default function Accounts() {
  const dispatch = useAppDispatch();

  const accounts = useAppSelector((state) => state.accounts.accounts);
  const selectedAccount = useAppSelector(
    (state) => state.accounts.selectedAccount
  );
  const accountInfo = useAppSelector((state) => state.accounts.accountInfo);

  // Load all account numbers on mount
  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  // Handle selecting an account
  const handleSelect = (accountNb: number) => {
    dispatch(setSelectedAccount(accountNb));
    dispatch(fetchAccountInfo(accountNb));
  };

  // === PDF Export Logic ===
  const handleExportPDF = () => {
    if (!accountInfo) return;

    const doc = new jsPDF();

    // -- Branding & Header --
    doc.setTextColor(0, 32, 96); // Enterprise Dark Blue
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("ARIDI BANK PORTAL", 20, 20);

    doc.setTextColor(100); // Grey text for metadata
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const dateStr = new Date().toLocaleString();
    doc.text(`Generated on: ${dateStr}`, 20, 26);

    // -- Divider Line --
    doc.setDrawColor(200);
    doc.line(20, 35, 190, 35);

    // -- Section Title --
    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("ACCOUNT DETAILS STATEMENT", 20, 48);

    // -- Content Configuration --
    const startY = 60;
    const lineHeight = 12;
    const labelX = 20;
    const valueX = 80;

    // Define the data to print
    const details = [
      { label: "Account Name", value: accountInfo.accountName },
      { label: "Account Number", value: String(accountInfo.accountNb) },
      { label: "Account Type", value: accountInfo.accountType },
      { label: "Branch", value: accountInfo.accountBranch },
      { label: "Date Opened", value: accountInfo.accountCreationDate },
      {
        label: "Current Balance",
        value: `$${accountInfo.accountBalance?.toFixed(2) || "0.00"} USD`,
      },
      {
        label: "Owner(s)",
        value: accountInfo.owners?.join(", ") || "N/A",
      },
    ];

    // -- Render Loop --
    details.forEach((item, index) => {
      const currentY = startY + index * lineHeight;

      // Label (Bold, Dark)
      doc.setFont("helvetica", "bold");
      doc.setTextColor(60);
      doc.setFontSize(11);
      doc.text(item.label.toUpperCase(), labelX, currentY);

      // Value (Normal, Black)
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0);
      doc.setFontSize(11);
      doc.text(String(item.value), valueX, currentY);

      // Light separator line between rows for readability
      doc.setDrawColor(240);
      doc.line(labelX, currentY + 4, 190, currentY + 4);
    });

    // -- Footer --
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(
      "This document is electronically generated and valid without signature.",
      20,
      280
    );

    // Save File
    doc.save(`Account_Statement_${accountInfo.accountNb}.pdf`);
  };

  const formattedBalance =
    accountInfo?.accountBalance !== undefined &&
    accountInfo?.accountBalance !== null
      ? `$${accountInfo.accountBalance.toFixed(2)} USD`
      : "$0.00 USD";

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#f9fafc",
        p: { xs: 2, sm: 4 },
      }}
    >
      {/* === Title Section === */}
      <Box sx={{ mb: 4, textAlign: "left" }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          My Accounts
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
          View and manage your account details
        </Typography>
        <Divider sx={{ mt: 2 }} />
      </Box>

      {/* Main Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        {/* List of account numbers */}
        <AccountNbsList
          accounts={accounts}
          selectedAccount={selectedAccount}
          onSelect={handleSelect}
        />

        {/* Balance Card */}
        {accountInfo && (
          <Card
            sx={{
              width: { xs: "100%", sm: "350px" },
              textAlign: "center",
              p: 3,
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1, color: "text.secondary", fontWeight: 600 }}>
              AVAILABLE BALANCE
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "#0066cc" }}
            >
              {formattedBalance}
            </Typography>
          </Card>
        )}

        {/* Account Details Card */}
        {accountInfo && (
          <Card sx={{ boxShadow: 3, borderRadius: 2, width: { xs: "100%", sm: "600px" } }}>
            <CardContent sx={{ p: 4 }}>
              {/* Header Row: Title + Export Button */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 4,
                  borderBottom: "1px solid #ddd",
                  pb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Details
                </Typography>

                <Button
                  variant="outlined"
                  startIcon={<FileDownloadIcon />}
                  onClick={handleExportPDF}
                  size="small"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderColor: "#0066cc",
                    color: "#0066cc",
                    "&:hover": {
                      borderColor: "#004c99",
                      backgroundColor: "rgba(0, 102, 204, 0.04)",
                    },
                  }}
                >
                  Export PDF
                </Button>
              </Box>

              {/* Row 1 */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 3 }}>
                <Box sx={{ flex: "1 1 250px" }}>
                  <Typography variant="caption" sx={{ mb: 1, fontWeight: 600, color: "text.secondary" }}>
                    ACCOUNT NAME
                  </Typography>
                  <TextField
                    fullWidth
                    value={accountInfo.accountName}
                    size="small"
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ flex: "1 1 250px" }}>
                  <Typography variant="caption" sx={{ mb: 1, fontWeight: 600, color: "text.secondary" }}>
                    ACCOUNT NUMBER
                  </Typography>
                  <TextField
                    fullWidth
                    value={accountInfo.accountNb}
                    size="small"
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ flex: "1 1 250px" }}>
                  <Typography variant="caption" sx={{ mb: 1, fontWeight: 600, color: "text.secondary" }}>
                    TYPE
                  </Typography>
                  <TextField
                    fullWidth
                    value={accountInfo.accountType}
                    size="small"
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                </Box>
              </Box>

              {/* Row 2 */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 3 }}>
                <Box sx={{ flex: "1 1 250px" }}>
                  <Typography variant="caption" sx={{ mb: 1, fontWeight: 600, color: "text.secondary" }}>
                    DATE OPENED
                  </Typography>
                  <TextField
                    fullWidth
                    value={accountInfo.accountCreationDate}
                    size="small"
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ flex: "1 1 250px" }}>
                  <Typography variant="caption" sx={{ mb: 1, fontWeight: 600, color: "text.secondary" }}>
                    ACCOUNT BRANCH
                  </Typography>
                  <TextField
                    fullWidth
                    value={accountInfo.accountBranch}
                    size="small"
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                </Box>
              </Box>

              {/* Owners */}
              <Box sx={{ width: "100%" }}>
                <Typography variant="caption" sx={{ mb: 1, fontWeight: 600, color: "text.secondary" }}>
                  OWNER(S)
                </Typography>
                <TextField
                  fullWidth
                  value={accountInfo.owners?.join(", ") || ""}
                  size="small"
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
}