import React from "react";
import { List, ListItemButton, ListItemText, Box, Typography } from "@mui/material";

interface AccountNbsListProps {
  accounts: number[]; // Array of account numbers to display
  selectedAccount: number | null; // Currently selected account
  onSelect: (accountNb: number) => void; // Callback when an account is selected
}

export default function AccountNbsList({
  accounts,
  selectedAccount,
  onSelect,
}: AccountNbsListProps) {
  return (
    // Outer container box for styling the list
    <Box
      sx={{
        width: { xs: "100%", sm: "350px" }, // Full width on mobile, fixed width on larger screens
        backgroundColor: "#f5f6fa", // Light background for the list container
        borderRadius: "8px", // Rounded corners
        p: 2, // Padding inside the box
        boxShadow: 1, // Slight shadow for depth
      }}
    >
      {/* Check if there are any accounts */}
      {accounts.length === 0 ? (
        <Typography
          sx={{ textAlign: "center", fontWeight: 500, color: "#555" }}
        >
          You don't have any accounts yet
        </Typography>
      ) : (
        <List sx={{ p: 0 }}>
          {accounts.map((acc) => (
            // Each account number as a clickable button
            <ListItemButton
              key={acc}
              onClick={() => onSelect(acc)} // Trigger selection callback
              sx={{
                backgroundColor:
                  selectedAccount === acc ? "#001f66" : "#002080", // Highlight selected account
                color: "white", // Text color
                mb: 1, // Margin bottom for spacing between buttons
                borderRadius: "6px", // Slightly rounded button corners
                "&:hover": {
                  backgroundColor: "#00164d", // Darker color on hover
                },
                "&:last-child": {
                  mb: 0, // Remove margin from the last item
                },
              }}
            >
              {/* Display account number centered with bold text */}
              <ListItemText
                primary={acc}
                sx={{ textAlign: "center", fontWeight: 600 }}
              />
            </ListItemButton>
          ))}
        </List>
      )}
    </Box>
  );
}
