import * as React from "react";
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
} from "@mui/x-data-grid";
import { Paper } from "@mui/material";

interface ContactMessagesTableProps {
  messages: any[]; // Array of message objects to display
  page: number; // Current page number (1-indexed)
  pageSize: number; // Number of rows per page
  total: number; // Total number of messages for server-side pagination
  onPageChange: (newPage: number, newPageSize?: number) => void; // Callback when pagination changes
  loading?: boolean; // Loading state for data fetch
}

export default function ContactMessagesTable({
  messages,
  page,
  pageSize,
  total,
  onPageChange,
  loading = false,
}: ContactMessagesTableProps) {
  // Define table columns and how each field is displayed
  const columns: GridColDef[] = [
    { field: "username", headerName: "Username", flex: 1, minWidth: 150 },
    { field: "firstName", headerName: "First Name", flex: 1, minWidth: 150 },
    { field: "lastName", headerName: "Last Name", flex: 1, minWidth: 150 },
    { field: "phoneNumber", headerName: "Phone", flex: 1, minWidth: 160 },
    { field: "country", headerName: "Country", flex: 1, minWidth: 130 },
    { field: "city", headerName: "City", flex: 1, minWidth: 130 },
    { field: "subject", headerName: "Subject", flex: 1, minWidth: 180 },
    {
      field: "message",
      headerName: "Message",
      flex: 2,
      minWidth: 250,
      // Custom render to allow word wrapping inside cells
      renderCell: (params) => (
        <span style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
          {params.value}
        </span>
      ),
    },
    { field: "createdAt", headerName: "Date", flex: 1, minWidth: 160 },
  ];

  // Memoized pagination model for the DataGrid
  const paginationModel = React.useMemo(
    () => ({ page: page - 1, pageSize }), // DataGrid uses 0-indexed pages
    [page, pageSize]
  );

  // Handles user changing page or page size
  const handlePaginationChange = (model: GridPaginationModel) => {
    onPageChange(model.page + 1, model.pageSize); // Convert back to 1-indexed
  };

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 3,
        p: 2,
        height: 600, // Fixed height for the table
        backgroundColor: "#fff",
      }}
    >
      <DataGrid
        // Add unique id for each row combining username and index
        rows={messages.map((m, i) => ({ id: `${m.username}-${i}`, ...m }))}
        columns={columns} // Columns defined above
        loading={loading} // Show loading overlay when data is fetching
        paginationMode="server" // Enable server-side pagination
        rowCount={total} // Total rows for pagination
        paginationModel={paginationModel} // Current page/pageSize
        onPaginationModelChange={handlePaginationChange} // Handle page changes
        pageSizeOptions={[5, 10, 20, 50]} // Options for rows per page
        disableRowSelectionOnClick // Disable row selection on click
        sx={{
          border: "none",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f4f6f8",
            color: "#333",
            fontWeight: 600,
            fontSize: "0.9rem",
          },
          "& .MuiDataGrid-cell": {
            fontSize: "0.875rem",
            lineHeight: "1.4rem",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#fafafa",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#f9fafc",
          },
        }}
      />
    </Paper>
  );
}
