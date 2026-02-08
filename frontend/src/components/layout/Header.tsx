import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import {
    Menu as MenuIcon,
    Logout,
    AccountBalance,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../api/authApi";

interface HeaderProps {
    isAdmin: boolean;
    userName?: string;
    onMenuClick: () => void; // Callback to toggle sidebar
}

export default function Header({ isAdmin, userName = "User", onMenuClick }: HeaderProps) {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Detect mobile screen
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // For user menu dropdown

    // Open user menu
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    // Close user menu
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Logout action
    const handleLogout = async () => {
        handleMenuClose(); // close menu immediately
        try {
            await logoutUser(); // Call API to logout
            console.log("User logged out successfully");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            navigate("/login"); // Redirect to login page
        }
    };

    // Display name (could capitalize first letter if needed)
    const displayName = userName;

    return (
        // Top AppBar
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                bgcolor: "#0a1929", // Dark header
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                zIndex: (theme) => theme.zIndex.drawer + 1, // Ensure above sidebar
                height: 64, // Fixed header height
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 3 } }}>
                {/* Left Section - Menu Icon (mobile) & Logo (desktop) */}
                <Box display="flex" alignItems="center" gap={2}>
                    {/* Hamburger menu for mobile */}
                    {isMobile && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={onMenuClick}
                            sx={{
                                "&:hover": {
                                    bgcolor: "rgba(255, 255, 255, 0.1)",
                                },
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    {/* Logo and site name for desktop */}
                    {!isMobile && (
                        <Box display="flex" alignItems="center" gap={1}>
                            <Avatar
                                sx={{
                                    bgcolor: "primary.main",
                                    width: 36,
                                    height: 36,
                                }}
                            >
                                <AccountBalance fontSize="small" />
                            </Avatar>
                            <Box>
                                <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1 }}>
                                    Aridi Bank Portal
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{ color: "grey.400", fontSize: "0.7rem" }}
                                >
                                    {isAdmin ? "Administrator" : "Customer"}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </Box>

                {/* Center Section - Mobile Page Title */}
                {isMobile && (
                    <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1, ml: 2 }}>
                        Aridi Bank
                    </Typography>
                )}

                {/* Right Section - User Menu */}
                <Box display="flex" alignItems="center" gap={1}>
                    {/* User Avatar + Name */}
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        sx={{
                            cursor: "pointer",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            transition: "all 0.2s ease",
                            "&:hover": {
                                bgcolor: "rgba(255, 255, 255, 0.1)",
                            },
                        }}
                        onClick={handleMenuOpen}
                    >
                        {/* Avatar with first letter */}
                        <Avatar
                            sx={{
                                width: 36,
                                height: 36,
                                bgcolor: "primary.main",
                                fontSize: "0.9rem",
                                fontWeight: "bold",
                            }}
                        >
                            {displayName.charAt(0)}
                        </Avatar>

                        {/* Name and role (desktop only) */}
                        {!isMobile && (
                            <Box>
                                <Typography variant="body2" fontWeight="600" sx={{ lineHeight: 1.2 }}>
                                    {displayName}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{ color: "grey.400", fontSize: "0.7rem" }}
                                >
                                    {isAdmin ? "Admin" : "User"}
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Dropdown Menu for User */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        transformOrigin={{ horizontal: "right", vertical: "top" }}
                        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                        PaperProps={{
                            sx: {
                                mt: 1.5,
                                minWidth: 200,
                                borderRadius: 2,
                                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
                            },
                        }}
                    >
                        {/* User Info in Menu */}
                        <Box sx={{ px: 2, py: 1.5 }}>
                            <Typography variant="body2" fontWeight="600">
                                {displayName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {isAdmin ? "Administrator Account" : "Customer Account"}
                            </Typography>
                        </Box>

                        <Divider />

                        {/* Logout Action */}
                        <MenuItem
                            onClick={handleLogout}
                            sx={{
                                py: 1.5,
                                color: "error.main",
                                "&:hover": {
                                    bgcolor: "error.lighter",
                                },
                            }}
                        >
                            <ListItemIcon>
                                <Logout fontSize="small" color="error" />
                            </ListItemIcon>
                            <ListItemText>Logout</ListItemText>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
