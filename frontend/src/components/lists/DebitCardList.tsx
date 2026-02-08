import React, { useEffect, useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { fetchUserDebitCards } from "../../api/debitCardApi";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { useAlert } from "../../hooks/useAlert";
import AlertSnackbar from "../common/AlertSnackbar";
import type { UserDebitCard } from "../../types/debitCard/UserDebitCard";

export default function DebitCardList() {
  // State to hold the list of debit cards
  const [cards, setCards] = useState<UserDebitCard[]>([]);

  // Custom hook to manage alert messages
  const { alertInfo, showAlert, handleClose } = useAlert();

  // Fetch debit cards when the component mounts
  useEffect(() => {
    const loadCards = async () => {
      try {
        const data = await fetchUserDebitCards(); // API call
        setCards(data); // Set the fetched cards to state
      } catch (err: any) {
          console.log(err)
      }
    };
    loadCards();
  }, []);

  // If there are no cards, display a placeholder message
  if (cards.length === 0)
    return (
      <>
        <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
          No debit cards available.
        </Typography>
        {/* Alert snackbar for any error messages */}
        <AlertSnackbar
          open={alertInfo.open}
          message={alertInfo.message}
          severity={alertInfo.severity}
          onClose={handleClose}
        />
      </>
    );

  return (
    <>
      {/* Stack to layout multiple debit cards horizontally and wrap on small screens */}
      <Stack
        direction="row"
        flexWrap="wrap"
        justifyContent="flex-start"
        gap={3}
      >
        {cards.map((card, index) => (
          // Card container
          <Box
            key={index}
            sx={{
              width: 300,
              height: 180,
              borderRadius: 4,
              p: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)", // Gradient background
              color: "white",
              boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-5px)", // Lift effect on hover
                boxShadow: "0 12px 25px rgba(0,0,0,0.5)",
              },
            }}
          >
            {/* Top row: Bank name and credit card icon */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                Aridi Bank Portal
              </Typography>
              <CreditCardIcon sx={{ fontSize: 28, opacity: 0.8 }} />
            </Box>

            {/* Middle: Account number with spacing and letter tracking */}
            <Typography
              variant="h6"
              sx={{
                letterSpacing: 2,
                fontWeight: 700,
                mt: 1,
                mb: 1,
              }}
            >
              {card.accountNb}
            </Typography>

            {/* Bottom row: Card holder and expiration date */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-end"
            >
              {/* Card holder info */}
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  CARD HOLDER
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {card.username.toUpperCase()}
                </Typography>
              </Box>

              {/* Expiration date info */}
              <Box textAlign="right">
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  EXPIRES
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {new Date(card.expirationDate).toLocaleDateString("en-GB", {
                    month: "2-digit",
                    year: "2-digit",
                  })}
                </Typography>
              </Box>
            </Box>

            {/* Card status */}
            <Typography
              variant="caption"
              sx={{
                textAlign: "right",
                opacity: 0.7,
                mt: 1,
                color:
                  card.cardStatus === "Active"
                    ? "#4caf50" // Green for active cards
                    : "rgba(255,255,255,0.5)", // Faded color for inactive cards
              }}
            >
              {card.cardStatus}
            </Typography>
          </Box>
        ))}
      </Stack>

      {/* Alert Snackbar to display errors */}
      <AlertSnackbar
        open={alertInfo.open}
        message={alertInfo.message}
        severity={alertInfo.severity}
        onClose={handleClose}
      />
    </>
  );
}
