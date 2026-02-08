import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { fetchFilteredUserMessages } from "../../api/contactApi";
import ContactMessagesTable from "../../components/tables/ContactMessagesTable";

/**
 * ContactMessages Page Component
 *
 * Allows admin users to view, filter, and manage messages
 * submitted by users through the Contact Us form.
 *
 * Features:
 * - Filter messages by username, first name, last name, phone number, country, and city
 * - Pagination support with page and limit control
 * - Reset filters to default
 * - Displays filtered results in a table with loading state
 */
const ContactMessages: React.FC = () => {
  const [filters, setFilters] = useState({
    username: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    country: "",
    city: "",
    page: 1,
    limit: 10,
  });

  const [messages, setMessages] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch messages
  const handleSearch = async () => {
    setLoading(true);
    try {
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value)
      );
      const { messages, total } = await fetchFilteredUserMessages(cleanedFilters);
      setMessages(messages);
      setTotal(total);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  //Pagination change (triggered by DataGrid)
  const handlePageChange = (newPage: number, newLimit?: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
      limit: newLimit || prev.limit,
    }));
  };

  //Auto-refresh when page/limit changes
  useEffect(() => {
    handleSearch();
  }, [filters.page, filters.limit]);

  // Reset filters
  const handleReset = () => {
    setFilters({
      username: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      country: "",
      city: "",
      page: 1,
      limit: 10,
    });
    setMessages([]);
    setTotal(0);
  };

  return (
    <Box >
      {/*Page Title & Subtitle */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Manage Contact Messages
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          View and filter messages sent by users through the Contact Us form.
        </Typography>
      </Box>

      {/*Filters Section */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Filter User Messages
        </Typography>

        <Box
          display="flex"
          flexWrap="wrap"
          gap={2}
          justifyContent="space-between"
        >
          {[
            "username",
            "firstName",
            "lastName",
            "phoneNumber",
            "country",
            "city",
          ].map((field) => (
            <Box
              key={field}
              flex="1 1 300px"
              minWidth="250px"
              display="flex"
              flexDirection="column"
            >
              <TextField
                fullWidth
                size="small"
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                value={(filters as any)[field]}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, [field]: e.target.value }))
                }
              />
            </Box>
          ))}
        </Box>

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleReset}
            disabled={loading}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
            sx={{ backgroundColor: "#1976d2" }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Search"}
          </Button>
        </Box>
      </Paper>

      {/*Table Section */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          borderRadius: 3,
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 2, ml: 1, mt: 1 }}
        >
          User Messages List
        </Typography>

        <ContactMessagesTable
          messages={messages}
          page={filters.page}
          pageSize={filters.limit}
          total={total}
          onPageChange={handlePageChange}
          loading={loading}
        />
      </Paper>
    </Box>
  );
};

export default ContactMessages;
