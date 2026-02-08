import {
    Button,
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Avatar,
} from "@mui/material";
import {
    ArrowForward,
    AccountBalance,
    Security,
    AttachMoney,
    TrendingUp,
    CreditCard,
    Group,
    AccessTime,
    SmartToy, // Chatbot Icon
    Chat,     // Chat Button Icon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

/**
 * Home Component
 * Landing page for the Aridi Bank Portal.
 * * LAYOUT NOTE: 
 * This version uses CSS Grid via the Box component for efficient responsiveness
 * instead of the MUI <Grid> component.
 */
export default function Home() {
    const navigate = useNavigate();

    // Navigate to login page
    const handleGetStarted = () => {
        navigate("/login");
    };

    // Navigate to Chatbot page
    const handleChatbot = () => {
        navigate("/chatbot");
    };

    return (
        <Box sx={{ bgcolor: "background.default", color: "text.primary" }}>
            {/* Header */}
            <header style={{ background: "#0a1929", color: "#fff" }}>
                <Container maxWidth="lg">
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        py={3}
                        sx={{ textAlign: "center" }}
                    >
                        <Box display="flex" alignItems="center" gap={1}>
                            <Avatar sx={{ bgcolor: "primary.main" }}>
                                <AccountBalance fontSize="small" />
                            </Avatar>
                            <Typography variant="h5" fontWeight="bold">
                                Aridi Bank Portal
                            </Typography>
                        </Box>
                    </Box>
                </Container>
            </header>

            {/* Hero Section */}
            <section>
                <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
                    <Typography
                        variant="h2"
                        fontWeight="bold"
                        gutterBottom
                        sx={{
                            fontSize: { xs: "2rem", md: "3.5rem" },
                            mb: 3,
                        }}
                    >
                        Your Digital Gateway to{" "}
                        <span style={{ color: "#1976d2" }}>Banking Excellence</span>
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ maxWidth: "800px", mx: "auto", mb: 4 }}
                    >
                        Manage your accounts, track transactions, and transfer funds
                        securely — all from one intuitive platform built for modern banking.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForward />}
                        onClick={handleGetStarted}
                        sx={{ px: 4, py: 1.5, fontWeight: "bold", borderRadius: 3 }}
                    >
                        Get Started
                    </Button>
                </Container>
            </section>

            {/* Stats Section */}
            <section style={{ background: "#f9fafc" }}>
                <Container maxWidth="lg" sx={{ py: 8 }}>
                    {/* Replaced Grid with CSS Grid Box */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                            gap: 4,
                        }}
                    >
                        {[
                            { count: "25K+", label: "Active Customers", color: "primary.main" },
                            { count: "$120M+", label: "Total Transactions", color: "success.main" },
                            { count: "150+", label: "Trusted Branches", color: "secondary.main" },
                        ].map((item, index) => (
                            <Card
                                key={index}
                                sx={{
                                    textAlign: "center",
                                    py: 4,
                                    boxShadow: 3,
                                    borderRadius: 3,
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-6px)",
                                        boxShadow: 6,
                                    },
                                }}
                            >
                                <CardContent>
                                    <Typography
                                        variant="h3"
                                        fontWeight="bold"
                                        sx={{ color: item.color }}
                                    >
                                        {item.count}
                                    </Typography>
                                    <Typography color="text.secondary">{item.label}</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Container>
            </section>

            {/* How It Works Section */}
            <section>
                <Container maxWidth="lg" sx={{ py: 8 }}>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        textAlign="center"
                        gutterBottom
                    >
                        How Aridi Bank Works
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        textAlign="center"
                        sx={{ mb: 6 }}
                    >
                        Banking made simple, secure, and fast for both users and administrators.
                    </Typography>

                    {/* Replaced Grid with CSS Grid Box */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                            gap: 4,
                            alignItems: "stretch", // Ensures all cards are same height
                        }}
                    >
                        {[
                            {
                                icon: <Group sx={{ fontSize: 36 }} />,
                                title: "1. Sign in with your account",
                                desc: "Sign in securely and get verified within minutes.",
                            },
                            {
                                icon: <AttachMoney sx={{ fontSize: 36 }} />,
                                title: "2. Manage Your Finances",
                                desc: "Open multiple accounts, view balances, and handle funds with ease.",
                            },
                            {
                                icon: <CreditCard sx={{ fontSize: 36 }} />,
                                title: "3. Transact Confidently",
                                desc: "Transfer money, make payments, and view transaction history in real time.",
                            },
                        ].map((step, index) => (
                            <Card
                                key={index}
                                sx={{
                                    textAlign: "center",
                                    borderRadius: 3,
                                    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    height: "100%",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-6px)",
                                        boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.15)",
                                    },
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: "primary.main",
                                            width: 64,
                                            height: 64,
                                            mb: 2,
                                            mx: "auto",
                                        }}
                                    >
                                        {step.icon}
                                    </Avatar>
                                    <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                        gutterBottom
                                        sx={{ mt: 1 }}
                                    >
                                        {step.title}
                                    </Typography>
                                    <Typography color="text.secondary">{step.desc}</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Container>
            </section>

            {/* Features Section */}
            <section style={{ background: "#f9fafc" }}>
                <Container maxWidth="lg" sx={{ py: 8 }}>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        textAlign="center"
                        gutterBottom
                    >
                        Why Choose Aridi Bank Portal?
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        textAlign="center"
                        sx={{ mb: 6 }}
                    >
                        Designed with trust, technology, and transparency for the modern
                        financial world.
                    </Typography>

                    {/* Replaced Grid with CSS Grid Box - 2 Columns */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                            gap: 6,
                            alignItems: "center",
                        }}
                    >
                        {/* Left Column: Feature List */}
                        <Box>
                            {[
                                {
                                    icon: <Security />,
                                    title: "Advanced Security",
                                    desc: "Multi-layered encryption and two-factor authentication to keep your data safe.",
                                },
                                {
                                    icon: <TrendingUp />,
                                    title: "Real-Time Insights",
                                    desc: "Track balances, transactions, and trends with live analytics.",
                                },
                                {
                                    icon: <AccessTime />,
                                    title: "24/7 Availability",
                                    desc: "Bank anytime, anywhere with no downtime or maintenance delays.",
                                },
                            ].map((feature, index) => (
                                <Box
                                    display="flex"
                                    gap={2}
                                    alignItems="flex-start"
                                    mb={4}
                                    key={index}
                                >
                                    <Avatar sx={{ bgcolor: "primary.main" }}>
                                        {feature.icon}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold">
                                            {feature.title}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            {feature.desc}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>

                        {/* Right Column: CTA Box */}
                        <Box
                            sx={{
                                bgcolor: "primary.main",
                                color: "white",
                                borderRadius: 3,
                                p: 5,
                                textAlign: "center",
                                boxShadow: 4,
                            }}
                        >
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Begin Your Digital Banking Journey
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 3 }}>
                                Join thousands of users already managing their accounts and
                                transactions effortlessly through Aridi Bank Portal.
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                endIcon={<ArrowForward />}
                                onClick={handleGetStarted}
                                sx={{
                                    bgcolor: "white",
                                    color: "primary.main",
                                    fontWeight: "bold",
                                    borderRadius: 3,
                                    px: 4,
                                    py: 1.5,
                                    "&:hover": { bgcolor: "grey.100" },
                                }}
                            >
                                Get Started
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </section>

            {/* Chatbot / AI Support Section */}
            <section style={{ paddingBottom: "60px" }}>
                <Container maxWidth="lg" sx={{ mt: 8 }}>
                    <Box
                        sx={{
                            background: "linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)",
                            borderRadius: 4,
                            p: { xs: 4, md: 8 },
                            display: "flex", // Flexbox here works best for 1-row split
                            flexDirection: { xs: "column", md: "row" },
                            alignItems: "center",
                            justifyContent: "space-between",
                            color: "white",
                            boxShadow: 6,
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {/* Decorative background circle */}
                        <Box
                            sx={{
                                position: "absolute",
                                top: -50,
                                right: -50,
                                width: 200,
                                height: 200,
                                borderRadius: "50%",
                                bgcolor: "rgba(255,255,255,0.1)",
                            }}
                        />

                        <Box sx={{ maxWidth: { xs: "100%", md: "60%" }, zIndex: 1, textAlign: { xs: "center", md: "left" } }}>
                            <Box display="flex" alignItems="center" gap={2} mb={2} justifyContent={{ xs: "center", md: "flex-start" }}>
                                <SmartToy sx={{ fontSize: 40 }} />
                                <Typography variant="h4" fontWeight="bold">
                                    Need Instant Help?
                                </Typography>
                            </Box>
                            <Typography variant="h6" sx={{ opacity: 0.9, mb: { xs: 3, md: 0 } }}>
                                Have questions about your transactions or need account support?
                                Talk to our AI Assistant for instant answers, 24/7.
                            </Typography>
                        </Box>

                        <Box sx={{ zIndex: 1 }}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<Chat />}
                                onClick={handleChatbot}
                                sx={{
                                    bgcolor: "white",
                                    color: "#0d47a1",
                                    fontWeight: "bold",
                                    fontSize: "1.1rem",
                                    px: 4,
                                    py: 2,
                                    borderRadius: 3,
                                    boxShadow: "0 4px 14px 0 rgba(0,0,0,0.3)",
                                    "&:hover": {
                                        bgcolor: "grey.100",
                                        transform: "scale(1.05)",
                                        transition: "all 0.2s ease-in-out"
                                    },
                                }}
                            >
                                Chat with AI
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </section>

            {/* Footer */}
            <footer style={{ background: "#0a1929", color: "#fff" }}>
                <Container maxWidth="lg">
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        py={4}
                        flexDirection={{ xs: "column", md: "row" }}
                        gap={2}
                    >
                        <Box display="flex" alignItems="center" gap={1}>
                            <Avatar sx={{ bgcolor: "primary.main" }}>
                                <AccountBalance fontSize="small" />
                            </Avatar>
                            <Typography variant="h6" fontWeight="bold">
                                Aridi Bank Portal
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="grey.400">
                            © {new Date().getFullYear()} Aridi Bank Portal — Secure. Smart.
                            Seamless Banking.
                        </Typography>
                    </Box>
                </Container>
            </footer>
        </Box>
    );
}