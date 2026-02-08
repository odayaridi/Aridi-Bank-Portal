import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import UserTable from "../../components/tables/UserTable";
import { fetchFilteredUsers } from "../../api/userApi";
import type { FilterUser } from "../../types/user/FilterUser";
import { useAlert } from "../../hooks/useAlert";
import AlertSnackbar from "../../components/common/AlertSnackbar";

/**
 * Users Component
 * Page for managing registered users.
 * Allows filtering users by multiple criteria and displays results in a paginated table.
 */
const Users: React.FC = () => {
  // State for filter inputs
  const [filters, setFilters] = useState<FilterUser>({
    username: "",
    firstname: "",
    lastname: "",
    country: "",
    city: "",
    phoneNumber: "",
    nbOfAccounts: "",
    page: 1,
    limit: 10,
  });

  // State for table data and loading
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { open, message, severity, showAlert, handleClose } = useAlert();

  // Input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  // Fetch filtered users
  const handleSearch = async () => {
    setLoading(true);
    try {
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value)
      ) as Partial<FilterUser>;
          // Validate nbOfAccounts if it exists
    if (
      filters.nbOfAccounts !== undefined &&
      Number(filters.nbOfAccounts) < 0
    ) {
      showAlert("Number of accounts cannot be negative.", "error");
      return;
    }

      const { users, total } = await fetchFilteredUsers(cleanedFilters);
      setUsers(users);
      setTotal(total);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Pagination change handler
  const handlePageChange = (newPage: number, newLimit?: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
      limit: newLimit || prev.limit,
    }));
  };

  // Trigger search whenever page or limit changes
  useEffect(() => {
    handleSearch();
  }, [filters.page, filters.limit]);

  // Reset filters to initial state
  const handleReset = () => {
    setFilters({
      username: "",
      firstname: "",
      lastname: "",
      country: "",
      city: "",
      phoneNumber: "",
      nbOfAccounts: "",
      page: 1,
      limit: 10,
    });
    setUsers([]);
    setTotal(0);
  };

  return (
    <Box>
      {/* Page Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Manage Users
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Search and manage registered users with filters by name, location, and account details.
        </Typography>
      </Box>

      {/* Filter Section */}
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
          Filter Users
        </Typography>

        <Box
          display="flex"
          flexWrap="wrap"
          gap={2}
          justifyContent="space-between"
        >
          {[
            { label: "Username", name: "username" },
            { label: "First Name", name: "firstname" },
            { label: "Last Name", name: "lastname" },
            { label: "Country", name: "country" },
            { label: "City", name: "city" },
            { label: "Phone Number", name: "phoneNumber" },
            { label: "Number of Accounts", name: "nbOfAccounts" },
          ].map((field) => (
            <Box key={field.name} flex="1 1 300px" minWidth="250px">
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                label={field.label}
                name={field.name}
                value={filters[field.name as keyof FilterUser] as string}
                onChange={handleChange}
              />
            </Box>
          ))}
        </Box>

        {/* Filter Buttons */}
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

      {/* Users Table Section */}
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
          Users List
        </Typography>

        <UserTable
          users={users}
          page={filters.page}
          pageSize={filters.limit}
          total={total}
          onPageChange={handlePageChange}
          onRefresh={handleSearch}
          loading={loading}
        />
      </Paper>

         {/* Alert Snackbar */}
            <AlertSnackbar
              open={open}
              message={message}
              severity={severity}
              onClose={handleClose}
            />

    </Box>
  );
};

export default Users;
