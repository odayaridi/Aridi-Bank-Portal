import * as React from "react";
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
} from "@mui/x-data-grid";
import {
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
} from "@mui/material";
import type { UpdateUser } from "../../types/user/UpdateUser";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import AlertSnackbar from "../common/AlertSnackbar";
import { useAlert } from "../../hooks/useAlert";
import ConfirmAction from "../common/ConfirmAction";
import { deleteUser, resetUpdateFormData, setUpdateFormData, updateUser } from "../../features/user/userSlice";

interface UserTableProps {
  users: any[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (newPage: number, newPageSize?: number) => void;
  onRefresh: () => void;
  loading?: boolean;
}

export default function UserTable({
  users,
  page,
  pageSize,
  total,
  onPageChange,
  onRefresh,
  loading = false,
}: UserTableProps) {
  const dispatch = useAppDispatch();

  // Access form data from Redux
  const { updateFormData } = useAppSelector((state) => state.user);

  const [openDialog, setOpenDialog] = React.useState(false);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<any>(null);

  const { open, message, severity, showAlert, handleClose } = useAlert();

  const columns: GridColDef[] = [
    { field: "username", headerName: "Username", flex: 1, minWidth: 150 },
    { field: "firstName", headerName: "First Name", flex: 1, minWidth: 150 },
    { field: "lastName", headerName: "Last Name", flex: 1, minWidth: 150 },
    { field: "dob", headerName: "Date of Birth", flex: 1, minWidth: 130 },
    { field: "phoneNumber", headerName: "Phone", flex: 1, minWidth: 160 },
    { field: "country", headerName: "Country", flex: 1, minWidth: 130 },
    { field: "city", headerName: "City", flex: 1, minWidth: 130 },
    {
      field: "nbOfAccounts",
      headerName: "Accounts",
      type: "number",
      flex: 0.6,
      align: "center",
      headerAlign: "center",
      minWidth: 120,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 180,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            sx={{ mr: 1 }}
            onClick={() => handleOpenDialog(params.row)}
          >
            Update
          </Button>

          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => {
              setSelectedUser(params.row);
              setOpenConfirm(true);
            }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const paginationModel = React.useMemo(
    () => ({ page: page - 1, pageSize }),
    [page, pageSize]
  );

  const handlePaginationChange = (model: GridPaginationModel) => {
    onPageChange(model.page + 1, model.pageSize);
  };

  const handleOpenDialog = (user: any) => {
    dispatch(
      setUpdateFormData({
        username: user.username,
        newUsername: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        country: "",
        city: "",
        password: "",
      })
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    dispatch(resetUpdateFormData());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setUpdateFormData({ [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    if (!updateFormData.username) return;

    // --- Password validation ---
    const password = updateFormData.password;
    if (password && password.trim() !== "") {
      if (password.length < 8 || password.length > 32) {
        showAlert("Password must be between 8 and 32 characters.", "error");
        return;
      }

      let hasUppercase = false;
      for (const ch of password) {
        if (ch >= "A" && ch <= "Z") {
          hasUppercase = true;
          break;
        }
      }
      if (!hasUppercase) {
        showAlert("Password must contain at least one uppercase letter.", "error");
        return;
      }

      const specials = `!@#$%^&*(),.?":{}|<>_-/`;
      let hasSpecial = false;
      for (const ch of password) {
        if (specials.includes(ch)) {
          hasSpecial = true;
          break;
        }
      }
      if (!hasSpecial) {
        showAlert("Password must contain at least one special character.", "error");
        return;
      }
    }
    // --- End Password validation ---

    const payload: Partial<UpdateUser> = { username: updateFormData.username };
    const keys: (keyof UpdateUser)[] = [
      "newUsername",
      "firstName",
      "lastName",
      "phoneNumber",
      "country",
      "city",
      "password",
    ];

    keys.forEach((k) => {
      const v = updateFormData[k];
      if (typeof v === "string" && v.trim()) {
        (payload as any)[k] = v.trim();
      }
    });

    const hasUpdates = Object.keys(payload).some((k) => k !== "username");
    if (!hasUpdates) {
      handleCloseDialog();
      return;
    }

    try {
      await dispatch(updateUser(payload as UpdateUser)).unwrap();
      showAlert("User updated successfully", "success");
      handleCloseDialog();
      onRefresh();
    } catch (err: any) {
      console.error("Update failed:", err);
      showAlert(err || "Failed to update user", "error");
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await dispatch(deleteUser({ username: selectedUser.username })).unwrap();
      showAlert("User deleted successfully", "success");
      onRefresh();
    } catch (err: any) {
      console.error("Delete failed:", err);
      showAlert(err || "Failed to delete user", "error");
    } finally {
      setSelectedUser(null);
      setOpenConfirm(false);
    }
  };

  const isConfirmDisabled = !(
    updateFormData.newUsername?.trim() ||
    updateFormData.firstName?.trim() ||
    updateFormData.lastName?.trim() ||
    updateFormData.phoneNumber?.trim() ||
    updateFormData.country?.trim() ||
    updateFormData.city?.trim() ||
    updateFormData.password?.trim()
  );

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 3,
        p: 2,
        height: 600,
        backgroundColor: "#fff",
      }}
    >
      <DataGrid
        rows={users.map((u, i) => ({ id: `${u.username}-${i}`, ...u }))}
        columns={columns}
        loading={loading}
        paginationMode="server"
        rowCount={total}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationChange}
        pageSizeOptions={[5, 10, 20, 50]}
        sx={{
          border: "none",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f4f6f8",
            color: "#333",
            fontWeight: 600,
            fontSize: "0.9rem",
          },
          "& .MuiDataGrid-cell": { fontSize: "0.875rem" },
          "& .MuiDataGrid-footerContainer": { backgroundColor: "#fafafa" },
          "& .MuiDataGrid-row:hover": { backgroundColor: "#f9fafc" },
        }}
      />

      {/* Update Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            width: 380,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            textAlign: "center",
            pb: 1,
          }}
        >
          Update User
        </DialogTitle>
        <Divider />
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.2,
            mt: 2,
            minWidth: 320,
          }}
        >
          <TextField
            label="Target Username"
            name="username"
            value={updateFormData.username || ""}
            disabled
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="New Username"
            name="newUsername"
            value={updateFormData.newUsername || ""}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="First Name"
            name="firstName"
            value={updateFormData.firstName || ""}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={updateFormData.lastName || ""}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={updateFormData.phoneNumber || ""}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Country"
            name="country"
            value={updateFormData.country || ""}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="City"
            name="city"
            value={updateFormData.city || ""}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="New Password"
            name="password"
            type="password"
            value={updateFormData.password || ""}
            onChange={handleInputChange}
            fullWidth
          />
        </DialogContent>

        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 3,
            pb: 2,
            pt: 1,
          }}
        >
          <Button onClick={handleCloseDialog} sx={{ fontWeight: 500 }}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            disabled={isConfirmDisabled}
            sx={{
              px: 3,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete */}
      <ConfirmAction
        open={openConfirm}
        title="Are you sure you want to delete this user?"
        onConfirm={handleDelete}
        onCancel={() => setOpenConfirm(false)}
      />

      {/* Snackbar */}
      <AlertSnackbar
        open={open}
        message={message}
        severity={severity}
        onClose={handleClose}
      />
    </Paper>
  );
}