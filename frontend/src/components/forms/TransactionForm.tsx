import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  Typography,
  Autocomplete,
  CircularProgress,
  createFilterOptions,
  InputAdornment,
  Paper,
} from "@mui/material";
import { 
  CloudUpload, 
  Send as SendIcon, 
  AttachFile,
  CheckCircle 
} from "@mui/icons-material";
import { getCheckingAccountsNbs, getAllAccountNbsExceptOne } from "../../api/accountApi";
import { createTransaction } from "../../api/transactionApi";
import type { CreateTransaction } from "../../types/transaction/CreateTransaction";
import AlertSnackbar from "../common/AlertSnackbar";
import { useAlert } from "../../hooks/useAlert";
import { fetchCurrentUser } from "../../api/authApi";
import type { User } from "../../types/user/User";

export default function TransactionForm() {
  const [formData, setFormData] = useState<CreateTransaction>({
    senderAccountNb: 0,
    receiverAccountNb: 0,
    amount: 0,
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [checkingAccounts, setCheckingAccounts] = useState<number[]>([]);
  const { open, message, severity, handleClose, showAlert } = useAlert();

  // --- RECEIVER ACCOUNT STATES ---
  const [receiverAccounts, setReceiverAccounts] = useState<number[]>([]);
  const [receiverPage, setReceiverPage] = useState(1);
  const [receiverTotalPages, setReceiverTotalPages] = useState(1);
  const [receiverLoading, setReceiverLoading] = useState(false);
  const [receiverSearch, setReceiverSearch] = useState("");

  // --- NATIONAL ID STATE ---
  const [nationalIdFile, setNationalIdFile] = useState<File | null>(null);

  // 1. Fetch Sender Accounts
  useEffect(() => {
    const fetchCheckingAccounts = async () => {
      try {
        const res = await getCheckingAccountsNbs();
        setCheckingAccounts(res?.data?.accountNbs || []);
      } catch (err) {
        console.error("Error fetching checking accounts:", err);
      }
    };
    fetchCheckingAccounts();
  }, []);

  // 2. Fetch Receiver Accounts (Search + Infinite Scroll)
  useEffect(() => {
    let active = true;

    const fetchReceiverAccounts = async () => {
      if (!formData.senderAccountNb) {
        setReceiverAccounts([]);
        return;
      }

      setReceiverLoading(true);
      try {
        const res = await getAllAccountNbsExceptOne(
          formData.senderAccountNb,
          receiverPage,
          receiverSearch
        );

        if (active && res?.accounts) {
          const newAccounts = res.accounts.map((a: any) => a.accountNb);

          setReceiverTotalPages(res.totalPages || 1);

          if (receiverPage === 1) {
            setReceiverAccounts(newAccounts);
          } else {
            setReceiverAccounts((prev) => {
              const combined = [...prev, ...newAccounts];
              return [...new Set(combined)];
            });
          }
        }
      } catch (err) {
        console.error("Error fetching receiver accounts:", err);
      } finally {
        if (active) setReceiverLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchReceiverAccounts();
    }, 400);

    return () => {
      clearTimeout(timer);
      active = false;
    };
  }, [receiverPage, receiverSearch, formData.senderAccountNb]);

  const handleChange = (field: keyof CreateTransaction, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 3. Scroll Handler
  const handleReceiverScroll = (event: React.SyntheticEvent) => {
    const listboxNode = event.currentTarget;
    if (
      listboxNode.scrollTop + listboxNode.clientHeight >=
      listboxNode.scrollHeight - 5
    ) {
      if (!receiverLoading && receiverPage < receiverTotalPages) {
        setReceiverPage((prev) => prev + 1);
      }
    }
  };

  // --- HELPER: File to Base64 ---
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // --- HANDLE FILE SELECTION ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNationalIdFile(e.target.files[0]);
    }
  };

  // --- SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validation
    if (
      !formData.senderAccountNb ||
      !formData.receiverAccountNb ||
      !formData.amount
    ) {
      showAlert("All fields except message are required", "warning");
      return;
    }

    // ID Validation
    if (!nationalIdFile) {
      showAlert("Please upload your National ID for verification before sending.", "error");
      return;
    }

    try {
      setLoading(true);
      const user : User = await fetchCurrentUser();
      // 1. Convert Image to Base64
      const documentBase64 = await fileToBase64(nationalIdFile);
      // 2. Scan ID (Verification Step)
      // We perform this check before allowing the transaction
      const scanResponse = await axios.post(
        "https://api2.idanalyzer.com/scan",
        { 
          document: documentBase64, 
          country: user.country, 
          type: "I" 
        },
        { headers: { "X-API-KEY": "JrEQLFh9RpVLKTzpP7cOrIPsklvOfRQE" } }
      );

      const scanData = scanResponse.data.data;
      const countryFull = scanData?.countryFull?.[0]?.value;
      const documentNumber = scanData?.documentNumber?.[0]?.value;
      if (!documentNumber || !countryFull) {
        showAlert("Failed to extract user details from national ID Image.", "error");
        return;
      }

      // 3. Prepare final payload
      const payload = {
        ...formData,
        countryFull,
        documentNumber,
      };


      // 3. Create Transaction
    
      await createTransaction(payload);
      
      showAlert("Transaction verified and sent successfully!", "success");
      
      // Reset Form
      setFormData({
        senderAccountNb: 0,
        receiverAccountNb: 0,
        amount: 0,
        message: "",
      });
      setReceiverSearch("");
      setReceiverPage(1);
      setNationalIdFile(null);

    } catch (err: any) {
      console.error("Error sending transaction:", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to send transaction";
      showAlert(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const filterOptions = createFilterOptions({
    matchFrom: "any",
    stringify: (option: number) => option.toString(),
  });

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        {/* Sender Account */}
        <Box>
          <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1, fontWeight: 600 }}>
            FROM ACCOUNT
          </Typography>
          <Select
            fullWidth
            value={formData.senderAccountNb || ""}
            onChange={(e) => {
              handleChange("senderAccountNb", Number(e.target.value));
              setReceiverPage(1);
              setReceiverSearch("");
            }}
            displayEmpty
          >
            <MenuItem value="">Select Account</MenuItem>
            {checkingAccounts.map((nb) => (
              <MenuItem key={nb} value={nb}>
                {nb}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Receiver Account */}
        <Box>
          <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1, fontWeight: 600 }}>
            TO ACCOUNT
          </Typography>
          <Autocomplete
            id="receiver-account-box"
            options={receiverAccounts}
            getOptionLabel={(option) => option.toString()}
            filterOptions={(options) => options}
            isOptionEqualToValue={(option, value) => option === value}
            loading={receiverLoading}
            value={formData.receiverAccountNb || null}
            onChange={(event, newValue) => {
              handleChange("receiverAccountNb", newValue || 0);
            }}
            onInputChange={(event, newInputValue, reason) => {
              if (reason === "input") {
                setReceiverSearch(newInputValue);
                setReceiverPage(1);
              }
            }}
            ListboxProps={{
              onScroll: handleReceiverScroll,
              style: { maxHeight: 150, overflowY: "auto" },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search or Select Account"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {receiverLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Box>

        {/* Amount */}
        <Box>
          <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1, fontWeight: 600 }}>
            AMOUNT
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={formData.amount || ""}
            onChange={(e) =>
              handleChange("amount", Math.max(0, Number(e.target.value)))
            }
            placeholder="0.00"
            InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*", min: 0 }}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
        </Box>

        {/* Message */}
        <Box>
          <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1, fontWeight: 600 }}>
            MESSAGE (OPTIONAL)
          </Typography>
          <TextField
            fullWidth
            type="text"
            value={formData.message || ""}
            onChange={(e) => handleChange("message", e.target.value)}
            placeholder="What is this for?"
          />
        </Box>

        {/* --- Upload National ID Section --- */}
        <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 2, bgcolor: '#fafafa' }}>
           <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1, fontWeight: 600 }}>
             IDENTITY VERIFICATION
           </Typography>
           
           <Box display="flex" alignItems="center" gap={2}>
             <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUpload />}
                sx={{ 
                    textTransform: "none",
                    borderColor: nationalIdFile ? 'success.main' : 'primary.main',
                    color: nationalIdFile ? 'success.main' : 'primary.main'
                }}
             >
                {nationalIdFile ? "Change ID Image" : "Upload National ID"}
                <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                />
             </Button>
             
             {nationalIdFile && (
                 <Box display="flex" alignItems="center" gap={1}>
                     <CheckCircle color="success" fontSize="small" />
                     <Typography variant="caption" noWrap sx={{ maxWidth: 200 }}>
                         {nationalIdFile.name}
                     </Typography>
                 </Box>
             )}
           </Box>
           {!nationalIdFile && (
               <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                   * Required for transaction verification
               </Typography>
           )}
        </Box>

        {/* --- Action Buttons --- */}
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          endIcon={loading ? <CircularProgress size={20} color="inherit"/> : <SendIcon />}
          sx={{ 
            mt: 2, 
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 'bold',
            textTransform: "none",
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'transform 0.2s',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
            }
          }}
        >
          {loading ? "Verifying & Sending..." : "Send Transaction"}
        </Button>
      </Box>

      <AlertSnackbar
        open={open}
        message={message}
        severity={severity}
        onClose={handleClose}
      />
    </>
  );
}