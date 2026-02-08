import React from "react";
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import {
    PersonAdd,
    AccountBalance,
    CreditCard,
    People,
    SwapHoriz,
    Message,
    Dashboard,
    AccountBalanceWallet,
    ContactMail,
    Person,
    Receipt,
    Analytics,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Props for Sidebar component
 */
interface SidebarProps {
    isAdmin: boolean; // Flag to determine if user is admin
    open: boolean; // Drawer open state for mobile
    onClose: () => void; // Callback to close drawer on mobile
}

// Drawer width constant
const DRAWER_WIDTH = 280;

/**
 * Sidebar component
 *
 * Displays a navigation drawer for Admin or User based on `isAdmin`.
 * - Admin menu includes user management, accounts, and messages.
 * - User menu includes dashboard, transactions, accounts, and profile.
 * - Responsive behavior: temporary drawer for mobile, permanent for desktop.
 */
export default function Sidebar({ isAdmin, open, onClose }: SidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    // Admin menu items
    const adminMenuItems = [
        { text: "Analytics", icon: <Analytics />, path: "/admin/analytics" },
        { text: "Create User", icon: <PersonAdd />, path: "/admin/create-user" },
        { text: "Create Account", icon: <AccountBalance />, path: "/admin/create-account" },
        { text: "Debit Cards", icon: <CreditCard />, path: "/admin/debit-cards" },
        { text: "Users", icon: <People />, path: "/admin/users" },
        { text: "Deposit/Withdraw", icon: <SwapHoriz />, path: "/admin/deposit-withdraw" },
        { text: "User Messages", icon: <Message />, path: "/admin/messages" },
    ];

    // User menu items
    const userMenuItems = [
        { text: "My Dashboard", icon: <Dashboard />, path: "/user/dashboard" },
        { text: "Transactions", icon: <Receipt />, path: "/user/transactions" },
        { text: "Accounts", icon: <AccountBalanceWallet />, path: "/user/accounts" },
        { text: "Contact Us", icon: <ContactMail />, path: "/user/contact-us" },
        { text: "Profile", icon: <Person />, path: "/user/profile" },
    ];

    // Select menu items based on role
    const menuItems = isAdmin ? adminMenuItems : userMenuItems;

    /**
     * Handles navigation when a menu item is clicked
     * - Navigates to the selected path
     * - Closes the drawer on mobile for better UX
     */
    const handleNavigation = (path: string) => {
        navigate(path);
        if (isMobile) onClose();
    };

    // Drawer content including menu items and footer
    const drawerContent = (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                bgcolor: "#0a1929",
                color: "#fff",
            }}
        >
            {/* Menu Items */}
            <List sx={{ flex: 1, px: 2, py: 2 }}>
                {menuItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    borderRadius: 2,
                                    transition: "all 0.2s ease",
                                    bgcolor: isActive
                                        ? "rgba(25, 118, 210, 0.2)"
                                        : "transparent",
                                    py: 1.5,
                                    "&:hover": {
                                        bgcolor: isActive
                                            ? "rgba(25, 118, 210, 0.3)"
                                            : "rgba(255, 255, 255, 0.05)",
                                        transform: "translateX(4px)",
                                    },
                                    borderLeft: isActive
                                        ? "3px solid #1976d2"
                                        : "3px solid transparent",
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: isActive ? "#1976d2" : "grey.400",
                                        minWidth: 40,
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 600 : 400,
                                        color: isActive ? "#fff" : "grey.300",
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

            {/* Footer Section */}
            <Box sx={{ p: 3 }}>
                <Typography variant="caption" color="grey.500" display="block">
                    © {new Date().getFullYear()} Aridi Bank
                </Typography>
                <Typography variant="caption" color="grey.600">
                    Secure. Smart. Seamless.
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={isMobile ? open : true}
            onClose={onClose}
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: DRAWER_WIDTH,
                    boxSizing: "border-box",
                    border: "none",
                    boxShadow: "4px 0 12px rgba(0, 0, 0, 0.1)",
                    top: isMobile ? 0 : 64, // Offset by header height on desktop
                    height: isMobile ? "100%" : "calc(100% - 64px)", // Adjust height on desktop
                },
            }}
            ModalProps={{
                keepMounted: true, // Better mobile performance
            }}
        >
            {drawerContent}
        </Drawer>
    );
}