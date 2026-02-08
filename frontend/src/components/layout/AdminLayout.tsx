import React, { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

// Width of the sidebar drawer
const DRAWER_WIDTH = 280;

export default function AdminLayout() {
    // State to manage mobile sidebar open/close
    const [mobileOpen, setMobileOpen] = useState(false);

    /**
     * Toggles the sidebar drawer on mobile devices
     */
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Example static admin username (could be dynamic)
    const userName = "Admin";

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            {/* Header Component */}
            <Header
                isAdmin={true}           // Flag indicating this is admin layout
                userName={userName}      // Display the user's name in the header
                onMenuClick={handleDrawerToggle} // Toggle sidebar on menu click
            />

            {/* Sidebar Component */}
            <Sidebar
                isAdmin={true}           // Flag indicating this is admin layout
                open={mobileOpen}        // Control open state for mobile
                onClose={handleDrawerToggle} // Close sidebar when needed
            />

            {/* Main content area */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1, // Main content expands to fill available space
                    width: { xs: "100%", md: `calc(100% - ${DRAWER_WIDTH}px)` }, // Adjust width based on drawer
                    mt: "64px", // Top margin to account for header height (adjust if header height changes)
                    overflowY: "auto", // Make content scrollable vertically
                    bgcolor: "#f9fafc", // Background color for content area
                    p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
                }}
            >
                {/* Toolbar spacer for mobile view to offset content */}
                <Toolbar sx={{ display: { xs: "block", md: "none" } }} />

                {/* Outlet renders nested routes/pages */}
                <Outlet />
            </Box>
        </Box>
    );
}
