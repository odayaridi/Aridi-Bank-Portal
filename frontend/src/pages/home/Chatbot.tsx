import React, { useState, useRef, useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    Avatar,
    Paper,
    TextField,
    IconButton,
} from "@mui/material";
import { Send, AccountBalance, SmartToy } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Assume this is your API wrapper
import { askAssistant } from "../../api/assistantApi";

// --- STYLE CONSTANTS (Matches Home.tsx) ---
const COLORS = {
    navy: "#0a1929",      // Global Header/Footer
    primary: "#1976d2",   // Buttons, User Bubbles, Links
    background: "#f9fafc",// Main Page Background
    botBubble: "#f0f2f5", // Light Gray for Bot
    textDark: "#1a2027",  // Main Text
    white: "#ffffff",
};

// --- TYPES ---
interface Message {
    text: string;
    sender: "bot" | "user";
}

// --- UTILITY: Format Message ---
const formatMessage = (text: string): string => {
    let safeText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return safeText
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br>");
};

export default function Chatbot() {
    const navigate = useNavigate();

    const [messages, setMessages] = useState<Message[]>([
        { text: "Hello! I am the Aridi Bank AI Assistant. How can I help you today?", sender: "bot" }
    ]);
    const [inputValue, setInputValue] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isTyping, setIsTyping] = useState<boolean>(false);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, isLoading]);

    // --- Typewriter Animation ---
    const typeWriter = (fullText: string) => {
        return new Promise<void>((resolve) => {
            let index = 0;
            // Faster typing speed for better UX
            const interval = setInterval(() => {
                setMessages((prev) => {
                    const last = prev[prev.length - 1];
                    if (!last || last.sender !== "bot") return prev;

                    const updated = [...prev];
                    updated[updated.length - 1] = {
                        ...last,
                        text: fullText.slice(0, index),
                    };
                    return updated;
                });

                index++;
                if (index > fullText.length) {
                    clearInterval(interval);
                    resolve();
                }
            }, 10);
        });
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inputValue.trim() || isLoading || isTyping) return;

        const userMessage = inputValue.trim();

        // 1. Add User Message
        setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
        setInputValue("");
        setIsLoading(true);

        try {
            // 2. Call API
            const response = await askAssistant(userMessage);
            const aiReply = response.data.reply;
            const formattedReply = formatMessage(aiReply);

            setIsLoading(false);
            setIsTyping(true);

            // 3. Add Empty Bot Message
            setMessages((prev) => [...prev, { text: "", sender: "bot" }]);

            // 4. Type it out
            await typeWriter(formattedReply);

            setIsTyping(false);

        } catch (error) {
            console.error("Assistant error:", error);
            setIsLoading(false);
            setIsTyping(false);
            setMessages((prev) => [
                ...prev,
                { text: "I'm sorry, connection failed. Please try again later.", sender: "bot" }
            ]);
        }
    };

    return (
        <Box sx={{ bgcolor: COLORS.background, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

            {/* CSS for loading dots animation */}
            <style>
                {`
                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1); }
                }
                .dot {
                    width: 8px; height: 8px;
                    background: #adb5bd;
                    border-radius: 50%;
                    animation: bounce 1.4s infinite ease-in-out both;
                }
                .dot:nth-of-type(1) { animation-delay: -0.32s; }
                .dot:nth-of-type(2) { animation-delay: -0.16s; }
                `}
            </style>

            {/* --- HEADER (Matches Home.tsx) --- */}
            <header style={{ background: COLORS.navy, color: COLORS.white }}>
                <Container maxWidth="lg">
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        py={3}
                        sx={{ textAlign: "center", cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    >
                        <Box display="flex" alignItems="center" gap={1}>
                            <Avatar sx={{ bgcolor: COLORS.primary }}>
                                <AccountBalance fontSize="small" />
                            </Avatar>
                            <Typography variant="h5" fontWeight="bold">
                                Aridi Bank Portal
                            </Typography>
                        </Box>
                    </Box>
                </Container>
            </header>

            {/* --- MAIN CONTENT SECTION --- */}
            <Box
                sx={{
                    flex: 1,
                    py: { xs: 2, md: 6 }, // Padding changes based on screen size
                    px: { xs: 2, md: 0 },
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center" // Centers the chat card vertically on desktop
                }}
            >
                <Container maxWidth="md" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    
                    <Paper
                        elevation={6}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                            borderRadius: 4,
                            bgcolor: COLORS.white,
                            // Responsive Height: 
                            // Full height (minus padding) on mobile, fixed height on desktop
                            height: { xs: "calc(100vh - 140px)", md: "75vh" }, 
                            boxShadow: "0px 10px 40px rgba(0,0,0,0.1)",
                        }}
                    >
                        {/* 1. Chat Window Header */}
                        <Box
                            sx={{
                                background: "linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)", // Matches Home AI Section
                                p: 2,
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                color: "white",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                zIndex: 1
                            }}
                        >
                            <Avatar sx={{ bgcolor: "white", color: COLORS.primary }}>
                                <SmartToy />
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    AI Support Assistant
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                    Always online • Instant replies
                                </Typography>
                            </Box>
                        </Box>

                        {/* 2. Messages Area */}
                        <Box
                            sx={{
                                flex: 1,
                                p: 3,
                                overflowY: "auto",
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                bgcolor: "#fff", // Inner background
                            }}
                        >
                            {messages.map((msg, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        alignSelf: msg.sender === "bot" ? "flex-start" : "flex-end",
                                        maxWidth: { xs: "85%", md: "75%" },
                                    }}
                                >
                                    {/* Sender Name (Optional, good for accessibility) */}
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            ml: msg.sender === "bot" ? 1 : 0, 
                                            mr: msg.sender === "user" ? 1 : 0,
                                            display: "block", 
                                            mb: 0.5, 
                                            color: "text.secondary",
                                            textAlign: msg.sender === "bot" ? "left" : "right"
                                        }}
                                    >
                                        {msg.sender === "bot" ? "Aridi Bot" : "You"}
                                    </Typography>

                                    <Box
                                        sx={{
                                            p: "12px 18px",
                                            borderRadius: "18px",
                                            bgcolor: msg.sender === "bot" ? COLORS.botBubble : COLORS.primary,
                                            color: msg.sender === "user" ? "white" : COLORS.textDark,
                                            // Corner shaping for chat bubble effect
                                            borderTopLeftRadius: msg.sender === "bot" ? "4px" : "18px",
                                            borderTopRightRadius: msg.sender === "user" ? "4px" : "18px",
                                            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                                            wordBreak: "break-word",
                                            lineHeight: 1.5,
                                            fontSize: "0.95rem"
                                        }}
                                    >
                                        {msg.sender === "bot" ? (
                                            <span dangerouslySetInnerHTML={{ __html: msg.text }} />
                                        ) : (
                                            msg.text
                                        )}
                                    </Box>
                                </Box>
                            ))}

                            {/* Loading Indicator */}
                            {isLoading && (
                                <Box sx={{ alignSelf: "flex-start", maxWidth: "80%" }}>
                                    <Typography variant="caption" sx={{ ml: 1, mb: 0.5, color: "text.secondary" }}>Aridi Bot</Typography>
                                    <Box
                                        sx={{
                                            bgcolor: COLORS.botBubble,
                                            p: "16px 20px",
                                            borderRadius: "18px",
                                            borderTopLeftRadius: "4px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px",
                                            width: "fit-content"
                                        }}
                                    >
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                    </Box>
                                </Box>
                            )}
                            <div ref={messagesEndRef} />
                        </Box>

                        {/* 3. Input Area */}
                        <Box 
                            component="form" 
                            onSubmit={handleSendMessage} 
                            sx={{ 
                                p: 2, 
                                borderTop: "1px solid #eee",
                                bgcolor: "white" 
                            }}
                        >
                            <Box 
                                sx={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    bgcolor: COLORS.botBubble, 
                                    borderRadius: "24px", 
                                    p: "8px 8px 8px 20px",
                                    gap: 1
                                }}
                            >
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    placeholder="Type your question here..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    disabled={isLoading || isTyping}
                                    InputProps={{ disableUnderline: true }}
                                    sx={{ fontSize: "0.95rem" }}
                                />
                                <IconButton
                                    type="submit"
                                    disabled={!inputValue.trim() || isLoading || isTyping}
                                    sx={{ 
                                        bgcolor: inputValue.trim() ? COLORS.primary : "#e0e0e0", 
                                        color: "white", 
                                        width: 40, 
                                        height: 40,
                                        transition: "background-color 0.2s",
                                        "&:hover": {
                                            bgcolor: inputValue.trim() ? "#1565c0" : "#e0e0e0",
                                        }
                                    }}
                                >
                                    <Send sx={{ fontSize: 18 }} />
                                </IconButton>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Box>

            {/* --- FOOTER (Matches Home.tsx) --- */}
            <footer style={{ background: COLORS.navy, color: COLORS.white }}>
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
                            <Avatar sx={{ bgcolor: COLORS.primary }}>
                                <AccountBalance fontSize="small" />
                            </Avatar>
                            <Typography variant="h6" fontWeight="bold">
                                Aridi Bank Portal
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="grey.400" textAlign={{ xs: "center", md: "right" }}>
                            © {new Date().getFullYear()} Aridi Bank Portal — Secure. Smart.
                            Seamless Banking.
                        </Typography>
                    </Box>
                </Container>
            </footer>
        </Box>
    );
}