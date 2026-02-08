import React from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

/**
 * Props for the ConfirmAction component.
 */
interface ConfirmActionProps {
  /**
   * Controls whether the dialog is open or not.
   */
  open: boolean;

  /**
   * The title text displayed in the confirmation dialog.
   */
  title: string;

  /**
   * Callback function triggered when the user confirms the action.
   */
  onConfirm: () => void;

  /**
   * Callback function triggered when the user cancels the action or closes the dialog.
   */
  onCancel: () => void;
}

/**
 * ConfirmAction component renders a modal dialog to confirm a user action.
 *
 * Provides "YES" and "NO" buttons for user response.
 * On confirming, it triggers `onConfirm` and then closes the dialog via `onCancel`.
 * Accessible attributes (`aria-labelledby` and `aria-describedby`) are included for screen readers.
 *
 * @param open - Whether the dialog is visible.
 * @param title - The confirmation message/title.
 * @param onConfirm - Function to execute on confirmation.
 * @param onCancel - Function to execute on cancellation or close.
 * @returns A React component rendering a confirmation dialog.
 */
const ConfirmAction: React.FC<ConfirmActionProps> = ({
  open,
  title,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog
      open={open} // Dialog visibility
      onClose={onCancel} // Close handler
      aria-labelledby="confirm-dialog-title" // Accessibility: title label
      aria-describedby="confirm-dialog-description" // Accessibility: description label
    >
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>

      <DialogActions>
        <Button onClick={onCancel}>NO</Button>
        <Button
          onClick={() => {
            onConfirm(); // Execute confirmation logic
            onCancel(); // Close the dialog after confirmation
          }}
          autoFocus // Focus on the primary action for better UX
        >
          YES
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmAction;
