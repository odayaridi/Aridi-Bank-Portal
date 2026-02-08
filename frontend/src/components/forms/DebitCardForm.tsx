import React, { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Button,
    InputAdornment,
    Paper,
    Typography,
    Divider,
    Autocomplete,
    CircularProgress,
} from "@mui/material";
import { CreditCard, Person, Delete, Add, Update } from "@mui/icons-material";
import type { CreateDebitCard } from "../../types/debitCard/CreateDebitCard";
import type { UpdateDebitCard } from "../../types/debitCard/UpdateDebitCard";
import type { DeleteDebitCard } from "../../types/debitCard/DeleteDebitCard";
import { useAlert } from "../../hooks/useAlert";
import AlertSnackbar from "../../components/common/AlertSnackbar";
import { createDebitCard, deleteDebitCard, updateDebitCard } from "../../api/debitCardApi";
import { getAllAccountNbsInSystem } from "../../api/accountApi";
import { getCardHolders } from "../../api/userApi";

export default function DebitCardForm() {
    /** ----------------------------
     * STATE
     * ---------------------------- */
    // MODIFICATION: Defaulted cardExpirationDate to "3"
    const [createCardData, setCreateCardData] = useState<CreateDebitCard>({
        accountNb: 0,
        cardHolder: "",
        cardExpirationDate: "3",
    });

    // MODIFICATION: Defaulted cardExpirationDate to "3"
    const [updateCardData, setUpdateCardData] = useState<UpdateDebitCard>({
        accountNb: 0,
        cardHolder: "",
        cardExpirationDate: "3",
    });

    const [deleteCardData, setDeleteCardData] = useState<DeleteDebitCard>({
        accountNb: 0,
        cardHolder: "",
    });

    const { alertInfo, showAlert, closeAlert } = useAlert();

    // --- ACCOUNT NUMBER SEARCH & SCROLL STATE ---
    const [accountOptions, setAccountOptions] = useState<number[]>([]);
    const [accPage, setAccPage] = useState(1);
    const [accTotalPages, setAccTotalPages] = useState(1);
    const [accLoading, setAccLoading] = useState(false);
    const [accSearch, setAccSearch] = useState("");

    // --- CARD HOLDER SEARCH & SCROLL STATE ---
    const [cardHolderOptions, setCardHolderOptions] = useState<string[]>([]);
    const [chPage, setChPage] = useState(1);
    const [chTotalPages, setChTotalPages] = useState(1);
    const [chLoading, setChLoading] = useState(false);
    const [chSearch, setChSearch] = useState("");

    /** ----------------------------
     * ACCOUNT FETCHING LOGIC
     * ---------------------------- */
    useEffect(() => {
        let active = true;
        const fetchAccounts = async () => {
            setAccLoading(true);
            try {
                const res = await getAllAccountNbsInSystem(accPage, accSearch);
                if (active && res?.accounts) {
                    const newAccounts = res.accounts.map((a: any) => a.accountNb);
                    setAccTotalPages(res.totalPages || 1);
                    if (accPage === 1) {
                        setAccountOptions(newAccounts);
                    } else {
                        setAccountOptions((prev) => {
                            const combined = [...prev, ...newAccounts];
                            return [...new Set(combined)];
                        });
                    }
                }
            } catch (err) {
                console.error("Error fetching accounts:", err);
            } finally {
                if (active) setAccLoading(false);
            }
        };
        const timer = setTimeout(() => {
            fetchAccounts();
        }, 400);
        return () => {
            clearTimeout(timer);
            active = false;
        };
    }, [accPage, accSearch]);

    const handleAccountScroll = (event: React.SyntheticEvent) => {
        const listboxNode = event.currentTarget;
        if (listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 5) {
            if (!accLoading && accPage < accTotalPages) {
                setAccPage((prev) => prev + 1);
            }
        }
    };

    const handleAccountBlur = () => {
        setAccSearch("");
        setAccPage(1);
    };

    /** ----------------------------
     * CARD HOLDER FETCHING LOGIC
     * ---------------------------- */
    useEffect(() => {
        let active = true;
        const fetchHolders = async () => {
            setChLoading(true);
            try {
                const res = await getCardHolders(chPage, chSearch);
                if (active && res?.users) {
                    const newHolders = res.users.map((u: any) => u.username);
                    setChTotalPages(res.totalPages || 1);
                    if (chPage === 1) {
                        setCardHolderOptions(newHolders);
                    } else {
                        setCardHolderOptions((prev) => {
                            const combined = [...prev, ...newHolders];
                            return [...new Set(combined)];
                        });
                    }
                }
            } catch (err) {
                console.error("Error fetching card holders:", err);
            } finally {
                if (active) setChLoading(false);
            }
        };
        const timer = setTimeout(() => {
            fetchHolders();
        }, 400);
        return () => {
            clearTimeout(timer);
            active = false;
        };
    }, [chPage, chSearch]);

    const handleCardHolderScroll = (event: React.SyntheticEvent) => {
        const listboxNode = event.currentTarget;
        if (listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 5) {
            if (!chLoading && chPage < chTotalPages) {
                setChPage((prev) => prev + 1);
            }
        }
    };

    const handleCardHolderBlur = () => {
        setChSearch("");
        setChPage(1);
    };

    /** ----------------------------
     * HANDLERS
     * ---------------------------- */
    const handleCreateChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setCreateCardData((prev) => ({
            ...prev,
            [name]: name === "accountNb" ? value.replace(/\D/g, "") : value,
        }));
    };

    const handleUpdateChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setUpdateCardData((prev) => ({
            ...prev,
            [name]: name === "accountNb" ? value.replace(/\D/g, "") : value,
        }));
    };

    const handleDeleteChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setDeleteCardData((prev) => ({
            ...prev,
            [name]: name === "accountNb" ? value.replace(/\D/g, "") : value,
        }));
    };

    const validateAccountNb = (value: string | number): boolean => {
        if (typeof value === 'string') {
            const trimmed = value.trim();
            return trimmed !== "" && !isNaN(Number(trimmed)) && Number(trimmed) > 0;
        }
        if (typeof value === 'number') {
            return !isNaN(value) && value > 0;
        }
        return false;
    };

    /** ----------------------------
     * CRUD Operations
     * ---------------------------- */
    const handleAdd = async () => {
        try {
            const expirationWithYears =
                createCardData.cardExpirationDate === "3"
                    ? "3 years"
                    : createCardData.cardExpirationDate === "5"
                        ? "5 years"
                        : createCardData.cardExpirationDate;

            if (!validateAccountNb(createCardData.accountNb)) {
                showAlert('Account number should be greater than 0 and not empty', "error")
                return;
            }

            const payload = {
                ...createCardData,
                accountNb: Number(createCardData.accountNb),
                cardExpirationDate: expirationWithYears,
            };

            console.log("Creating card with payload:", payload);
            const response = await createDebitCard(payload);
            if (response.data) {
                showAlert("Debit card created successfully!", "success");
                handleClearCreate();
            }
            else {
                showAlert(response.message, "error");
            }


        } catch (error: any) {
            showAlert(
                "Error creating debit card",
                "error"
            );
            console.error("Error creating debit card:", error);
        }
    };

    const handleUpdate = async () => {
        try {
            const expirationWithYears =
                updateCardData.cardExpirationDate === "3"
                    ? "3 years"
                    : updateCardData.cardExpirationDate === "5"
                        ? "5 years"
                        : updateCardData.cardExpirationDate;

            if (!validateAccountNb(updateCardData.accountNb)) {
                showAlert('Account number should be greater than 0 and not empty', "error")
                return;
            }

            const payload = {
                ...updateCardData,
                accountNb: Number(updateCardData.accountNb),
                cardExpirationDate: expirationWithYears,
            };

            console.log("Updating card with payload:", payload);
            const response = await updateDebitCard(payload);
            if (response.data) {
                showAlert("Debit card created successfully!", "success");
                handleClearUpdate();
            }
            else {
                showAlert(response.message, "error");
            }


        } catch (error: any) {
            showAlert(
                "Error updating debit card",
                "error"
            );
            console.error("Error updating debit card:", error);
        }
    };

    const handleDelete = async () => {
        try {
            if (!validateAccountNb(deleteCardData.accountNb)) {
                showAlert('Account number should be greater than 0 and not empty', "error")
                return;
            }

            const payload: DeleteDebitCard = {
                ...deleteCardData,
                accountNb: Number(deleteCardData.accountNb),
            };

            console.log("Deleting card with payload:", payload);
            const response = await deleteDebitCard(payload);
            if (response.deleted) {
                showAlert("Debit card deleted successfully!", "success");
                handleClearDelete();
            }
            else {
                showAlert(
                    response.message,
                    "error"
                );
            }

        } catch (error: any) {
            showAlert(
                error.message || "Error deleting debit card",
                "error"
            );
            console.error("Error deleting debit card:", error);
        }
    };

    /** ----------------------------
     * CLEAR HELPERS
     * ---------------------------- */
    const handleClearCreate = () => {
        setCreateCardData({
            accountNb: 0,
            cardHolder: "",
            // MODIFICATION: Reset to "3"
            cardExpirationDate: "3",
        });
    };

    const handleClearUpdate = () => {
        setUpdateCardData({
            accountNb: 0,
            cardHolder: "",
            // MODIFICATION: Reset to "3"
            cardExpirationDate: "3",
        });
    };

    const handleClearDelete = () => {
        setDeleteCardData({
            accountNb: 0,
            cardHolder: "",
        });
    };

    /** ----------------------------
     * RENDER
     * ---------------------------- */
    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {/* ================= CREATE SECTION ================= */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "background.paper",
                    }}
                >
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                        Create Debit Card
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {/* ACCOUNT NUMBER AUTOCOMPLETE */}
                        <Autocomplete
                            options={accountOptions}
                            getOptionLabel={(option) => option.toString()}
                            filterOptions={(x) => x}
                            loading={accLoading}
                            value={createCardData.accountNb || null}
                            onChange={(event, newValue) => {
                                setCreateCardData((prev) => ({ ...prev, accountNb: newValue || 0 }));
                            }}
                            onInputChange={(event, newInputValue, reason) => {
                                if (reason === 'input') {
                                    setAccSearch(newInputValue);
                                    setAccPage(1);
                                }
                            }}
                            onBlur={handleAccountBlur}
                            ListboxProps={{
                                onScroll: handleAccountScroll,
                                style: { maxHeight: 150, overflowY: 'auto' },
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Account Number"
                                    required
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <>
                                                <InputAdornment position="start">
                                                    <CreditCard color="action" />
                                                </InputAdornment>
                                                {params.InputProps.startAdornment}
                                            </>
                                        ),
                                        endAdornment: (
                                            <React.Fragment>
                                                {accLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                />
                            )}
                        />
                        {/* CARD HOLDER AUTOCOMPLETE */}
                        <Autocomplete
                            options={cardHolderOptions}
                            getOptionLabel={(option) => option}
                            filterOptions={(x) => x}
                            loading={chLoading}
                            value={createCardData.cardHolder || null}
                            onChange={(event, newValue) => {
                                setCreateCardData((prev) => ({ ...prev, cardHolder: newValue || "" }));
                            }}
                            onInputChange={(event, newInputValue, reason) => {
                                if (reason === 'input') {
                                    setChSearch(newInputValue);
                                    setChPage(1);
                                }
                            }}
                            onBlur={handleCardHolderBlur}
                            ListboxProps={{
                                onScroll: handleCardHolderScroll,
                                style: { maxHeight: 150, overflowY: 'auto' },
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Card Holder"
                                    required
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <>
                                                <InputAdornment position="start">
                                                    <Person color="action" />
                                                </InputAdornment>
                                                {params.InputProps.startAdornment}
                                            </>
                                        ),
                                        endAdornment: (
                                            <React.Fragment>
                                                {chLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                />
                            )}
                        />
                        <TextField
                            fullWidth
                            select
                            label="Card Expiration Date"
                            name="cardExpirationDate"
                            value={createCardData.cardExpirationDate}
                            onChange={handleCreateChange}
                            required
                            slotProps={{ select: { native: true } }}
                        >
                            <option value=""></option>
                            <option value="3">3 years</option>
                            <option value="5">5 years</option>
                        </TextField>
                        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
                            <Button variant="outlined" onClick={handleClearCreate} sx={{ px: 4 }}>
                                Clear
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={handleAdd}
                                // MODIFICATION: Disabled if fields are empty
                                disabled={!createCardData.accountNb || !createCardData.cardHolder || !createCardData.cardExpirationDate}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: "bold",
                                    borderRadius: 2,
                                    bgcolor: "#1976d2",
                                    "&:hover": { bgcolor: "#1565c0" },
                                }}
                            >
                                Create
                            </Button>
                        </Box>
                    </Box>
                </Paper>
                <Divider sx={{ my: 2 }} />
                {/* ================= UPDATE SECTION ================= */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "background.paper",
                    }}
                >
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                        Update Debit Card
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {/* ACCOUNT NUMBER AUTOCOMPLETE */}
                        <Autocomplete
                            options={accountOptions}
                            getOptionLabel={(option) => option.toString()}
                            filterOptions={(x) => x}
                            loading={accLoading}
                            value={updateCardData.accountNb || null}
                            onChange={(event, newValue) => {
                                setUpdateCardData((prev) => ({ ...prev, accountNb: newValue || 0 }));
                            }}
                            onInputChange={(event, newInputValue, reason) => {
                                if (reason === 'input') {
                                    setAccSearch(newInputValue);
                                    setAccPage(1);
                                }
                            }}
                            onBlur={handleAccountBlur}
                            ListboxProps={{
                                onScroll: handleAccountScroll,
                                style: { maxHeight: 150, overflowY: 'auto' },
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Account Number"
                                    required
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <>
                                                <InputAdornment position="start">
                                                    <CreditCard color="action" />
                                                </InputAdornment>
                                                {params.InputProps.startAdornment}
                                            </>
                                        ),
                                        endAdornment: (
                                            <React.Fragment>
                                                {accLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                />
                            )}
                        />
                        {/* CARD HOLDER AUTOCOMPLETE */}
                        <Autocomplete
                            options={cardHolderOptions}
                            getOptionLabel={(option) => option}
                            filterOptions={(x) => x}
                            loading={chLoading}
                            value={updateCardData.cardHolder || null}
                            onChange={(event, newValue) => {
                                setUpdateCardData((prev) => ({ ...prev, cardHolder: newValue || "" }));
                            }}
                            onInputChange={(event, newInputValue, reason) => {
                                if (reason === 'input') {
                                    setChSearch(newInputValue);
                                    setChPage(1);
                                }
                            }}
                            onBlur={handleCardHolderBlur}
                            ListboxProps={{
                                onScroll: handleCardHolderScroll,
                                style: { maxHeight: 150, overflowY: 'auto' },
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Card Holder"
                                    required
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <>
                                                <InputAdornment position="start">
                                                    <Person color="action" />
                                                </InputAdornment>
                                                {params.InputProps.startAdornment}
                                            </>
                                        ),
                                        endAdornment: (
                                            <React.Fragment>
                                                {chLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                />
                            )}
                        />
                        <TextField
                            fullWidth
                            select
                            label="Card Expiration Date"
                            name="cardExpirationDate"
                            value={updateCardData.cardExpirationDate}
                            onChange={handleUpdateChange}
                            required
                            slotProps={{ select: { native: true } }}
                        >
                            <option value=""></option>
                            <option value="3">3 years</option>
                            <option value="5">5 years</option>
                        </TextField>
                        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
                            <Button variant="outlined" onClick={handleClearUpdate} sx={{ px: 4 }}>
                                Clear
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<Update />}
                                onClick={handleUpdate}
                                // MODIFICATION: Disabled if fields are empty
                                disabled={!updateCardData.accountNb || !updateCardData.cardHolder || !updateCardData.cardExpirationDate}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: "bold",
                                    borderRadius: 2,
                                    bgcolor: "#1976d2",
                                    "&:hover": { bgcolor: "#1565c0" },
                                }}
                            >
                                Update
                            </Button>
                        </Box>
                    </Box>
                </Paper>
                <Divider sx={{ my: 2 }} />
                {/* ================= DELETE SECTION ================= */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "background.paper",
                    }}
                >
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                        Delete Debit Card
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {/* ACCOUNT NUMBER AUTOCOMPLETE */}
                        <Autocomplete
                            options={accountOptions}
                            getOptionLabel={(option) => option.toString()}
                            filterOptions={(x) => x}
                            loading={accLoading}
                            value={deleteCardData.accountNb || null}
                            onChange={(event, newValue) => {
                                setDeleteCardData((prev) => ({ ...prev, accountNb: newValue || 0 }));
                            }}
                            onInputChange={(event, newInputValue, reason) => {
                                if (reason === 'input') {
                                    setAccSearch(newInputValue);
                                    setAccPage(1);
                                }
                            }}
                            onBlur={handleAccountBlur}
                            ListboxProps={{
                                onScroll: handleAccountScroll,
                                style: { maxHeight: 150, overflowY: 'auto' },
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Account Number"
                                    required
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <>
                                                <InputAdornment position="start">
                                                    <CreditCard color="action" />
                                                </InputAdornment>
                                                {params.InputProps.startAdornment}
                                            </>
                                        ),
                                        endAdornment: (
                                            <React.Fragment>
                                                {accLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                />
                            )}
                        />
                        {/* CARD HOLDER AUTOCOMPLETE */}
                        <Autocomplete
                            options={cardHolderOptions}
                            getOptionLabel={(option) => option}
                            filterOptions={(x) => x}
                            loading={chLoading}
                            value={deleteCardData.cardHolder || null}
                            onChange={(event, newValue) => {
                                setDeleteCardData((prev) => ({ ...prev, cardHolder: newValue || "" }));
                            }}
                            onInputChange={(event, newInputValue, reason) => {
                                if (reason === 'input') {
                                    setChSearch(newInputValue);
                                    setChPage(1);
                                }
                            }}
                            onBlur={handleCardHolderBlur}
                            ListboxProps={{
                                onScroll: handleCardHolderScroll,
                                style: { maxHeight: 150, overflowY: 'auto' },
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Card Holder"
                                    required
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <>
                                                <InputAdornment position="start">
                                                    <Person color="action" />
                                                </InputAdornment>
                                                {params.InputProps.startAdornment}
                                            </>
                                        ),
                                        endAdornment: (
                                            <React.Fragment>
                                                {chLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                />
                            )}
                        />
                        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
                            <Button variant="outlined" onClick={handleClearDelete} sx={{ px: 4 }}>
                                Clear
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<Delete />}
                                onClick={handleDelete}
                                color="error"
                                // MODIFICATION: Disabled if fields are empty
                                disabled={!deleteCardData.accountNb || !deleteCardData.cardHolder}
                                sx={{ px: 4, py: 1.5, fontWeight: "bold", borderRadius: 2 }}
                            >
                                Delete
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
            {/* Global Snackbar */}
            <AlertSnackbar
                open={alertInfo.open}
                message={alertInfo.message}
                severity={alertInfo.severity}
                onClose={closeAlert}
            />
        </>
    );
}