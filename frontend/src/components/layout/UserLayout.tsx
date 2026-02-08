import React, { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

const DRAWER_WIDTH = 280; // Sidebar width

export default function UserLayout() {
    const [mobileOpen, setMobileOpen] = useState(false); // Mobile drawer state
    const { user } = useAuth(); // Get current logged-in user

    const handleDrawerToggle = () => {
        setMobileOpen((prev) => !prev); // Toggle mobile drawer open/close
    };

    const userName = user?.username || "User"; // Fallback to "User" if undefined

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            {/* --- Header --- */}
            <Header
                isAdmin={false} // User layout, not admin
                userName={userName}
                onMenuClick={handleDrawerToggle} // Open/close drawer on mobile
            />

            {/* --- Sidebar --- */}
            <Sidebar
                isAdmin={false} // User menu items
                open={mobileOpen} // Mobile drawer state
                onClose={handleDrawerToggle} // Close drawer callback
            />

            {/* --- Main Content Area --- */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { xs: "100%", md: `calc(100% - ${DRAWER_WIDTH}px)` }, // Full width on mobile, sidebar offset on desktop
                    mt: "64px", // Offset by header height
                    overflowY: "auto",
                    bgcolor: "#f9fafc", // Light background for content area
                    p: 0,
                }}
            >
                {/* Spacer for mobile to prevent content overlap with header */}
                <Toolbar sx={{ display: { xs: "block", md: "none" } }} />

                {/* Nested pages rendered here via React Router Outlet */}
                <Outlet />
            </Box>
        </Box>
    );
}
