import React from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import type { TransactionData } from "../../types/transaction/TransactionData";

interface Props {
  transactions: TransactionData[]; // Array of transaction objects to display
  loading?: boolean; // Optional loading state (not used in this code but could be useful for future enhancements)
}

export default function TransactionTable({ transactions, loading = false }: Props) {
  return (
    // Wrap table in Paper component to give it elevation and rounded corners
    <Paper sx={{ borderRadius: 2 }}>
      <TableContainer>
        <Table>
          {/* Table header */}
          <TableHead>
            <TableRow>
              <TableCell>Sender Account</TableCell> {/* Column for sender account number */}
              <TableCell>Receiver Account</TableCell> {/* Column for receiver account number */}
              <TableCell>Amount ($)</TableCell> {/* Column for transaction amount */}
              <TableCell>Date</TableCell> {/* Column for transaction date */}
            </TableRow>
          </TableHead>

          {/* Table body */}
          <TableBody>
            {transactions.length > 0 ? (
              // Map over transactions array and create a row for each transaction
              transactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{transaction.senderAccountNumber}</TableCell>
                  <TableCell>{transaction.receiverAccountNumber}</TableCell>
                  <TableCell>
                    {/* Amount displayed in red and bold to highlight outgoing money */}
                    <span style={{ color: "red", fontWeight: 600 }}>
                      -${transaction.value}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
                </TableRow>
              ))
            ) : (
              // Show message if there are no transactions
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No rows
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
