import React, { useEffect } from "react";
import { Box, Typography, Avatar, Paper } from "@mui/material";


import { useAlert } from "../../hooks/useAlert";
import AlertSnackbar from "../../components/common/AlertSnackbar";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getUserProfile } from "../../features/user/userProfileSlice";

export default function Profile() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userProfile.user);

  const { alertInfo, showAlert, handleClose } = useAlert();

  useEffect(() => {
    dispatch(getUserProfile())
      .unwrap()
      .catch((err: any) => {
        showAlert(
          err?.response?.data?.message || "Failed to load profile",
          "error"
        );
      });
  }, [dispatch]);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#f9fafc",
        p: { xs: 2, sm: 4 },
      }}
    >
      <Box sx={{ mb: 4, textAlign: "left" }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          My Profile
        </Typography>
        <hr />
      </Box>

      {user && (
        <Paper
          elevation={4}
          sx={{
            borderRadius: 4,
            p: { xs: 3, sm: 5 },
            maxWidth: 1000,
            mx: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "center", sm: "flex-start" },
              gap: { xs: 3, sm: 5 },
            }}
          >
            <Avatar
              sx={{
                bgcolor: "#00264d",
                width: 100,
                height: 100,
                fontSize: 40,
                flexShrink: 0,
              }}
            >
              {user.firstName.charAt(0).toUpperCase()}
            </Avatar>

            <Box
              sx={{
                flex: 1,
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                gap: { xs: 3, sm: 4 },
              }}
            >
              {[
                ["FIRST NAME", user.firstName],
                ["LAST NAME", user.lastName],
                ["USERNAME", user.username],
                ["PHONE NUMBER", user.phoneNumber],
                ["COUNTRY", user.country],
                ["CITY", user.city],
                ["EMAIL", user.email],
                ["DATE OF BIRTH", user.dob],
              ].map(([label, value]) => (
                <Box
                  key={label}
                  sx={{ minWidth: { xs: "100%", sm: "calc(50% - 16px)" } }}
                >
                  <Typography variant="caption" sx={{ color: "gray" }}>
                    {label}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mt: 0.5 }}
                  >
                    {value || "—"}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Paper>
      )}

      <AlertSnackbar
        open={alertInfo.open}
        message={alertInfo.message}
        severity={alertInfo.severity}
        onClose={handleClose}
      />
    </Box>
  );
}
